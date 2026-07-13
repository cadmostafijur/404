from django.urls import path

from .views import TaskDetailView, TaskListCreateView, TaskReorderView

urlpatterns = [
    path("", TaskListCreateView.as_view(), name="task-list"),
    path("reorder/", TaskReorderView.as_view(), name="task-reorder"),
    path("<int:pk>/", TaskDetailView.as_view(), name="task-detail"),
]
