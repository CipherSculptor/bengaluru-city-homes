#!/bin/bash

# Build the React app
echo "Building React application..."
npm run build

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Choose deployment option
echo "Choose deployment option:"
echo "1. Deploy to Heroku"
echo "2. Deploy to Vercel (frontend) and Railway (backend)"
echo "3. Manual deployment"
read -p "Enter your choice (1-3): " choice

case $choice in
  1)
    echo "Deploying to Heroku..."
    heroku login
    heroku create bengaluru-city-homes || true
    git add .
    git commit -m "Deployment commit"
    git push heroku main
    heroku open
    ;;
  2)
    echo "Deploying frontend to Vercel..."
    vercel
    
    echo "Deploying backend to Railway..."
    cd backend
    railway login
    railway init
    railway up
    cd ..
    ;;
  3)
    echo "Manual deployment selected."
    echo "1. Copy the 'build' folder to your web server"
    echo "2. Set up the backend on your server"
    echo "3. Configure your web server to serve static files and proxy API requests"
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo "Deployment process completed!"
