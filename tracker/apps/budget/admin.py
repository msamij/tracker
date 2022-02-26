from django.contrib import admin
from .models import Budget, Income, Expense, Income_Category, Expense_Category

# Register your models here.
admin.site.register(Budget)
admin.site.register(Income)
admin.site.register(Expense)
admin.site.register(Income_Category)
admin.site.register(Expense_Category)
