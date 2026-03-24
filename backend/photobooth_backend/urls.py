from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import RegisterView, UserProfileView, MyTokenObtainPairView
from photos.views import PhotoViewSet, PropViewSet

router = routers.DefaultRouter()
router.register(r'photos', PhotoViewSet, basename='photo')
router.register(r'props', PropViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/profile/', UserProfileView.as_view(), name='user_profile'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
