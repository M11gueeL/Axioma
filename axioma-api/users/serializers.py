from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import LoginHistory

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Para mostrar datos del usuario"""
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'birth_date', 'profile_image']

class RegisterSerializer(serializers.ModelSerializer):
    """Para registrar nuevos usuarios"""
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirmation']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirmation']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        # Quitamos password_confirmation porque create_user no lo usa
        validated_data.pop('password_confirmation')
        # Usamos create_user para que Django encripte la contraseña automáticamente
        user = User.objects.create_user(**validated_data)
        return user

class LoginHistorySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = LoginHistory
        fields = ['id', 'username', 'ip_address', 'user_agent', 'created_at']


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer del perfil autenticado con visibilidad condicional del rol."""

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'birth_date',
            'role',
            'date_joined',
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')

        # Para usuarios no ADMIN ocultamos el campo role en el endpoint /profile.
        if request and getattr(request.user, 'role', None) != User.Roles.ADMIN:
            data.pop('role', None)

        return data