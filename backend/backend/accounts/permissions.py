from rest_framework.response import Response
from rest_framework.decorators import api_view
from .auth import decode_jwt


def auth_required(view_func):
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization required"}, status=401)

        token = auth_header.split(" ")[1]

        try:
            payload = decode_jwt(token)
            request.user_payload = payload
        except Exception:
            return Response({"error": "Invalid or expired token"}, status=401)

        return view_func(request, *args, **kwargs)
    return wrapper
