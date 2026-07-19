import os
import re
import uuid

import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

from config import Config
from extensions import db
from models import User, Study, BoardUpload
from auth import generate_token, login_required
from seed_data import (
    DEFAULT_OPENINGS,
    DEFAULT_MIDDLEGAMES,
    DEFAULT_ENDGAMES,
    DEFAULT_BOARD_DESCRIPTION,
)

FEN_BY_TYPE = {
    "start": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "middle": "r1bq1rk1/1pp1bppp/p1np1n2/4p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7",
    "end": "8/8/8/5kp1/6p1/8/5K2/8 w - - 0 1",
}

VALID_CATEGORIES = ("opening", "middlegame", "endgame")


def seed_studies(user):
    rows = []
    for title in DEFAULT_OPENINGS:
        rows.append(
            Study(user_id=user.id, category="opening", title=title, is_default=True)
        )
    for title in DEFAULT_MIDDLEGAMES:
        rows.append(
            Study(user_id=user.id, category="middlegame", title=title, is_default=True)
        )
    for title in DEFAULT_ENDGAMES:
        rows.append(
            Study(user_id=user.id, category="endgame", title=title, is_default=True)
        )
    db.session.add_all(rows)
    db.session.commit()


def chesscom_url(title):
    formatted = title.lower().replace("'", "").replace(" ", "-")
    formatted = re.sub(r"[^a-z0-9\-]", "", formatted)
    return "https://www.chess.com/openings/" + formatted


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    CORS(app)
    db.init_app(app)

    with app.app_context():
        db.create_all()

    @app.post("/api/auth/signup")
    def signup():
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        username = (data.get("username") or "").strip()
        password = (data.get("password") or "").strip()
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        if not username:
            username = email.split("@")[0]
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "An account with this email already exists"}), 409
        user = User(email=email, username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        seed_studies(user)
        token = generate_token(user)
        return jsonify({"token": token, "user": user.to_dict()}), 201

    @app.post("/api/auth/login")
    def login():
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        password = (data.get("password") or "").strip()
        user = User.query.filter_by(email=email).first()
        if user is None or not user.check_password(password):
            return jsonify({"error": "Login failed: incorrect credentials"}), 401
        token = generate_token(user)
        return jsonify({"token": token, "user": user.to_dict()})

    @app.get("/api/me")
    @login_required
    def me():
        return jsonify({"user": request.current_user.to_dict()})

    @app.get("/api/studies")
    @login_required
    def list_studies():
        category = request.args.get("category")
        query = Study.query.filter_by(user_id=request.current_user.id)
        if category:
            query = query.filter_by(category=category)
        studies = query.order_by(
            Study.is_favorite.desc(), Study.id.asc()
        ).all()
        return jsonify({"studies": [s.to_dict() for s in studies]})

    @app.post("/api/studies")
    @login_required
    def create_study():
        data = request.get_json(silent=True) or {}
        category = (data.get("category") or "").strip()
        title = (data.get("title") or "").strip()
        if category not in VALID_CATEGORIES:
            return jsonify({"error": "Invalid category"}), 400
        if not title:
            return jsonify({"error": "Title is required"}), 400
        study = Study(
            user_id=request.current_user.id, category=category, title=title
        )
        db.session.add(study)
        db.session.commit()
        return jsonify({"study": study.to_dict()}), 201

    @app.patch("/api/studies/<int:study_id>")
    @login_required
    def update_study(study_id):
        study = Study.query.filter_by(
            id=study_id, user_id=request.current_user.id
        ).first()
        if study is None:
            return jsonify({"error": "Study not found"}), 404
        data = request.get_json(silent=True) or {}
        if "isFavorite" in data:
            study.is_favorite = bool(data["isFavorite"])
        if "title" in data and str(data["title"]).strip():
            study.title = str(data["title"]).strip()
        db.session.commit()
        return jsonify({"study": study.to_dict()})

    @app.delete("/api/studies/<int:study_id>")
    @login_required
    def delete_study(study_id):
        study = Study.query.filter_by(
            id=study_id, user_id=request.current_user.id
        ).first()
        if study is None:
            return jsonify({"error": "Study not found"}), 404
        db.session.delete(study)
        db.session.commit()
        return jsonify({"deleted": study_id})

    @app.get("/api/openings/chesscom-url")
    @login_required
    def opening_url():
        title = request.args.get("title", "").strip()
        if not title:
            return jsonify({"error": "Title is required"}), 400
        return jsonify({"title": title, "url": chesscom_url(title)})

    @app.get("/api/book-moves")
    @login_required
    def book_moves():
        game_type = request.args.get("type", "start").lower()
        fen = FEN_BY_TYPE.get(game_type, FEN_BY_TYPE["start"])
        try:
            response = requests.get(
                "https://explorer.lichess.ovh/masters",
                params={"fen": fen},
                timeout=10,
            )
            response.raise_for_status()
        except requests.RequestException as exc:
            return (
                jsonify({"error": "Failed to load book moves", "detail": str(exc)}),
                502,
            )
        payload = response.json()
        moves = []
        for move in payload.get("moves", []):
            white = move.get("white", 0)
            draws = move.get("draws", 0)
            black = move.get("black", 0)
            moves.append(
                {
                    "san": move.get("san", "Unknown move"),
                    "white": white,
                    "draws": draws,
                    "black": black,
                    "total": white + draws + black,
                }
            )
        return jsonify({"type": game_type, "fen": fen, "moves": moves})

    @app.post("/api/uploads")
    @login_required
    def create_upload():
        if "image" not in request.files:
            return jsonify({"error": "An image file is required"}), 400
        file = request.files["image"]
        if file.filename == "":
            return jsonify({"error": "An image file is required"}), 400
        description = (request.form.get("description") or "").strip()
        if not description:
            description = DEFAULT_BOARD_DESCRIPTION
        extension = os.path.splitext(secure_filename(file.filename))[1] or ".png"
        stored_name = uuid.uuid4().hex + extension
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], stored_name))
        upload = BoardUpload(
            user_id=request.current_user.id,
            filename=stored_name,
            description=description,
        )
        db.session.add(upload)
        db.session.commit()
        return jsonify({"upload": upload.to_dict()}), 201

    @app.get("/api/uploads")
    @login_required
    def list_uploads():
        uploads = (
            BoardUpload.query.filter_by(user_id=request.current_user.id)
            .order_by(BoardUpload.id.desc())
            .all()
        )
        return jsonify({"uploads": [u.to_dict() for u in uploads]})

    @app.get("/api/uploads/file/<path:filename>")
    def serve_upload(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
