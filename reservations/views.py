from rest_framework import viewsets, permissions
from .models import Reservation
from .serializers import ReservationSerializer

class ReservationViewSet(viewsets.ModelViewSet):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admins see all reservations, users only their own
        if self.request.user.is_staff:
            return Reservation.objects.select_related('room', 'user')
        return Reservation.objects.filter(user=self.request.user).select_related('room')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
