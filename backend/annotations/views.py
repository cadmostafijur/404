from rest_framework import generics

from .models import AnnotatedImage, Polygon
from .serializers import AnnotatedImageSerializer, PolygonSerializer


class ImageListCreateView(generics.ListCreateAPIView):
    serializer_class = AnnotatedImageSerializer

    def get_queryset(self):
        return AnnotatedImage.objects.filter(user=self.request.user).prefetch_related(
            "polygons"
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class ImageDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = AnnotatedImageSerializer

    def get_queryset(self):
        return AnnotatedImage.objects.filter(user=self.request.user).prefetch_related(
            "polygons"
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class PolygonListCreateView(generics.ListCreateAPIView):
    serializer_class = PolygonSerializer

    def get_queryset(self):
        return Polygon.objects.filter(image__user=self.request.user)

    def perform_create(self, serializer):
        image = serializer.validated_data["image"]
        if image.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("You do not own this image.")
        serializer.save()


class PolygonDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = PolygonSerializer

    def get_queryset(self):
        return Polygon.objects.filter(image__user=self.request.user)
