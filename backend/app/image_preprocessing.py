"""Image preprocessing utilities for soil image classification.
Engineered for both local TensorFlow runtimes and serverless Vercel environments.
"""

from pathlib import Path
import numpy as np
from PIL import Image, UnidentifiedImageError


def preprocess_image(image_path: str) -> np.ndarray:
    """Load an image, resize it, normalize it, and return a model-ready array.

    The returned array has shape (1, 224, 224, 3) suitable for EfficientNetB2 inference.
    """
    if not image_path or not str(image_path).strip():
        raise ValueError("image_path must be a non-empty string.")

    image_file = Path(image_path)
    if not image_file.exists():
        raise FileNotFoundError(f"Image file not found: {image_path}")

    try:
        with Image.open(image_file) as image:
            rgb_image = image.convert("RGB")
            resized_image = rgb_image.resize((224, 224), Image.Resampling.BILINEAR)
            image_array = np.array(resized_image, dtype=np.float32)
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError(f"Unable to read image from path: {image_path}") from exc

    if image_array.ndim != 3:
        raise ValueError("The loaded image must have three dimensions: height, width, channels.")

    processed_image = np.expand_dims(image_array, axis=0)
    return processed_image
