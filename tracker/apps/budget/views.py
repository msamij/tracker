import json
from django.http import JsonResponse
from django.urls.base import reverse
from django.shortcuts import redirect, render
from django.http.response import HttpResponse
from django.contrib.auth.decorators import login_required

from .forms import BudgetForm
from tracker.apps.users.models import User
from .models import (Budget, Income_Category,
                     Expense_Category, Income, Expense)
from .utils.validators import (valid_budget,
                               valid_category,
                               valid_income_and_expense)
from .utils.data import (get_budget_menu_data, save_budget, update_budget)


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
        user=user_id, date__month=month, date__year=year)[0]

    data = {
        'budget': budget.budget
    }

    return JsonResponse(data, status=200, safe=False)


def save_category(request, inc_or_exp):
    if request.method != 'POST':
        return redirect(reverse('budget-menu'))

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
    if request.method != 'POST':
        return redirect(reverse('budget-menu'))

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
