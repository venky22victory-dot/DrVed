# DrVed - Starter Repo

This repository is a starter template for the Dr. Ved Sciences project.

## Contents
- `backend/` - Node.js + Express skeleton (Razorpay placeholders)
- `frontend/` - Minimal React skeleton (placeholder images, slots)
- `.github/workflows/node-ci.yml` - CI workflow for Node.js build/test
- `.gitignore` - recommended ignores

## How to use
1. Extract or clone into your workspace.
2. Backend:
   - `cd backend`
   - Copy `.env.example` -> `.env` and fill in values (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, PORT, DATABASE_URL)
   - `npm install`
   - `npm run dev` (uses nodemon)
3. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm start`
4. Push to your GitHub repository:
   - `git remote add origin https://github.com/venky22victory-dot/DrVed.git`
   - `git push -u origin main`

## Notes
- Do NOT commit secrets. Use GitHub Secrets for CI / deployment.
- This is a starter scaffold. Replace placeholder code and assets with real implementations.
