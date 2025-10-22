# Logistics Frontend

This is the frontend application for the Logistics system, built with React and Vite.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features

- User authentication (Login/Signup)
- Automatic token management
- Protected routes
- Error handling

## API Integration

The frontend communicates with the backend API running at `http://localhost:8080/api`. All API calls are made using an Axios instance that automatically:

- Adds the JWT token to requests
- Handles unauthorized errors
- Manages the base URL configuration

## Testing

You can test the API endpoints using Postman:

1. Login endpoint: `POST http://localhost:8080/api/auth/signin`
   ```json
   {
     "username": "your_username",
     "password": "your_password"
   }
   ```

2. Signup endpoint: `POST http://localhost:8080/api/auth/signup`
   ```json
   {
     "username": "your_username",
     "email": "your_email@example.com",
     "password": "your_password",
     "roles": ["user"]
   }
   ```