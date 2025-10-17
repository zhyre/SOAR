from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

# API routes
router = DefaultRouter()
# Uncomment these if you have the viewsets
# router.register(r'organizations', views.OrganizationViewSet)
# router.register(r'members', views.OrganizationMemberViewSet)

urlpatterns = [
    path('orgpage/', views.orgpage, name='orgpage'),
    path('profile/', views.organization_profile, name='organization_profile'),
    path('members/', views.membermanagement, name='membermanagement'),
] + router.urls
