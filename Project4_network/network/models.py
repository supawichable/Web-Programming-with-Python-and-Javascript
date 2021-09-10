from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import datetime
from django.utils import timezone

now = timezone.now()


class User(AbstractUser):
    display_name = models.CharField(max_length = 150, default=None)
    followings = models.ManyToManyField("self", blank=True, symmetrical=False, related_name="followers")

    def serialize(self):
        return {
            "username": self.username
        }

# class Following(models.Model):
#     target = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
#     follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="targets")

class Post(models.Model):
    text = models.TextField(max_length = 280)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posted")
    liked_by = models.ManyToManyField(User, blank=True, related_name="liked_posts") 
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
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="commented")
    liked_by = models.ManyToManyField(User, blank=True, related_name="liked_comments")
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
