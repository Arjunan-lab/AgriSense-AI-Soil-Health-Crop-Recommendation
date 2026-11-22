# AI-Based Soil Health Assessment System — Portable Frontend Package

This is a self-contained, backend-independent React + Vite + TypeScript application for the AI-Based Soil Health Assessment System.

## Features & Self-Containment

- **Backend Independence**: Communicates with backend endpoints exclusively via a centralized API layer (`VITE_API_BASE_URL`).
- **Portable & Production Ready**: Self-contained with local services, hooks, utilities, types, components, and contexts.
- **Zero Redesign Required**: Works with any compatible backend implementing the API contracts.

## Quick Start

### 1. Installation

```bash
cd Frontend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to target your backend server:

```bash
cp .env.example .env
```

Example `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_SOCKET_URL=ws://localhost:8000/ws
VITE_UPLOAD_URL=http://localhost:8000/uploads
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Canonical Folder Structure

```
src/
├── api/          # Centralized API client & service endpoints
├── assets/       # Icons, SVGs, static media
├── components/   # UI components, layouts, dialogs
├── config/       # Environment & feature configuration
├── constants/    # Navigation & system constants
├── contexts/     # React Context providers (Auth, Language, Theme)
├── data/         # Offline data & mock presets
├── hooks/        # Custom React hooks (useAuth, useUser, usePrediction, etc.)
├── i18n/         # Multi-language translation setup
├── pages/        # Application view pages
├── routes/       # React router & protected routes
├── services/     # Business logic & local storage services
├── store/        # Application store exports
├── styles/       # CSS & theme definitions
├── types/        # TypeScript interfaces, DTOs & API models
├── utils/        # Formatting, JWT & helper utilities
└── validators/   # Form & data validation functions
```
