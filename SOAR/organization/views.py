from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from django.contrib.auth.decorators import login_required

from .models import Organization, OrganizationMember
from .serializers import OrganizationSerializer, OrganizationMemberSerializer
from .permissions import IsOrgOfficerOrAdviser

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'], url_path='members')
    def members(self, request, pk=None):
        org = self.get_object()
        query = request.query_params.get('q', '').strip()
        members = org.members.select_related('student')
        if query:
            members = members.filter(
                Q(student__username__icontains=query) |
                Q(student__first_name__icontains=query) |
                Q(student__last_name__icontains=query)
            )
        serializer = OrganizationMemberSerializer(members, many=True)
        return Response(serializer.data)

class OrganizationMemberViewSet(viewsets.ModelViewSet):
    queryset = OrganizationMember.objects.select_related('student', 'organization').all()
    serializer_class = OrganizationMemberSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def promote(self, request, pk=None):
        member = self.get_object()
        member.promote()
        return Response({'status': 'promoted', 'new_role': member.role})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({'status': 'removed'})

@login_required
def organization_page(request):
    """Render the organization page using the template under accounts/templates/accounts."""
    organizations = Organization.objects.all()
    return render(request, 'accounts/organization.html', {'organizations': organizations})

@login_required
def orgpage(request):
    """Render the organization dashboard page."""
    # Get organization data (you can modify this based on your needs)
    organization = None
    if Organization.objects.exists():
        organization = Organization.objects.first()
    return render(request, 'organization/orgpage.html', {'organization': organization})

@login_required
def organization_profile(request):
    """Render the organization profile page."""
    organization = None
    if Organization.objects.exists():
        organization = Organization.objects.first()
    return render(request, 'organization/organization_profile.html', {'organization': organization})

@login_required
def membermanagement(request):
    """Render the member management page."""
    organization = None
    if Organization.objects.exists():
        organization = Organization.objects.first()
    return render(request, 'organization/membermanagement.html', {'organization': organization})
