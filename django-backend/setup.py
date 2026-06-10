"""One-time setup: migrate DB and create default admin user."""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.core.management import call_command
from accounts.models import User


def main():
    print("Running migrations...")
    call_command("migrate", verbosity=0)

    admin_email = "admin@hhhusain.com"
    if not User.objects.filter(email=admin_email).exists():
        User.objects.create_superuser(
            email=admin_email,
            name="Admin",
            password="admin123",
        )
        print(f"Admin created: {admin_email} / admin123")
    else:
        print(f"Admin already exists: {admin_email}")

    employee_email = "employee@hhhusain.com"
    if not User.objects.filter(email=employee_email).exists():
        User.objects.create_user(
            email=employee_email,
            name="Employee",
            password="employee123",
            role=User.Role.EMPLOYEE,
        )
        print(f"Employee created: {employee_email} / employee123")
    else:
        print(f"Employee already exists: {employee_email}")

    print("Django setup complete!")
    print("Admin panel: http://localhost:8000/admin")


if __name__ == "__main__":
    main()
