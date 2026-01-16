from django.urls import path
from django.http import HttpResponseRedirect
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from tenants.views import TenantSignupView
from users.views import RegisterView

# View simples para redirecionar /login para o frontend
def login_redirect(request):
    """Redireciona requisições de /login para o frontend"""
    return HttpResponseRedirect('http://localhost:5173')

# Rotas públicas que não precisam de tenant
urlpatterns = [
    # Autenticação JWT (público)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Signup de tenant (público - precisa criar tenant antes de usar)
    path('api/signup/', TenantSignupView.as_view(), name='tenant-signup'),
    
    # Registro de usuários (público)
    path('api/register/', RegisterView.as_view(), name='register'),
    
    # Fallback para /login - redireciona para o frontend
    path('login/', login_redirect, name='login-redirect'),
]
