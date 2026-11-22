# AgriSense AI — Soil Health Assessment & Crop Recommendation Platform

AgriSense is a production-grade agriculture intelligence system engineered during the Infosys Springboard internship program. The platform combines deep learning convolutional neural networks, gradient-boosted decision trees, and asynchronous queue workers to provide automated soil fertility evaluation, crop suitability rankings, and nutrient deficiency diagnostics.

---

## Architecture & Multi-Services Deployment (Vercel)

This repository is configured to deploy to Vercel as a **multi-service project** (`vercel.json`) with shared routing, unified domain access, and inter-service bindings:

```
AgriSense/
├── vercel.json                 # Vercel Multi-Services configuration & routing
├── backend/                    # Service: agroai-app (FastAPI Python service)
│   ├── app/
│   │   ├── dataset/            # Agricultural datasets and benchmarks
│   │   ├── ml_models/          # EfficientNetB2 & CatBoost serialized weights
│   │   ├── routes/             # Authentication, crop, prediction & soil endpoints
│   │   ├── services/           # ML inference pipelines & business logic
│   │   ├── tasks/              # Celery asynchronous queue tasks
│   │   ├── main.py             # FastAPI router setup (dual root & /api support)
│   │   └── ...
│   ├── main.py                 # Vercel Serverless entrypoint
│   └── requirements.txt        # Python library dependencies
└── frontend/                   # Service: frontend (React 19 + Vite + Tailwind)
    ├── public/                 # Static web assets & icons
    ├── src/
    │   ├── api/                # Axios API client with dynamic routing
    │   ├── components/         # Modular agricultural dashboard widgets
    │   ├── config/env.ts       # Unified environment configuration
    │   └── ...
    ├── index.html
    ├── package.json
    └── vite.config.ts
```

### Services Configuration

| Service Name | Type | Directory | Framework / Runtime | Visibility | Description |
|---|---|---|---|---|---|
| `agroai-app` | Backend API | `backend/` | FastAPI (Python) | Public (`/api/*`, `/docs`, `/openapi.json`) | ML inference, soil analysis, crop recommendation, auth |
| `frontend` | Web UI | `frontend/` | Vite (React 19, TypeScript) | Public (`/*`) | Responsive farmer dashboard, analytics, real-time charts |

### Service Bindings
The `frontend` service defines a binding to `agroai-app`:
```json
"bindings": [
  {
    "type": "service",
    "service": "agroai-app",
    "format": "url",
    "env": "AGROAI_APP_URL"
  }
]
```
Vercel injects the internal URL of `agroai-app` into `AGROAI_APP_URL`, enabling server-side functions and proxies to reach the backend securely without exposing internal endpoints.

---

## Local Development

### 1. Test using Vercel CLI (Services Mode)
```bash
vercel dev
```
`vercel dev` starts all services concurrently and injects the binding variables automatically.

### 2. Run Individually

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Machine Learning Backbones
- **Soil Classification:** EfficientNetB2 convolutional vision backbone for texture & color feature extraction.
- **Crop Recommendation:** CatBoost multi-target gradient-boosted decision trees.
- **Nutrient Profiling:** Algorithmic N-P-K deficiency regression models.

---

## License
MIT License. Developed by Arjunan V. (Infosys Springboard AI/ML Program).
