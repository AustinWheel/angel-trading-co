from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'collection', 'wishlist', 'trades', 'rating', 'raters', 'username', 'profile_img']