import cv2
import tempfile
import os

def extract_frames(video_bytes: bytes, frame_rate: int = 1):
    """
    Extract frames from a video at a given rate (frames per second).
    Returns a list of frame images as bytes.
    """
    frames = []

    # Save video temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
        temp_video.write(video_bytes)
        video_path = temp_video.name

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    interval = int(fps // frame_rate) if fps else 1

    frame_count = 0
    success, frame = cap.read()

    while success:
        if frame_count % interval == 0:
            _, buffer = cv2.imencode(".jpg", frame)
            frames.append(buffer.tobytes())

        success, frame = cap.read()
        frame_count += 1

    cap.release()
    os.remove(video_path)

    return frames
