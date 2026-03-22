from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MyTokenObtainPairView, SignupView, UpdatePasswordView,
    AdminStoreViewSet, AdminUserViewSet, UserStoreViewSet, RatingViewSet,
    AdminDashboardStatsView, StoreOwnerDashboardView
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'admin/stores', AdminStoreViewSet, basename='admin_stores')
router.register(r'admin/users', AdminUserViewSet, basename='admin_users')
router.register(r'stores', UserStoreViewSet, basename='user_stores')
router.register(r'ratings', RatingViewSet, basename='ratings')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/dashboard-stats/', AdminDashboardStatsView.as_view(), name='admin_dashboard_stats'),
    path('store-owner/dashboard/', StoreOwnerDashboardView.as_view(), name='store_owner_dashboard'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('update-password/', UpdatePasswordView.as_view(), name='update_password'),
]
