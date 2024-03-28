from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Collectible
from rest_framework.response import Response
from django.db.models import Q
from trades.models import Listing
from trades.serializers import ListingSerializer
from .serializers import CollectibleSerializer

class CollectibleViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        collectibles = Collectible.objects.all()
        serializer = CollectibleSerializer(collectibles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SearchCollectibles(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_query = request.query_params.get('search')

        direct_collectibles = Collectible.objects.filter(
            Q(name__icontains=search_query) | 
            Q(series__icontains=search_query)
        )
        direct_trades = Listing.objects.filter(collectible__in=direct_collectibles)

        series_list = [collectible.series for collectible in direct_collectibles]
        related_trades = Listing.objects.filter(collectible__series__in=series_list)

        direct_trades_serializer = ListingSerializer(direct_trades, many=True)
        related_trades_serializer = ListingSerializer(related_trades, many=True)
        related_trades_serializer = [ trade for trade in related_trades_serializer.data if trade not in direct_trades_serializer.data ]
        trades = direct_trades_serializer.data + related_trades_serializer

        return Response({
            'results': len(trades),
            'listings': trades,
            'series': series_list,
        }, status=status.HTTP_200_OK)



