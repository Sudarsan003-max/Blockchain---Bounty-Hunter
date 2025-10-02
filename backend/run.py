#!/usr/bin/env python3
"""
Bug Bounty Platform Backend Server
Run this script to start the Flask backend server
"""

from app import app, db

if __name__ == '__main__':
    print("🚀 Starting Bug Bounty Platform Backend Server...")
    print("📊 Database: SQLite")
    print("🔗 Web3 Provider: http://localhost:8545")
    print("🌐 Server: http://localhost:5000")
    print("📚 API Documentation: http://localhost:5000/api/health")
    print("-" * 50)
    
    with app.app_context():
        db.create_all()
        print("✅ Database initialized successfully!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)


