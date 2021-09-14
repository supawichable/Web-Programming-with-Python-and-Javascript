import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt

from .models import *

def index(request):
    if request.method == "POST":
        if 'post_text' in request.POST:
            post_text = request.POST["post_text"]
            post = Post(text=post_text, owner=request.user)
            post.save()
    return paginator(request)

@login_required(login_url='login')
def comment(request, post_id):
    if request.method == "POST":
        if 'comment_text' in request.POST:
            comment_text = request.POST["comment_text"]
            comment_post = Post.objects.get(pk=post_id)
            comment = Comment(text=comment_text, owner=request.user, post=comment_post)
            comment.save()
    return paginator(request)

@login_required(login_url='login')
def editpost(request, post_id):
    if request.method == "POST":
        if 'edit_post_text' in request.POST:
            edittext = request.POST['edit_post_text']
            Post.objects.filter(pk=post_id).update(text=edittext)
    return paginator(request)

@login_required(login_url="login")
def editcomment(request, comment_id):
    if request.method == "POST":
        if 'edit_comment_text' in request.POST:
            edittext = request.POST['edit_comment_text']
            Comment.objects.filter(pk=comment_id).update(text=edittext)
    return paginator(request)

def paginator(request):
    paginator = Paginator(Post.objects.all().order_by('-timestamp'), 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "network/index.html", {
        "page_obj" : page_obj,
        "user": request.user
    })

def login_view(request):
    next = ""
    if request.GET:
        next = request.GET['next']
    print("next 123: ", next)

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
    if request.method == "POST":
        display_name = request.POST["display_name"]
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password, display_name = display_name)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required(login_url='login')
def following(request):
    if request.method == "POST":
        post_text = request.POST["post_text"]
        post = Post(text = post_text, owner =request.user)
        post.save()
    posts = Post.objects.filter(owner__in = request.user.followings.all()).order_by('-timestamp')
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "network/following.html", {
        "page_obj" : page_obj
    })

def profile(request, username):
    user_profile = User.objects.get(username=username)
    # paginator = Paginator(Post.objects.all().order_by('-timestamp'), 10)
    posts = user_profile.posted.all().order_by('-timestamp')
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "network/profile.html", {
        "profile": user_profile,
        "page_obj": page_obj
    })

def posts(request, post_id):
    # Query for requested post
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
    # Query for requested comment
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

@login_required(login_url='/login/')
def user(request, user_id=""):
    if user_id == "":
        fetched_user = request.user
    else:
        fetched_user = User.objects.get(pk=user_id)
    
    if request.method == "GET":
        return JsonResponse(fetched_user.serialize())
    
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)


@csrf_exempt
@login_required(login_url='login')
def user_interact(request, user_id):

    # Query for requested user
    try:
        fetched_user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
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

@csrf_exempt
@login_required(login_url='login')
def post_interact(request, post_id):

    # Query for requested post
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("like") == True:
            post.liked_by.add(request.user)
        if data.get("like") == False:
            post.liked_by.remove(request.user)
        if data.get("comment"):
            comment_text = data.get("comment")
            comment = Comment(text = comment_text, owner =request.user, post=post)
            comment.save()
        if data.get("edittext"):
            edittext = data.get("edittext")
            post = Post.objects.filter(pk=post_id).update(text=edittext)
        post.save()
        return HttpResponse(status=204)
    
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)


@csrf_exempt
@login_required(login_url='login')
def comment_interact(request, comment_id):
    # Query for requested comment
    try:
        comment = Comment.objects.get(pk=comment_id)
    except:
        return JsonResponse({"error": "Comment not found."}, status=404)
    
    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("like") == True:
            comment.liked_by.add(request.user)
        if data.get("like") == False:
            comment.liked_by.remove(request.user)
        comment.save()
        return HttpResponse(status=204)
    
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)