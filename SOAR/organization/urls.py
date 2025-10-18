from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

# API routes
router = DefaultRouter()
router.register(r'programs', views.ProgramViewSet, basename='program')

urlpatterns = [
    path('orgpage/', views.orgpage, name='orgpage'),
    path('profile/', views.organization_profile, name='organization_profile'),
     path('profile/edit/', views.organization_edit_profile, name='organization_editprofile'),
    path('members/', views.membermanagement, name='membermanagement'),
    path('api/update-organization/', views.api_update_organization, name='api_update_organization'),
] + router.urls
