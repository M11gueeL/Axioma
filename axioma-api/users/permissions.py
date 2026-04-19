from rest_framework import permissions

class IsAdminOrOwner(permissions.BasePermission):
    """
    Permite el acceso total si el usuario es ADMIN.
    Si es USER, solo permite el acceso si el objeto le pertenece a sí mismo.
    """
    def has_object_permission(self, request, view, obj):
        # Si el usuario es administrador, puede hacer lo que sea
        if request.user.role == 'ADMIN':
            return True
        
        # Si es un usuario normal, el objeto consultado/modificado debe ser él mismo
        return obj == request.user