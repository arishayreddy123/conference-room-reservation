from accounts.views import RegisterView
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rooms.views import RoomViewSet
from reservations.views import ReservationViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'reservations', ReservationViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),

    # JWT Auth
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Register endpoint
    path('api/register/', RegisterView.as_view(), name='register'),
]
