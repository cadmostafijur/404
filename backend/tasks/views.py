from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Task
from .serializers import TaskReorderSerializer, TaskSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user)
        task_date = self.request.query_params.get("task_date")
        if task_date:
            queryset = queryset.filter(task_date=task_date)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)


class TaskReorderView(APIView):
    def post(self, request):
        serializer = TaskReorderSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        task_ids = [item["id"] for item in serializer.validated_data]
        tasks = {
            task.id: task
            for task in Task.objects.filter(user=request.user, id__in=task_ids)
        }

        if len(tasks) != len(task_ids):
            return Response(
                {"detail": "One or more tasks not found."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        for item in serializer.validated_data:
            task = tasks[item["id"]]
            task.status = item["status"]
            task.order = item["order"]
            task.save(update_fields=["status", "order", "updated_at"])

        updated = Task.objects.filter(user=request.user, id__in=task_ids)
        return Response(TaskSerializer(updated, many=True).data)
