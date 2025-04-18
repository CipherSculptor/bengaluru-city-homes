# Bengaluru City Homes - Deployment Guide

This guide provides instructions for deploying the Bengaluru City Homes website to various hosting platforms.

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Preparing for Deployment

1. Build the React application:
   ```
   npm run build
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   cd ..
   ```

## Deployment Options

### Option 1: Heroku Deployment

Heroku is a cloud platform that lets you deploy, run, and manage applications. It's a good option for both the frontend and backend.

1. Create a Heroku account at [heroku.com](https://heroku.com)
2. Install the Heroku CLI:
   ```
   npm install -g heroku
   ```

3. Login to Heroku:
   ```
   heroku login
   ```

4. Create a new Heroku app:
   ```
   heroku create bengaluru-city-homes
   ```

5. Deploy to Heroku:
   ```
   git push heroku main
   ```

6. Open your deployed application:
   ```
   heroku open
   ```

### Option 2: Vercel (Frontend) + Railway (Backend)

This option separates the frontend and backend deployments.

#### Frontend Deployment with Vercel

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

3. Deploy the frontend:
   ```
   vercel
   ```

4. Follow the prompts to complete the deployment

#### Backend Deployment with Railway

1. Create a Railway account at [railway.app](https://railway.app)
2. Install Railway CLI:
   ```
   npm install -g @railway/cli
   ```

3. Login to Railway:
   ```
   railway login
   ```

4. Initialize a new project:
   ```
   cd backend
   railway init
   ```

5. Deploy the backend:
   ```
   railway up
   ```

6. Update the API endpoint in the frontend to point to your Railway backend URL

### Option 3: Traditional Web Hosting

If you prefer traditional web hosting:

1. Upload the contents of the `build` folder to your web hosting service
2. Set up the backend on your server:
   ```
   cd backend
   npm install
   npm start
   ```

3. Configure your web server (Apache/Nginx) to:
   - Serve the static files from the `build` directory
   - Proxy API requests to the backend server

## Environment Variables

For production deployment, you may need to set the following environment variables:

- `NODE_ENV=production` - Sets the environment to production
- `PORT=5001` - The port for the backend server (or let the hosting platform set it)

## Post-Deployment

After deployment:

1. Test the application thoroughly
2. Set up proper email credentials for production (replace Ethereal with a real email service)
3. Consider setting up a database for storing bookings instead of Excel files for better scalability

## Troubleshooting

- If you encounter CORS issues, ensure your backend has proper CORS configuration
- If the backend can't write to the bookings directory, check file permissions
- For Heroku deployments, use Heroku's filesystem guidelines as files are ephemeral
