from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Category, Post


# Register your models here.

class CustomUserAdmin(UserAdmin):
    search_fields = ('username',)
    list_display = ('username', 'is_staff', 'is_active')
    list_filter = ('username', 'is_staff', 'is_active')
    filter_horizontal = ('groups', 'user_permissions')

    class Meta:
        model = User


admin.site.register(User, UserAdmin)
admin.site.register([Category, Post])
