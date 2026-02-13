from fastapi import APIRouter, UploadFile, File
from app.services.video_service import analyze_video_file

router = APIRouter()

@router.post("/video")
async def analyze_video(file: UploadFile = File(...)):
    contents = await file.read()
    result = analyze_video_file(contents)
    result["filename"] = file.filename
    return result
