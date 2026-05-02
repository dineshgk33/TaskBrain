# TaskBrain Deployment & Architecture Guide

This document provides a senior-level overview of the TaskBrain system architecture and deployment procedures.

## 1. System Architecture

TaskBrain follows a modern micro-monolith architecture:
- **Frontend**: React.js SPA (Single Page Application) served via Nginx.
- **Backend**: Spring Boot 3.x REST API with JWT-based stateless authentication.
- **Database**: PostgreSQL for persistent storage.
- **AI Integration**: Google Gemini API for intelligent task allocation and design suggestions.

### Data Flow
1. User interacts with React Frontend.
2. Frontend makes authenticated REST calls to Backend via Axios.
3. Backend validates JWT using `JwtAuthenticationFilter`.
4. Business logic interacts with Postgres via JPA/Hibernate.
5. Complex tasks (AI Chat, Recommendations) are proxied to Gemini API with retry logic and timeouts.

---

## 2. Deployment Instructions

### A. Local Development
1. **Backend**:
   - Install Java 22 and Maven.
   - Run `mvn spring-boot:run`.
   - Access at `http://localhost:8080`.
2. **Frontend**:
   - Install Node.js 20.
   - Run `npm install` and `npm run dev`.
   - Access at `http://localhost:5173`.

### B. Docker Deployment (Recommended)
1. Build images:
   ```bash
   docker build -t taskbrain-backend ./backend
   docker build -t taskbrain-frontend ./frontend
   ```
2. Run via Docker Compose:
   ```bash
   docker-compose up -d
   ```

### C. Cloud Deployment (Render/Heroku/Vercel)
1. **Backend (Render Web Service)**:
   - Connect GitHub repository.
   - Build Command: `mvn clean package -DskipTests`.
   - Start Command: `java -jar backend/target/*.jar`.
   - **Environment Variables**:
     - `SPRING_DATASOURCE_URL`: jdbc:postgresql://<host>:<port>/<db>
     - `SPRING_DATASOURCE_USERNAME`: <db_user>
     - `SPRING_DATASOURCE_PASSWORD`: <db_pass>
     - `GEMINI_API_KEY`: <your_api_key>

2. **Frontend (Vercel/Netlify/Render Static)**:
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
   - **Environment Variables**:
     - `VITE_API_BASE_URL`: https://your-backend-url.onrender.com

---

## 3. Environment Variables (Antigravity Context)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API Endpoint | `http://localhost:8080` |
| `SPRING_DATASOURCE_URL` | Postgres Connection String | `jdbc:postgresql://localhost:5432/taskbrain` |
| `JWT_SECRET` | Secret key for token signing | (Random string) |
| `GEMINI_API_KEY` | Google Gemini API Key | (Empty -> Mocks AI) |

---

## 4. Stability & Fault Tolerance
- **Timeouts**: `AIService` is configured with a 30s read timeout to prevent thread exhaustion.
- **Retries**: AI calls include exponential backoff (up to 3 retries) for 503 errors.
- **Graceful Fallback**: If Gemini API is missing or fails, the system returns intelligent mock data to keep the UI functional.
