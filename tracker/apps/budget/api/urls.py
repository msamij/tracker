from django.urls import path
from . import views

urlpatterns = [
    path('budget/<int:page>/', views.paginate_budget),
    path('income-category/<int:page>/', views.paginate_income_category),
    path('expense-category/<int:page>/', views.paginate_expense_category),
    path('income/<int:page>/', views.paginate_income),
    path('expense/<int:page>/', views.paginate_expense)
]
