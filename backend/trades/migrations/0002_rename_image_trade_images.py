# Generated by Django 4.2.4 on 2024-03-08 03:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trades', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='trade',
            old_name='image',
            new_name='images',
        ),
    ]
