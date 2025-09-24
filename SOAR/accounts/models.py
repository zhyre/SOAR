from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    student_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    course = models.CharField(max_length=100, blank=True)
    year_level = models.PositiveSmallIntegerField(null=True, blank=True)

    def __str__(self):
        return self.username
