from datetime import datetime, timedelta
from functools import wraps

import jwt
from flask import request, jsonify, current_app

from models import User


def generate_token(user):
    payload = {
        "sub": user.id,
        "exp": datetime.utcnow()
        + timedelta(hours=current_app.config["JWT_EXP_HOURS"]),
    }
    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")


def decode_token(token):
    return jwt.decode(
        token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
    )


def login_required(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        parts = header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"error": "Authorization token required"}), 401
        try:
            payload = decode_token(parts[1])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        user = User.query.get(payload.get("sub"))
        if user is None:
            return jsonify({"error": "User not found"}), 401
        request.current_user = user
        return view(*args, **kwargs)

    return wrapper
