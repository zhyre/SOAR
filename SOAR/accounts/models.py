from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    course = models.CharField(max_length=100, blank=True)
    year_level = models.PositiveSmallIntegerField(null=True, blank=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        null=True,
        blank=True
    )

    def __str__(self):
        return self.username
