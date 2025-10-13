import uuid
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from PIL import Image

def validate_image_file_type(value):
    valid_formats = ("JPEG", "PNG")
    try:
        img = Image.open(value)
        img_format = img.format.upper()
        if img_format not in valid_formats:
            raise ValidationError("Please upload a JPG or PNG image.")
    except Exception:
        raise ValidationError("Invalid image file.")
    finally:
        value.seek(0)

def validate_image_file_size(value):
    max_size = 10 * 1024 * 1024  # 10 MB
    if value.size > max_size:
        raise ValidationError("Image must be under 10 MB.")

class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    adviser = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="advised_organizations"
    )
    profile_picture = models.ImageField(
        upload_to='organization_profiles/',
        null=True,
        blank=True,
        validators=[validate_image_file_type, validate_image_file_size]
    )
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


ROLE_MEMBER = "member"
ROLE_OFFICER = "officer"
ROLE_LEADER = "leader"
ROLE_CHOICES = [
    (ROLE_MEMBER, "Member"),
    (ROLE_OFFICER, "Officer"),
    (ROLE_LEADER, "Leader"),
]

class OrganizationMember(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="members")
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="organizations_joined")
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default=ROLE_MEMBER)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)

    class Meta:
        unique_together = ('organization', 'student')

    def __str__(self):
        return f"{self.student.username} - {self.organization.name} ({self.role})"

    def promote(self):
        if self.role == ROLE_MEMBER:
            self.role = ROLE_OFFICER
            self.save()
        elif self.role == ROLE_OFFICER:
            self.role = ROLE_LEADER
            self.save()
