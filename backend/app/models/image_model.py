import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
import io

# --------------------------------------------------
# CNN MODEL LOADER (Inference-only, Pretrained)
# --------------------------------------------------

# Load EfficientNet once at startup
_model = models.efficientnet_b0(weights="IMAGENET1K_V1")
_model.eval()

_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def cnn_fake_probability(image_bytes: bytes) -> float:
    """
    Returns a probabilistic signal indicating potential AI generation.
    NOTE: This is NOT a binary fake detector.
    It contributes a confidence signal to the ensemble.
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = _transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = _model(tensor)
        confidence = torch.softmax(outputs, dim=1).max().item()

    # Lower confidence in natural class → higher suspicion
    suspicion_score = 1.0 - confidence

    return round(suspicion_score, 2)
