# app/api/v1/announcements.py

from flask import Blueprint, request, jsonify, current_app
from app.core.database import db

# Create blueprint
announcements_bp = Blueprint('announcements', __name__, url_prefix='/announcements')

# Mock data (replace with database model later)
announcements = [
    {
        "id": 1,
        "title": "Welcome to the New Semester",
        "content": "We are excited to welcome all students back for the new academic year.",
        "category": "General",
        "is_pinned": True,
        "author_name": "Admin",
        "author_title": "Principal",
        "created_at": "2026-01-15T09:00:00",
        "views": 245
    },
    {
        "id": 2,
        "title": "Mid-Term Examinations Schedule",
        "content": "Mid-term examinations will begin from October 15th. Please refer to the examination timetable.",
        "category": "Academic",
        "is_pinned": False,
        "author_name": "Academic Office",
        "author_title": "Registrar",
        "created_at": "2026-01-14T14:30:00",
        "views": 189
    }
]

@announcements_bp.route('', methods=['GET', 'OPTIONS'])
def get_announcements():
    """Get all announcements"""
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
        return response
    
    try:
        return jsonify(announcements), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@announcements_bp.route('', methods=['POST', 'OPTIONS'])
def create_announcement():
    """Create a new announcement"""
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
        return response
    
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('title') or not data.get('content'):
            return jsonify({'error': 'Title and content are required'}), 400
        
        # Create new announcement
        new_announcement = {
            "id": len(announcements) + 1,
            "title": data.get('title'),
            "content": data.get('content'),
            "category": data.get('category', 'General'),
            "is_pinned": data.get('is_pinned', False),
            "author_name": "Admin",  # Get from auth token
            "author_title": "Administrator",
            "created_at": "2026-01-15T10:00:00",  # Use current time
            "views": 0
        }
        
        # Insert at beginning
        announcements.insert(0, new_announcement)
        
        return jsonify(new_announcement), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@announcements_bp.route('/<int:announcement_id>', methods=['DELETE', 'OPTIONS'])
def delete_announcement(announcement_id):
    """Delete an announcement"""
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
        return response
    
    try:
        global announcements
        announcements = [a for a in announcements if a['id'] != announcement_id]
        return jsonify({'message': 'Announcement deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

__all__ = ['announcements_bp']