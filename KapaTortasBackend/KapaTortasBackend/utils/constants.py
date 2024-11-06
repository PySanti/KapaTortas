from rest_framework.response import Response
from rest_framework import status

BASE_SERIALIZER_ERROR_RESPONSE = Response({'error' : "serializer_error"}, status.HTTP_400_BAD_REQUEST)