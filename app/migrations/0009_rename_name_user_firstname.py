# Generated by Django 5.0.1 on 2024-01-15 09:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_remove_post_image_remove_user_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='name',
            new_name='firstname',
        ),
    ]
