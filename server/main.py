import logging

from flask import Flask
from flask_cors import CORS
from app.core.config import settings
from app.core.database import db, _ensure_user_schema
from app.api.router import api_router
from app.utils.exceptions import error_response
import app.models  # noqa: F401


def create_app():
    app = Flask(__name__)

    # Load configurations
    app.config["SECRET_KEY"] = settings.SECRET_KEY
    app.config["SQLALCHEMY_DATABASE_URI"] = settings.DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Configure CORS for Next.js frontend
    CORS(
        app,
        resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}},
        supports_credentials=True,
    )

    # Initialize Database Extension
    db.init_app(app)

    # Register central API blueprint (/api/v1)
    app.register_blueprint(api_router)

    # Root route check
    @app.route("/")
    def root():
        return {"message": "CampusHub API is running"}

    @app.errorhandler(Exception)
    def handle_general_exception(error):
        logging.exception("Unhandled server error", exc_info=error)
        return error_response("Something went wrong. Please try again.", 500)

    # Automatically create SQLite tables inside context
    with app.app_context():
        db.create_all()
        _ensure_user_schema()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(port=5000, debug=False)