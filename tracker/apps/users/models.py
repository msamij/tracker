from django.db import models

# Create your models here.


class User(models.Model):
    username = models.CharField(max_length=15)
    password = models.CharField(max_length=32)
    confirm_password = models.CharField(max_length=32)

    def __str__(self):
        return f"{self.username} {self.pk}"
