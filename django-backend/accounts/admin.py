from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("email", "name", "role")


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("email", "name", "role", "is_active", "password")


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    list_display = ("email", "name", "role", "is_active", "date_joined", "last_login")
    list_filter = ("role", "is_active", "date_joined")
    search_fields = ("email", "name")
    ordering = ("-date_joined",)
    readonly_fields = ("date_joined", "last_login")
    list_per_page = 25

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("name", "role")}),
        ("Account Status", {"fields": ("is_active", "date_joined", "last_login")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "name", "role", "password1", "password2"),
            },
        ),
    )

    actions = ["make_admin", "make_employee", "activate_users", "deactivate_users"]

    @admin.action(description="Set selected users as Admin")
    def make_admin(self, request, queryset):
        queryset.update(role=User.Role.ADMIN)

    @admin.action(description="Set selected users as Employee")
    def make_employee(self, request, queryset):
        queryset.update(role=User.Role.EMPLOYEE)

    @admin.action(description="Activate selected users")
    def activate_users(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description="Deactivate selected users")
    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
