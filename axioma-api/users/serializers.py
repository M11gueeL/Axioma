from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import LoginHistory

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Para mostrar datos del usuario"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'birth_date', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    """Para registrar nuevos usuarios"""
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone_number', 'birth_date']

    def create(self, validated_data):
        # Usamos create_user para que Django encripte la contraseña automáticamente
        user = User.objects.create_user(**validated_data)
        return user

class LoginHistorySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = LoginHistory
        fields = ['id', 'username', 'ip_address', 'user_agent', 'created_at']