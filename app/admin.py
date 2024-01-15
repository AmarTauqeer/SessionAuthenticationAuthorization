from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Category, Post, Comment, Reply


# Register your models here.

class CustomUserAdmin(UserAdmin):
    search_fields = ('username',)
    list_display = ('username', 'is_staff', 'is_active','first_name')
    list_filter = ('username', 'is_staff', 'is_active')
    filter_horizontal = ('groups', 'user_permissions')

    class Meta:
        model = User

class CustomCommentAdmin(admin.ModelAdmin):
    list_display = ('comment_id', 'comment_text','post', 'created_at','created_by', 'updated_at','like')

class CustomReplyAdmin(admin.ModelAdmin):
    list_display = ('reply_id', 'reply_text','comment', 'created_at','created_by', 'updated_at','like')

class CustomPostAdmin(admin.ModelAdmin):
    list_display = ('post_id', 'post_title','post_description', 'created_at','created_by', 'updated_at',"category",'like')

class CustomCategoryAdmin(admin.ModelAdmin):
    list_display = ('category_id', 'category_name', 'created_at','created_by', 'updated_at')

admin.site.register(User, UserAdmin)
admin.site.register(Comment, CustomCommentAdmin)
admin.site.register(Reply, CustomReplyAdmin)
admin.site.register(Post, CustomPostAdmin)
admin.site.register(Category, CustomCategoryAdmin)
