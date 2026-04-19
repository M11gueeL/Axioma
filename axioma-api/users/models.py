from django.contrib.auth.models import AbstractUser
from django.db import models

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

    # El email será obligatorio para crear usuarios desde consola
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'role']

    def __str__(self):
        return f"{self.username} ({self.role})"