# Generated by Django 4.2.4 on 2024-02-21 05:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collectibles', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='collectible',
            name='description',
        ),
        migrations.AddField(
            model_name='collectible',
            name='image',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='collectible',
            name='product',
            field=models.CharField(choices=[('smiski', 'Smiski')], default=('smiski', 'Smiski'), max_length=100),
        ),
        migrations.AlterField(
            model_name='collectible',
            name='series',
            field=models.CharField(choices=[('moving-series', 'Moving Series'), ('exercising-series', 'Exercising Series'), ('dressing-series', 'Dressing Series'), ('work', '@ Work Series'), ('museum', 'Museum Series'), ('cheer', 'Cheer Series'), ('yoga-series', 'Yoga Series'), ('bed', 'Bed Series'), ('living', 'Living Series'), ('bath-series', 'Bath Series'), ('toilet-series', 'Toilet Series'), ('series-4', 'Series 4'), ('series-3', 'Series 3'), ('series-2', 'Series 2'), ('series-1', 'Series 1')], default=('moving-series', 'Moving Series'), max_length=100),
        ),
    ]