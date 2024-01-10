from rest_framework import serializers
from .models import User, Category, Post


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'username']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class CategorySerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Category
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Post
        fields = '__all__'
