from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name="login"),
    path('signup/', views.signup, name="signup"),
    path('test-token/', views.test_token, name="test token"),
    path('category-create/', views.category_create, name="category create"),
    path('category-list/', views.category_list, name="category list"),
    path('category/<int:id>', views.category_byid, name="category by id"),
    path('category-update/', views.category_update, name="category update"),
    path('category-delete/<int:id>', views.category_delete, name="category delete"),

    path('post-create/', views.post_create, name="post create"),
    path('post-list/', views.post_list, name="post list"),
    path('post/<int:id>', views.post_byid, name="post by id"),
    path('post-update/', views.post_update, name="post update"),
    path('post-delete/<int:id>', views.post_delete, name="post delete"),
]
