from django.db import models

class Listing(models.Model):
    collectible = models.ForeignKey('collectibles.Collectible', on_delete=models.CASCADE, related_name="trading")
    available = models.BooleanField(default=False, blank=True)
    price = models.DecimalField(decimal_places=2, default=0.00, max_digits=10, blank=True, null=True)
    description = models.TextField(default="", blank=True, null=True)
    images = models.TextField(default="", blank=True, null=True)
    verified = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return self.trading.name
    
class Trade(models.Model):
    profileOne = models.ForeignKey('profiles.Profile', on_delete=models.CASCADE, related_name="profileOne", blank=True, null=True)
    profileTwo = models.ForeignKey('profiles.Profile', on_delete=models.CASCADE, related_name="profileTwo", blank=True, null=True)
    givingOne = models.ManyToManyField('trades.Listing', related_name="givingOne", blank=True)
    givingTwo = models.ManyToManyField('trades.Listing', related_name="givingTwo", blank=True)
    status = models.IntegerField(default=0, blank=True)
    profileOneAccepted = models.BooleanField(default=False, blank=True)
    profileTwoAccepted = models.BooleanField(default=False, blank=True)

class Image(models.Model):
    url = models.CharField(max_length=255, default="", blank=True)
    verified = models.BooleanField(default=False, blank=True)
