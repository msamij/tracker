import calendar
import datetime


# These functions will generate context that'll be injected into html.
def generate_budget_context(context, budget, budget_count):
    context['budget'] = budget[0].budget
    context['budget_count'] = budget_count
    context['budget_month'] = calendar.month_name[budget[0].date.month]
    context['budget_year'] = budget[0].date.year
    return context


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
