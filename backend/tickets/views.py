from django.contrib.auth.models import User
from django_filters import rest_framework as filters
from rest_framework import generics, permissions, status, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Ticket
from .serializers import TicketSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Ticket
from .permissions import IsAdminOrOwner
from .serializers import CustomTokenObtainPairSerializer, TicketSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class TicketFilter(filters.FilterSet):
    class Meta:
        model = Ticket
        fields = {
            'status': ['exact'],
            'priority': ['exact'],
            'user': ['exact'],
            'assigned_to': ['exact'],
        }

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]
    filter_backends = [filters.DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TicketFilter
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'priority']
    
    def get_queryset(self):
        """
        This view should return:
        - All tickets for admins
        - Only user's own tickets for regular users
        """
        if self.request.user.is_staff:
            return Ticket.objects.all().order_by('-created_at')
        return Ticket.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        """
        Set the user when creating a new ticket
        """
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **pk):
        """
        Allow only admin users to delete tickets
        """
        if not request.user.is_staff:
            return Response(
                {"detail": "You do not have permission to delete tickets."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **pk)
