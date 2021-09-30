
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('login/', views.login_view, name="login"),
    path('addpost', views.addpost, name="addpost"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("following", views.following, name="following"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("addcomment/<int:post_id>", views.addcomment, name="addcomment"),
    path("editpost/<int:post_id>", views.editpost, name="editpost"),
    path("editcomment/<int:comment_id>", views.editcomment, name="editcomment"),
    path("editprofile/<str:username>", views.editprofile, name="editprofile"),
    path("index_paginator/", views.index_paginator, name="index_paginator"),
    path("following_paginator/", views.following_paginator, name="following_paginator"),
    path("profile_paginator/", views.profile_paginator, name="profile_paginator"),

    # API Routes
    # path("posts/<str:post_list>", views.views.all_post, name="all_post"),
    path("user/", views.user, name="user"),
    path("user/<int:user_id>", views.user, name="other_user"),
    path("user_interact/<int:user_id>", views.user_interact, name="user_interact"),
    path("posts/<int:post_id>", views.posts, name="posts"),
    path("post_interact/<int:post_id>", views.post_interact, name="post_interact"),
    path("comments/<int:comment_id>", views.comments, name="comments"),
    path("comment_interact/<int:comment_id>", views.comment_interact, name="comment_interact"),
]

urlpatterns += static(settings.PROFILE_IMG_URL, document_root=settings.PROFILE_IMG_ROOT)
urlpatterns += static(settings.COMMENT_IMG_URL, document_root=settings.COMMENT_IMG_ROOT)
urlpatterns += static(settings.POST_IMG_URL, document_root=settings.POST_IMG_ROOT)
