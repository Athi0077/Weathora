# WeatherPlan

**Plan smarter with the weather.**

WeatherPlan is an AI Weather Trip & Work Planner. This repository contains **Part 1** of the application, focusing on the foundation and authentication infrastructure.

## Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB
- **Authentication:** JWT + bcrypt
- **Future APIs:** OpenWeather + OpenRouter

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas URI)

### Backend

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Update the `MONGO_URI` in the `.env` file with your MongoDB connection string.
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Next Steps (Part 2-5)
- **Part 2:** OpenWeather integration for real-time data.
- **Part 3:** AI integration (OpenRouter) for smart recommendations.
- **Part 4:** Trip & Activity planning dashboard logic.
- **Part 5:** Notifications, advanced analytics, and refinement.
