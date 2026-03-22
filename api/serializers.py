from rest_framework import serializers
import re
from django.contrib.auth import get_user_model
from .models import Store, Rating
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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

class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, max_length=16, required=False)
    store_rating = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'address', 'password', 'role', 'store_rating']

    def get_store_rating(self, obj):
        if obj.role == User.STORE_OWNER and hasattr(obj, 'store'):
            ratings = obj.store.ratings.all()
            if ratings.exists():
                return sum(r.value for r in ratings) / ratings.count()
        return None

    def validate_password(self, value):
        if value:
            if not re.search(r'[A-Z]', value):
                raise serializers.ValidationError("Password must include at least one uppercase letter.")
            if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
                raise serializers.ValidationError("Password must include at least one special character.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

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

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'store', 'value']

    def validate_value(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        if user.role != User.NORMAL_USER:
            raise serializers.ValidationError("Only normal users can submit ratings.")
        
        rating, created = Rating.objects.update_or_create(
            user=user,
            store=validated_data['store'],
            defaults={'value': validated_data['value']}
        )
        return rating

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

class UserStoreSerializer(serializers.ModelSerializer):
    overall_rating = serializers.SerializerMethodField()
    user_rating = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = ['id', 'name', 'address', 'overall_rating', 'user_rating']

    def get_overall_rating(self, obj):
        ratings = obj.ratings.all()
        if ratings.exists():
            return sum(r.value for r in ratings) / ratings.count()
        return 0

    def get_user_rating(self, obj):
        user = self.context.get('request').user
        if not user or user.is_anonymous:
            return None
        rating = obj.ratings.filter(user=user).first()
        if rating:
            return rating.value
        return None

class UpdatePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8, max_length=16)

    def validate_new_password(self, value):
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must include at least one uppercase letter.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must include at least one special character.")
        return value
