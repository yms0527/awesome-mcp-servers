import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .src.components.info_retrival import Pokemon
from .src.components.comparison_module import PokemonComparer
from .src.components.strategy import recommend_counters
from .src.components.team_composition import generate_team_with_gemini

logger = logging.getLogger(__name__)

class PokemonInfoView(APIView):
    def post(self, request):
        name = request.data.get("name", "").lower()
        if not name:
            return Response({"error": "Missing 'name'"}, status=status.HTTP_400_BAD_REQUEST)
        info = Pokemon(name)
        try:
            info.fetch_basic_info()
            info.fetch_flavor_text()
            return Response({"result": info.get_summary()}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception("Error in PokemonInfoView")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ComparePokemonView(APIView):
    def post(self, request):
        name1 = request.data.get("pokemon1")
        name2 = request.data.get("pokemon2")
        if not name1 or not name2:
            return Response(
                {"error": "Both 'pokemon1' and 'pokemon2' are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            comparer = PokemonComparer(name1, name2)
            return Response({"result": comparer.compare()}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception("Error in ComparePokemonView")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StrategyAPIView(APIView):
    def post(self, request):
        name = request.data.get("name")
        if not name:
            return Response({"error": "Missing 'name'"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            return Response({"result": recommend_counters(name)}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception("Error in StrategyAPIView")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TeamCompositionAPIView(APIView):
    def post(self, request):
        description = request.data.get("description")
        if not description:
            return Response({"error": "Missing 'description' in request body."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            team_data = generate_team_with_gemini(description)
            return Response({"result": team_data}, status=status.HTTP_200_OK)
        except ValueError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
