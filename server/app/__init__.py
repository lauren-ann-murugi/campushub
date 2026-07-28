from flask import Flask
from flask_cors import CORS

from app.core.config import settings
from app.core.database import db
from app.api.router import api_router

def create_app():
    app = Flask(__name__)
    
    app.config["SECRET_KEY"] = settings.SECRET_KEY
    app.config["SQLALCHEMY_DATABASE_URI"] = settings.SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = settings.SQLALCHEMY_TRACK_MODIFICATIONS

    CORS(app)
    db.init_app(app)

    # Register Central API Router
    app.register_blueprint(api_router)

    # Automatically create SQLite DB tables on launch
    with app.app_context():
        db.create_all()

    return app