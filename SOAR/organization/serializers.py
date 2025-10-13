from rest_framework import serializers
from .models import Organization, OrganizationMember

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'description', 'profile_picture', 'adviser', 'date_created']

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Organization name is required")
        return value

    def validate_description(self, value):
        if not value.strip():
            raise serializers.ValidationError("Description is required")
        if len(value) > 500:
            raise serializers.ValidationError("Description must be 500 characters or fewer")
        return value

class OrganizationMemberSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)
    class Meta:
        model = OrganizationMember
        fields = ['id', 'organization', 'student', 'student_username', 'role', 'date_joined', 'is_approved']
