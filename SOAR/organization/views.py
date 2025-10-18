from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from .models import Organization, OrganizationMember, Program
from .serializers import OrganizationSerializer, OrganizationMemberSerializer, ProgramSerializer
from .permissions import IsOrgOfficerOrAdviser

from django.shortcuts import render, get_object_or_404

def organization_detail(request, org_id):
    organization = get_object_or_404(Organization, id=org_id)
    programs = Program.objects.all()  # ← this must be plural

    return render(request, 'organization_profile.html', {
        'organization': organization,
        'programs': programs,  # ← what the template loops over
    })

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

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated]

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

def organization_profile(request):
    """Render and update the general organization profile page."""
    organization = None
    if Organization.objects.exists():
        organization = Organization.objects.first()  # Use the first org for now

    programs = Program.objects.all()

    if request.method == 'POST' and organization:
        # Basic info
        name = (request.POST.get('org_name') or organization.name).strip()
        about = (request.POST.get('org_about') or organization.description or '').strip()
        is_public_val = request.POST.get('is_public')
        is_public = True if str(is_public_val).lower() in ('true', '1', 'on', 'yes') else False

        # Save updates
        organization.name = name
        organization.description = about
        organization.is_public = is_public
        organization.save()

        # Handle allowed programs only if private
        if not is_public:
            allowed_ids = request.POST.getlist('allowed_programs')
            selected_programs = Program.objects.filter(id__in=allowed_ids)
            organization.allowed_programs.set(selected_programs)
        else:
            organization.allowed_programs.clear()

        # Optional: add success message
        messages.success(request, "Organization profile updated successfully!")

        # Redirect to avoid re-submission
        return redirect('organization_profile')

    return render(request, 'organization/organization_profile.html', {
        'organization': organization,
        'programs': programs,
    })

@login_required
def organization_edit_profile(request):
    """Edit organization profile page."""
    # Get the first organization (or None if none exist)
    organization = Organization.objects.first()
    programs = Program.objects.all()

    if request.method == 'POST' and organization:
        # Collect and sanitize form fields
        name = (request.POST.get('org_name') or organization.name).strip()
        about = (request.POST.get('org_about') or organization.description or '').strip()
        is_public_val = request.POST.get('is_public')
        is_public = str(is_public_val).lower() in ('true', '1', 'on', 'yes')

        # Update organization fields
        organization.name = name
        organization.description = about
        organization.is_public = is_public
        organization.save()

        # Update allowed programs if private
        if not is_public:
            allowed_ids = request.POST.getlist('allowed_programs')
            allowed_programs = Program.objects.filter(id__in=allowed_ids)
            organization.allowed_programs.set(allowed_programs)
        else:
            organization.allowed_programs.clear()

        messages.success(request, "Organization profile updated successfully.")
        return redirect('organization_profile')

    return render(request, 'organization/organization_editprofile.html', {
        'organization': organization,
        'programs': programs,
    })
@login_required
def membermanagement(request):
    """Render the member management page."""
    organization = None
    if Organization.objects.exists():
        organization = Organization.objects.first()
    return render(request, 'organization/membermanagement.html', {'organization': organization})
  # Only if not using CSRF token in JS
@login_required
def api_update_organization(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    data = json.loads(request.body)
    organization = Organization.objects.first()
    if not organization:
        return JsonResponse({'error': 'Organization not found'}, status=404)

    organization.name = data.get('org_name', organization.name)
    organization.description = data.get('org_about', organization.description)
    is_public_val = data.get('is_public', organization.is_public)
    organization.is_public = str(is_public_val).lower() in ('true', '1', 'on', 'yes')
    organization.save()

    if not organization.is_public:
        allowed_ids = data.get('allowed_programs', [])
        organization.allowed_programs.set(Program.objects.filter(id__in=allowed_ids))
    else:
        organization.allowed_programs.clear()

    return JsonResponse({'message': 'Organization updated successfully'})