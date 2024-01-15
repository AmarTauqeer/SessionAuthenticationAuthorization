from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name="login"),
    path('signup/', views.signup, name="signup"),
    path('test-token/', views.test_token, name="test token"),
    path('logout/', views.get_logout, name="logout"),
    path('users/', views.get_users, name="users"),

    path('category-create/', views.category_create, name="category create"),
    path('category-list/', views.category_list, name="category list"),
    path('category/<int:id>', views.category_byid, name="category by id"),
    path('category-update/', views.category_update, name="category update"),
    path('category-delete/<int:id>', views.category_delete, name="category delete"),

    path('post-create/', views.post_create, name="post create"),
    path('post-list/', views.post_list, name="post list"),
    path('post-list/category/<int:id>', views.post_list_by_category, name="post list by category"),
    path('post/<int:id>', views.post_byid, name="post by id"),
    path('post-update/', views.post_update, name="post update"),
    path('post-delete/<int:id>', views.post_delete, name="post delete"),

    path('comment-create/', views.comment_create, name="comment create"),
    path('comment-list/', views.comment_list, name="comment list"),
    path('comment/<int:id>', views.comment_byid, name="comment by id"),
    path('comment-update/', views.comment_update, name="comment update"),
    path('comment-delete/<int:id>', views.comment_delete, name="comment delete"),

    path('reply-create/', views.reply_create, name="reply create"),
    path('reply-list/', views.reply_list, name="reply list"),
    path('reply/<int:id>', views.reply_byid, name="reply by id"),
    path('reply-update/', views.reply_update, name="reply update"),
    path('reply-delete/<int:id>', views.reply_delete, name="reply delete"),
]
