from transformers import pipeline
import re
from typing import Dict

# Load model once (deterministic)
classifier = pipeline(
    "text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english",
    top_k=None
)

# -----------------------------
# Signal detectors
# -----------------------------

def emotional_language_signal(text: str) -> float:
    keywords = [
        "shocking", "breaking", "unbelievable", "never",
        "always", "guaranteed", "must see", "devastating"
    ]
    hits = sum(1 for k in keywords if k in text.lower())
    return min(hits / 3, 1.0)


def source_presence_signal(text: str) -> float:
    patterns = [
        "according to", "reported by", "study shows",
        "researchers", "official", "government", "data from"
    ]
    return 1.0 if any(p in text.lower() for p in patterns) else 0.0


def numeric_evidence_signal(text: str) -> float:
    return 1.0 if re.search(r"\d+%|\d+\s?(people|cases|reports)", text.lower()) else 0.0


# -----------------------------
# Main analysis
# -----------------------------

def analyze_text(text: str) -> Dict:
    if not text.strip():
        return {
            "verdict": "suspicious",
            "confidence": 0.0,
            "signals": [],
            "evidence": [],
        }

    # Model sentiment (weak signal)
    model_output = classifier(text)[0]
    model_score = model_output["score"]

    # Signals
    emotional = emotional_language_signal(text)
    source = source_presence_signal(text)
    numeric = numeric_evidence_signal(text)

    signals = [
        {"signal": "emotional_language", "strength": emotional, "impact": "negative"},
        {"signal": "source_presence", "strength": source, "impact": "positive"},
        {"signal": "numeric_evidence", "strength": numeric, "impact": "positive"},
        {"signal": "model_consistency", "strength": model_score, "impact": "neutral"},
    ]

    # Weighted score (deterministic)
    score = (
        (1 - emotional) * 0.35 +
        source * 0.35 +
        numeric * 0.2 +
        model_score * 0.1
    )

    confidence = round(score * 100, 2)

    # Verdict logic
    if confidence >= 75:
        verdict = "authentic"
    elif confidence >= 50:
        verdict = "suspicious"
    else:
        verdict = "manipulated"

    evidence = []

    if emotional > 0.5:
        evidence.append({
            "type": "concern",
            "description": "High emotional or sensational language detected",
            "source": "Linguistic Signal Analyzer"
        })

    if source > 0:
        evidence.append({
            "type": "support",
            "description": "Presence of source attribution or institutional references",
            "source": "Source Detection Engine"
        })

    if numeric > 0:
        evidence.append({
            "type": "support",
            "description": "Numeric or statistical evidence detected",
            "source": "Fact Pattern Extractor"
        })

    return {
        "verdict": verdict,
        "confidence": confidence,
        "signals": signals,
        "evidence": evidence,
    }
