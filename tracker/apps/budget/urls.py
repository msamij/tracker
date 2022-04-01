from django.urls import path
from . import views

urlpatterns = [
    path('', views.budget_menu, name='budget-menu'),
    path('add-<str:inc_or_exp>-category/', views.save_category),
    path('add-<str:inc_or_exp>/', views.save_income_and_expense),
    path('delete-<str:inc_or_exp>-category/', views.delete_category)
]
