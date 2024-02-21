from django.db import models
from profiles.models import Profile

class Trade(models.Model):
    trading = models.ForeignKey('collectibles.Collectible', on_delete=models.CASCADE, related_name="trading")
    requesting1 = models.ForeignKey('collectibles.Collectible', on_delete=models.CASCADE, related_name="requesting1")
    requesting2 = models.ForeignKey('collectibles.Collectible', on_delete=models.CASCADE, related_name="requesting2")
    requesting3 = models.ForeignKey('collectibles.Collectible', on_delete=models.CASCADE, related_name="requesting3")
    price = models.DecimalField(decimal_places=2, default=0.00, max_digits=10)
    description = models.TextField(default="")
    image = models.TextField(default="")

    
    def __str__(self):
        return self.user.username