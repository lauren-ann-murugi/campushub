import datetime
from app.core.database import db

AUDIENCES = ("all", "teachers", "students", "class")


class Announcement(db.Model):
    __tablename__ = "announcements"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    audience = db.Column(db.String(20), default="all", index=True)
    # Only used when audience == "class"
    class_name = db.Column(db.String(50), default="")
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    author = db.relationship("User")

    def visible_to_teachers(self) -> bool:
        return self.audience in ("all", "teachers")

    def visible_to_class(self, class_name: str) -> bool:
        if self.audience in ("all", "students"):
            return True
        return self.audience == "class" and (self.class_name or "") == (class_name or "")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "audience": self.audience or "all",
            "class_name": self.class_name or "",
            "author": self.author.name if self.author else "Administration",
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
