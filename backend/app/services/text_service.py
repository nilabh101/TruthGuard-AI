from transformers import pipeline
from app.services.rag_service import retrieve_evidence

classifier = pipeline(
    "text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

def analyze_text(text: str):
    result = classifier(text)[0]
    evidence = retrieve_evidence(text)

    verdict = (
        "Potentially Misleading"
        if result["label"] == "NEGATIVE"
        else "Likely Legitimate"
    )

    return {
        "verdict": verdict,
        "confidence": round(result["score"], 3),
        "evidence": evidence
    }
