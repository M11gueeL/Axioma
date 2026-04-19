from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer
from .permissions import IsAdminOrOwner

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