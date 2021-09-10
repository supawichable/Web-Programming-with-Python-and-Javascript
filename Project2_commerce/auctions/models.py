from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Listing(models.Model):
    CATEGORIES = [
       ('FAS', 'Fashion'),
       ('TOY', 'Toy & Hobbies'),
       ('ELE', 'Electronics'),
       ('HOM', 'Home & Garden'),
       ('MUS', 'Music'),
       ('MOV', 'Movies'),
       ('BOO', 'Books'),
       ('COL', 'Collectibles & Art'),
       ('SPO', 'Sporting Goods'),
       ('BUS', 'Business & Industrial'),
       ('HEA', 'Health & Beauty'),
       ('AUT', 'Auto & Motors'),
       ('OTH', 'Others'),
    ]
    title = models.CharField(max_length=150)
    description = models.CharField(max_length=2000)
    url = models.URLField(blank=True)
    start_price = models.IntegerField()
    max_bid_price = models.IntegerField(default=0)
    max_bidder = models.ForeignKey(User, blank=True, on_delete=models.CASCADE, related_name="max_bidded", null=True)
    winner = models.ForeignKey(User, blank=True, on_delete=models.CASCADE, related_name="won", null=True)
    category = models.CharField(max_length=3, choices = CATEGORIES)
    status = models.BooleanField(default=True) #False: inactive, True: active
    lister = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listed")
    watched_by = models.ManyToManyField(User, blank=True, related_name="watching", null=True)


class Bid(models.Model):
    bid_price = models.IntegerField()
    bid_item = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="bidding", default=None)
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bidded")

class Comment(models.Model):
    comment_text = models.CharField(max_length=2000)
    comment_item = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="commenting", default=None)
    commentator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="commented")

