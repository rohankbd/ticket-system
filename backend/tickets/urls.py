from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import RegisterView, TicketViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
]