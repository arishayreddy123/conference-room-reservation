from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from rooms.views import RoomViewSet
from reservations.views import ReservationViewSet
from accounts.views import RegisterView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.http import JsonResponse

router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'reservations', ReservationViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # JWT Auth
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Register
    path('api/register/', RegisterView.as_view(), name='register'),

    # Browsable login
    path('api-auth/', include('rest_framework.urls')),

    # Root route
    path('', lambda request: JsonResponse({"message": "Welcome to Te Whare Rūnanga API"})),
]
