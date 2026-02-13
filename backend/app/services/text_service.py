from transformers import pipeline

# Load once (IMPORTANT for performance)
classifier = pipeline(
    "text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

def analyze_text(text: str):
    if not text or not text.strip():
        return {
            "verdict": "Suspicious",
            "confidence": 0,
            "evidence": [
                {
                    "type": "concern",
                    "description": "Empty or invalid text input"
                }
            ]
        }

    # ✅ Pipeline returns a LIST
    result = classifier(text)[0]

    label = result["label"]
    score = result["score"]

    # Normalize verdict
    if label == "POSITIVE" and score > 0.75:
        verdict = "Likely Authentic"
    elif label == "NEGATIVE" and score > 0.75:
        verdict = "Likely Manipulated"
    else:
        verdict = "Suspicious"

    return {
        "verdict": verdict,
        "confidence": round(score * 100),
        "evidence": [
            {
                "type": "support" if verdict == "Likely Authentic" else "concern",
                "description": f"Transformer model classified text as {label} with confidence {round(score * 100)}%"
            }
        ]
    }
