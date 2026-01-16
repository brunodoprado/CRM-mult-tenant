from django.urls import path, include

# Rotas que precisam de tenant (acessadas via subdomínio)
urlpatterns = [
    path('api/', include('crm.urls')),      # API do CRM (customers)
]