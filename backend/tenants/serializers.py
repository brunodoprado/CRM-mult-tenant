from rest_framework import serializers
from .models import Tenant, Domain
from users.models import User
from django.db import connection

class TenantSignupSerializer(serializers.Serializer):
    company_name = serializers.CharField(max_length=100)
    subdomain = serializers.CharField(max_length=50)
    admin_name = serializers.CharField(max_length=100)
    admin_email = serializers.EmailField()
    admin_password = serializers.CharField(write_only=True)
    
    def validate_subdomain(self, value):
        # Validar formato
        if not value.isalnum():
            raise serializers.ValidationError("Subdomínio deve conter apenas letras e números")
        
        # Verificar disponibilidade
        if Domain.objects.filter(domain__startswith=f"{value}.").exists():
            raise serializers.ValidationError("Subdomínio já existe")
        
        return value.lower()
    
    def create(self, validated_data):
        # Criar tenant
        tenant = Tenant(
            schema_name=validated_data['subdomain'],
            name=validated_data['company_name'],
        )
        tenant.save()
        
        # Criar domínio
        domain = Domain()
        domain.domain = f"{validated_data['subdomain']}.localhost"  # Dev
        # domain.domain = f"{validated_data['subdomain']}.seucrm.com"  # Prod
        domain.tenant = tenant
        domain.is_primary = True
        domain.save()
        
        # Trocar para schema do tenant
        connection.set_tenant(tenant)
        
        # Criar usuário admin
        user = User.objects.create_user(
            username=validated_data['admin_email'],
            email=validated_data['admin_email'],
            password=validated_data['admin_password'],
            first_name=validated_data['admin_name'],
            role='admin',
            is_staff=True,
        )
        
        return {
            'tenant': tenant,
            'domain': domain,
            'user': user,
        }