import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.http.response import HttpResponse
from django.shortcuts import render
from tracker.apps.users.models import User

from .forms import BudgetForm
from .models import Budget, Expense, Expense_Category, Income, Income_Category
from .utils.data import get_budget_menu_data, save_budget, update_budget
from .utils.validators import (valid_budget, valid_category,
                               valid_income_and_expense)


@login_required(login_url='signup')
def budget_menu(request):
    context = {}
    user_id = User.objects.get(username=request.user.username).id
    context = get_budget_menu_data(user_id, context, Budget,
                                   Income_Category, Expense_Category, Income, Expense)
    form = BudgetForm()
    context['form'] = form

    return render(request, 'main.html', context)


def get_budget(request):
    user_id = User.objects.get(username=request.user.username).id
    month = request.GET.get('month')
    year = request.GET.get('year')

    budget = Budget.objects.filter(
        user=user_id, date__month=month, date__year=year)

    data = {
        'budget':  None if not budget else budget[0].budget
    }

    return JsonResponse(data, status=200, safe=False)


def save_category(request, inc_or_exp):
    data = json.load(request)
    data['user'] = User.objects.get(username=request.user.username)
    type_obj = {
        'income_category': Income_Category,
        'expense_category': Expense_Category,
        'income': Income_Category(title=data['category'],
                                  date=data['date'],
                                  user=data['user']).save,
        'expense': Expense_Category(title=data['category'],
                                    date=data['date'],
                                    user=data['user']).save}
    if not valid_category(type_obj[inc_or_exp + '_category'], data):
        return HttpResponse(data['category']
                            + ' title already exists in month '
                            + data['month'], status=403)

    if inc_or_exp == 'income' and valid_budget(Budget, data['user'].id, data['month'], data['year']):
        Budget(budget=0,
               date=data['date'], user=data['user']).save()

    type_obj[inc_or_exp]()
    return HttpResponse('success', content_type="text", status=200)


def save_income_and_expense(request, inc_or_exp):
    data = json.load(request)
    user = User.objects.get(username=request.user.username)
    type_of_category = {
        'income': Income_Category,
        'expense': Expense_Category
    }
    data['category'] = type_of_category[inc_or_exp].objects.get(
        title=data['categoryTitle'],
        date__month=data['month'],
        date__year=data['year'],
        user=user)
    type_of_inc_or_exp = {
        'income': Income,
        'expense': Expense,
    }

    if not valid_income_and_expense(type_of_inc_or_exp[inc_or_exp], data):
        return HttpResponse(data['title']
                            + ' title already exists in month '
                            + data['month'], status=403)

    type_of_inc_or_exp[inc_or_exp](title=data['title'],
                                   amount=data['amount'],
                                   date=data['date'],
                                   category=data['category']).save()
    save_budget(Budget, inc_or_exp, data, user)
    return HttpResponse('success', status=200)


def delete_category(request, inc_or_exp):
    user_id = User.objects.get(username=request.user.username).id

    year = request.GET.get('year')
    month = request.GET.get('month')
    title = request.GET.get('title')

    if inc_or_exp == 'income':
        update_budget(Budget, Income.objects.filter(date__month=month, date__year=year, category=Income_Category.objects.filter(
            user=user_id, date__month=month, date__year=year, title=title)[:1][0].id), 'subtract', user_id, month, year)
        Income_Category.objects.filter(
            user=user_id, date__month=month, date__year=year, title=title).delete()
    else:
        update_budget(Budget, Expense.objects.filter(date__month=month, date__year=year, category=Expense_Category.objects.filter(
            user=user_id, date__month=month, date__year=year, title=title)[:1][0].id), 'add', user_id, month, year)
        Expense_Category.objects.filter(
            user=user_id, date__month=month, date__year=year, title=title).delete()

    return HttpResponse('success', status=200)


def delete_income_and_expense(request, inc_or_exp):
    user_id = User.objects.get(username=request.user.username).id

    year = request.GET.get('year')
    month = request.GET.get('month')
    title = request.GET.get('title')
    category_title = request.GET.get('categoryTitle')

    if inc_or_exp == 'income':
        income = Income.objects.filter(
            date__month=month, date__year=year, title=title, category=Income_Category.objects.filter(
                user=user_id, date__month=month, date__year=year, title=category_title)[:1][0].id)
        update_budget(Budget, income, 'subtract', user_id, month, year)
        income.delete()
    else:
        expense = Expense.objects.filter(
            date__month=month, date__year=year, title=title, category=Expense_Category.objects.filter(
                user=user_id, date__month=month, date__year=year, title=category_title)[:1][0].id)
        update_budget(Budget, expense, 'add', user_id, month, year)
        expense.delete()

    return HttpResponse('success', status=200)


def update_category(request, inc_or_exp):
    user_id = User.objects.get(username=request.user.username).id

    year = request.GET.get('year')
    month = request.GET.get('month')
    title = request.GET.get('title')
    newTitle = request.GET.get('newTitle')

    if inc_or_exp == 'income':
        income_category = Income_Category.objects.filter(
            user=user_id, date__month=month, date__year=year, title=title)[0]

        income_category.title = newTitle
        income_category.save()
    else:
        expense_category = Expense_Category.objects.filter(
            user=user_id, date__month=month, date__year=year, title=title)[0]

        expense_category.title = newTitle
        expense_category.save()

    return HttpResponse('success', status=200)


def update_income_and_expense(request, inc_or_exp):
    user_id = User.objects.get(username=request.user.username).id
    year = request.GET.get('year')
    month = request.GET.get('month')
    title = request.GET.get('title')
    newTitle = request.GET.get('newTitle')
    newAmount = request.GET.get('newAmount')
    category_title = request.GET.get('categoryTitle')

    budget = Budget.objects.filter(
        date__month=month, date__year=year, user=user_id)[0]

    if inc_or_exp == 'income':
        income = Income.objects.filter(
            date__month=month, date__year=year, title=title, category=Income_Category.objects.filter(
                user=user_id, date__month=month, date__year=year, title=category_title)[:1][0].id)[0]
        prev_amount = income.amount
        income.amount = newAmount
        income.title = newTitle
        income.save()
        budget.budget -= prev_amount
        budget.budget += int(newAmount)
        budget.save()
    else:
        expense = Expense.objects.filter(
            date__month=month, date__year=year, title=title, category=Expense_Category.objects.filter(
                user=user_id, date__month=month, date__year=year, title=category_title)[:1][0].id)[0]
        prev_amount = expense.amount
        expense.amount = newAmount
        expense.title = newTitle
        expense.save()
        budget.budget += prev_amount
        budget.budget -= int(newAmount)
        budget.save()

    data = {
        'budget': budget.budget
    }

    return JsonResponse(data, status=200, safe=False)
