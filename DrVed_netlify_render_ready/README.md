# DrVed - Netlify-ready (frontend) + Render-ready (backend)

This project uses a modern Vite + React frontend (builds to `dist`) and an Express backend (suitable for Render).

## Quick start (local)

### Frontend (Vite + React)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev       # local dev on http://localhost:5173
npm run build     # creates dist/
npm run preview   # preview production build
```

### Backend (Express)
```bash
cd backend
cp .env.example .env
npm install
npm run dev       # uses nodemon, dev on PORT (default 5000)
npm start         # production: node index.js
```

## Deploy

### Netlify (frontend)
- Connect to GitHub repo and set build settings:
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `frontend/dist`
- Add environment variables in Netlify UI if needed (VITE_API_BASE_URL)

### Render (backend)
- Create a new Web Service on Render, connect GitHub, set root to `backend`,
  and set the start command to `npm start`. Add environment variables (RAZORPAY keys).

## Notes
- Do NOT commit `.env` files containing secrets.
- Frontend loads Razorpay checkout script dynamically; backend holds Razorpay secret keys.
