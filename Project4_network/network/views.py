import os
import json
import hashlib
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from datetime import date
from urllib.parse import urlencode

from .models import *

def index(request):
    return paginator(request, "index")

@login_required
def addpost(request):
    """
    backend for addding a new post
    """
    page_rendering = "index" #default
    if request.method == "POST":
        page_rendering = request.POST["page_rendering"]
        upload_imgs = request.FILES.getlist("addphotos-newpost", None)

        # handle new post's text
        if 'post_text' in request.POST:
            post_text = request.POST["post_text"]
            post = Post(text=post_text, owner=request.user)
            post.save()
        # handle uploaded images (if there are)
        if upload_imgs:
            for upload_img in upload_imgs:
                post_img = ImageInPost(post=post, image=upload_img)
                post_img.save() 
    return paginator(request, page_rendering, username=request.user.username, page_number=1) 

@login_required
def addcomment(request, post_id):
    """
    backend for addding a new comment
    """
    page_rendering = "index" #default
    if request.method == "POST":
        page_rendering = request.POST["page_rendering"]
        page_number = request.POST["page_number"]
        upload_img = request.FILES.get("addphotos", None)

        # handle new comment's text
        if 'comment_text' in request.POST:
            comment_text = request.POST["comment_text"]
            comment_post = Post.objects.get(pk=post_id)
            comment = Comment(text=comment_text, owner=request.user, post=comment_post)
            comment.save()
        # handle uploaded image (if there is)
        if upload_img:
            comment_img = ImageInComment(comment=comment, image=upload_img)
            comment_img.save()

        return paginator(request, page_rendering, username=request.user.username, page_number=page_number, action="addcomment")
    return paginator(request, page_rendering, username=request.user.username)

@login_required
def editpost(request, post_id):
    """
    backend for editing a post
    """
    if request.method == "POST":
        # retrive status (existing images, deleted images, added images) from front-end
        status = request.POST.get("status", None)
        # get deleted images' list
        if status:
            deleted = json.loads(status)["deleted"]
        else:
            deleted = []
        upload_imgs = request.FILES.getlist("addphotos-editpost", None)
        post = Post.objects.get(pk=post_id)

        # handle edited post's text
        if 'edit_post_text' in request.POST:
            edittext = request.POST['edit_post_text']
            Post.objects.filter(pk=post_id).update(text=edittext)
        # allows up to 4 images in a post
        if len(upload_imgs) - len(deleted) + len(ImageInPost.objects.filter(post = post)) > 4:
            return JsonResponse({'not updated': "Number of photos exceeds limit of 4."}, status=204)
        # handle edited post's images
        if upload_imgs:
            for upload_img in upload_imgs:
                post_img = ImageInPost.objects.create(post=post, image=upload_img)
                post_img.save()
        # if previously existed images get deleted, handle the delete
        if deleted:
            for deleted_img in deleted:
                for image in ImageInPost.objects.filter(post=post).all():
                    if image.image.url in deleted_img:
                        image.delete()
    return JsonResponse({'updated': "Post updated."}, status=204)

@login_required
def editcomment(request, comment_id):
    """
    backend for editing a comment
    """
    if request.method == "POST":
        page_rendering = request.POST["page_rendering"]
        page_number = request.POST["page_number"]
        status = request.POST['status']
        upload_img = request.FILES.get("addphotos", None)
        comment = Comment.objects.get(pk=comment_id)
        # handle edited comment's text
        if 'edit_comment_text' in request.POST:
            edittext = request.POST['edit_comment_text']
            Comment.objects.filter(pk=comment_id).update(text=edittext)
        # handle edited comment's image
        if upload_img:
            if comment.comment_image:
                comment_image = comment.comment_image.all()
                comment_image.delete()
            comment_image = ImageInComment(comment=comment, image=upload_img)
            comment_image.save()
        # if previously existed image gets deleted, handle the delete
        elif status == "deleted":
            comment_image = comment.comment_image.all()
            comment_image.delete()
    return JsonResponse({'updated': "Comment updated."}, status=204)


def index_paginator(request):
    """
    render index page with paginator
    """
    posts = Post.objects.all()
    paginator = Paginator(posts.order_by('-timestamp'), 10)
    page_number = request.GET.get('page_number')
    action = request.GET.get('action')
    if not page_number:
        page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # if there's no post yet, render the page with message
    if list(posts) == []:
        return render(request, "network/index.html", {
            "page_obj" : page_obj,
            "user": request.user,
            "message": "There is no post yet.",
            "action": action
        })
    return render(request, "network/index.html", {
        "page_obj" : page_obj,
        "user": request.user,
        "action": action
    })

def following_paginator(request):
    """
    render following page with paginator
    """
    posts = Post.objects.filter(owner__in = request.user.followings.all()).order_by('-timestamp')
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page_number')
    action = request.GET.get('action')
    if not page_number:
        page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # if there's no post yet, render the page with message
    if list(posts) == []:
        return render(request, "network/following.html", {
            "page_obj" : page_obj,
            "message": "There is no post yet.",
            "action": action
        })
    return render(request, "network/following.html", {
        "page_obj" : page_obj,
        "action": action
    })

def profile_paginator(request):
    """
    render profile page with paginator
    """
    username = request.GET.get('username')
    user_profile = CustomUser.objects.get(username=username)
    posts = user_profile.posted.all().order_by('-timestamp')
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page_number')
    action = request.GET.get('action')
    if not page_number:
        page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    # if there's no post yet, render the page with message
    if list(posts.all()) == []:
        return render(request, "network/profile.html", {
        "profile": user_profile,
        "page_obj": page_obj,
        "message": "{} has no post yet.".format(user_profile.display_name),
        "today": date.today(),
        "action": action
    })
    return render(request, "network/profile.html", {
        "profile": user_profile,
        "page_obj": page_obj,
        "today": date.today(),
        "action": action
    })

def paginator(request, page_rendering, username=None, page_number=None, action=None):
    """
    paginator functions handling (redirect to the designated function)
    """
    if page_rendering == "index":
        redirect_url = reverse('index_paginator')
        parameters = urlencode({'page_number': page_number, 'action': action})
        url = f'{redirect_url}?{parameters}'
        return redirect(url)
    elif page_rendering == "following":
        redirect_url = reverse('following_paginator')
        parameters = urlencode({'page_number': page_number, 'action': action})
        url = f'{redirect_url}?{parameters}'
        return redirect(url)
    elif page_rendering == "profile":
        redirect_url = reverse('profile_paginator')
        parameters = urlencode({'page_number': page_number, 'username':username, 'action': action})
        url = f'{redirect_url}?{parameters}'
        return redirect(url)

def login_view(request):
    next = ""
    if request.GET:
        next = request.GET['next']

    if request.POST:

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            if next == "":
                return HttpResponseRedirect(reverse("index"))
            else:
                return HttpResponseRedirect(next)
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    """
    backend for registering a new user account
    """
    if request.method == "POST":
        display_name = request.POST["display_name"]
        username = request.POST["username"]
        email = request.POST["email"]
        date_of_birth = request.POST["date_of_birth"]
        about = request.POST["about"]
        profile_img = request.FILES.get("profile_img", None) # if file not uploaded, set default to None

        if not date_of_birth:
            date_of_birth = None

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "⚠️ Passwords must match."
            })

        # Attempt to create new user
        try:
            if profile_img:
                user = CustomUser.objects.create_user(username=username, email=email, password=password, display_name=display_name, date_of_birth=date_of_birth, about=about, profile_img=profile_img)
            else:
                user = CustomUser.objects.create_user(username=username, email=email, password=password, display_name=display_name, date_of_birth=date_of_birth, about=about)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def following(request):
    """
    following page's view
    """
    page_rendering = "following"
    if request.method == "POST":
        post_text = request.POST["post_text"]
        post = Post(text = post_text, owner =request.user)
        post.save()
    return paginator(request, page_rendering)

def profile(request, username):
    """
    profile page's view
    """
    page_rendering = "profile"
    return paginator(request, page_rendering, username)

@login_required
def editprofile(request, username):
    """
    backend for editing a user's profile
    """
    user_profile = CustomUser.objects.get(username=username)
    if not user_profile.date_of_birth:
        date_of_birth = None
    else:
        date_of_birth = user_profile.date_of_birth.strftime("%Y-%m-%d")

    if request.method == "POST":
        display_name = request.POST["display_name"]
        new_username = request.POST["username"]
        email = request.POST["email"]
        date_of_birth = request.POST["date_of_birth"]
        about = request.POST["about"]
        status = request.POST["status"]
        profile_img = request.FILES.get("profile_img", None) # if file not uploaded, set default to None

        if not date_of_birth:
            date_of_birth = None

        try:
            # handle profile image's changes
            user = CustomUser.objects.filter(username=username)
            # if a new image is uploaded, change the image
            if profile_img:
                fs = FileSystemStorage(location=settings.PROFILE_IMG_ROOT, base_url='/profile_img/')
                file = fs.save(profile_img.name, profile_img)
                user.update(display_name=display_name, username=new_username,email=email, date_of_birth=date_of_birth, about=about, profile_img="/profile_img/{}".format(profile_img))
            elif status == "unchanged":
                user.update(display_name=display_name, username=new_username,email=email, date_of_birth=date_of_birth, about=about)
            # set profile image to default if user deleted their profile image
            elif status == "deleted": 
                user.update(display_name=display_name, username=new_username,email=email, date_of_birth=date_of_birth, about=about, profile_img=settings.DEFAULT_PROFILE)
        except IntegrityError:
            return render(request, "network/editprofile.html", {
                "message": "⚠️ Username already taken.",
                "profile": user_profile,
                "date_of_birth": user_profile.date_of_birth
            })
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/editprofile.html", {
                "message": "⚠️ Passwords must match.",
                "profile": user_profile,
                "date_of_birth": user_profile.date_of_birth
            })
        return HttpResponseRedirect(reverse('profile', args=[new_username]))
    return render(request, "network/editprofile.html", {
        "profile": user_profile,
        "date_of_birth": date_of_birth
    })


def posts(request, post_id):
    """
    API query for requested post
    """ 
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    if request.method == "GET":
        return JsonResponse(post.serialize())
    
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

def comments(request, comment_id):
    """
    API query for requested comment
    """
    try:
        comment = Comment.objects.get(pk=comment_id)
    except Comment.DoesNotExist:
        return JsonResponse({'error': "Comment not found."}, status=404)
    
    if request.method == "GET":
        return JsonResponse(comment.serialize())
    
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

@login_required
def user(request, user_id=""):
    """
    API query for requested comment
    """
    if user_id == "":
        fetched_user = request.user
    else:
        fetched_user = CustomUser.objects.get(pk=user_id)
    
    if request.method == "GET":
        return JsonResponse(fetched_user.serialize())
    
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

@login_required
def user_interact(request, user_id):
    """
    API calls for updating users' followers
    """
    try:
        fetched_user = CustomUser.objects.get(pk=user_id)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "User nor found."}, status=404)

    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("followed") == True:
            fetched_user.followers.add(request.user)
        if data.get("followed") == False:
            fetched_user.followers.remove(request.user)
        fetched_user.save()
        return HttpResponse(status=204)

    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

@login_required
def post_interact(request, post_id):
    """
    API calls for updating posts
    """
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("like") == True:
            post.liked_by.add(request.user)
            post.save()
        if data.get("like") == False:
            post.liked_by.remove(request.user)
            post.save()
        if data.get("comment"):
            comment_text = data.get("comment")
            comment = Comment(text = comment_text, owner =request.user, post=post)
            comment.save()
        if data.get("edittext"):
            edittext = data.get("edittext")
            Post.objects.filter(pk=post_id).update(text=edittext)
        if data.get("remove") == True:
            post.delete()
        return HttpResponse(status=204)
    
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

@login_required
def comment_interact(request, comment_id):
    """
    API calls for updating comments
    """
    try:
        comment = Comment.objects.get(pk=comment_id)
    except:
        return JsonResponse({"error": "Comment not found."}, status=404)
    
    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("like") == True:
            comment.liked_by.add(request.user)
            comment.save()
        if data.get("like") == False:
            comment.liked_by.remove(request.user)
            comment.save()
        if data.get("remove") == True:
            comment.delete()
        return HttpResponse(status=204)
    
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)