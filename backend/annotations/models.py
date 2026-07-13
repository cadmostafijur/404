from django.conf import settings
from django.db import models


class AnnotatedImage(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="annotated_images",
    )
    image = models.ImageField(upload_to="uploads/%Y/%m/%d/")
    name = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.name or f"Image {self.pk}"


class Polygon(models.Model):
    image = models.ForeignKey(
        AnnotatedImage,
        on_delete=models.CASCADE,
        related_name="polygons",
    )
    points = models.JSONField(help_text="List of {x, y} coordinates")
    label = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=20, default="#6366f1")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Polygon {self.pk} on {self.image_id}"
