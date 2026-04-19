from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Personalizamos qué se ve en el panel de administrador
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'role', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Información de Axioma', {'fields': ('role', 'phone_number', 'birth_date', 'is_deleted')}),
    )

admin.site.register(User, CustomUserAdmin)