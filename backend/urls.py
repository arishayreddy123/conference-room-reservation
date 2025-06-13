from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from reservations.views import ReservationViewSet
from rooms.views import RoomViewSet
from accounts.views import RegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'rooms', RoomViewSet, basename='room')             # ✅ For viewing rooms
router.register(r'reservations', ReservationViewSet, basename='reservation')  # ✅ For booking & managing

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),                              # ✅ All API routes
    path('api/register/', RegisterView.as_view(), name='register'),  # ✅ User registration
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # ✅ Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # ✅ Refresh token
    path('api-auth/', include('rest_framework.urls')),               # (Optional) Browsable API login
]
