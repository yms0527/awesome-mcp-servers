from django.urls import path
from .views import PokemonInfoView,ComparePokemonView,StrategyAPIView,TeamCompositionAPIView

urlpatterns = [
    path('agent/pokemon-info/', PokemonInfoView.as_view(), name='agent-pokemon-info'),
    path('agent/compare/', ComparePokemonView.as_view(), name='agent-compare-pokemon'),
    path('agent/strategy/', StrategyAPIView.as_view(), name='agent-strategy'),
    path('agent/team/', TeamCompositionAPIView.as_view(), name='agent-team'),
]
