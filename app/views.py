from django.contrib.auth import logout
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.contrib.auth.decorators import permission_required
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import UserSerializer, CategorySerializer, PostSerializer, CommentSerializer, ReplySerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import User, Category, Post, Comment, Reply
from django.shortcuts import get_object_or_404

@swagger_auto_schema(methods=['post'], request_body=UserSerializer, tags=["Account"])
@api_view(['POST'])
def login(requst):
    user = get_object_or_404(User, username=requst.data["username"])
    if not user.check_password(requst.data['password']):
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    token, create = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({"token": token.key, "user": serializer.data})

@swagger_auto_schema(methods=['post'], request_body=UserSerializer, tags=["Account"])
@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['get'], tags=["Account"])
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(requst):
    return Response(requst.user, status=status.HTTP_200_OK)

@swagger_auto_schema(methods=['get'], tags=["Account"])
@api_view(['GET'])
# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(methods=['get'], tags=["Account"])
@api_view(['GET'])
def get_logout(requst):
    logout(requst)
    return Response("logout successfully", status=status.HTTP_200_OK)


"""======================Category=============================="""

@swagger_auto_schema(methods=['post'], request_body=CategorySerializer, tags=["Category"])
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def category_create(request):
    if request.user.has_perm("app.create_category"):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = Category.objects.get(category_name=request.data['category_name'])
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)


@swagger_auto_schema(methods=['get'], tags=["Category"])
@api_view(['GET'])
# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
def category_list(request):
    # if request.user.has_perm("app.view_category"):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# return Response("You don't have permission for this action", status=status.HTTP_200_OK)

@swagger_auto_schema(methods=['get'], tags=["Category"])
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def category_byid(request, id):
    if request.user.has_perm("app.view_category"):
        category = Category.objects.filter(category_id=id).first()
        if category is not None:
            serializer = CategorySerializer(category, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response("Not found", status=status.HTTP_200_OK)
    return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)


@swagger_auto_schema(methods=['put'], request_body=CategorySerializer, tags=["Category"])
@api_view(['PUT'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def category_update(request):
    if request.user.has_perm("app.change_category"):
        category = get_object_or_404(Category, category_id=request.data["category_id"])
        print(category)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)

@swagger_auto_schema(methods=['delete'], tags=["Category"])
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def category_delete(request, id):
    if request.user.has_perm("app.delete_category"):
        category = get_object_or_404(Category, category_id=id)
        category.delete()
        return Response("Record has been deleted successfully.", status=status.HTTP_200_OK)
    return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)


"""======================Post=============================="""

@swagger_auto_schema(methods=['post'], request_body=PostSerializer, tags=["Post"])
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def post_create(request):
    if request.user.has_perm("app.create_post"):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)

@swagger_auto_schema(methods=['get'], tags=["Post"])
@api_view(['GET'])
# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
def post_list(request):
    # if request.user.has_perm("app.view_post"):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# return Response("You don't have permission for this action", status=status.HTTP_200_OK)


@swagger_auto_schema(methods=['get'], tags=["Post"])
@api_view(['GET'])
# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
def post_list_by_category(request, id):
    # if request.user.has_perm("app.view_post"):
    posts = Post.objects.filter(category=id)
    print(posts)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# return Response("You don't have permission for this action", status=status.HTTP_200_OK)

@swagger_auto_schema(methods=['get'], tags=["Post"])
@api_view(['GET'])
# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
def post_byid(request, id):
    # if request.user.has_perm("app.view_post"):
    post = Post.objects.filter(post_id=id).first()
    if post is not None:
        serializer = PostSerializer(post, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response("Not found", status=status.HTTP_200_OK)


# return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)

@swagger_auto_schema(methods=['patch'], request_body=PostSerializer, tags=["Post"])
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def post_update(request):
    if request.user.has_perm("app.change_post"):
        post = get_object_or_404(Post, post_id=request.data["post_id"])
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)


@swagger_auto_schema(methods=['delete'], tags=["Post"])
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def post_delete(request, id):
    if request.user.has_perm("app.delete_post"):
        post = get_object_or_404(Post, post_id=id)
        post.delete()
        return Response("Record has been deleted successfully.", status=status.HTTP_200_OK)
    return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)


"""======================Comment=============================="""

@swagger_auto_schema(methods=['post'], request_body=CommentSerializer, tags=["Comment"])
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def comment_create(request):
    if request.user.has_perm("app.add_comment"):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)

@swagger_auto_schema(methods=['get'], tags=["Comment"])
@api_view(['GET'])
# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
def comment_list(request):
    # if request.user.has_perm("app.view_post"):
    comments = Comment.objects.all()
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(methods=['get'], tags=["Comment"])
@api_view(['GET'])
def comment_byid(request, id):
    comment = Comment.objects.filter(comment_id=id).first()
    if comment is not None:
        serializer = CommentSerializer(comment, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response("Not found", status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(methods=['put'], request_body=CommentSerializer, tags=["Comment"])
@api_view(['PUT'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def comment_update(request):
    if request.user.has_perm("app.change_comment"):
        comment = get_object_or_404(Comment, comment_id=request.data["comment_id"])
        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)

@swagger_auto_schema(methods=['delete'], tags=["Comment"])
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def comment_delete(request, id):
    if request.user.has_perm("app.delete_comment"):
        comment = get_object_or_404(Comment, comment_id=id)
        comment.delete()
        return Response("Record has been deleted successfully.", status=status.HTTP_200_OK)
    return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)


"""======================Reply=============================="""

@swagger_auto_schema(methods=['post'], request_body=ReplySerializer, tags=["Reply"])
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def reply_create(request):
    if request.user.has_perm("app.add_reply"):
        serializer = ReplySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)

@swagger_auto_schema(methods=['get'], tags=["Reply"])
@api_view(['GET'])
# @authentication_classes([SessionAuthentication, TokenAuthentication])
# @permission_classes([IsAuthenticated])
def reply_list(request):
    # if request.user.has_perm("app.view_post"):
    replies = Reply.objects.all()
    serializer = ReplySerializer(replies, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(methods=['get'], tags=["Reply"])
@api_view(['GET'])
def reply_byid(request, id):
    reply = Reply.objects.filter(reply_id=id).first()
    if reply is not None:
        serializer = ReplySerializer(reply, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response("Not found", status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(methods=['put'], request_body=ReplySerializer, tags=["Reply"])
@api_view(['PUT'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def reply_update(request):
    if request.user.has_perm("app.change_reply"):
        reply = get_object_or_404(Reply, reply_id=request.data["reply_id"])
        serializer = ReplySerializer(reply, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)

@swagger_auto_schema(methods=['delete'], tags=["Reply"])
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def reply_delete(request, id):
    if request.user.has_perm("app.delete_reply"):
        reply = get_object_or_404(Reply, reply_id=id)
        reply.delete()
        return Response("Record has been deleted successfully.", status=status.HTTP_200_OK)
    return Response("You don't have permission for this action", status=status.HTTP_403_FORBIDDEN)
