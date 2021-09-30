from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import *

class CustomUserTest(TestCase):
    def test_custom_superuser(self):
        db = get_user_model()
        super_user = db.objects.create_superuser(
            'Super User', 'super', 'superuser@user.com', password="password"
        )
        self.assertEqual(super_user.email, 'superuser@user.com')
        self.assertEqual(super_user.username, 'super')
        self.assertEqual(super_user.display_name, 'Super User')
        self.assertTrue(super_user.is_staff)
        self.assertTrue(super_user.is_superuser)
        self.assertTrue(super_user.is_active)
        self.assertEqual(str(super_user), "super")

        with self.assertRaises(ValueError):
            db.objects.create_superuser(
                display_name="Super User", username="super", email="superuser@user.com", password="password", is_superuser=False
            )

        with self.assertRaises(ValueError):
            db.objects.create_superuser(
                display_name="Super User", username="super", email="superuser@user.com", password="password", is_staff=False
            )

        with self.assertRaises(ValueError):
            db.objects.create_superuser(
                display_name="Super User", username="super", email="", password="password"
            )

    def test_new_user(self):
        db = get_user_model()
        user = db.objects.create_user(
            'User', 'user', 'user@user.com', password="password"
        )
        self.assertEqual(user.display_name, "User")
        self.assertEqual(user.username, "user")
        self.assertEqual(user.email, "user@user.com")
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)
        self.assertEqual(user.serialize(), {"username":"user", "followings":[], "followings_num":0, "followers":[], "followers_num":0})

        with self.assertRaises(ValueError):
            db.objects.create_user(
                display_name="", username="user", email="user@user.com", password="password"
            )

        with self.assertRaises(ValueError):
            db.objects.create_user(
                display_name="User", username="", email="user@user.com", password="password"
            )
        
        with self.assertRaises(ValueError):
            db.objects.create_user(
                display_name="User", username="user", email="", password="password"
            )

class ModelsTestCase(TestCase):

    def setUp(self):
        # Create users
        db = get_user_model()
        user1 = db.objects.create_user(
            'User1', 'user1', 'user1@user.com', password="password"
        )
        user2 = db.objects.create_user(
            'User2', 'user2', 'user2@user.com', password="password"
        )

        # Create posts
        post1 = Post.objects.create(text="posttext1", owner=user1)
        post2 = Post.objects.create(text="posttext2", owner=user2)
        post2.liked_by.add(user1)

        # Create comments
        comment1 = Comment.objects.create(text="commenttext1", owner=user2, post=post1)
        comment2 = Comment.objects.create(text="commenttext2", owner=user1, post=post2)
        comment2.liked_by.add(user2)

    def test_post_serialize(self):
        user1 = CustomUser.objects.get(username="user1")
        user2 = CustomUser.objects.get(username="user2")
        post1 = Post.objects.get(text="posttext1", owner=user1)
        post2 = Post.objects.get(text="posttext2", owner=user2)
        self.assertEqual(post1.serialize(), {"likes":0, "liked_by":[], "text":"posttext1"})
        self.assertEqual(post2.serialize(), {"likes":1, "liked_by":[user1.username], "text":"posttext2"})
    
    def test_comment_serialize(self):
        user1 = CustomUser.objects.get(username="user1")
        user2 = CustomUser.objects.get(username="user2")
        post1 = Post.objects.get(text="posttext1", owner=user1)
        post2 = Post.objects.get(text="posttext2", owner=user2)
        comment1 = Comment.objects.get(text="commenttext1", owner=user2, post=post1)
        comment2 = Comment.objects.get(text="commenttext2", owner=user1, post=post2)
        self.assertEqual(comment1.serialize(), {"likes":0, "liked_by":[], "text":"commenttext1"})
        self.assertEqual(comment2.serialize(), {"likes":1, "liked_by":[user2.username], "text":"commenttext2"})
