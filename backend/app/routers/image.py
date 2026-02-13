from fastapi import APIRouter, UploadFile, File
from app.services.image_service import analyze_image_file

router = APIRouter()

@router.post("/image")
async def analyze_image(file: UploadFile = File(...)):
    contents = await file.read()
    result = analyze_image_file(contents)
    result["filename"] = file.filename
    return result
