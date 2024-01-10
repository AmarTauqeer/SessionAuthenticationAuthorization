from django.test import SimpleTestCase
from django.urls import reverse, resolve
from rest_framework.test import APITestCase,force_authenticate
from rest_framework.authtoken.models import Token
from .models import User, Category, Post
from .serializers import CategorySerializer, PostSerializer
from django.contrib.auth.models import Permission
from rest_framework import status

from . import views


# Create your tests here.
class AppUrlsTests(SimpleTestCase):

    def test_get_login_is_resolved(self):
        url = reverse('login')
        self.assertEquals(resolve(url).func.view_class, views.login.view_class)

    def test_get_signup_is_resolved(self):
        url = reverse('signup')
        self.assertEquals(resolve(url).func.view_class, views.signup.view_class)


    def test_get_categories_is_resolved(self):
        url = reverse('category list')
        self.assertEquals(resolve(url).func.view_class, views.category_list.view_class)

    def test_get_category_by_id_is_resolved(self):
        url = reverse('category by id', args=[1])
        self.assertEquals(resolve(url).func.view_class, views.category_byid.view_class)

    def test_get_category_update_is_resolved(self):
        url = reverse('category update')
        self.assertEquals(resolve(url).func.view_class, views.category_update.view_class)

    def test_get_category_delete_is_resolved(self):
        url = reverse('category delete', args=[1])
        self.assertEquals(resolve(url).func.view_class, views.category_delete.view_class)

    def test_get_posts_is_resolved(self):
        url = reverse('post list')
        self.assertEquals(resolve(url).func.view_class, views.post_list.view_class)

    def test_get_post_by_id_is_resolved(self):
        url = reverse('post by id', args=[1])
        self.assertEquals(resolve(url).func.view_class, views.post_byid.view_class)

    def test_post_update_is_resolved(self):
        url = reverse('post update')
        self.assertEquals(resolve(url).func.view_class, views.post_update.view_class)

    def test_post_delete_is_resolved(self):
        url = reverse('post delete', args=[1])
        self.assertEquals(resolve(url).func.view_class, views.post_delete.view_class)

class AppApiViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(name="amar taqeer", username="amar.tauqeer@wur.nl", password="amar",
                                             email="amar.tauqeer@wur.nl")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        # permissions
        view_all_category_permission = Permission.objects.get(name='Can view category')
        update_category_permission = Permission.objects.get(name='Can change category')
        delete_category_permission = Permission.objects.get(name='Can delete category')
        view_all_posts_permission = Permission.objects.get(name='Can view post')
        update_post_permission = Permission.objects.get(name='Can change post')
        delete_post_permission = Permission.objects.get(name='Can delete post')
        self.user.user_permissions.add(view_all_category_permission)
        self.user.user_permissions.add(update_category_permission)
        self.user.user_permissions.add(delete_category_permission)
        self.user.user_permissions.add(view_all_posts_permission)
        self.user.user_permissions.add(update_post_permission)
        self.user.user_permissions.add(delete_post_permission)
        self.user.save()
        # category data
        self.category = Category()
        obj = {"category_name": "Desktop", "created_by": 1}
        serializer = CategorySerializer(self.category, data=obj, partial=True)
        if serializer.is_valid():
            serializer.save()
        self.category = serializer.data
        # post data
        self.post = Post()
        obj_post = {"post_title": "Post1", "post_description": "Post1 description", "category": 1, "created_by": 1}
        serializer = PostSerializer(self.post, data=obj_post, partial=True)
        if serializer.is_valid():
            serializer.save()
        self.post = serializer.data

    def tearDown(self):
        pass

    def test_create_category_authenticated(self):
        data = {"category_name": "Desktop", "created_by": 1}
        response = self.client.post(reverse('category create'), data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_get_categories_authenticated(self):
        response = self.client.get(reverse('category list'))
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_update_category_authenticated(self):
        data = {"category_id": 1, "category_name": "Desktop updated", "created_by": 1}
        response = self.client.put(reverse('category update'), data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_delete_category_authenticated(self):
        response = self.client.delete(reverse('category delete', args=[1]))
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_create_post_authenticated(self):
        data = {"post_title": "Post1", "post_description": "Post1 description", "category": 1, "created_by": 1}
        response = self.client.post(reverse('post create'), data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_get_posts_authenticated(self):
        response = self.client.get(reverse('post list'))
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_update_post_authenticated(self):
        data = {"post_id": 1, "post_title": "Post1 updated", "post_description": "Post1 description updated",
                "category": 1, "created_by": 1}
        response = self.client.put(reverse('post update'), data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_delete_post_authenticated(self):
        response = self.client.delete(reverse('post delete', args=[1]))
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    # unauthenticated test cases
    def test_create_category_unauthenticated(self):
        self.client.force_authenticate(user=None, token=None)
        data = {"category_name": "Desktop", "created_by": 1}
        response = self.client.post(reverse('category create'), data, format='json')
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_categories_unauthenticated(self):
        self.client.force_authenticate(user=None, token=None)
        response = self.client.get(reverse('category list'))
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_category_unauthenticated(self):
        self.client.force_authenticate(user=None, token=None)
        data = {"category_id": 1, "category_name": "Desktop updated", "created_by": 1}
        response = self.client.put(reverse('category update'), data, format='json')
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_post_unauthenticated(self):
        self.client.force_authenticate(user=None, token=None)
        data = {"post_title": "Post1", "post_description": "Post1 description", "category": 1, "created_by": 1}
        response = self.client.post(reverse('post create'), data, format='json')
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_posts_unauthenticated(self):
        self.client.force_authenticate(user=None, token=None)
        response = self.client.get(reverse('post list'))
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_post_unauthenticated(self):
        self.client.force_authenticate(user=None, token=None)
        data = {"post_id": 1, "post_title": "Post1 updated", "post_description": "Post1 description updated",
                "category": 1, "created_by": 1}
        response = self.client.put(reverse('post update'), data, format='json')
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)