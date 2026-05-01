from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, UserViewSet, 
    CustomTokenObtainPairView, LogoutView, LoginHistoryView, ProfileView, UserProfileView,
    PasswordResetRequestView, PasswordResetConfirmView, ChangePasswordView, VerifyEmailView
)

router = DefaultRouter()
router.register(r'manage', UserViewSet, basename='user-manage')

urlpatterns = [
    # Autenticación
    path('register/', RegisterView.as_view(), name='user-register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'), # Usamos el nuestro
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/<int:pk>/', UserProfileView.as_view(), name='user-profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Password Reset
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # Historial de Sesiones
    path('sessions/', LoginHistoryView.as_view(), name='sessions_history'),
    
    # CRUD de Usuarios
    path('', include(router.urls)),
]