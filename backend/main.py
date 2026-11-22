"""
AgriSense Backend - Vercel Multi-Services Entrypoint
Exposes the FastAPI application instance for Vercel Serverless execution.
"""
import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app

__all__ = ["app"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
