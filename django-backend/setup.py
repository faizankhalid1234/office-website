"""
Django setup: migrate DB + create/update admin with YOUR email & password.

Run from django-backend folder:
  python setup.py

Or with arguments:
  python setup.py --email you@mail.com --name "Your Name" --password yourpass
"""
import argparse
import getpass
import os
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django

django.setup()

from django.core.management import call_command
from accounts.models import User


def prompt_admin_credentials(args: argparse.Namespace) -> tuple[str, str, str]:
    email = (args.email or "").strip().lower()
    if not email:
        email = input("Admin email (login): ").strip().lower()
    if not email or "@" not in email:
        print("Valid email required.")
        sys.exit(1)

    name = (args.name or "").strip()
    if not name:
        name = input("Admin name: ").strip() or "Admin"

    password = args.password or ""
    if not password:
        password = getpass.getpass("Admin password (min 6 chars): ")
    if len(password) < 6:
        print("Password must be at least 6 characters.")
        sys.exit(1)

    return email, name, password


def upsert_superuser(email: str, name: str, password: str) -> None:
    existing = User.objects.filter(email=email).first()
    if existing:
        existing.name = name
        existing.set_password(password)
        existing.is_staff = True
        existing.is_superuser = True
        existing.role = User.Role.ADMIN
        existing.save()
        print(f"Updated admin: {email}")
        return

    User.objects.create_superuser(email=email, name=name, password=password)
    print(f"Created admin: {email}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Migrate DB and create Django admin")
    parser.add_argument("--email", help="Admin email for login")
    parser.add_argument("--name", help="Admin display name")
    parser.add_argument("--password", help="Admin password (prefer interactive)")
    parser.add_argument(
        "--skip-demo",
        action="store_true",
        help="Do not create demo employee account",
    )
    args = parser.parse_args()

    print("Running migrations...")
    call_command("migrate")

    email, name, password = prompt_admin_credentials(args)
    upsert_superuser(email, name, password)

    if not args.skip_demo:
        demo_email = "employee@hhhusain.com"
        if not User.objects.filter(email=demo_email).exists():
            User.objects.create_user(
                email=demo_email,
                name="Employee",
                password="employee123",
                role=User.Role.EMPLOYEE,
            )
            print(f"Demo employee: {demo_email} / employee123")

    print()
    print("Django setup complete!")
    print("Admin panel: http://localhost:8000/admin")
    print(f"Login email: {email}")
    print("Start server: python manage.py runserver 8000")


if __name__ == "__main__":
    main()
