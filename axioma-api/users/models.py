from django.contrib.auth.models import AbstractUser
from django.db import models
import os
import uuid

# ==========================================
# FILE PATH GENERATORS
# ==========================================

def get_profile_image_path(instance, filename):
    """
    Generates a dynamic path for profile images:
    media/users/<user_id>/profile/<uuid>.ext
    """
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    # Use instance.id because this is the User model itself
    return f"media/users/{instance.id}/profile/{filename}"

def get_post_media_path(instance, filename):
    """
    Generates a dynamic path for post media:
    media/users/<user_id>/posts/<uuid>.ext
    """
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    # Use instance.author.id assuming the Post model has a ForeignKey to User named 'author'
    return f"media/users/{instance.author.id}/posts/{filename}"

# ==========================================
# MODELS
# ==========================================
class User(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = 'ADMIN', 'Administrador'
        USER = 'USER', 'Usuario Normal'

    role = models.CharField(max_length=10, choices=Roles.choices, default=Roles.USER)
    email = models.EmailField(unique=True)
    
    # Campos nuevos
    phone_number = models.CharField(max_length=20, blank=True, null=True) # Ejemplo: +58412...
    birth_date = models.DateField(blank=True, null=True)
    
    # Auditoría
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    profile_image = models.ImageField(upload_to=get_profile_image_path, null=True, blank=True)

    # El email será obligatorio para crear usuarios desde consola
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'role']

    def __str__(self):
        return f"{self.username} ({self.role})"
    
class LoginHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_history')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.created_at}"

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    
    # Magic for post images
    post_image = models.ImageField(upload_to=get_post_media_path, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.author.username} at {self.created_at}"