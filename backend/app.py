from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from web3 import Web3

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///bug_bounty.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Web3 configuration
w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    wallet_address = db.Column(db.String(42), unique=True, nullable=True)
    user_type = db.Column(db.String(20), nullable=False)  # 'company' or 'hunter'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Bounty(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    reward_amount = db.Column(db.Float, nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='active')  # 'active', 'completed', 'cancelled'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    company = db.relationship('User', backref=db.backref('bounties', lazy=True))
    
    def __repr__(self):
        return f'<Bounty {self.title}>'

class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bounty_id = db.Column(db.Integer, db.ForeignKey('bounty.id'), nullable=False)
    hunter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    proof_of_concept = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'accepted', 'rejected'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    bounty = db.relationship('Bounty', backref=db.backref('submissions', lazy=True))
    hunter = db.relationship('User', backref=db.backref('submissions', lazy=True))
    
    def __repr__(self):
        return f'<Submission {self.title}>'

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Bug Bounty API is running'})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        wallet_address=data.get('wallet_address'),
        user_type=data.get('user_type', 'hunter')
    )
    
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'User created successfully',
        'access_token': access_token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'user_type': user.user_type,
            'wallet_address': user.wallet_address
        }
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type,
                'wallet_address': user.wallet_address
            }
        })
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/bounties', methods=['GET'])
def get_bounties():
    bounties = Bounty.query.filter_by(status='active').all()
    return jsonify([{
        'id': bounty.id,
        'title': bounty.title,
        'description': bounty.description,
        'reward_amount': bounty.reward_amount,
        'company': bounty.company.username,
        'created_at': bounty.created_at.isoformat()
    } for bounty in bounties])

@app.route('/api/bounties', methods=['POST'])
@jwt_required()
def create_bounty():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.user_type != 'company':
        return jsonify({'message': 'Only companies can create bounties'}), 403
    
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('description') or not data.get('reward_amount'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    bounty = Bounty(
        title=data['title'],
        description=data['description'],
        reward_amount=data['reward_amount'],
        company_id=current_user_id
    )
    
    db.session.add(bounty)
    db.session.commit()
    
    return jsonify({
        'message': 'Bounty created successfully',
        'bounty': {
            'id': bounty.id,
            'title': bounty.title,
            'description': bounty.description,
            'reward_amount': bounty.reward_amount,
            'status': bounty.status
        }
    }), 201

@app.route('/api/submissions', methods=['POST'])
@jwt_required()
def create_submission():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.user_type != 'hunter':
        return jsonify({'message': 'Only hunters can submit vulnerabilities'}), 403
    
    data = request.get_json()
    
    if not data or not data.get('bounty_id') or not data.get('title') or not data.get('description'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    submission = Submission(
        bounty_id=data['bounty_id'],
        hunter_id=current_user_id,
        title=data['title'],
        description=data['description'],
        proof_of_concept=data.get('proof_of_concept')
    )
    
    db.session.add(submission)
    db.session.commit()
    
    return jsonify({
        'message': 'Submission created successfully',
        'submission': {
            'id': submission.id,
            'title': submission.title,
            'description': submission.description,
            'status': submission.status,
            'bounty_id': submission.bounty_id
        }
    }), 201

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'user_type': user.user_type,
        'wallet_address': user.wallet_address,
        'created_at': user.created_at.isoformat()
    })

# Initialize database
@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)


