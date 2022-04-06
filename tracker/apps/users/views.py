from django.shortcuts import render, redirect
from django.urls.base import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
import json

from .forms import UserForm
from .models import User
from django.http import HttpResponse


# ADMIN PASSWORD
# c056BH89Pm

@login_required(login_url='signup')
def index(request):
    return redirect(reverse('budget-menu'))


def signup_user(request):
    if not request.user.is_authenticated:
        if request.method != 'POST':
            form = UserForm()
            return render(request, 'index.html', {'form': form})

        post_data = json.load(request)
        registered_form = UserForm(post_data)

        if not registered_form.is_valid():
            # This is just for extracting error messages and sending it as plain text.
            errors = list(dict(registered_form.errors).values())
            return HttpResponse(errors[len(errors)-1][0],
                                content_type="text", status=401)

        registered_form.save()
        User(username=registered_form.cleaned_data['username'],
             password=registered_form.cleaned_data['password1'],
             confirm_password=registered_form.cleaned_data['password2']).save()

        user = authenticate(
            request,
            username=registered_form.cleaned_data['username'],
            password=registered_form.cleaned_data['password1'])
        login(request, user)
        return HttpResponse('success', content_type="text", status=200)

    return redirect(reverse('index'))


def login_user(request):
    if not request.user.is_authenticated:
        if request.method != 'POST':
            form = UserForm()
            return render(request, 'login.html', {'form': form})

        post_data = json.load(request)

        user = authenticate(
            request,
            username=post_data['username'],
            password=post_data['password1'])
        if user is None:
            return HttpResponse('username or password is incorrect',
                                content_type="text", status=401)

        login(request, user)
        return HttpResponse('success', content_type="text", status=200)

    return redirect(reverse('index'))


def logout_user(request):
    logout(request)
    return redirect(reverse('index'))
