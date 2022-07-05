# Project 4: Network

## Table of Contents
- [Description](#description)
- [Set Up and Installation](#set-up-and-installation)
- [Preview](#preview)

## Description
This project is a social media clone web application where users can,
- **Register for an account** by filling in their information including their name, desire username, email address, birthday, bio, profile picture etc.
- Share their thoughts by **posting** in text or include up to 4 images per post
- **Comment** on any post in text or image
- **Edit their posts and comments** by changing the text message, and adding or removing images
- **Like or unlike** any post or commments
- **Follow or unfollow** each other to make their posts appear/disappear from the Following page
- **Customize** their profile with their profile picture, bio, and username
- **See if it is someone's birthday** by checking their profile page.

The pages implemented include,
- **Profile Page**: A page containing each user's profile and their information. All their posts are gathered here. The user visiting others' profile page will be able to follow/unfollow the profile owner on this page. Also, if it is tghe profile owner's birthday, a birthday notification message will appear on their profile as a little gimmick so that the visiting user can say happy birthday.
- **All Posts Page**: A global view of the application where all posts from all users are gathered and displayed. The user will also be able to create a new post from this page. If the user is not logged-in, they will be prompted to redirect to the log-in or the register page.
- **Following Page**: A user-customized page that shows only the posts from users that they are following.
- **Log-in Page**: A landing page where the user can fill-in username and password to be authenticated and log-in.
- **Account Register Page**: A page for new users to fill-in their basic information and create a new account.

## Set Up and Installation
To set up the project:
1. Clone the repository.
2. Run `pip3 install Django`
3. Run `cd Web_Programming_Projects/Project4_network`
4. Run `python manage.py runserver`
5. You should be able to access the application via http://127.0.0.1:8000/ or at the port of your designation displayed on your terminal.

## Preview
Watch preview of the application on [YouTube](https://youtu.be/19h6JXXN-RM)
