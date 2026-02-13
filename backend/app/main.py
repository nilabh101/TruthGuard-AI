from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import text, image, video

app = FastAPI()

# ✅ CORS FIX (THIS IS THE MISSING PIECE)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(text.router, prefix="/analyze", tags=["Text"])
app.include_router(image.router, prefix="/analyze", tags=["Image"])
app.include_router(video.router, prefix="/analyze", tags=["Video"])
