# Harshit's DevOps Portfolio

A high-fidelity, interactive DevOps portfolio demonstrating infrastructure skills, CI/CD expertise, and cloud engineering projects. Designed to reflect an industry-standard engineering aesthetic.

This project has been migrated from Next.js to a custom Vite/React frontend + Node.js Express backend architecture.

## 🚀 Key Features

- **Live System Telemetry:** Real-time observability dashboard streaming CPU, Memory, and Network metrics via Server-Sent Events (SSE).
- **Interactive CLI Terminal:** A fully functional, web-based terminal interface for navigating directories and running commands.
- **Git-Branch Experience Timeline:** Career and project history visualized as a Git commit tree.
- **Pipeline-Style Skills Visualization:** Dynamic representation of technical proficiencies.
- **3D Interactive Projects:** "IaC X-Ray" 3D-flip interactions for project cards using Three.js and React Three Fiber.
- **Integrated Easter Eggs:** Playable mini-games including a racing game and GitHub Snake.
- **Dark/Light Mode:** Seamless theme toggling for the entire application.

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS V4
- **Animations:** Framer Motion
- **3D Graphics:** Three.js, React Three Fiber (@react-three/fiber, @react-three/drei)
- **Icons:** Lucide React

### Backend
- **Framework:** Node.js, Express
- **Real-time Comms:** Server-Sent Events (SSE) for system telemetry
- **Email Delivery:** Nodemailer (with multer for file uploads)

## 📁 Project Structure

```text
Harshit-Devops-Portfolio/
├── frontend/             # Vite + React Application
│   ├── src/
│   │   ├── components/   # UI Components (Hero, LiveMetrics, CliMode, etc.)
│   │   ├── index.css     # Global Styles
│   │   └── App.tsx       # Main Application Entry
│   └── package.json      # Frontend Dependencies
├── backend/              # Node.js + Express API
│   ├── index.js          # Main Server Logic (SSE Telemetry, Contact Form)
│   └── package.json      # Backend Dependencies
└── amplify.yml           # AWS Amplify Deployment Configuration
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/harshit-devops-portfolio.git
cd harshit-devops-portfolio
```

### 2. Setup the Backend
Navigate to the backend directory, install dependencies, and create an environment file.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 3. Setup the Frontend
Open a new terminal, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the development server:
```bash
npm run dev
# Server will run on http://localhost:5173
```

## 🌐 Deployment
This portfolio is configured for deployment using AWS Amplify (see `amplify.yml`). The backend can be deployed to an EC2 instance, AWS App Runner, or any standard Node.js hosting environment.

---
*Built with ❤️ to showcase the beauty of DevOps.*
