import calendar
import datetime
from django.core.paginator import Paginator


def valid_category(category, data):
    category_obj = category.objects.filter(
        title=data['category'],
        date__month=data['month'],
        date__year=data['year'],
        user=data['user'].id)
    if category_obj:
        return
    return True


def valid_income_and_expense(inc_or_exp, data):
    filter_data = inc_or_exp.objects.filter(
        title=data['title'],
        date__month=data['month'],
        date__year=data['year'],
        category=data['category'].id)
    if filter_data:
        return
    else:
        return True


def valid_budget(budget, user_id, month, year):
    budget_found = budget.objects.filter(
        date__month=month, date__year=year, user=user_id)
    if budget_found:
        return
    else:
        return True


# These functions will generate context that'll be injected into html.
def generate_category_context(context, category, category_count, category_string):
    context[category_string + '_category_title'] = category[0].title
    formatted_date = datetime.datetime(
        category[0].date.year,
        category[0].date.month,
        category[0].date.day)
    context[category_string +
            '_category_date'] = formatted_date.strftime('%b %d, %Y')
    context['budget_month'] = calendar.month_name[category[0].date.month]
    context['budget_year'] = category[0].date.year
    context[category_string + '_category_count'] = category_count
    return context


def generate_budget_context(context, budget, budget_count):
    context['budget'] = budget[0].budget
    context['budget_count'] = budget_count
    context['budget_month'] = calendar.month_name[budget[0].date.month]
    context['budget_year'] = budget[0].date.year
    return context


def generate_income_and_expense_context(context, inc_or_exp, inc_or_exp_count, inc_or_exp_string):
    context[inc_or_exp_string + '_title'] = inc_or_exp[0].title
    context[inc_or_exp_string] = inc_or_exp[0].amount
    formatted_date = datetime.datetime(
        inc_or_exp[0].date.year,
        inc_or_exp[0].date.month,
        inc_or_exp[0].date.day)
    context[inc_or_exp_string +
            '_date'] = formatted_date.strftime('%b %d, %Y')
    context[inc_or_exp_string + '_count'] = inc_or_exp_count
    return context


# These functions will fetch relevant information from database.
def get_budget(user_id, Budget, income_category, page):
    return Paginator(Budget.objects.filter(user=user_id,
                                           date__month=income_category[0].date.month,
                                           date__year=income_category[0].date.year), 1).page(page).object_list[0]


def get_income_and_expense(category, Inc_or_exp, page):
    return Paginator(Inc_or_exp.objects.filter(date__month=category[0].date.month,
                                               category=category[0].id), 1).page(page).object_list[0]


def get_income_category(Income_Category, user_id, page):
    return Paginator(Income_Category.objects.filter(user=user_id), 1).page(page).object_list[0]


def get_expense_category(Expense_Category, inc_category, user_id, page):
    return Paginator(Expense_Category.objects.filter(user=user_id,
                                                     date__month=inc_category.page(
                                                         page).object_list[0].date.month,
                                                     date__year=inc_category.page(page).object_list[0].date.year), 1
                     ).page(page).object_list[0]


def get_data(user_id, context, Budget, Income_Category, Expense_Category, Income, Expense):
    inc_category = Income_Category.objects.filter(user=user_id)[:1]
    if len(inc_category) > 0:
        context = generate_category_context(
            context, inc_category,
            Income_Category.objects.filter(user=user_id).count(), 'income')

        budget = Budget.objects.filter(
            user=user_id,
            date__month=inc_category[0].date.month,
            date__year=inc_category[0].date.year)[:1]
        if len(budget) > 0:
            context = generate_budget_context(
                context, budget, Budget.objects.filter(user=user_id).count())

        income = Income.objects.filter(date__month=inc_category[0].date.month,
                                       category=inc_category[0].id)[:1]
        if len(income) > 0:
            context = generate_income_and_expense_context(
                context, income,
                Income.objects.filter(date__month=inc_category[0].date.month,
                                      category=inc_category[0].id).count(), 'income')

        exp_category = Expense_Category.objects.filter(
            user=user_id, date__month=inc_category[0].date.month,
            date__year=inc_category[0].date.year)[:1]
        if len(exp_category) > 0:
            context = generate_category_context(
                context, exp_category, Expense_Category.objects.filter(
                    user=user_id, date__month=inc_category[0].date.month,
                    date__year=inc_category[0].date.year).count(), 'expense')

            expense = Expense.objects.filter(date__month=exp_category[0].date.month,
                                             category=exp_category[0].id)[:1]
            if len(expense) > 0:
                context = generate_income_and_expense_context(
                    context, expense,
                    Expense.objects.filter(date__month=exp_category[0].date.month,
                                           category=exp_category[0].id).count(), 'expense')
    return context
