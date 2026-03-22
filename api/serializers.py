from rest_framework import serializers
import re
from django.contrib.auth import get_user_model
from .models import Store, Rating

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['name'] = user.name
        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'address', 'role']

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, max_length=16)

    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'address', 'password']

    def validate_password(self, value):
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must include at least one uppercase letter.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must include at least one special character.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            address=validated_data['address'],
            role=User.NORMAL_USER
        )
        return user

class StoreSerializer(serializers.ModelSerializer):
    overall_rating = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = ['id', 'name', 'address', 'email', 'owner', 'overall_rating']

    def get_overall_rating(self, obj):
        ratings = obj.ratings.all()
        if ratings.exists():
            return sum(r.value for r in ratings) / ratings.count()
        return 0

class UpdatePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8, max_length=16)

    def validate_new_password(self, value):
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must include at least one uppercase letter.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must include at least one special character.")
        return value
