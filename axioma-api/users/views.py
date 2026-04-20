from rest_framework import generics, viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, LoginHistorySerializer
from .permissions import IsAdminOrOwner
from .models import LoginHistory

User = get_user_model()

# 1. Vista de Registro (La dejamos igual, cualquiera puede registrarse)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) 
    serializer_class = RegisterSerializer

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