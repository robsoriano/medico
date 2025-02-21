from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from flask_cors import CORS
from flask_migrate import Migrate  
import re
from datetime import timedelta
from models import db, User, Patient, Appointment  # Make sure Appointment is imported from models

app = Flask(__name__)

# Enable CORS for all routes from http://localhost:3000
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configure Database & JWT
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:2679@localhost/medical_crm_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key_here'  # Change this to a secure value
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)   # Access token valid for 1 hour
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)     # Refresh token valid for 7 days

# Initialize database, JWT, and Flask-Migrate
db.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

# Helper function to validate email format
def is_valid_email(email):
    pattern = r'^\S+@\S+\.\S+$'
    return re.match(pattern, email) is not None

# Ensure tables are created
with app.app_context():
    db.create_all()

# ---------------------------
# User Authentication Routes
# ---------------------------
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

    new_user = User(username=username, role=role)  # Set role during registration
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Include the user's role in the token's additional claims
    additional_claims = {"role": user.role}
    access_token = create_access_token(identity=username, additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity=username)
    return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200

@app.route('/api/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)
    return jsonify({"access_token": new_access_token}), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Hello, {current_user}! This is a protected route."})

# ---------------------------
# CRUD API Endpoints for Patients (Now Protected)
# ---------------------------
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

@app.route('/api/patients/<int:patient_id>', methods=['PUT'])
@jwt_required()
def update_patient(patient_id):
    current_user = get_jwt_identity()
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

# ---------------------------
# CRUD API Endpoints for Appointments (Now Protected)
# ---------------------------
@app.route('/api/appointments', methods=['POST'])
@jwt_required()
def add_appointment():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request must be JSON'}), 400

    patient_id = data.get('patient_id')
    appointment_date = data.get('appointment_date')  # Expect "YYYY-MM-DD"
    appointment_time = data.get('appointment_time')  # Expect "HH:MM:SS"
    doctor = data.get('doctor')

    if not patient_id or not appointment_date or not appointment_time or not doctor:
        return jsonify({'error': 'Missing required fields: patient_id, appointment_date, appointment_time, doctor'}), 400

    try:
        new_appointment = Appointment(
            patient_id=patient_id,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            doctor=doctor
        )
        db.session.add(new_appointment)
        db.session.commit()
        return jsonify({'message': 'Appointment added successfully', 'id': new_appointment.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    try:
        appointments = Appointment.query.all()
        appointment_list = [{
            'id': a.id,
            'patient_id': a.patient_id,
            'appointment_date': a.appointment_date.isoformat(),
            'appointment_time': a.appointment_time.isoformat(),
            'doctor': a.doctor
        } for a in appointments]
        return jsonify(appointment_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments/<int:appointment_id>', methods=['GET'])
@jwt_required()
def get_appointment(appointment_id):
    try:
        appointment = Appointment.query.get(appointment_id)
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404
        return jsonify({
            'id': appointment.id,
            'patient_id': appointment.patient_id,
            'appointment_date': appointment.appointment_date.isoformat(),
            'appointment_time': appointment.appointment_time.isoformat(),
            'doctor': appointment.doctor
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments/<int:appointment_id>', methods=['PUT'])
@jwt_required()
def update_appointment(appointment_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request must be JSON'}), 400
    try:
        appointment = Appointment.query.get(appointment_id)
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404

        if 'patient_id' in data:
            appointment.patient_id = data['patient_id']
        if 'appointment_date' in data:
            appointment.appointment_date = data['appointment_date']
        if 'appointment_time' in data:
            appointment.appointment_time = data['appointment_time']
        if 'doctor' in data:
            appointment.doctor = data['doctor']

        db.session.commit()
        return jsonify({'message': 'Appointment updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments/<int:appointment_id>', methods=['DELETE'])
@jwt_required()
def delete_appointment(appointment_id):
    try:
        appointment = Appointment.query.get(appointment_id)
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404
        db.session.delete(appointment)
        db.session.commit()
        return jsonify({'message': 'Appointment deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# A simple home route
@app.route('/')
def home():
    return "Hello, Medical CRM MVP with PostgreSQL and Authentication!"

if __name__ == '__main__':
    app.run(debug=True)
