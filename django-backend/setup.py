"""
Django setup: migrate DB + create/update admin with YOUR email & password.

Login uses EMAIL (not separate username).

Run from django-backend folder:
  python setup.py

With your own credentials (no prompts):
  python setup.py --email you@mail.com --name "Your Name" --password yourpass --skip-demo
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


def read_password(prompt: str) -> str:
    while True:
        password = getpass.getpass(prompt)
        if len(password) < 6:
            print("Password must be at least 6 characters.")
            continue
        return password


def prompt_admin_credentials(args: argparse.Namespace) -> tuple[str, str, str]:
    print()
    print("--- Admin account (you choose email & password) ---")
    print("Note: Login username = your EMAIL address")
    print()

    email = (args.email or args.username or "").strip().lower()
    if not email:
        email = input("Admin email (login): ").strip().lower()
    if not email or "@" not in email:
        print("Valid email required (this is your admin login).")
        sys.exit(1)

    name = (args.name or "").strip()
    if not name:
        name = input("Admin name (display): ").strip() or "Admin"

    password = args.password or ""
    if not password:
        password = read_password("Admin password (min 6 chars): ")
        confirm = getpass.getpass("Confirm password: ")
        if password != confirm:
            print("Passwords do not match.")
            sys.exit(1)
    elif len(password) < 6:
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
        existing.is_active = True
        existing.role = User.Role.ADMIN
        existing.save()
        print(f"Updated admin: {email}")
        return

    User.objects.create_superuser(email=email, name=name, password=password)
    print(f"Created admin: {email}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Migrate DB and create Django admin with your email & password"
    )
    parser.add_argument("--email", help="Admin email (login username)")
    parser.add_argument(
        "--username",
        help="Same as --email (login uses email, not a separate username)",
    )
    parser.add_argument("--name", help="Admin display name")
    parser.add_argument("--password", help="Admin password")
    parser.add_argument(
        "--skip-demo",
        action="store_true",
        help="Do not create demo employee account",
    )
    parser.add_argument(
        "--skip-migrate",
        action="store_true",
        help="Skip database migrations",
    )
    args = parser.parse_args()

    if not args.skip_migrate:
        print("Running migrations...")
        call_command("migrate", verbosity=1)

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
    print("=" * 50)
    print("  Django setup complete!")
    print("=" * 50)
    print("  Admin URL:  http://localhost:8000/admin")
    print(f"  Login email: {email}")
    print("  Password:    (the one you just set)")
    print()
    print("  Start server: python manage.py runserver 8000")
    print("  Or double-click: start-admin.bat")
    print("=" * 50)


if __name__ == "__main__":
    main()
