from django.contrib import admin
from django.urls import path, include # Importa include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')), # Conectamos las URLs de la app users
]