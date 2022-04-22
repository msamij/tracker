
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
    item = inc_or_exp.objects.filter(
        title=data['title'],
        date__month=data['month'],
        date__year=data['year'],
        category=data['category'].id)
    if item:
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
