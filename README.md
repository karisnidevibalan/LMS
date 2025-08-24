<<<<<<< HEAD
# Learning Management System (LMS)

A full-stack Learning Management System built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (Students and Teachers)
- Course creation and management
- Student enrollment and course browsing
- Role-based dashboards
- AI-powered features with OpenAI integration
- Responsive design with Tailwind CSS

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- OpenAI API Key (for AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd LMS_PROJECT
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables:
   ```bash
   cd ../server
   cp .env.example .env
   ```
   
   Edit the `.env` file and fill in your actual values:
   - `JWT_SECRET`: A strong random string for JWT token signing
   - `MONGO_URI`: Your MongoDB connection string
   - `PORT`: Server port (default: 5000)
   - `OPENAI_API_KEY`: Your OpenAI API key from https://platform.openai.com/

### Running the Application

1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. Start the client (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```   const express = require('express');
   const router = express.Router();
   const authMiddleware = require('../middleware/authMiddleware');
   
   // GET /api/auth/me - Get current authenticated user
   router.get('/me', authMiddleware(['student', 'teacher', 'admin']), (req, res) => {
     // Only return safe user info
     if (!req.user) {
       return res.status(401).json({ error: 'Not authenticated' });
     }
     res.json({
       _id: req.user._id,
       name: req.user.name,
       email: req.user.email,
       role: req.user.role
       // Add other fields as needed
     });
   });
   
   module.exports = router;   const express = require('express');
   // ...other requires...
   const router = express.Router();
   // ...all router.get/post/put/delete calls below this line...

The application will be available at:
- Client: http://localhost:5173
- Server: http://localhost:5000

## Project Structure

```
LMS_PROJECT/
├── client/          # React frontend
├── server/          # Node.js backend
├── ai_bot/          # AI bot functionality
└── README.md
```

## Technologies Used

- **Frontend**: React, React Router, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **AI Integration**: OpenAI API
- **Development**: ESLint, PostCSS
=======
<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# LMS
>>>>>>> 4ce28e3fa43ab6f22872ec249ebb50255b345593
>>>>>>> 707a91c59ba987ba028eb1e4e1677f7e1bc3de02
