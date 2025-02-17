from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_migrate import Migrate  
import re
from models import db, User  # Import models from models.py
from flask_jwt_extended import create_refresh_token, jwt_required, get_jwt_identity
from datetime import timedelta
from models import db, User, Patient  # Import Patient as well


app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configure Database & JWT
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:2679@localhost/medical_crm_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key_here'  # Change this to a secure value
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)   # Access token valid for 1 hour
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)   # Refresh token valid for 7 days

# Initialize database and JWT
db.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)  # Initialize Flask-Migrate

# Ensure tables are created
with app.app_context():
    db.create_all()

# ---------------------------
# User Authentication Routes
# ---------------------------

# Register a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'secretary')  # Default to 'secretary' if role isn't provided

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# Login user and generate JWT token
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=username)
    refresh_token = create_refresh_token(identity=username)  # Generate refresh token
    return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200

@app.route('/api/refresh', methods=['POST'])
@jwt_required(refresh=True)  # Requires a refresh token
def refresh():
    identity = get_jwt_identity()  # Get the user's identity from the refresh token
    new_access_token = create_access_token(identity=identity)  # Generate a new access token
    return jsonify({"access_token": new_access_token}), 200

# Protected route example
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Hello, {current_user}! This is a protected route."})

# ---------------------------
# CRUD API Endpoints for Patients (Now Protected)
# ---------------------------

# Create a new patient (Requires Authentication)
@app.route('/api/patients', methods=['POST'])
@jwt_required()
def add_patient():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request must be JSON'}), 400
    if 'name' not in data or 'email' not in data:
        return jsonify({'error': 'Missing required fields: name, email'}), 400
    if not isinstance(data['name'], str) or not data['name'].strip():
        return jsonify({'error': 'Name must be a non-empty string'}), 400
    if not isinstance(data['email'], str) or not is_valid_email(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400
    try:
        new_patient = Patient(name=data['name'].strip(), email=data['email'].strip())
        db.session.add(new_patient)
        db.session.commit()
        return jsonify({'message': 'Patient added successfully', 'id': new_patient.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Retrieve all patients (Requires Authentication)
@app.route('/api/patients', methods=['GET'])
@jwt_required()
def get_patients():
    try:
        print("Fetching patients...")
        patients = Patient.query.all()
        patient_list = [{'id': p.id, 'name': p.name, 'email': p.email} for p in patients]
        print("Patients retrieved successfully:", patient_list)
        return jsonify(patient_list), 200
    except Exception as e:
        print("Error in get_patients:", str(e))
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# Retrieve a specific patient by ID (Requires Authentication)
@app.route('/api/patients/<int:patient_id>', methods=['GET'])
@jwt_required()
def get_patient(patient_id):
    try:
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        return jsonify({'id': patient.id, 'name': patient.name, 'email': patient.email}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update a patient (Requires Authentication)
@app.route('/api/patients/<int:patient_id>', methods=['PUT'])
@jwt_required()
def update_patient(patient_id):
    current_user = get_jwt_identity()  # This returns the username as set in the token

    # Retrieve the user and check their role
    user = User.query.filter_by(username=current_user).first()
    if not user or user.role != 'doctor':
        return jsonify({"error": "Permission denied"}), 403

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request must be JSON'}), 400

    try:
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404

        if 'name' in data:
            if not isinstance(data['name'], str) or not data['name'].strip():
                return jsonify({'error': 'Name must be a non-empty string'}), 400
            patient.name = data['name'].strip()
        if 'email' in data:
            if not isinstance(data['email'], str) or not is_valid_email(data['email']):
                return jsonify({'error': 'Invalid email format'}), 400
            patient.email = data['email'].strip()

        db.session.commit()
        return jsonify({'message': 'Patient updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a patient (Requires Authentication)
@app.route('/api/patients/<int:patient_id>', methods=['DELETE'])
@jwt_required()
def delete_patient(patient_id):
    try:
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        db.session.delete(patient)
        db.session.commit()
        return jsonify({'message': 'Patient deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# A simple home route
@app.route('/')
def home():
    return "Hello, Medical CRM MVP with PostgreSQL and Authentication!"

if __name__ == '__main__':
    app.run(debug=True)
