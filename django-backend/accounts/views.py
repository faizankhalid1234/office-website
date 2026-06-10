from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer


class RegisterView(APIView):
    """User registers with their own name, email & password."""

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            errors = serializer.errors
            first_error = next(iter(errors.values()))[0]
            return Response({"error": str(first_error)}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        return Response(
            {"user": UserSerializer(user).data, "message": "Account created successfully"},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """Verify email & password — used by Next.js frontend."""

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            errors = serializer.errors
            if "non_field_errors" in errors:
                msg = errors["non_field_errors"][0]
            else:
                msg = next(iter(errors.values()))[0]
            return Response({"error": str(msg)}, status=status.HTTP_401_UNAUTHORIZED)

        user = serializer.validated_data["user"]
        return Response({"user": UserSerializer(user).data})
