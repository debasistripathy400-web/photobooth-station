from rest_framework import serializers
from .models import Photo, Prop

class PropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prop
        fields = '__all__'

class PhotoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Photo
        fields = ('id', 'user', 'username', 'image', 'filter_used', 'created_at', 'is_public')
        read_only_fields = ('user',)
