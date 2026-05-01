from rest_framework import generics, viewsets, status, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import (
    RegisterSerializer, UserSerializer, LoginHistorySerializer, ProfileSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer, ChangePasswordSerializer,
    VerifyEmailSerializer
)
from .permissions import IsAdminOrOwner, IsOwnerOrReadOnly
from .models import LoginHistory

User = get_user_model()

# 1. Vista de Registro (La dejamos igual, cualquiera puede registrarse)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny] 
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    """Permite leer y actualizar el perfil de un usuario. Solo el dueño puede editarlo."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

class ProfileView(generics.RetrieveAPIView):
    """Devuelve el perfil del usuario autenticado."""

    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user

# 2. El CRUD completo de Usuarios
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    # Exigimos que estén logueados Y que cumplan la regla de roles
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        """
        Lógica para los GET (Listar usuarios).
        - ADMIN ve a todos los activos.
        - USER solo se ve a sí mismo.
        """
        user = self.request.user
        if user.role == 'ADMIN':
            return User.objects.filter(is_deleted=False)
        return User.objects.filter(id=user.id, is_deleted=False)

    def perform_destroy(self, instance):
        """
        Sobrescribimos el método de borrado (DELETE) para hacer un Soft Delete.
        En lugar de borrar de la base de datos, cambiamos el estado.
        """
        instance.is_deleted = True
        instance.is_active = False # También desactivamos el login de Django
        instance.save()

    def perform_update(self, serializer):
        """
        Interceptamos la actualización antes de guardar en base de datos.
        Evitamos que un USER normal pueda cambiarse el rol a ADMIN.
        """
        user = self.request.user
        
        # Si no es ADMIN, eliminamos silenciosamente cualquier intento de cambiar el rol
        if user.role != 'ADMIN' and 'role' in serializer.validated_data:
            serializer.validated_data.pop('role')
            
        # Guardamos los datos (con el rol filtrado si fue necesario)
        serializer.save()

# --- 1. Custom Login (Para registrar el historial) ---
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Bloquear el acceso si el usuario no ha verificado su correo
        username = request.data.get('username')
        if username:
            try:
                user = User.objects.get(username=username)
                if not user.is_email_verified:
                    return Response(
                        {"detail": "Please verify your email address before logging in."}, 
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            except User.DoesNotExist:
                # Si no existe, dejamos que TokenObtainPairView lance su error normal
                pass
                
        response = super().post(request, *args, **kwargs)
        
        # Si el login fue exitoso (código 200), guardamos el historial
        if response.status_code == 200:
            user = User.objects.get(username=request.data['username'])
            ip = request.META.get('REMOTE_ADDR')
            agent = request.META.get('HTTP_USER_AGENT', '')
            LoginHistory.objects.create(user=user, ip_address=ip, user_agent=agent)
            
        return response

# --- 2. Logout View ---
class LogoutView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            # El frontend debe enviarnos el token de refresco para meterlo en la lista negra
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Sesión cerrada exitosamente."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"detail": "Token inválido o ya expirado."}, status=status.HTTP_400_BAD_REQUEST)

# --- 3. Historial Inteligente (1 Endpoint para ambos roles) ---
class LoginHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LoginHistorySerializer

    def get_queryset(self):
        user = self.request.user
        # Si es ADMIN, ve el historial de TODOS. Si es USER, solo el suyo.
        if user.role == 'ADMIN':
            return LoginHistory.objects.all().order_by('-created_at')
        return LoginHistory.objects.filter(user=user).order_by('-created_at')

# --- 4. Flujo de Reseteo de Contraseñas ---
class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # La lógica de envío está en el save() del serializer
        serializer.save()
        # Siempre retornamos éxito por seguridad (evitar user enumeration)
        return Response(
            {"detail": "If an account exists with that email, we've sent you a password reset link."},
            status=status.HTTP_200_OK
        )

class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # La lógica de cambio de clave está en el save() del serializer
        serializer.save()
        return Response(
            {"detail": "Password has been reset successfully. You may now login."},
            status=status.HTTP_200_OK
        )

# --- 5. Flujo de Cambio de Contraseña Interno ---
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response(
                {"detail": "Password updated successfully."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- 6. Flujo de Verificación de Email ---
class VerifyEmailView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = VerifyEmailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # La lógica de validación del token está en el save()
        serializer.save()
        
        return Response(
            {"detail": "Email verified successfully. You may now login."},
            status=status.HTTP_200_OK
        )