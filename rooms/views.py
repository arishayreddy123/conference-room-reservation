from rest_framework import viewsets, permissions
from .models import Room
from .serializers import RoomSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission: Only admin users can add/edit/delete.
    Everyone else can only view (GET).
    """

    def has_permission(self, request, view):
        # SAFE_METHODS: GET, HEAD, OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True
        # Check if user is authenticated and is an admin
        return request.user and request.user.is_authenticated and request.user.is_admin

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAdminOrReadOnly]
