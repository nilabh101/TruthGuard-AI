from fastapi import APIRouter
from pydantic import BaseModel
from app.services.text_service import analyze_text

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/text")
def analyze_text_endpoint(payload: TextRequest):
    return analyze_text(payload.text)
