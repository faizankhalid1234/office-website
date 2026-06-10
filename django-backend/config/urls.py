from django.contrib import admin
from django.urls import path, include

admin.site.site_header = "H.H Husain - User Admin"
admin.site.site_title = "HH Expense Admin"
admin.site.index_title = "Manage Users, Emails & Passwords"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
]
