from django.urls import path
from rest_framework import generics
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

# Una vista rápida para el registro
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
]