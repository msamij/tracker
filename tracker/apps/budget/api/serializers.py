from rest_framework import serializers
from ..models import Budget, Income_Category, Expense_Category, Income, Expense


class Budget_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['budget', 'date']


class Income_Category_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Income_Category
        fields = ['date', 'title', 'pk']


class Income_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['title', 'amount', 'date']


class Expense_Category_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Expense_Category
        fields = ['date', 'title', 'pk']


class Expense_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['title', 'amount', 'date']
