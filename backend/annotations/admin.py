from django.contrib import admin

from .models import AnnotatedImage, Polygon

admin.site.register(AnnotatedImage)
admin.site.register(Polygon)
