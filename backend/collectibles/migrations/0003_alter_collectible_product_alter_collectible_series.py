# Generated by Django 4.2.4 on 2024-02-21 06:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collectibles', '0002_remove_collectible_description_collectible_image_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collectible',
            name='product',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='collectible',
            name='series',
            field=models.CharField(default='', max_length=100),
        ),
    ]