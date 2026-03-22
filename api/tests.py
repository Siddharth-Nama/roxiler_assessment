from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthenticationTests(APITestCase):
    def setUp(self):
        self.signup_url = reverse('signup')
        self.login_url = reverse('token_obtain_pair')
        self.user_data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "Password123!",
            "name": "Test User Name With Min Length 20 Characters Long",
            "address": "Test Address"
        }

    def test_signup(self):
        response = self.client.post(self.signup_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'testuser@example.com')

    def test_login(self):
        self.client.post(self.signup_url, self.user_data)
        login_data = {"email": "testuser@example.com", "password": "Password123!"}
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_invalid_signup(self):
        invalid_data = self.user_data.copy()
        invalid_data['password'] = "short"
        response = self.client.post(self.signup_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

from .models import Store, Rating

class RoleAndRatingTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(username='admin', email='admin@example.com', password='Password123!', role='Admin', name='Admin User Name Min 20 Chars')
        self.user = User.objects.create_user(username='user', email='user@example.com', password='Password123!', role='User', name='Normal User Name Min 20 Chars')
        self.owner = User.objects.create_user(username='owner', email='owner@example.com', password='Password123!', role='StoreOwner', name='Store Owner Name Min 20 Chars')
        self.store = Store.objects.create(name='Test Store', address='Test Address', email='store@example.com', owner=self.owner)
        
        self.client.force_authenticate(user=self.user)
        self.rating_url = reverse('ratings-list')

    def test_submit_rating(self):
        data = {"store": self.store.id, "value": 5}
        response = self.client.post(self.rating_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Rating.objects.count(), 1)
        self.assertEqual(Rating.objects.get().value, 5)

    def test_modify_rating(self):
        rating = Rating.objects.create(user=self.user, store=self.store, value=3)
        data = {"store": self.store.id, "value": 4}
        response = self.client.post(self.rating_url, data) # update_or_create logic in serializer
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Rating.objects.get().value, 4)

    def test_admin_access(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('admin_stores-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cannot_access_admin(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('admin_stores-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
