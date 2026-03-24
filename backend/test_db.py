import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'photobooth_backend.settings')
django.setup()

from django.contrib.auth.models import User

try:
    username = 'testuser_' + os.urandom(4).hex()
    user = User.objects.create_user(username=username, password='password123')
    print(f"User created successfully: {user.username}")
    user.delete()
    print("User deleted. Test PASSED.")
except Exception as e:
    print(f"Test FAILED: {str(e)}")
