# Ticket Management System Setup Guide

## Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- Git

## Initial Setup

### 1. Clone the Repository
```bash
# Create project directory
cd ticket-system

# Setup virtual environment
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Backend and Database Setup

```bash
# Ensure you're in the backend directory with activated virtual environment
cd backend

# Install all requirements
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
# Follow the prompts to create admin user
# Please note that these credentials will be used for admin login

# Run the development server
python manage.py runserver
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install required dependencies
npm install

# Install dev dependencies
npm install -D

# Start the development server
npm start
```

## Verification Steps

1. Backend Verification:
   ```bash
   # Access Django admin interface
   open http://localhost:8000/admin
   
   # Access API documentation
   open http://localhost:8000/swagger/
   ```
Additionally, you can also import the `Postman` API collection provided in the repo

2. Frontend Verification:
   ```bash
   # Access React application
   open http://localhost:3000
   ```

## Common Issues and Solutions

### Backend Issues

1. Migration Issues:
   ```bash
   # Reset migrations if needed
   python manage.py migrate --fake tickets zero
   python manage.py makemigrations
   python manage.py migrate
   ```

### Frontend Issues

1. Node Module Issues:
   ```bash
   # Clear npm cache and node_modules
   rm -rf node_modules
   npm cache clean --force
   npm install
   ```

2. Port Already in Use:
   ```bash
   # Kill process using port 3000
   # On Windows:
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   # On macOS/Linux:
   lsof -i :3000
   kill -9 <PID>
   ```

## Additional Notes

- Always activate the virtual environment before working on the backend:
  ```bash
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  ```
- Keep both backend and frontend servers running during development
- Use different terminal windows/tabs for backend and frontend development
- Regularly check the console for errors
- Keep the API documentation open in browser for reference