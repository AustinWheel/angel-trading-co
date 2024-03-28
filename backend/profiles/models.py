from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(default="")
    collection = models.ManyToManyField('trades.Listing', related_name="collection", blank=True, default=None)
    wishlist = models.ManyToManyField('collectibles.Collectible', related_name="wishlist", blank=True, default=None)
    trades = models.ManyToManyField('trades.Trade', related_name="trades", blank=True, default=None)
    rating = models.IntegerField(default=0)
    raters = models.IntegerField(default=0)
    username = models.CharField(max_length=100, default="")
    profile_img = models.CharField(max_length=255, default="", blank=True)
    
    def __str__(self):
        return self.user.username

    