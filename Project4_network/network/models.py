from datetime import datetime
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.utils import timezone


now = timezone.now()

class CustomUserManager(BaseUserManager):

    def create_user(self, display_name, username, email, date_of_birth=None, about=None, password=None, **other_fields):
        """
        Create and save a User
        """
        if not username:
            raise ValueError(_("Users must have a username."))
        if not email:
            raise ValueError(_("Users must provide an email."))
        if not display_name:
            raise ValueError(_("Users must provide a display name."))
        email = self.normalize_email(email)
        user = self.model(display_name=display_name, username=username, email=email, date_of_birth=date_of_birth, about=about, **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, display_name, username, email, date_of_birth=None, about=None, password=None, **other_fields):
        """
        Create and save a super user
        """
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError(
                'Superuser must be assigned to is_staff=True.'
            )
        if other_fields.get('is_superuser') is not True:
            raise ValueError(
                'Superuser must be assigned to is_superuser=True.'
            )
        
        user = self.create_user(display_name, username, email, date_of_birth, about, password, **other_fields)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    display_name = models.CharField(max_length = 150, default=None)
    username = models.CharField(max_length = 50, unique=True)
    email = models.EmailField(
        verbose_name = 'email address',
        max_length = 255,
        unique = True
    )
    date_of_birth = models.DateField(blank=True, null=True)
    about = models.TextField(_(
        'about'), max_length=280, blank=True, null=True
    )
    start_date = models.DateTimeField(default=timezone.now)
    followings = models.ManyToManyField("self", blank=True, symmetrical=False, related_name="followers")
    profile_img = models.ImageField(
        upload_to='profile_img',
        default="profile_img/default1.jpg",
        null=True,
        blank=True
    )
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'display_name']

    def __str__(self):
        return self.username

    def serialize(self):
        return {
            "username": self.username,
            "followings": [user.username for user in self.followings.all()],
            "followings_num": self.followings.count(),
            "followers": [user.username for user in self.followers.all()],
            "follwers_num": self.followers.count()
        }

class Post(models.Model):
    text = models.TextField(max_length = 280)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="posted")
    liked_by = models.ManyToManyField(CustomUser, blank=True, related_name="liked_posts") 
    timestamp = models.DateTimeField(auto_now_add=True)
    last_editted = models.DateTimeField(auto_now=True)

    def serialize(self):
        return {
            "likes": self.liked_by.count(),
            "liked_by": [user.username for user in self.liked_by.all()],
            "text": self.text
        }

class ImageInPost(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to = 'post_images/')

class Comment(models.Model):
    text = models.TextField(max_length=280, blank=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="commented")
    liked_by = models.ManyToManyField(CustomUser, blank=True, related_name="liked_comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    timestamp = models.DateTimeField(auto_now_add=True)
    last_editted = models.DateTimeField(auto_now=True)

    def serialize(self):
        return {
            "likes": self.liked_by.count(),
            "liked_by": [user.username for user in self.liked_by.all()],
            "text": self.text
        }

class ImageInComment(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="image")
    image = models.ImageField(upload_to = 'comment_images/')
