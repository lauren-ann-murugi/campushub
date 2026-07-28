# app/api/v1/student_fees.py

from flask import Blueprint, request, jsonify
from datetime import datetime

# Create blueprint
student_fees_bp = Blueprint('student_fees', __name__, url_prefix='/student/fees')

# Mock student fees data
student_fees_data = {
    "students": [
        { 
            "id": "1", 
            "name": "John Doe", 
            "class": "Grade 10A", 
            "amount": 5000, 
            "paid": 3000, 
            "status": "partial", 
            "dueDate": "2026-08-15" 
        },
        { 
            "id": "2", 
            "name": "Jane Smith", 
            "class": "Grade 12B", 
            "amount": 7500, 
            "paid": 7500, 
            "status": "paid", 
            "dueDate": "2026-07-30" 
        },
        { 
            "id": "3", 
            "name": "Michael Johnson", 
            "class": "Grade 8A", 
            "amount": 4500, 
            "paid": 0, 
            "status": "overdue", 
            "dueDate": "2026-06-30" 
        },
        { 
            "id": "4", 
            "name": "Sarah Williams", 
            "class": "Grade 11A", 
            "amount": 6000, 
            "paid": 3000, 
            "status": "partial", 
            "dueDate": "2026-08-01" 
        },
        { 
            "id": "5", 
            "name": "Robert Brown", 
            "class": "Grade 9B", 
            "amount": 4000, 
            "paid": 4000, 
            "status": "paid", 
            "dueDate": "2026-07-15" 
        },
    ],
    "summary": {
        "totalCollected": 87500,
        "totalPending": 24500,
        "totalOverdue": 4500,
        "collectionRate": 78
    },
    "recentTransactions": [
        { 
            "id": "TXN-001", 
            "student": "Jane Smith", 
            "amount": 7500, 
            "date": "2026-07-28", 
            "status": "completed", 
            "method": "Bank Transfer" 
        },
        { 
            "id": "TXN-002", 
            "student": "Robert Brown", 
            "amount": 4000, 
            "date": "2026-07-27", 
            "status": "completed", 
            "method": "Credit Card" 
        },
        { 
            "id": "TXN-003", 
            "student": "John Doe", 
            "amount": 3000, 
            "date": "2026-07-26", 
            "status": "pending", 
            "method": "Cash" 
        },
        { 
            "id": "TXN-004", 
            "student": "Michael Johnson", 
            "amount": 4500, 
            "date": "2026-07-25", 
            "status": "failed", 
            "method": "Bank Transfer" 
        },
    ]
}

@student_fees_bp.route('', methods=['GET', 'OPTIONS'])
def get_student_fees():
    """Get all student fees data"""
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
        return response
    
    try:
        return jsonify(student_fees_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_fees_bp.route('', methods=['POST', 'OPTIONS'])
def create_student_fee():
    """Create a new student fee record"""
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
        return response
    
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['studentId', 'amount', 'dueDate']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new fee record
        new_record = {
            "id": str(len(student_fees_data['students']) + 1),
            "name": data.get('studentName', f"Student {data.get('studentId')}"),
            "class": data.get('className', 'Grade 10A'),
            "amount": float(data.get('amount')),
            "paid": float(data.get('paid', 0)),
            "status": data.get('status', 'pending'),
            "dueDate": data.get('dueDate')
        }
        
        student_fees_data['students'].append(new_record)
        student_fees_data['summary']['totalPending'] += float(data.get('amount'))
        
        return jsonify(new_record), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_fees_bp.route('/<student_id>', methods=['DELETE', 'OPTIONS'])
def delete_student_fee(student_id):
    """Delete a student fee record"""
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
        return response
    
    try:
        student_fees_data['students'] = [s for s in student_fees_data['students'] if s['id'] != student_id]
        return jsonify({'message': 'Fee record deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_fees_bp.route('/<student_id>', methods=['PUT', 'OPTIONS'])
def update_student_fee(student_id):
    """Update a student fee record"""
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        return response
    
    try:
        data = request.get_json()
        
        for student in student_fees_data['students']:
            if student['id'] == student_id:
                if 'amount' in data:
                    student['amount'] = float(data['amount'])
                if 'paid' in data:
                    student['paid'] = float(data['paid'])
                if 'status' in data:
                    student['status'] = data['status']
                if 'dueDate' in data:
                    student['dueDate'] = data['dueDate']
                if 'name' in data:
                    student['name'] = data['name']
                if 'class' in data:
                    student['class'] = data['class']
                return jsonify(student), 200
        
        return jsonify({'error': 'Student not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

__all__ = ['student_fees_bp']