# Generated by Django 5.0.1 on 2024-01-15 09:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_post_image_user_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='image',
        ),
        migrations.RemoveField(
            model_name='user',
            name='image',
        ),
    ]
