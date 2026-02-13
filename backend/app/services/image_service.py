import numpy as np
import cv2
from PIL import Image
import io

from app.models.image_model import cnn_fake_probability

# --------------------------------------------------
# IMAGE FORENSIC + CNN ENSEMBLE ANALYSIS
# --------------------------------------------------

def analyze_image_file(file_bytes: bytes) -> dict:
    """
    Performs multi-signal image authenticity analysis:
    1. Classical forensic analysis (texture, color statistics)
    2. CNN-based probabilistic signal (EfficientNet)
    """

    # Load image
    image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = np.array(image)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    # -----------------------------
    # Forensic Signal 1: Texture
    # -----------------------------
    laplacian_variance = cv2.Laplacian(gray, cv2.CV_64F).var()

    # -----------------------------
    # Forensic Signal 2: Color Stats
    # -----------------------------
    r, g, b = cv2.split(img)
    color_std = np.std([np.std(r), np.std(g), np.std(b)])

    forensic_score = 0.0
    artifacts = []

    if laplacian_variance < 80:
        forensic_score += 0.4
        artifacts.append("texture_smoothing")

    if color_std < 15:
        forensic_score += 0.3
        artifacts.append("color_distribution_anomaly")

    forensic_score = min(forensic_score, 1.0)

    # -----------------------------
    # CNN Signal
    # -----------------------------
    cnn_score = cnn_fake_probability(file_bytes)

    # -----------------------------
    # Final Ensemble Score
    # -----------------------------
    combined_score = round(min((forensic_score + cnn_score) / 2, 0.99), 2)

    verdict = (
        "Likely AI-Generated or Manipulated"
        if combined_score > 0.5
        else "Likely Authentic"
    )

    return {
        "verdict": verdict,
        "ai_generated_probability": combined_score,
        "detected_artifacts": artifacts,
        "model_signals": {
            "forensic_score": round(forensic_score, 2),
            "cnn_score": cnn_score
        }
    }
