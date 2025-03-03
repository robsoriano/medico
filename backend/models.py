from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='secretary')  # Default role can be changed

    def set_password(self, password):
        """Hashes the user's password before storing it"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Checks if the entered password matches the stored hash"""
        return check_password_hash(self.password_hash, password)

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False, server_default='')
    last_name = db.Column(db.String(50), nullable=False, server_default='')
    age = db.Column(db.Integer, nullable=True)
    birth_date = db.Column(db.Date, nullable=True)
    home_address = db.Column(db.String(200), nullable=True)
    home_phone = db.Column(db.String(20), nullable=True)
    personal_phone = db.Column(db.String(20), nullable=True)
    occupation = db.Column(db.String(100), nullable=True)
    medical_insurance = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)


    def __repr__(self):
        return f'<Patient {self.first_name} {self.last_name}>'

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    appointment_date = db.Column(db.Date, nullable=False)
    appointment_time = db.Column(db.Time, nullable=False)
    doctor = db.Column(db.String(80), nullable=False)

    patient = db.relationship('Patient', backref=db.backref('appointments', lazy=True))

    def __repr__(self):
        return f'<Appointment {self.id} for patient {self.patient_id}>'

class PatientRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    doctor = db.Column(db.String(80), nullable=False)
    notes = db.Column(db.Text, nullable=False)
    diagnosis = db.Column(db.String(200))
    prescription = db.Column(db.String(200))
    record_date = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<PatientRecord {self.id} for patient {self.patient_id}>'
