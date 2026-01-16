from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import RegisterView

# Rotas que precisam de tenant (acessadas via subdomínio)
urlpatterns = [
    # Autenticação JWT (disponível também via subdomínio)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Registro de usuários (disponível também via subdomínio)
    path('api/register/', RegisterView.as_view(), name='register'),
    
    # API do CRM (customers)
    path('api/', include('crm.urls')),
]