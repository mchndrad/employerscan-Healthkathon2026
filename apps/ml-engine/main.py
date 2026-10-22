"""
EmployerScan ML Engine - FastAPI Service
Serves XGBoost ECRS scoring + SHAP explainability + RapidFuzz matching
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="EmployerScan ML Engine",
    description="AI/ML service for Employer Compliance Risk Scoring",
    version="1.0.0"
)

# CORS for Next.js integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "service": "EmployerScan ML Engine",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
