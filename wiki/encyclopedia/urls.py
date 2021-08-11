from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:title>", views.entry, name="entry"),
    path("?q=", views.search, name="search"),
    path("create/", views.create, name="create"),
    path("wiki/<str:title>/edit", views.edit, name="edit"),
    path("random/", views.get_random, name="random")
]
