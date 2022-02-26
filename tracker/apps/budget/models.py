from django.db import models
from tracker.apps.users.models import User


class Budget(models.Model):
    budget = models.IntegerField()
    date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.user.username} {self.budget}"


class Income_Category(models.Model):
    title = models.CharField(max_length=12)
    date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.user.username} {self.title}"


class Income(models.Model):
    title = models.CharField(max_length=12)
    amount = models.IntegerField()
    date = models.DateField()
    category = models.ForeignKey(Income_Category, on_delete=models.CASCADE)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.category.title} {self.title}"


class Expense_Category(models.Model):
    title = models.CharField(max_length=12)
    date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.user.username} {self.title}"


class Expense(models.Model):
    title = models.CharField(max_length=12)
    amount = models.IntegerField()
    date = models.DateField()
    category = models.ForeignKey(Expense_Category, on_delete=models.CASCADE)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.category.title} {self.title}"
