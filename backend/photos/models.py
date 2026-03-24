from django.db import models
from django.contrib.auth.models import User

class Prop(models.Model):
    PROP_TYPES = (
        ('glasses', 'Glasses'),
        ('hat', 'Hat'),
        ('mask', 'Mask'),
        ('other', 'Other'),
    )
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='props/')
    type = models.CharField(max_length=20, choices=PROP_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Photo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='photos', null=True, blank=True)
    image = models.ImageField(upload_to='captured_photos/')
    filter_used = models.CharField(max_length=50, default='none')
    created_at = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(default=True)

    def __str__(self):
        return f"Photo {self.id} by {self.user.username if self.user else 'Anonymous'}"

class session(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_data = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)
