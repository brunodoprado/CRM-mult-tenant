from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import TenantSignupSerializer

class TenantSignupView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = TenantSignupSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        
        return Response({
            'message': 'Empresa criada com sucesso!',
            'subdomain': result['domain'].domain,
            'redirect_url': f"http://{result['domain'].domain}:8000/login"
        }, status=status.HTTP_201_CREATED)