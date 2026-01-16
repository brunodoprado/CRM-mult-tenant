from django.db import models
from django_tenants.models import TenantMixin, DomainMixin

class Tenant(TenantMixin):
    """
    Representa uma empresa/organização
    Automaticamente cria um schema no PostgreSQL
    """
    name = models.CharField(max_length=100)
    created_on = models.DateTimeField(auto_now_add=True)
    
    # Configurações específicas do tenant
    max_users = models.IntegerField(default=10)
    is_active = models.BooleanField(default=True)
    
    # django-tenants cria automaticamente:
    # - schema_name (nome do schema no PostgreSQL)
    # - auto_create_schema
    # - auto_drop_schema
    
    def __str__(self):
        return self.name

class Domain(DomainMixin):
    """
    Domínios/subdomínios associados ao tenant
    """
    pass
    # Herda automaticamente:
    # - domain (ex: "acme.seucrm.com")
    # - tenant (FK para Tenant)
    # - is_primary