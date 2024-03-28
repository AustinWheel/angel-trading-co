from trades.models import Listing
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from profiles.models import Profile
from collectibles.models import Collectible
from collections import defaultdict

class WishListRecommendations(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        collectibles = Collectible.objects.filter(id__in=profile.wishlist.all())
        collectibles = list(collectibles)

        results = defaultdict(list)
        for collectible in collectibles:
            listings = Listing.objects.filter(collectible=collectible).exclude(id__in=profile.collection.all())
            results[collectible.id].append(f"{len(listings)}, {collectible.image}")
        return Response(results, status=status.HTTP_200_OK)
    
class MFCRecommendations(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        collectibles = Collectible.objects.exclude(id__in=profile.collection.all())
        collectibles = list(collectibles)

        results = defaultdict(list)
        for collectible in collectibles:
            listings = Listing.objects.filter(collectible=collectible).exclude(id__in=profile.collection.all())
            if listings: results[collectible.id].append(f"{len(listings)}, {collectible.image}")

        return Response(results, status=status.HTTP_200_OK)