import cv2
import numpy as np
from tempfile import NamedTemporaryFile
from typing import Dict, List
from PIL import Image
from transformers import pipeline


# -----------------------------
# Load neural image detector
# -----------------------------
image_detector = pipeline(
    "image-classification",
    model="dima806/deepfake_vs_real_image_detection"
)


# -----------------------------
# Extract frames safely
# -----------------------------
def extract_frames(video_path: str, max_frames: int = 12) -> List[np.ndarray]:
    cap = cv2.VideoCapture(video_path)
    frames = []

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    step = max(total_frames // max_frames, 1)

    idx = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if idx % step == 0 and frame is not None:
            frames.append(frame)

        idx += 1
        if len(frames) >= max_frames:
            break

    cap.release()
    return frames


# -----------------------------
# Video analysis (FINAL)
# -----------------------------
def analyze_video_file(video_bytes: bytes) -> Dict:
    with NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(video_bytes)
        video_path = tmp.name

    frames = extract_frames(video_path)

    if not frames:
        return {
            "verdict": "Error",
            "deepfake_probability": 0.0,
            "evidence": [
                {
                    "type": "concern",
                    "description": "No readable frames extracted from video",
                    "source": "Video Decoder"
                }
            ]
        }

    neural_scores = []

    for frame in frames:
        try:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(rgb)

            preds = image_detector(img)

            score = 0.0
            for p in preds:
                label = p["label"].lower()
                if "fake" in label or "ai" in label:
                    score = p["score"]
                    break

            neural_scores.append(score)

        except Exception:
            # Skip corrupted frames safely
            continue

    if not neural_scores:
        return {
            "verdict": "Error",
            "deepfake_probability": 0.0,
            "evidence": [
                {
                    "type": "concern",
                    "description": "Frame analysis failed",
                    "source": "Neural Detector"
                }
            ]
        }

    avg_score = float(np.mean(neural_scores))
    variance = float(np.var(neural_scores))

    # Temporal inconsistency boosts confidence
    temporal_signal = min(variance * 5, 1.0)

    final_score = round(
        0.7 * avg_score +
        0.3 * temporal_signal,
        2
    )

    if final_score >= 0.75:
        verdict = "Likely Deepfake"
        manipulation = "AI face synthesis / manipulation"
    elif final_score >= 0.45:
        verdict = "Suspicious"
        manipulation = "Possible AI-assisted alteration"
    else:
        verdict = "Likely Authentic"
        manipulation = None

    return {
        "verdict": verdict,
        "deepfake_probability": final_score,
        "manipulation_type": manipulation,
        "model_signals": {
            "average_neural_score": round(avg_score, 2),
            "temporal_variance": round(variance, 3)
        },
        "evidence": [
            {
                "type": "concern" if avg_score > 0.5 else "neutral",
                "description": f"Neural frame average score: {round(avg_score, 2)}",
                "source": "AI Image Detector"
            },
            {
                "type": "concern" if temporal_signal > 0.4 else "neutral",
                "description": f"Temporal inconsistency across frames (variance: {round(variance, 3)})",
                "source": "Temporal Consistency Analyzer"
            }
        ]
    }
