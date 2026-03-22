from rest_framework import generics, status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer, SignupSerializer, UpdatePasswordSerializer, StoreSerializer, AdminUserSerializer, UserStoreSerializer, RatingSerializer
from .models import Store, Rating
from django.contrib.auth import get_user_model
from rest_framework.views import APIView

User = get_user_model()

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]

class UpdatePasswordView(generics.UpdateAPIView):
    serializer_class = UpdatePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'Admin'

class AdminStoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['name', 'address', 'email']
    search_fields = ['name', 'address', 'email']
    ordering_fields = ['name', 'email', 'address']

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['name', 'email', 'address', 'role']
    search_fields = ['name', 'email', 'address']
    ordering_fields = ['name', 'email', 'role']

    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id)

class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

class UserStoreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Store.objects.all()
    serializer_class = UserStoreSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['name', 'address']
    search_fields = ['name', 'address']
    ordering_fields = ['name', 'address']

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Rating.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get(self, request):
        stats = {
            "total_users": User.objects.count(),
            "total_stores": Store.objects.count(),
            "total_ratings": Rating.objects.count()
        }
        return Response(stats, status=status.HTTP_200_OK)
