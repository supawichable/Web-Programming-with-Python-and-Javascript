from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from django.urls import reverse
from django.contrib.auth.decorators import login_required

from .models import *


def index(request):
    return render(request, "auctions/index.html",{
        "listings": Listing.objects.all()
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            if 'next' in request.POST:
                return redirect(request.POST.get('next'))
            else:
                return render(request, "auctions/index.html",{
                    "listings": Listing.objects.all()
                })
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return render(request, "auctions/index.html", {
        "listings": Listing.objects.all()
    })


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return render(request, "auctions/index.html", {
            "listings": Listing.objects.all()
        })
    else:
        return render(request, "auctions/register.html")

@login_required
def list(request):
    # get data from list form, create new Listing object
    if request.method == "POST":
        new_title = request.POST["title"]
        description = request.POST["description"]
        url = request.POST["pic_url"]
        start_price = request.POST["start_price"]
        category = request.POST["category"]
        new_listing = Listing(title=new_title, 
                            description=description, 
                            url = url,
                            start_price = start_price,
                            category = category,
                            status = True,
                            lister = request.user)
        new_listing.save()
        return render(request, "auctions/listing.html", {
            "request_listing": new_listing
        })
    # render the form
    return render(request, "auctions/list.html", {
        "categories": Listing.CATEGORIES
    })

def listing(request, listing_id):
    request_listing = Listing.objects.get(id = listing_id)
    return render(request, "auctions/listing.html", {
        "request_listing": request_listing,
        "comments": request_listing.commenting.all()
    })

@login_required
def bid(request, listing_id):
    request_listing = Listing.objects.get(id = listing_id)
    if request.method == 'POST':
        bid_price = int(request.POST["bid_price"])
        # if bit price is not more than the highest bid or less than the starting price, show error message
        if bid_price <= request_listing.max_bid_price or bid_price < request_listing.start_price:
            return render(request, "auctions/bid.html", {
                "request_listing": request_listing,
                "message": "Price must be at least the starting bid price and higher than highest bid." 
            })
        # if not, create a new Bid object, update the listing's max_bid_price
        else:
            request_listing.max_bid_price = bid_price
            request_listing.max_bidder = request.user
            new_bid = Bid(bid_price=bid_price, 
                         bid_item=request_listing,
                         bidder=request.user)
            request_listing.save()
            new_bid.save()
            return render(request, "auctions/listing.html", {
                "request_listing": request_listing
            })
    return render(request, "auctions/bid.html", {
        "request_listing": request_listing
    })

@login_required
def close(request, listing_id):
    # record the winner and change the listing's status to inactive
    request_listing = Listing.objects.get(id = listing_id)
    if request.user == request_listing.lister:
        request_listing.status = False
        request_listing.winner = request_listing.max_bidder
        request_listing.save()
        return HttpResponseRedirect(reverse("auctions:listing", args=[listing_id]))

@login_required
def comment(request, listing_id):
    request_listing = Listing.objects.get(id = listing_id)
    # create a new Comment object from the form
    if request.method == 'POST':
        new_comment_text = request.POST["comment"]
        new_comment_item = request_listing
        new_commentator = request.user
        new_comment = Comment(comment_text=new_comment_text,
                             comment_item=new_comment_item,
                             commentator=new_commentator)
        new_comment.save()
        return HttpResponseRedirect(reverse("auctions:listing", args=(listing_id,)))
    # render the form
    return render(request, "auctions/comment.html", {
        "request_listing": request_listing,
        "comments": request_listing.commenting.all()
    })

@login_required
def add_watchlist(request, listing_id):
    # add a listing to the user's watchlist
    request_listing = Listing.objects.get(id=listing_id)
    request_listing.watched_by.add(request.user)
    request_listing.save()
    return render(request, "auctions/listing.html", {
        "request_listing": request_listing,
        # "comments": request_listing.commenting.all(),
        "watchlist_message": "Added to watchlist"
    })

@login_required
def remove_watchlist(request, listing_id):
    # remove a watchlist from the user's watchlist
    request_listing = Listing.objects.get(id=listing_id)
    request_listing.watched_by.remove(request.user)
    request_listing.save()
    return render(request, "auctions/listing.html", {
        "request_listing": request_listing,
        # "comments": request_listing.commenting.all(),
        "watchlist_message": "Removed from watchlist"
    })

@login_required
def watchlist(request):
    # render watchlist page (show all listings in the watchlist)
    return render(request, "auctions/watchlist.html")

@login_required
def my_bids(request):
    # render the user's ongoing bid's listings
    bids = {}
    bid_listings = []
    # if the user bidded more than one time, show just the latest bid
    for bid in request.user.bidded.all():
        if bid.bid_item not in bid_listings:
            bid_listings.append(bid.bid_item)
            bids[bid.bid_item] = bid
        else:
            if bid.bid_price > bids[bid.bid_item].bid_price:
                bids[bid.bid_item] = bid
    return render(request, "auctions/my_bids.html", {
        "bids": bids
    })

@login_required
def my_listings(request):
    return render(request, "auctions/my_listings.html")

def categories(request):
    return render(request, "auctions/categories.html", {
        "categories": Listing.CATEGORIES
    })

def category(request, category_code):
    listings_in_cat = Listing.objects.filter(category=category_code, status=True)
    category_name = dict(Listing.CATEGORIES)[category_code]
    return render(request, "auctions/category.html",{
        "listing_in_cat": listings_in_cat,
        "category_name": category_name
    })
