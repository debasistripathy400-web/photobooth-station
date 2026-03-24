from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Photo, Prop
from .serializers import PhotoSerializer, PropSerializer
import base64
from django.core.files.base import ContentFile
import cv2
import numpy as np
import io
from PIL import Image

class PhotoViewSet(viewsets.ModelViewSet):
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['filter_used']

    def get_queryset(self):
        # Only return photos belonging to the current user
        user = self.request.user
        if user.is_staff:
             return Photo.objects.all().order_by('-created_at')
        return Photo.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['POST'])
    def upload_base64(self, request):
        user = request.user if request.user.is_authenticated else None
        image_data = request.data.get('image')
        filter_type = request.data.get('filter_used', 'none')
        
        if not image_data:
            return Response({'error': 'No image data provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[-1]
            img_bytes = base64.b64decode(imgstr)
            
            # AI Processing with OpenCV
            if filter_type != 'none':
                # Convert to numpy array
                nparr = np.frombuffer(img_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                if filter_type == 'cartoon':
                    # Cartoon Effect
                    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                    gray = cv2.medianBlur(gray, 5)
                    edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 9)
                    color = cv2.bilateralFilter(img, 9, 300, 300)
                    cartoon = cv2.bitwise_and(color, color, mask=edges)
                    img = cartoon
                elif filter_type == 'sketch':
                    # Sketch Effect
                    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                    inv_gray = 255 - gray
                    blur = cv2.GaussianBlur(inv_gray, (21, 21), 0)
                    sketch = cv2.divide(gray, 255 - blur, scale=256.0)
                    img = cv2.cvtColor(sketch, cv2.COLOR_GRAY2BGR)
                
                # Convert back to bytes
                _, buf = cv2.imencode('.' + ext, img)
                img_bytes = buf.tobytes()

            data = ContentFile(img_bytes, name=f'capture_{int(np.datetime64("now").astype(int))}.' + ext)
            
            photo = Photo.objects.create(
                user=user,
                image=data,
                filter_used=filter_type
            )
            
            return Response(PhotoSerializer(photo).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PropViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Prop.objects.all()
    serializer_class = PropSerializer
    permission_classes = [permissions.AllowAny]
