from datetime import datetime

from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Integer, default=800, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    studies = db.relationship(
        "Study", backref="user", cascade="all, delete-orphan", lazy=True
    )
    uploads = db.relationship(
        "BoardUpload", backref="user", cascade="all, delete-orphan", lazy=True
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "rating": self.rating,
        }


class Study(db.Model):
    __tablename__ = "studies"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category = db.Column(db.String(20), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    image_url = db.Column(db.String(300), default="chessicons")
    is_favorite = db.Column(db.Boolean, default=False, nullable=False)
    is_default = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "title": self.title,
            "imageUrl": self.image_url,
            "isFavorite": self.is_favorite,
            "isDefault": self.is_default,
        }


class BoardUpload(db.Model):
    __tablename__ = "board_uploads"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    filename = db.Column(db.String(300), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "description": self.description,
            "url": "/api/uploads/file/" + self.filename,
            "createdAt": self.created_at.isoformat(),
        }
