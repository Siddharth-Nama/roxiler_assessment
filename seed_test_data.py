import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'roxiler_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from api.models import Store

User = get_user_model()

# Create Admin
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin', 
        email='admin@example.com', 
        password='Password123!', 
        role='Admin', 
        name='System Administrator Name 20 Chars'
    )
    print("Admin created")

# Create Normal User
if not User.objects.filter(username='user1').exists():
    User.objects.create_user(
        username='user1', 
        email='user1@example.com', 
        password='Password123!', 
        role='User', 
        name='Normal User One Name 20 Chars',
        address='User One Address 123'
    )
    print("Normal User created")

# Create Store Owner
if not User.objects.filter(username='owner1').exists():
    owner = User.objects.create_user(
        username='owner1', 
        email='owner1@example.com', 
        password='Password123!', 
        role='StoreOwner', 
        name='Store Owner One Name 20 Chars',
        address='Owner One Address 123'
    )
    print("Store Owner created")
    
    # Create a store for this owner
    Store.objects.create(
        name='Gourmet Garden',
        email='contact@gourmetgarden.com',
        address='123 Culinary St, Food City',
        owner=owner
    )
    print("Store created")
