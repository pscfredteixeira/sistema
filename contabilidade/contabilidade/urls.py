from django.contrib import admin
from django.urls import path
from django.contrib.auth.views import LoginView
from core.views import home

urlpatterns = [
    path("admin/", admin.site.urls),
    path("login/", LoginView.as_view(template_name="login.html"), name="login"),
    path("", home, name="home"),
]
