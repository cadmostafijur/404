"""
Management command to create a demo user for the 404 project.
Usage: python manage.py create_demo_user
"""

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Creates a demo user for testing"

    def handle(self, *args, **options):
        email = "demo@404project.com"
        password = "demo1234"

        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": email},
        )
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f"Demo user created: {email}"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Demo user updated: {email}"))

        self.stdout.write(f"Password: {password}")
