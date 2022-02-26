from django.http import JsonResponse
from django.http.response import HttpResponse

from tracker.apps.users.models import User
from ..models import (Budget, Income_Category,
                      Expense_Category, Income, Expense)
from ..utils.data import (get_budget, get_category,
                          get_income_and_expense)


def paginate_budget(request, page):
    user_id = User.objects.get(username=request.user.username).id
    budget = get_budget(user_id, Budget, page)

    if not budget:
        return HttpResponse("Invalid Page no", status=404)

    data = {
        "budget": budget.budget,
        "budgetDate": budget.date
    }

    income_category = get_category(
        Income_Category, user_id, budget.date.month, budget.date.year, 1)
    expense_category = get_category(
        Expense_Category, user_id, budget.date.month, budget.date.year, 1)

    if income_category:
        data['incomeCategoryDate'] = income_category.date
        data['incomeCategoryTitle'] = income_category.title
        data['incomeCategoryCount'] = Income_Category.objects.filter(
            user=user_id,
            date__month=budget.date.month,
            date__year=budget.date.year).count()

        income = get_income_and_expense(income_category, Income, 1)
        if income:
            data['incomeDate'] = income.date
            data['incomeTitle'] = income.title
            data['incomeAmount'] = income.amount
            data['incomeCount'] = Income.objects.filter(
                date__month=budget.date.month,
                date__year=budget.date.year,
                category=income_category.id).count()

    if expense_category:
        data['expenseCategoryDate'] = expense_category.date
        data['expenseCategoryTitle'] = expense_category.title
        data['expenseCategoryCount'] = Expense_Category.objects.filter(
            user=user_id,
            date__month=budget.date.month,
            date__year=budget.date.year).count()

        expense = get_income_and_expense(expense_category, Expense, 1)
        if expense:
            data['expenseDate'] = expense.date
            data['expenseTitle'] = expense.title
            data['expenseAmount'] = expense.amount
            data['expenseCount'] = Expense.objects.filter(
                category=expense_category.id,
                date__month=budget.date.month,
                date__year=budget.date.year).count()

    return JsonResponse(data, status=200, safe=False)


def paginate_income_category(request, page):
    month = request.GET.get('month')
    year = request.GET.get('year')
    user_id = User.objects.get(username=request.user.username).id
    income_category = get_category(
        Income_Category, user_id, month, year, page)

    if not income_category:
        return HttpResponse("Invalid Page no", status=404)

    data = {}
    data['incomeCategoryDate'] = income_category.date
    data['incomeCategoryTitle'] = income_category.title
    data['incomeCategoryCount'] = Income_Category.objects.filter(
        user=user_id,
        date__month=month,
        date__year=year).count()

    income = get_income_and_expense(income_category, Income, 1)
    if income:
        data['incomeDate'] = income.date
        data['incomeTitle'] = income.title
        data['incomeAmount'] = income.amount
        data['incomeCount'] = Income.objects.filter(
            date__month=month,
            date__year=year,
            category=income_category.id).count()

    return JsonResponse(data, status=200, safe=False)


def paginate_expense_category(request, page):
    month = request.GET.get('month')
    year = request.GET.get('year')
    user_id = User.objects.get(username=request.user.username).id
    expense_category = get_category(
        Expense_Category, user_id, month, year, page)

    if not expense_category:
        return HttpResponse("Invalid Page no", status=404)

    data = {}
    data['expenseCategoryDate'] = expense_category.date
    data['expenseCategoryTitle'] = expense_category.title
    data['expenseCategoryCount'] = Expense_Category.objects.filter(
        user=user_id,
        date__month=month,
        date__year=year).count()

    expense = get_income_and_expense(expense_category, Expense, 1)
    if expense:
        data['expenseDate'] = expense.date
        data['expenseTitle'] = expense.title
        data['expenseAmount'] = expense.amount
        data['expenseCount'] = Expense.objects.filter(
            date__month=month,
            date__year=year,
            category=expense_category.id).count()

    return JsonResponse(data, status=200, safe=False)


def paginate_income(request, page):
    month = request.GET.get('month')
    year = request.GET.get('year')
    title = request.GET.get('title')
    user_id = User.objects.get(username=request.user.username).id
    income_category = Income_Category.objects.filter(
        user=user_id,
        title=title,
        date__month=month,
        date__year=year)

    if not income_category:
        return HttpResponse("Page not found", status=404)

    income = get_income_and_expense(income_category[0], Income, page)

    data = {
        "incomeTitle": income.title,
        "incomeAmount": income.amount,
        "incomeDate": income.date
    }

    return JsonResponse(data)


def paginate_expense(request, page):
    month = request.GET.get('month')
    year = request.GET.get('year')
    title = request.GET.get('title')
    user_id = User.objects.get(username=request.user.username).id
    expense_category = Expense_Category.objects.filter(
        user=user_id,
        title=title,
        date__month=month,
        date__year=year)

    if not expense_category:
        return HttpResponse("Page not found", status=404)

    expense = get_income_and_expense(expense_category[0], Expense, page)

    data = {
        "expenseTitle": expense.title,
        "expenseAmount": expense.amount,
        "expenseDate": expense.date
    }

    return JsonResponse(data)
