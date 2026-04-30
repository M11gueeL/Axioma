from rest_framework import permissions

class IsAdminOrOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        # Para listar o crear en /manage/, el usuario debe estar autenticado
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Solo ADMIN puede crear usuarios (POST) a través del ViewSet (/manage/)
        if view.action == 'create':
            return request.user.role == 'ADMIN'
        
        return True
    
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

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute, or `obj == request.user` if it's the User instance itself.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner.
        return obj == request.user
