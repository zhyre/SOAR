from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import StudentRegistrationForm
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required

# Existing index view
@login_required
def index(request):
    return render(request, "accounts/index.html")

# New registration view
def register(request):
    if request.method == 'POST':
        form = StudentRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Account created successfully! You can now log in.')
    else:
        form = StudentRegistrationForm()
    return render(request, 'accounts/register.html', {'form': form})
