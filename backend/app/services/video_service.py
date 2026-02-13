from app.utils.video_utils import extract_frames
from app.services.image_service import analyze_image_file

def analyze_video_file(video_bytes: bytes):
    """
    Analyzes video for deepfake indicators using frame-based aggregation.
    """
    frames = extract_frames(video_bytes, frame_rate=1)

    if not frames:
        return {"error": "No frames extracted from video"}

    suspicious_frames = 0
    cnn_scores = []
    forensic_scores = []

    for frame_bytes in frames:
        result = analyze_image_file(frame_bytes)

        cnn_scores.append(result["model_signals"]["cnn_score"])
        forensic_scores.append(result["model_signals"]["forensic_score"])

        if result["ai_generated_probability"] > 0.5:
            suspicious_frames += 1

    avg_cnn = round(sum(cnn_scores) / len(cnn_scores), 2)
    avg_forensic = round(sum(forensic_scores) / len(forensic_scores), 2)
    final_score = round((avg_cnn + avg_forensic) / 2, 2)

    verdict = (
        "Likely Deepfake"
        if final_score > 0.5
        else "Likely Authentic"
    )

    return {
        "verdict": verdict,
        "frames_analyzed": len(frames),
        "suspicious_frames": suspicious_frames,
        "ai_generated_probability": final_score,
        "model_signals": {
            "avg_cnn_score": avg_cnn,
            "avg_forensic_score": avg_forensic
        }
    }
