# NextMoves (Fullstack)

A React + Flask + SQL rebuild of the NextMoves chess study app, originally a Flutter/Dart project. All original features are preserved except text-to-speech.

## Features

- Email / password sign up and login with hashed passwords and JWT sessions
- Home dashboard with player rating and navigation
- Openings, Middle Games, and End Games study grids seeded with default content
- Favorite toggling (favorites float to the top) and adding custom studies
- Chess.com opening links generated from the opening title
- Interactive chessboard visualizer with drag-and-drop moves, undo, reset, and SAN move history
- Master "book moves" lookup by position (opening / middlegame / endgame) via the Lichess masters explorer
- Board image upload with a positioning description, stored per user

## Project structure

```
nextmoves/
  backend/    Flask API + SQL (SQLAlchemy over SQLite)
  frontend/   React app (Vite)
```

## Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

The API runs on http://localhost:5000 and creates `nextmoves.db` automatically. A raw `schema.sql` is included for reference.

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs on http://localhost:5173 and talks to the API defined by `VITE_API_BASE`.

## API overview

| Method | Path | Description |
| --- | --- | --- |
| POST | /api/auth/signup | Create an account and seed default studies |
| POST | /api/auth/login | Authenticate and receive a token |
| GET | /api/me | Current user profile |
| GET | /api/studies?category= | List studies by category |
| POST | /api/studies | Add a custom study |
| PATCH | /api/studies/:id | Toggle favorite or rename |
| DELETE | /api/studies/:id | Remove a study |
| GET | /api/openings/chesscom-url | Build a Chess.com URL from a title |
| GET | /api/book-moves?type= | Master book moves for a position |
| POST | /api/uploads | Upload a board image |
| GET | /api/uploads | List uploaded boards |
