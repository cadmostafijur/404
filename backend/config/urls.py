from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/tasks/", include("tasks.urls")),
    path("api/annotations/", include("annotations.urls")),
]

# django.conf.urls.static.static() no-ops when DEBUG=False, which is always
# true in production - call the underlying view directly so uploaded media
# is served regardless of DEBUG.
urlpatterns += [
    re_path(
        r"^%s(?P<path>.*)$" % settings.MEDIA_URL.lstrip("/"),
        serve,
        {"document_root": settings.MEDIA_ROOT},
    ),
]
