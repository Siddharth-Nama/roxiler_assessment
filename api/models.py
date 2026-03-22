from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator, MaxLengthValidator

class User(AbstractUser):
    SYSTEM_ADMIN = 'Admin'
    NORMAL_USER = 'User'
    STORE_OWNER = 'StoreOwner'
    
    ROLE_CHOICES = [
        (SYSTEM_ADMIN, 'System Administrator'),
        (NORMAL_USER, 'Normal User'),
        (STORE_OWNER, 'Store Owner'),
    ]
    
    name = models.CharField(
        max_length=60,
        validators=[MinLengthValidator(20), MaxLengthValidator(60)]
    )
    address = models.TextField(
        max_length=400,
        validators=[MaxLengthValidator(400)]
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=NORMAL_USER)
    
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']

    def __str__(self):
        return self.email
