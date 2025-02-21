from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

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
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

def __repr__(self):
        return f'<Patient {self.name}>'

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    appointment_date = db.Column(db.Date, nullable=False)
    appointment_time = db.Column(db.Time, nullable=False)
    doctor = db.Column(db.String(80), nullable=False)

    patient = db.relationship('Patient', backref=db.backref('appointments', lazy=True))

def __repr__(self):
        return f'<Appointment {self.id} for patient {self.patient_id}>'