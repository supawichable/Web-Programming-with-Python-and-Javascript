# Generated by Django 3.2 on 2021-08-18 11:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0007_auto_20210818_1100'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='listing',
            name='max_bidder',
        ),
        migrations.RemoveField(
            model_name='listing',
            name='winner',
        ),
    ]