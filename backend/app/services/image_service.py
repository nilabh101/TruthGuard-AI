from PIL import Image
import numpy as np
from typing import Dict
from io import BytesIO

import torch
from transformers import pipeline

# -----------------------------
# Load neural AI-image detector
# -----------------------------

device = 0 if torch.cuda.is_available() else -1

image_classifier = pipeline(
    "image-classification",
    model="dima806/deepfake_vs_real_image_detection",
    device=device
)

# -----------------------------
# Forensic signals
# -----------------------------

def color_distribution_signal(img: Image.Image) -> float:
    arr = np.array(img)
    std = np.std(arr)
    return min(std / 50, 1.0)


def edge_consistency_signal(img: Image.Image) -> float:
    gray = np.array(img.convert("L"))
    edges = np.abs(np.diff(gray, axis=0)).mean()
    return min(edges / 20, 1.0)


def resolution_pattern_signal(img: Image.Image) -> float:
    w, h = img.size
    return 1.0 if (w % 64 == 0 and h % 64 == 0) else 0.0


# -----------------------------
# Main analysis (BYTES IN)
# -----------------------------

def analyze_image_file(image_bytes: bytes) -> Dict:
    try:
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
    except Exception:
        return {
            "verdict": "Error",
            "ai_generated_probability": 0.0,
            "signals": [],
            "evidence": [
                {
                    "type": "concern",
                    "description": "Invalid or corrupted image file",
                    "source": "Image Loader"
                }
            ]
        }

    # -----------------------------
    # Neural signal (PRIMARY)
    # -----------------------------

    neural_result = image_classifier(img)
    neural_score = 0.0
    neural_label = "unknown"

    for r in neural_result:
        if "fake" in r["label"].lower() or "ai" in r["label"].lower():
            neural_score = r["score"]
            neural_label = r["label"]
            break

    # -----------------------------
    # Forensic signals
    # -----------------------------

    color_signal = color_distribution_signal(img)
    edge_signal = edge_consistency_signal(img)
    resolution_signal = resolution_pattern_signal(img)

    forensic_score = (
        color_signal * 0.4 +
        edge_signal * 0.4 +
        resolution_signal * 0.2
    )

    # -----------------------------
    # Final fusion score
    # -----------------------------

    final_ai_probability = round(
        0.55 * neural_score +
        0.45 * forensic_score,
        2
    )

    # -----------------------------
    # Verdict
    # -----------------------------

    if final_ai_probability >= 0.75:
        verdict = "Likely AI-Generated or Manipulated"
    elif final_ai_probability >= 0.45:
        verdict = "Suspicious"
    else:
        verdict = "Likely Authentic"

    # -----------------------------
    # Evidence
    # -----------------------------

    evidence = []

    evidence.append({
        "type": "concern" if neural_score > 0.5 else "neutral",
        "description": f"Neural classifier prediction: {neural_label}",
        "source": "AI Image Classifier"
    })

    if color_signal > 0.6:
        evidence.append({
            "type": "concern",
            "description": "Abnormal color variance detected",
            "source": "Forensic Analyzer"
        })

    if edge_signal > 0.6:
        evidence.append({
            "type": "concern",
            "description": "Edge patterns inconsistent with camera optics",
            "source": "Edge Consistency Analyzer"
        })

    if resolution_signal:
        evidence.append({
            "type": "concern",
            "description": "Resolution matches common AI generation grids",
            "source": "Resolution Pattern Detector"
        })

    return {
        "verdict": verdict,
        "ai_generated_probability": final_ai_probability,
        "model_signals": {
            "neural_score": round(neural_score, 2),
            "forensic_score": round(forensic_score, 2)
        },
        "signals": [
            {"signal": "neural_classifier", "strength": neural_score},
            {"signal": "color_distribution", "strength": color_signal},
            {"signal": "edge_consistency", "strength": edge_signal},
            {"signal": "resolution_pattern", "strength": resolution_signal},
        ],
        "evidence": evidence,
    }
