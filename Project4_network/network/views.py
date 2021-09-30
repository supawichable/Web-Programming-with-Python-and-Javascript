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
    page_rendering = "index" #default
    if request.method == "POST":
        page_rendering = request.POST["page_rendering"]
        upload_imgs = request.FILES.getlist("addphotos-newpost", None)
        # print(upload_imgs)

        if 'post_text' in request.POST:
            post_text = request.POST["post_text"]
            post = Post(text=post_text, owner=request.user)
            post.save()
        
        if upload_imgs:
            for upload_img in upload_imgs:
                post_img = ImageInPost(post=post, image=upload_img)
                post_img.save() 
    return paginator(request, page_rendering, username=request.user.username, page_number=1) 

@login_required
def addcomment(request, post_id):
    page_rendering = "index" #default
    # page_number = 1 #default
    if request.method == "POST":
        page_rendering = request.POST["page_rendering"]
        page_number = request.POST["page_number"]
        upload_img = request.FILES.get("addphotos", None)

        if 'comment_text' in request.POST:
            comment_text = request.POST["comment_text"]
            comment_post = Post.objects.get(pk=post_id)
            comment = Comment(text=comment_text, owner=request.user, post=comment_post)
            comment.save()
        
        if upload_img:
            # print("Got here")
            # fs = FileSystemStorage(location=settings.COMMENT_IMG_ROOT, base_url='/comment_img/')
            # file = fs.save(upload_img.name, upload_img)
            comment_img = ImageInComment(comment=comment, image=upload_img)
            comment_img.save()
            # print(comment_img.comment)
            # print(comment_img)
            # print(ImageInComment.objects.filter(comment=comment))
            # print(comment.comment_image.all())
        # print(comment.comment_image)

        return paginator(request, page_rendering, username=request.user.username, page_number=page_number, action="addcomment")
    return paginator(request, page_rendering, username=request.user.username)

@login_required
def editpost(request, post_id):
    if request.method == "POST":
        # sha1 = hashlib.sha1()
        # hashstring = hashlib.sha1(str(request.POST.get('csrf_token')))
        # if request.session.get('sessionform') != hashstring:
            page_rendering = request.POST["page_rendering"]
            page_number = request.POST["page_number"]
            status = request.POST.get("status", None)
            if status:
                deleted = json.loads(status)["deleted"]
            else:
                deleted = []
                # current_num = json.loads(status)["current_num"]
            upload_imgs = request.FILES.getlist("addphotos-editpost", None)
            post = Post.objects.get(pk=post_id)
            # current_num = int(request.POST["current_num"])
            # print("CURRENT_NUM: ", current_num)
            # print("BASE DIR: ", settings.BASE_DIR)
            # print("DELETED backend: ", deleted)
            print("UPLOAD: ", len(upload_imgs))
            print("DELETE: ", deleted)
            print("EXISTING: ", len(ImageInPost.objects.filter(post = post)))
            if 'edit_post_text' in request.POST:
                edittext = request.POST['edit_post_text']
                Post.objects.filter(pk=post_id).update(text=edittext)
            if len(upload_imgs) - len(deleted) + len(ImageInPost.objects.filter(post = post)) > 4:
            # if current_num > 4:
                print("GOT HERE!")
                return paginator(request, page_rendering, username=request.user.username, page_number=page_number)
            if upload_imgs:
                for upload_img in upload_imgs:
                    post_img = ImageInPost.objects.create(post=post, image=upload_img)
                    post_img.save()
            if deleted:
                for deleted_img in deleted:
                    for image in ImageInPost.objects.filter(post=post).all():
                        # print("URL: ", image.image.url)
                        # print("DELETED: ", deleted_img)
                        if image.image.url in deleted_img:
                            # print("DELETED!!")
                            image.delete()
    return paginator(request, page_rendering, username=request.user.username, page_number=page_number)

@login_required
def editcomment(request, comment_id):
    if request.method == "POST":
        page_rendering = request.POST["page_rendering"]
        page_number = request.POST["page_number"]
        status = request.POST['status']
        upload_img = request.FILES.get("addphotos", None)
        # upload_img = request.FILES["addphotos_editcomment"]
        # print("UPLOAD: ", upload_img)
        comment = Comment.objects.get(pk=comment_id)
        # comment_image = comment.comment_image.all()[0]
        if 'edit_comment_text' in request.POST:
            edittext = request.POST['edit_comment_text']
            # print("Edittext: ", edittext)
            Comment.objects.filter(pk=comment_id).update(text=edittext)
            # comment.comment_text = edittext
            # comment_filtered.update(text=edittext)
            # comment_filtered.save()
            # comment.update(text=edittext)
        if upload_img:
            # print("COMMENT IMG: ", comment.comment_image)
            if comment.comment_image:
                comment_image = comment.comment_image.all()
                comment_image.delete()
            comment_image = ImageInComment(comment=comment, image=upload_img)
            print("Comment Image: ", comment_image)
            comment_image.save()
        elif status == "deleted":
            comment_image = comment.comment_image.all()
            comment_image.delete()
    return paginator(request, page_rendering, username=request.user.username, page_number=page_number, action="editcomment")

def index_paginator(request):
    posts = Post.objects.all()
    paginator = Paginator(posts.order_by('-timestamp'), 10)
    page_number = request.GET.get('page_number')
    action = request.GET.get('action')
    if not page_number:
        page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

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
    posts = Post.objects.filter(owner__in = request.user.followings.all()).order_by('-timestamp')
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page_number')
    action = request.GET.get('action')
    if not page_number:
        page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
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
    username = request.GET.get('username')
    user_profile = CustomUser.objects.get(username=username)
    # paginator = Paginator(Post.objects.all().order_by('-timestamp'), 10)
    posts = user_profile.posted.all().order_by('-timestamp')
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page_number')
    action = request.GET.get('action')
    if not page_number:
        page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
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
    if page_rendering == "index":
        redirect_url = reverse('index_paginator')
        parameters = urlencode({'page_number': page_number, 'action': action})
        url = f'{redirect_url}?{parameters}'
        return redirect(url)
        # return redirect(index_paginator, page_number=page_number, action=action)
        # return index_paginator(request, page_number, action)
    elif page_rendering == "following":
        redirect_url = reverse('following_paginator')
        parameters = urlencode({'page_number': page_number, 'action': action})
        url = f'{redirect_url}?{parameters}'
        return redirect(url)
        # return following_paginator(request, page_number, action)
    elif page_rendering == "profile":
        redirect_url = reverse('profile_paginator')
        parameters = urlencode({'page_number': page_number, 'username':username, 'action': action})
        url = f'{redirect_url}?{parameters}'
        return redirect(url)
        # print(username)
        # return redirect(profile_paginator, page_number=page_number, action=action)
        # return profile_paginator(request, username, page_number, action)

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
    page_rendering = "following"
    if request.method == "POST":
        post_text = request.POST["post_text"]
        post = Post(text = post_text, owner =request.user)
        post.save()
    return paginator(request, page_rendering)

def profile(request, username):
    page_rendering = "profile"
    return paginator(request, page_rendering, username)

@login_required
def editprofile(request, username):
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

        print(date_of_birth)
        if not date_of_birth:
            date_of_birth = None
        # else:
        #     date_of_birth = date_of_birth.strftime("%Y-%m-%d")

        try:
            # print("PROFILE IMG: ", profile_img)
            user = CustomUser.objects.filter(username=username)
            if profile_img:
                # print("profile exists")
                # print(profile_img.value)
                # print("Profile changed")
                fs = FileSystemStorage(location=settings.PROFILE_IMG_ROOT, base_url='/profile_img/')
                # fs = FileSystemStorage(location=settings.PROFILE_IMG_ROOT)
                file = fs.save(profile_img.name, profile_img)
                # fileurl = fs.url(file)
                # print("URL: ", fileurl)
                user.update(display_name=display_name, username=new_username,email=email, date_of_birth=date_of_birth, about=about, profile_img="/profile_img/{}".format(profile_img))
                # user.update(display_name=display_name, username=new_username,email=email, date_of_birth=date_of_birth, about=about, profile_img="/profile_img/default1.jpg")
            elif status == "unchanged":
                # print(user_profile.profile_img)
                # print("Profile unchanged")
                user.update(display_name=display_name, username=new_username,email=email, date_of_birth=date_of_birth, about=about)
            elif status == "deleted": 
                # print("Profile deleted")
                user.update(display_name=display_name, username=new_username,email=email, date_of_birth=date_of_birth, about=about, profile_img=settings.DEFAULT_PROFILE)
        except IntegrityError:
            return render(request, "network/editprofile.html", {
                "message": "⚠️ Username already taken.",
                "profile": user_profile,
                "date_of_birth": user_profile.date_of_birth
                # "date_of_birth": user_profile.date_of_birth.strftime("%Y-%m-%d")
            })
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/editprofile.html", {
                "message": "⚠️ Passwords must match.",
                "profile": user_profile,
                "date_of_birth": user_profile.date_of_birth
                # "date_of_birth": user_profile.date_of_birth.strftime("%Y-%m-%d")
            })
        return HttpResponseRedirect(reverse('profile', args=[new_username]))
    return render(request, "network/editprofile.html", {
        "profile": user_profile,
        "date_of_birth": date_of_birth
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

@login_required
def user(request, user_id=""):
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

    # Query for requested user
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

    # Query for requested post
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
            post = Post.objects.filter(pk=post_id).update(text=edittext)
            post.save()
        if data.get("remove") == True:
            post.delete()
        return HttpResponse(status=204)
    
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

@login_required
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