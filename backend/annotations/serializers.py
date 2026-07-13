from rest_framework import serializers

from .models import AnnotatedImage, Polygon


class PolygonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Polygon
        fields = ["id", "image", "points", "label", "color", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_points(self, value):
        if not isinstance(value, list) or len(value) < 3:
            raise serializers.ValidationError("A polygon needs at least 3 points.")
        for point in value:
            if not isinstance(point, dict) or "x" not in point or "y" not in point:
                raise serializers.ValidationError(
                    "Each point must be an object with x and y keys."
                )
        return value


class AnnotatedImageSerializer(serializers.ModelSerializer):
    polygons = PolygonSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = AnnotatedImage
        fields = ["id", "name", "image", "image_url", "uploaded_at", "polygons"]
        read_only_fields = ["id", "uploaded_at", "image_url", "polygons"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        if obj.image:
            return obj.image.url
        return None

    def create(self, validated_data):
        image_file = validated_data.get("image")
        if image_file and not validated_data.get("name"):
            validated_data["name"] = image_file.name
        return super().create(validated_data)
