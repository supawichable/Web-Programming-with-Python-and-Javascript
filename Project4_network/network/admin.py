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



# Register your models here.
# class UserCreationForm(forms.ModelForm):
#     password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
#     password2 = forms.CharField(label="Password confirmation", widget=forms.PasswordInput)

#     class Meta:
#         model = User,
#         fields = ('display_name', 'email', 'date_of_birth')

#     def clean_password2(self):
#         password1 = self.cleaned_data.get("password1")
#         password2 = self.cleaned_data.get("password2")
#         if password1 and password2 and password1 != password2:
#             raise ValidationError("Passwords don't match")
#         return password2
    
#     def save(self, commit=True):
#         user = super().save(commit=False)
#         user.set_password(self.cleaned_data["password1"])
#         if commit:
#             user.save()
#         return user

# class UseChangeForm(forms.ModelForm):
#     password = ReadOnlyPasswordHashField()
    
#     class Meta:
#         model = User
#         fields = ('display_name', 'email', 'date_of_birth', 'is_active', 'is_admin')

# class UserAdmin(BaseUserAdmin):
#     form = UserChangeForm
#     add_form = UserCreationForm
    
#     list_display = ('display_name', 'email', 'date_of_birth', 'is_admin')
#     list_filter = ('is_admin',)
#     fieldsets = (
#         (None, {'fields': ('username', 'password')}),
#         ('Personal info', {'fields': ('display_name', 'date_of_birth', )}),
#         ('Permission', {'fields': ('is_admin', )}),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('display_name', 'emails', 'date_of_birth', 'password1', 'password2')
#         }),
#     )
#     search_fields = ('username',)
#     ordering = ('username',)
#     filter_horizontal = ()


admin.site.register(CustomUser, UserAdminConfig)
admin.site.register(Post)
admin.site.register(ImageInPost)
admin.site.register(Comment)
admin.site.register(ImageInComment)

# admin.site.unregister(Group)