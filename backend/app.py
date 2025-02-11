from flask import Flask
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

# ✅ Ensure tables are created before the first request
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return "Hello, Medical CRM MVP with PostgreSQL!"

if __name__ == '__main__':
    app.run(debug=True)