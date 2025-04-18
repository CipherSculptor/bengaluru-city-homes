#!/bin/bash
set -e

echo "Installing dependencies..."
npm ci --legacy-peer-deps

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Building React app..."
npm run build

echo "Build completed successfully!"
