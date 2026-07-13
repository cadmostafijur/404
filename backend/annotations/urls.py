from django.urls import path

from .views import ImageDetailView, ImageListCreateView, PolygonDetailView, PolygonListCreateView

urlpatterns = [
    path("images/", ImageListCreateView.as_view(), name="image-list"),
    path("images/<int:pk>/", ImageDetailView.as_view(), name="image-detail"),
    path("polygons/", PolygonListCreateView.as_view(), name="polygon-list"),
    path("polygons/<int:pk>/", PolygonDetailView.as_view(), name="polygon-detail"),
]
