from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.core.exceptions import NON_FIELD_ERRORS, ValidationError
from django.utils.translation import gettext_lazy as _


class User(AbstractUser,PermissionsMixin):
    first_name = models.CharField(max_length=255)
    username = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "user"



class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = "category"
        ordering = ['-created_at']

    def __str__(self):
        return self.category_name


class Post(models.Model):
    post_id = models.AutoField(primary_key=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    post_title = models.CharField(max_length=255, null=False, blank=False)
    post_description = models.TextField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    like = models.BooleanField(default=False, null=True)

    class Meta:
        db_table = "post"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.category}|{self.post_title}"


class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    comment_text =models.TextField(null=False, blank=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    like =models.BooleanField(default=False,null=True)

    class Meta:
        db_table = "comment"
        ordering = ['-created_at']

    # def __str__(self):
    #     return f"{self.created_by}-{self.comment_text}"

class Reply(models.Model):
    reply_id = models.AutoField(primary_key=True)
    reply_text =models.TextField(null=False, blank=False)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    like = models.BooleanField(default=False, null=True)

    class Meta:
        db_table = "reply"
        ordering = ['-created_at']

    # def __str__(self):
    #     return f"{self.created_by}-{self.reply_text}"