from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class StudentRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    student_id = forms.CharField(required=True)
    course = forms.CharField(required=False)
    year_level = forms.IntegerField(required=False, min_value=1)

    class Meta:
        model = User
        fields = ('username', 'email', 'student_id', 'course', 'year_level', 'password1', 'password2')
