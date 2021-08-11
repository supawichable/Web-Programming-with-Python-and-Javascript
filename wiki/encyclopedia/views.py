from django.shortcuts import render
from django import forms
from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse
from django.utils.safestring import mark_safe
import markdown2
import os
import random
import logging

from . import util

logger = logging.getLogger(__name__)

class NewSearchForm(forms.Form):
    search_query = forms.CharField(label="Search Encyclopedia", widget=forms.TextInput(attrs={'class':'search'}))

class NewCreateForm(forms.Form):
    input_title = forms.CharField(label = "Type your title:", widget=forms.TextInput())
    input_text = forms.CharField(label = "Type your text:", widget=forms.Textarea())

class NewEditForm(forms.Form):
    input_title = forms.CharField(label = "Type your title:", widget=forms.TextInput())
    input_text = forms.CharField(label = "Type your text:", widget=forms.Textarea())
    

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries(),
        "search_form": NewSearchForm()
    })

def entry(request, title):
    if title in util.list_entries():
        entry_md = util.get_entry(title)
        return render(request, "encyclopedia/entry.html", {
            "title": title,
            "text": markdown2.Markdown().convert(entry_md),
            "search_form": NewSearchForm()
        })
    else:
        return render(request, "encyclopedia/entry_error.html")

def search(request):
    if request.method == 'POST':
        form = NewSearchForm(request.POST)
        if form.is_valid():
            search_query = form.cleaned_data["search_query"]
            if search_query in util.list_entries():
                return redirect(reverse('entry', args=[search_query]))
            else:
                return render(request, "encyclopedia/search_result.html", {
                    "query": search_query,
                    "titles": util.get_related_titles(search_query),
                    "search_form": NewSearchForm()
                })
    return redirect(reverse('index'))

def create(request):
    if request.method == 'GET':
        return render(request, "encyclopedia/create.html", {
            "search_form": NewSearchForm(),
            "create_form": NewCreateForm()
        })

    if request.method == 'POST':
        form = NewCreateForm(request.POST)
        if form.is_valid():
            input_title = form.cleaned_data["input_title"]
            input_text = form.cleaned_data["input_text"]
            if input_title in util.list_entries():
                return render(request, "encyclopedia/create_error.html",{
                    "search_form": NewSearchForm(),
                    "title": input_title
                })
            else:
                util.save_entry(input_title, input_text)
                return redirect(reverse('entry', args=[input_title]))
    return redirect(reverse('index'))

def edit(request, title):
    if request.method == 'GET':
        initial = {'input_title': title, 'input_text': util.get_entry(title)}
        return render(request, "encyclopedia/edit.html", {
            "search_form": NewSearchForm(),
            "edit_form": NewEditForm(initial = initial),
            "title": title
        })
    
    if request.method == 'POST':
        form = NewEditForm(request.POST)
        if form.is_valid():
            input_title = form.cleaned_data["input_title"]
            input_text = form.cleaned_data["input_text"]
            util.save_entry(input_title, input_text)
            return redirect(reverse('entry', args=[input_title]))
    return redirect(reverse('index'))

def get_random(request):
    titles = util.list_entries()
    title_num = len(titles)
    rand_title_num = random.randint(0, title_num-1)
    rand_title = titles[rand_title_num]
    return redirect(reverse('entry', args=[rand_title]))