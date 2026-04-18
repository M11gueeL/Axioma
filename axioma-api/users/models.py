from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Definimos los roles como opciones
    class Roles(models.TextChoices):
        ADMIN = 'ADMIN', 'Administrador'
        USER = 'USER', 'Usuario Normal'

    role = models.CharField(
        max_length=10, 
        choices=Roles.choices, 
        default=Roles.USER
    )
    email = models.EmailField(unique=True) # Hacemos que el email sea único

    # Usaremos el email para loguearnos en lugar del username si quisiéramos
    REQUIRED_FIELDS = ['first_name', 'last_name', 'role']