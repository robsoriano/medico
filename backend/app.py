from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import re
from flask_cors import CORS  # Import the extension

app = Flask(__name__)

# Enable CORS for all routes in the app
CORS(app)

# Configure PostgreSQL Database URI (Ensure your password is correct)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:2679@localhost/medical_crm_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable modification tracking for performance

# Initialize the database
db = SQLAlchemy(app)

# Define the Patient model
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<Patient {self.name}>'

# Ensure tables are created
with app.app_context():
    db.create_all()

# Helper function to validate email format using a simple regex
def is_valid_email(email):
    pattern = r'^\S+@\S+\.\S+$'
    return re.match(pattern, email) is not None

# ---------------------------
# CRUD API Endpoints for Patients
# ---------------------------

# Create a new patient
@app.route('/api/patients', methods=['POST'])
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

# Retrieve all patients
@app.route('/api/patients', methods=['GET'])
def get_patients():
    try:
        patients = Patient.query.all()
        patient_list = [{'id': p.id, 'name': p.name, 'email': p.email} for p in patients]
        return jsonify(patient_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Retrieve a specific patient by ID
@app.route('/api/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    try:
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        return jsonify({'id': patient.id, 'name': patient.name, 'email': patient.email}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update a patient
@app.route('/api/patients/<int:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request must be JSON'}), 400
    try:
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        # Validate and update name if provided
        if 'name' in data:
            if not isinstance(data['name'], str) or not data['name'].strip():
                return jsonify({'error': 'Name must be a non-empty string'}), 400
            patient.name = data['name'].strip()
        # Validate and update email if provided
        if 'email' in data:
            if not isinstance(data['email'], str) or not is_valid_email(data['email']):
                return jsonify({'error': 'Invalid email format'}), 400
            patient.email = data['email'].strip()
        db.session.commit()
        return jsonify({'message': 'Patient updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a patient
@app.route('/api/patients/<int:patient_id>', methods=['DELETE'])
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
    return "Hello, Medical CRM MVP with PostgreSQL!"

if __name__ == '__main__':
    app.run(debug=True)
