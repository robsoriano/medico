from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

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

# Ensure tables are created before the first request
with app.app_context():
    db.create_all()

# --------------------------
# Add CRUD API Endpoints here:
# --------------------------

# Create a new patient
@app.route('/api/patients', methods=['POST'])
def add_patient():
    data = request.get_json()
    if not data or 'name' not in data or 'email' not in data:
        return jsonify({'error': 'Missing required fields: name, email'}), 400
    new_patient = Patient(name=data['name'], email=data['email'])
    db.session.add(new_patient)
    db.session.commit()
    return jsonify({'message': 'Patient added successfully', 'id': new_patient.id}), 201

# Retrieve all patients
@app.route('/api/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    patient_list = [{'id': p.id, 'name': p.name, 'email': p.email} for p in patients]
    return jsonify(patient_list), 200

# Retrieve a specific patient by id
@app.route('/api/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    patient = Patient.query.get(patient_id)
    if patient:
        return jsonify({'id': patient.id, 'name': patient.name, 'email': patient.email}), 200
    return jsonify({'error': 'Patient not found'}), 404

# Update a patient
@app.route('/api/patients/<int:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    data = request.get_json()
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({'error': 'Patient not found'}), 404
    if 'name' in data:
        patient.name = data['name']
    if 'email' in data:
        patient.email = data['email']
    db.session.commit()
    return jsonify({'message': 'Patient updated successfully'}), 200

# Delete a patient
@app.route('/api/patients/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({'error': 'Patient not found'}), 404
    db.session.delete(patient)
    db.session.commit()
    return jsonify({'message': 'Patient deleted successfully'}), 200

# A simple home route (this is separate from the API endpoints)
@app.route('/')
def home():
    return "Hello, Medical CRM MVP with PostgreSQL!"

if __name__ == '__main__':
    app.run(debug=True)
