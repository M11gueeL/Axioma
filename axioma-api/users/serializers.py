from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
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
        fields = ['username', 'email', 'password', 'password_confirmation', 'first_name', 'last_name', 'phone_number', 'birth_date']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirmation']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        # Quitamos password_confirmation porque create_user no lo usa
        validated_data.pop('password_confirmation')
        # Usamos create_user para que Django encripte la contraseña automáticamente
        user = User.objects.create_user(**validated_data)
        
        # Email verification setup
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        verify_link = f"http://localhost:5173/verify-email/{uid}/{token}/"
        
        # Send confirmation email
        try:
            send_mail(
                subject="Verify your Email",
                message=f"Welcome! Please verify your email address by clicking the link below:\n\n{verify_link}",
                from_email=None,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as e:
            # Imprimimos el error y el enlace por consola por si falla el envío de correo de gmail
            print(f"Error al enviar el correo: {e}")
            print(f"ENLACE DE VERIFICACIÓN: {verify_link}")
        
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

class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer para solicitar el restablecimiento de clave mediante un link al correo."""
    email = serializers.EmailField(required=True)

    def save(self):
        email = self.validated_data['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Para evitar ataques de enumeración (saber qué emails existen), no damos error.
            return None

        # Generar UID basado en la clave primaria (ID)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        # Generar Token usando el generator oficial de Django
        token = default_token_generator.make_token(user)

        # Simular ruta del frontend alojado localmente en React/Vite
        reset_link = f"http://localhost:5173/reset-password/{uid}/{token}/"

        # Enviar el correo electrónico
        send_mail(
            subject="Password Reset Request",
            message=f"You requested a password reset. Click the link below to change your password:\n\n{reset_link}\n\nIf you didn't request this, simply ignore this email.",
            from_email=None,  # Toma el DEFAULT_FROM_EMAIL de settings.py
            recipient_list=[user.email],
            fail_silently=False,
        )

class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer para confirmar y establecer la nueva clave usando el UID y el Token provistos."""
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(write_only=True, required=True)

    def save(self):
        uid = self.validated_data['uid']
        token = self.validated_data['token']
        new_password = self.validated_data['new_password']

        try:
            # Decodificar el UID (que está en base64) y castearlo a string
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uid": "Invalid or corrupted UID."})

        # Verificar matemáticamente que el hash (token) pertenece al usuario y no ha expirado
        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError({"token": "The reset token is invalid or has expired."})

        # Almacenar la nueva password encriptada (hashing) con set_password
        user.set_password(new_password)
        user.save()

class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password when the user is already authenticated."""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct.")
        return value

class VerifyEmailSerializer(serializers.Serializer):
    """Serializer for verifying the user's email."""
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)

    def save(self):
        uid = self.validated_data['uid']
        token = self.validated_data['token']

        try:
            # Decodificar el UID
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uid": "Invalid or corrupted UID."})

        # Verificar matemáticamente que el hash (token) pertenece al usuario y es válido
        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError({"token": "The verification token is invalid or has expired."})

        # Cambiar el estado del usuario a verificado
        user.is_email_verified = True
        user.save()
