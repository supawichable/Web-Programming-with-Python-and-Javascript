from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField, UserChangeForm
from django.core.exceptions import ValidationError
from django.forms import TextInput, Textarea

from .models import *

class UserAdminConfig(UserAdmin):
    model = CustomUser
    search_fields = ('username', 'display_name', 'email')
    list_display = ('username', 'display_name', 'email', 'date_of_birth')
    list_filter = ('username', 'display_name', 'email')
    ordering = ('username',)
    fieldsets = (
        (None, {'fields': ('username', 'display_name', 'email',)}),
        ('Permissions', {'fields': ('is_staff', 'is_active',)}),
        ('Personal', {'fields': ('about','date_of_birth','profile_img',)}),
        ('Follow', {'fields': ('followings',)}),
    )
    formfield_overrides = {
        CustomUser.about: {'widget': Textarea(attrs={'rows':10, 'cols':40})},
    }
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'display_name', 'email', 'password1', 'password2', 'date_of_birth', 'about')}
        ),
    )

admin.site.register(CustomUser, UserAdminConfig)
admin.site.register(Post)
admin.site.register(ImageInPost)
admin.site.register(Comment)
admin.site.register(ImageInComment)