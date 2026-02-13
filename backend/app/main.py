from fastapi import FastAPI
from app.routers import text, image, video

app = FastAPI(
    title="TruthGuard AI Backend",
    description="AI-powered misinformation & deepfake detection API",
    version="1.0.0"
)

app.include_router(text.router, prefix="/analyze", tags=["Text"])
app.include_router(image.router, prefix="/analyze", tags=["Image"])
app.include_router(video.router, prefix="/analyze", tags=["Video"])
