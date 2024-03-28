from rest_framework import serializers
from trades.models import Trade, Image, Listing
from profiles.serializers import ProfileSerializer
from collectibles.serializers import CollectibleSerializer

class ListingSerializer(serializers.ModelSerializer):
    collectible = CollectibleSerializer(read_only=True)
    class Meta:
        model = Listing
        fields = ['collectible', 'available', 'price', 'description', 'images', 'verified']

class TradeSerializer(serializers.ModelSerializer):
    profileOne = ProfileSerializer(read_only=True)
    profileTwo = ProfileSerializer(read_only=True)
    givingOne = ListingSerializer(many=True)
    givingTwo = ListingSerializer(many=True)

    class Meta:
        model = Trade
        fields = ['profileOne', 'profileTwo', 'givingOne', 'givingTwo', 'status', 'profileOneAccepted', 'profileTwoAccepted', 'id']


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['url', 'verified']