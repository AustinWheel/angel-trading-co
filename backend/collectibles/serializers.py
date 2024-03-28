from rest_framework import serializers
from .models import Collectible

class CollectibleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collectible
        fields = ['product', 'series', 'name', 'image', 'id']