from rest_framework import viewsets, permissions
from .models import Reservation
from .serializers import ReservationSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Allow users to modify only their reservations.
    Admins can access and modify any reservation.
    """

    def has_object_permission(self, request, view, obj):
        # Admins can do anything
        if request.user.is_admin:
            return True
        # Users can only touch their own reservations
        return obj.user == request.user

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Reservation.objects.all()
        return Reservation.objects.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.user

        # Admins can make reservations for others
        if user.is_admin and 'user' in self.request.data:
            serializer.save(user_id=self.request.data['user'])
        else:
            serializer.save(user=user)
