from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator, MaxLengthValidator, MinValueValidator, MaxValueValidator

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

class Store(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField(max_length=400, validators=[MaxLengthValidator(400)])
    email = models.EmailField()
    owner = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'role': User.STORE_OWNER}, related_name='store')

    def __str__(self):
        return self.name

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': User.NORMAL_USER}, related_name='ratings')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='ratings')
    value = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    class Meta:
        unique_together = ('user', 'store')

    def __str__(self):
        return f"{self.user.email} - {self.store.name}: {self.value}"
