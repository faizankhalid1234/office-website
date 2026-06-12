from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

admin.site.site_header = "H.H Husain - User Admin"
admin.site.site_title = "HH Expense Admin"
admin.site.index_title = "Manage Users, Emails & Passwords"

urlpatterns = [
    path("", RedirectView.as_view(url="/admin/", permanent=False)),
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
]
