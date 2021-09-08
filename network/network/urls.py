
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('login/', views.login_view, name="login"),
    path('login/<str:next>', views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("following", views.following, name="following"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("comment/<int:post_id>", views.comment, name="comment"),
    path("editpost/<int:post_id>", views.editpost, name="editpost"),
    path("editcomment/<int:comment_id>", views.editcomment, name="editcomment"),

    # API Routes
    # path("posts/<str:post_list>", views.views.all_post, name="all_post"),
    path("user/", views.user, name="user"),
    path("posts/<int:post_id>", views.posts, name="posts"),
    path("post_interact/<int:post_id>", views.post_interact, name="post_interact"),
    path("comments/<int:comment_id>", views.comments, name="comments"),
    path("comment_interact/<int:comment_id>", views.comment_interact, name="comment_interact")
]
