from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('register/', views.register, name='register'),
    path('index/', views.index, name='index'),
    path('organization/', views.organization_page, name='organization'),
    path('profile/', views.profile, name='profile'),
    path('members/', views.members_management, name='members_management'),
    path('logout/', views.logout_view, name='logout'),
    
]
