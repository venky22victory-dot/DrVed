# DrVed - Complete Starter (Frontend + Backend)

This repository contains a deployable frontend (React) and backend (Node/Express) scaffold suitable for Netlify (frontend) + Render/Railway/VPS (backend).

## Quick start (local)

### Backend
```bash
cd backend
cp .env.example .env
# edit .env with real values
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm start
```

### Build & Deploy
- Frontend: build with `npm run build` and deploy to Netlify (set base dir to `frontend`, publish `frontend/build`).
- Backend: host on Render/Railway/Heroku. Provide the backend URL to frontend env var `REACT_APP_API_BASE_URL`.

## Notes
- Do NOT commit `.env` files. Use GitHub secrets for CI and Netlify environment variables.
- Razorpay integration: backend uses `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. Frontend only uses `RAZORPAY_KEY_ID` (public) for checkout.
