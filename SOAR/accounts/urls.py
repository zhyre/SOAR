from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('login/', views.login_view, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout_view, name='logout'),
    
    # Protected routes (require login)
    path('index/', views.index, name='index'),
    path('organization/', views.organization_page, name='organization'),
    path('profile/', views.profile, name='profile'),
    path('members/', views.members_management, name='members_management'),
]
