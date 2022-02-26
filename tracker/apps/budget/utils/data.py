from django.core.paginator import Paginator
from .context import (generate_budget_context,
                      generate_category_context,
                      generate_income_and_expense_context)


def save_budget(Budget, inc_or_exp, data, user):
    """
    Get the budget for the specified month, increment the budget if we added an income otherwise
    decrement budget. If budget not found for the specified month, then create a new budget for that month.
    """
    budget = Budget.objects.filter(
        date__month=data['month'], date__year=data['year'], user=user.id)
    if budget:
        if inc_or_exp == 'income':
            budget[0].budget += int(data['amount'])
        else:
            budget[0].budget -= int(data['amount'])
        budget[0].save()
    else:
        Budget(budget=data['amount'],
               date=data['date'], user=user).save()


# These functions will fetch relevant information from database.
def get_budget_menu_data(user_id, context, Budget, Income_Category, Expense_Category, Income, Expense):

    budget = Budget.objects.filter(user=user_id)[:1]
    if len(budget) > 0:
        context = generate_budget_context(
            context, budget, Budget.objects.filter(user=user_id).count())

        inc_category = Income_Category.objects.filter(
            user=user_id,
            date__month=budget[0].date.month,
            date__year=budget[0].date.year)[:1]
        if len(inc_category) > 0:
            context = generate_category_context(
                context, inc_category, Income_Category.objects.filter(
                    user=user_id,
                    date__month=budget[0].date.month,
                    date__year=budget[0].date.year).count(), 'income')

            income = Income.objects.filter(
                date__month=budget[0].date.month,
                date__year=budget[0].date.year,
                category=inc_category[0].id)[:1]
            if len(income) > 0:
                context = generate_income_and_expense_context(
                    context, income, Income.objects.filter(
                        date__month=budget[0].date.month,
                        date__year=budget[0].date.year,
                        category=inc_category[0].id).count(), 'income')

        exp_category = Expense_Category.objects.filter(
            user=user_id,
            date__month=budget[0].date.month,
            date__year=budget[0].date.year)[:1]
        if len(exp_category) > 0:
            context = generate_category_context(
                context, exp_category, Expense_Category.objects.filter(
                    user=user_id,
                    date__month=budget[0].date.month,
                    date__year=budget[0].date.year).count(), 'expense')

            expense = Expense.objects.filter(
                date__month=budget[0].date.month,
                date__year=budget[0].date.year,
                category=exp_category[0].id)[:1]
            if len(expense) > 0:
                context = generate_income_and_expense_context(
                    context, expense,
                    Expense.objects.filter(
                        date__month=budget[0].date.month,
                        date__year=budget[0].date.year,
                        category=exp_category[0].id).count(), 'expense')
    return context


def get_budget(user_id, Budget, page):
    try:
        return Paginator(Budget.objects.filter(user=user_id), 1).page(page).object_list[0]
    except Exception:
        return False


def get_income_and_expense(Category, Inc_or_exp, page):
    try:
        return Paginator(Inc_or_exp.objects.filter(date__month=Category.date.month,
                                                   date__year=Category.date.year,
                                                   category=Category.id), 1).page(page).object_list[0]
    except Exception:
        return False


def get_category(Category, user_id, month, year, page):
    try:
        return Paginator(Category.objects.filter(user=user_id,
                                                 date__month=month,
                                                 date__year=year), 1).page(page).object_list[0]
    except Exception:
        return False
