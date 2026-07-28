# app/api/v1/admin_fees.py

from flask import Blueprint, request, jsonify
from datetime import datetime

# Create blueprint
admin_fees_bp = Blueprint('admin_fees', __name__, url_prefix='/admin/fees')

# Mock admin fees data
admin_fees_data = {
    "admins": [
        { 
            "id": "1", 
            "name": "John Administrator", 
            "role": "Principal",
            "salary": 120000, 
            "paid": 120000, 
            "status": "paid", 
            "dueDate": "2026-07-30" 
        },
        { 
            "id": "2", 
            "name": "Sarah Manager", 
            "role": "Finance Manager",
            "salary": 95000, 
            "paid": 47500, 
            "status": "partial", 
            "dueDate": "2026-07-15" 
        },
        { 
            "id": "3", 
            "name": "Michael Coordinator", 
            "role": "Academic Coordinator",
            "salary": 88000, 
            "paid": 0, 
            "status": "overdue", 
            "dueDate": "2026-06-30" 
        },
        { 
            "id": "4", 
            "name": "Emily Director", 
            "role": "HR Director",
            "salary": 105000, 
            "paid": 105000, 
            "status": "paid", 
            "dueDate": "2026-07-28" 
        },
        { 
            "id": "5", 
            "name": "Robert Officer", 
            "role": "Admissions Officer",
            "salary": 78000, 
            "paid": 39000, 
            "status": "partial", 
            "dueDate": "2026-08-01" 
        },
    ],
    "summary": {
        "totalPayroll": 486000,
        "totalPaid": 311500,
        "totalPending": 174500,
        "totalOverdue": 88000,
        "paymentRate": 64
    },
    "recentTransactions": [
        { 
            "id": "TXN-201", 
            "admin": "John Administrator", 
            "amount": 120000, 
            "date": "2026-07-30", 
            "status": "completed", 
            "method": "Bank Transfer" 
        },
        { 
            "id": "TXN-202", 
            "admin": "Emily Director", 
            "amount": 105000, 
            "date": "2026-07-28", 
            "status": "completed", 
            "method": "Bank Transfer" 
        },
        { 
            "id": "TXN-203", 
            "admin": "Sarah Manager", 
            "amount": 47500, 
            "date": "2026-07-15", 
            "status": "pending", 
            "method": "Cash" 
        },
        { 
            "id": "TXN-204", 
            "admin": "Michael Coordinator", 
            "amount": 88000, 
            "date": "2026-06-30", 
            "status": "failed", 
            "method": "Bank Transfer" 
        },
    ]
}

@admin_fees_bp.route('', methods=['GET', 'OPTIONS'])
def get_admin_fees():
    """Get all admin fees data"""
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        return response
    
    try:
        return jsonify(admin_fees_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_fees_bp.route('', methods=['POST', 'OPTIONS'])
def create_admin_fee():
    """Create a new admin fee record"""
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        return response
    
    try:
        data = request.get_json()
        print("Received data:", data)  # Debug log
        
        # Validate required fields - Match frontend field names
        required_fields = ['adminName', 'salary', 'dueDate']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new fee record with correct field mapping
        new_record = {
            "id": str(len(admin_fees_data['admins']) + 1),
            "name": data.get('adminName'),  # Changed from adminId to adminName
            "role": data.get('role', 'Administrator'),
            "salary": float(data.get('salary')),
            "paid": 0,  # New records start with 0 paid
            "status": data.get('status', 'pending'),
            "dueDate": data.get('dueDate')
        }
        
        admin_fees_data['admins'].append(new_record)
        
        # Update summary
        admin_fees_data['summary']['totalPayroll'] += float(data.get('salary'))
        admin_fees_data['summary']['totalPending'] += float(data.get('salary'))
        admin_fees_data['summary']['paymentRate'] = int(
            (admin_fees_data['summary']['totalPaid'] / admin_fees_data['summary']['totalPayroll']) * 100
        )
        
        # Add to recent transactions
        admin_fees_data['recentTransactions'].insert(0, {
            "id": f"TXN-{len(admin_fees_data['recentTransactions']) + 201}",
            "admin": data.get('adminName'),
            "amount": float(data.get('salary')),
            "date": datetime.now().strftime("%Y-%m-%d"),
            "status": "pending",
            "method": "Pending"
        })
        
        return jsonify(new_record), 201
    except Exception as e:
        print("Error creating admin fee:", str(e))
        return jsonify({'error': str(e)}), 500

@admin_fees_bp.route('/<admin_id>', methods=['DELETE', 'OPTIONS'])
def delete_admin_fee(admin_id):
    """Delete an admin fee record"""
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        return response
    
    try:
        # Find and remove the admin
        admin_to_delete = None
        for admin in admin_fees_data['admins']:
            if admin['id'] == admin_id:
                admin_to_delete = admin
                break
        
        if admin_to_delete:
            admin_fees_data['admins'] = [a for a in admin_fees_data['admins'] if a['id'] != admin_id]
            # Update summary
            admin_fees_data['summary']['totalPayroll'] -= admin_to_delete['salary']
            if admin_to_delete['status'] == 'paid':
                admin_fees_data['summary']['totalPaid'] -= admin_to_delete['salary']
            elif admin_to_delete['status'] == 'pending':
                admin_fees_data['summary']['totalPending'] -= admin_to_delete['salary']
            elif admin_to_delete['status'] == 'overdue':
                admin_fees_data['summary']['totalOverdue'] -= admin_to_delete['salary']
            
            admin_fees_data['summary']['paymentRate'] = int(
                (admin_fees_data['summary']['totalPaid'] / admin_fees_data['summary']['totalPayroll']) * 100 
                if admin_fees_data['summary']['totalPayroll'] > 0 else 0
            )
        
        return jsonify({'message': 'Fee record deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_fees_bp.route('/<admin_id>', methods=['PUT', 'OPTIONS'])
def update_admin_fee(admin_id):
    """Update an admin fee record"""
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        return response
    
    try:
        data = request.get_json()
        
        for admin in admin_fees_data['admins']:
            if admin['id'] == admin_id:
                old_salary = admin['salary']
                old_status = admin['status']
                
                if 'salary' in data:
                    admin['salary'] = float(data['salary'])
                    # Update summary
                    admin_fees_data['summary']['totalPayroll'] += (admin['salary'] - old_salary)
                
                if 'paid' in data:
                    admin['paid'] = float(data['paid'])
                
                if 'status' in data:
                    admin['status'] = data['status']
                    # Update summary based on status change
                    if old_status == 'pending' and data['status'] == 'paid':
                        admin_fees_data['summary']['totalPending'] -= admin['salary']
                        admin_fees_data['summary']['totalPaid'] += admin['salary']
                    elif old_status == 'paid' and data['status'] == 'pending':
                        admin_fees_data['summary']['totalPaid'] -= admin['salary']
                        admin_fees_data['summary']['totalPending'] += admin['salary']
                
                if 'name' in data:
                    admin['name'] = data['name']
                if 'role' in data:
                    admin['role'] = data['role']
                if 'dueDate' in data:
                    admin['dueDate'] = data['dueDate']
                
                # Update payment rate
                admin_fees_data['summary']['paymentRate'] = int(
                    (admin_fees_data['summary']['totalPaid'] / admin_fees_data['summary']['totalPayroll']) * 100 
                    if admin_fees_data['summary']['totalPayroll'] > 0 else 0
                )
                
                return jsonify(admin), 200
        
        return jsonify({'error': 'Admin not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_fees_bp.route('/stats', methods=['GET', 'OPTIONS'])
def get_admin_fees_stats():
    """Get admin fees statistics"""
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response
    
    try:
        return jsonify(admin_fees_data['summary']), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

__all__ = ['admin_fees_bp']