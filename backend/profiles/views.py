from rest_framework import serializers
from .models import Profile
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from collectibles.models import Collectible
from collectibles.serializers import CollectibleSerializer
from trades.models import Trade, Image, Listing
from trades.serializers import TradeSerializer, ListingSerializer

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'collection', 'wishlist', 'trades', 'rating', 'raters', 'username', 'profile_img']

class ProfileViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        collection = ListingSerializer(profile.collection, many=True)
        wishlist = CollectibleSerializer(profile.wishlist, many=True)
        trades = TradeSerializer(profile.trades, many=True)
        data = {
            "url": serializer.data["bio"],
            "username": serializer.data["username"],
            "profile_img": serializer.data["profile_img"],
            "rating": serializer.data["rating"],
            "raters": serializer.data["raters"],
            "collection": collection.data,
            "wishlist": wishlist.data,
            "trades": trades.data,
        }
        return Response(data, status=status.HTTP_200_OK)
    
    def delete(self, request):
        profile = Profile.objects.get(user=request.user)
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    
class ProfileListing(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile = Profile.objects.get(user=request.user)
        if request.data['verifyImage']: vImg = Image.objects.get(url=request.data['verifyImage'])
        else: vImg = None

        listing = Listing.objects.create(
            collectible=Collectible.objects.get(id=request.data['collectible']),
            available=request.data['available'],
            price=(float(request.data['price'])),
            description=request.data['description'],
            images=request.data['images'],
            verified= vImg.verified if vImg else False,
        )
        profile.collection.add(listing)
        profile.save()
        return Response(status=status.HTTP_201_CREATED)
    
    def delete(self, request):
        profile = Profile.objects.get(user=request.user)
        listing = Listing.objects.get(id=request.data['collectible'])
        profile.collection.remove(listing)
        listing.delete()
        profile.save()
        return Response(status=status.HTTP_204_NO_CONTENT)