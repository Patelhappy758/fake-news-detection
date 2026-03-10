from fastapi import FastAPI, HTTPException, Header, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Any
import time
import re
import os
import io
import base64
import uuid
import pickle
import numpy as np

# Source verification
from source_checker import verify_news

# Image processing imports
try:
    from PIL import Image, ImageFilter, ImageEnhance
    import pytesseract
    HAS_OCR = True

    # Configure Tesseract path for Windows
    TESSERACT_PATH = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    if os.path.exists(TESSERACT_PATH):
        pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH
        print(f"  Tesseract found at: {TESSERACT_PATH}")
    else:
        print(f"  WARNING: Tesseract not found at {TESSERACT_PATH}")
        print("  Image OCR will not work until Tesseract is installed.")
        HAS_OCR = False
except ImportError:
    HAS_OCR = False
    print("  WARNING: pytesseract or Pillow not installed. Image OCR disabled.")
    print("  Install with: pip install pytesseract Pillow")

# ---------------- TEXT PREPROCESSING ----------------
def clean_text_for_model(text):
    """
    Clean text using the same preprocessing as the training notebook (Paper 2 approach).
    - Lowercase
    - Remove URLs
    - Remove HTML tags
    - Remove special characters and digits
    - Remove extra spaces
    """
    if not text or not isinstance(text, str):
        return ""
    text = str(text).lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-z\s]', '', text)
    text = ' '.join(text.split())
    return text.strip()


def clean_text_basic(text):
    """Basic text cleanup for OCR output."""
    if not text or not isinstance(text, str):
        return ""
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = ' '.join(text.split())
    return text.strip()

# ---------------- IMAGE PREPROCESSING ----------------
def preprocess_image_for_ocr(image):
    """Preprocess an image to improve OCR accuracy."""
    gray = image.convert('L')
    enhancer = ImageEnhance.Contrast(gray)
    gray = enhancer.enhance(2.0)
    gray = gray.filter(ImageFilter.SHARPEN)
    width, height = gray.size
    if width < 1000:
        scale = 1000 / width
        new_size = (int(width * scale), int(height * scale))
        gray = gray.resize(new_size, Image.LANCZOS)
    return gray

def extract_text_from_image(image):
    """Extract text from a PIL Image using Tesseract OCR."""
    processed = preprocess_image_for_ocr(image)
    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(processed, config=custom_config)
    text = text.strip()
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text

# ---------------- APP INIT ----------------
app = FastAPI(
    title="Fake News Detection API",
    version="4.0"
)

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- LOAD ML MODELS (Logistic Regression, Random Forest, XGBoost) ----------------
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS = {}
VECTORIZER = None

try:
    # Load TF-IDF vectorizer
    vectorizer_path = os.path.join(MODEL_DIR, 'vectorizer.pkl')
    print(f"Loading TF-IDF vectorizer from: {vectorizer_path}")
    with open(vectorizer_path, 'rb') as f:
        VECTORIZER = pickle.load(f)
    print("  ✓ TF-IDF vectorizer loaded")

    # Load trained models
    models_path = os.path.join(MODEL_DIR, 'isot_trained_models.pkl')
    print(f"Loading trained models from: {models_path}")
    with open(models_path, 'rb') as f:
        trained_models = pickle.load(f)

    for name, data in trained_models.items():
        MODELS[name] = {
            'model': data['model'],
            'accuracy': data.get('accuracy', 0),
        }
        print(f"  ✓ {name} loaded (accuracy: {data.get('accuracy', 0)*100:.2f}%)")

    print(f"  ✓ All {len(MODELS)} models loaded successfully")
except Exception as e:
    print(f"  ERROR loading models: {e}")
    MODELS = {}
    VECTORIZER = None

# ---------------- REQUEST SCHEMA ----------------
class NewsRequest(BaseModel):
    text: str

class ImageRequest(BaseModel):
    image: str  # base64-encoded image data

class LoginRequest(BaseModel):
    username: str
    password: str

class SourceRequest(BaseModel):
    text: str

# ---------------- RESPONSE SCHEMA ----------------
class ModelDetail(BaseModel):
    name: str
    result: str
    confidence: float
    accuracy: Optional[float] = None

class NewsResponse(BaseModel):
    result: str
    confidence: float
    explanation: str
    analysis_time: str
    content: Optional[str] = None
    models_detail: Optional[List[ModelDetail]] = None
    sources: Optional[List[Any]] = None
    credibility: Optional[Any] = None
    search_query: Optional[str] = None
    verification_time: Optional[str] = None

class ImageNewsResponse(BaseModel):
    result: str
    confidence: float
    explanation: str
    analysis_time: str
    extracted_text: str
    content: Optional[str] = None
    models_detail: Optional[List[ModelDetail]] = None
    sources: Optional[List[Any]] = None
    credibility: Optional[Any] = None
    search_query: Optional[str] = None
    verification_time: Optional[str] = None

# ---------------- LOGIN API ----------------
@app.post("/login")
def login(user: LoginRequest):
    # Accept any username & password (project demo)
    token = str(uuid.uuid4())
    return {
        "message": "Login successful",
        "username": user.username,
        "token": token
    }

# ---------------- TEXT PREDICTION FUNCTION (3 ML Models) ----------------
def fake_news_predictor(text: str):
    start_time = time.time()

    if not MODELS or VECTORIZER is None:
        raise HTTPException(status_code=503, detail="ML models not loaded. Please check model files and restart.")

    # Clean text using the same preprocessing as training
    cleaned = clean_text_for_model(text)
    if len(cleaned.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text too short after cleaning. Please provide more content.")

    # Transform using TF-IDF vectorizer
    features = VECTORIZER.transform([cleaned])

    # Run prediction on all 3 models
    predictions = []
    models_detail = []

    for name, model_data in MODELS.items():
        model = model_data['model']
        pred = model.predict(features)[0]
        proba = model.predict_proba(features)[0] if hasattr(model, 'predict_proba') else None

        label = "Real" if pred == 1 else "Fake"
        conf = float(proba[pred]) if proba is not None else 0.95

        predictions.append({
            'name': name,
            'result': label,
            'confidence': conf,
            'prediction': int(pred),
            'accuracy': model_data.get('accuracy', 0),
        })

        models_detail.append({
            'name': name,
            'result': label,
            'confidence': conf,
            'accuracy': model_data.get('accuracy', 0),
        })

    # Ensemble: majority vote
    fake_votes = sum(1 for p in predictions if p['result'] == 'Fake')
    real_votes = sum(1 for p in predictions if p['result'] == 'Real')

    if fake_votes > real_votes:
        ensemble_result = 'Fake'
        ensemble_confidence = np.mean([p['confidence'] for p in predictions if p['result'] == 'Fake'])
    else:
        ensemble_result = 'Real'
        ensemble_confidence = np.mean([p['confidence'] for p in predictions if p['result'] == 'Real'])

    # Build detailed explanation
    model_summaries = []
    for p in predictions:
        model_summaries.append(f"{p['name']}: {p['result']} ({round(p['confidence']*100, 1)}%)")

    explanation = (
        f"Ensemble of 3 ML models analyzed the text. "
        f"Result: {ensemble_result.upper()} with {round(ensemble_confidence * 100, 1)}% average confidence. "
        f"Individual models — {'; '.join(model_summaries)}. "
        f"Vote: {real_votes} Real vs {fake_votes} Fake."
    )

    return {
        "result": ensemble_result,
        "confidence": float(ensemble_confidence),
        "explanation": explanation,
        "analysis_time": f"{round(time.time() - start_time, 2)}s",
        "models_detail": models_detail,
    }

# ---------------- IMAGE PREDICTION FUNCTION ----------------
def image_news_predictor(image_data: str):
    start_time = time.time()

    if not HAS_OCR:
        raise HTTPException(
            status_code=503,
            detail="Image OCR is not available. Please install Tesseract OCR and pytesseract."
        )

    try:
        if ',' in image_data:
            image_data = image_data.split(',', 1)[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        print(f"  Image decoded: {image.size} {image.mode}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")

    # Extract text using OCR
    extracted_text = extract_text_from_image(image)
    print(f"  Extracted text ({len(extracted_text)} chars): {extracted_text[:100]}...")

    if len(extracted_text.strip()) < 10:
        return {
            "result": "Error",
            "confidence": 0.0,
            "explanation": "Could not extract sufficient text from the image.",
            "extracted_text": extracted_text if extracted_text.strip() else "(No text detected)",
            "analysis_time": f"{round(time.time() - start_time, 2)}s"
        }

    # Use ML models to predict on extracted text
    prediction = fake_news_predictor(extracted_text)

    return {
        "result": prediction["result"],
        "confidence": prediction["confidence"],
        "explanation": prediction["explanation"],
        "extracted_text": extracted_text,
        "analysis_time": f"{round(time.time() - start_time, 2)}s",
        "models_detail": prediction.get("models_detail", []),
    }

# ---------------- TEXT API ENDPOINT ----------------
@app.post("/predict", response_model=NewsResponse)
def predict_news(
    request: NewsRequest,
    authorization: str = Header(None)
):
    if authorization:
        pass  # Token acknowledged
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input text is empty")

    # Get ML prediction
    prediction = fake_news_predictor(request.text)

    # Add original content for history tracking
    prediction['content'] = request.text[:500]  # Limit to 500 chars for storage

    # Run source verification
    try:
        source_data = verify_news(request.text)
        prediction['sources'] = source_data.get('sources', [])
        prediction['credibility'] = source_data.get('credibility', {})
        prediction['search_query'] = source_data.get('search_query', '')
        prediction['verification_time'] = source_data.get('verification_time', '')
    except Exception as e:
        print(f"Source verification error: {e}")
        prediction['sources'] = []
        prediction['credibility'] = {'verdict': 'error', 'message': 'Source verification temporarily unavailable.'}

    return prediction

# ---------------- IMAGE API ENDPOINT ----------------
@app.post("/predict-image", response_model=ImageNewsResponse)
def predict_image_news(
    request: ImageRequest,
    authorization: str = Header(None)
):
    """
    Accept a base64-encoded image, extract text using OCR,
    and run fake news detection on the extracted text.
    """
    if authorization:
        pass  # Token acknowledged
    if not request.image.strip():
        raise HTTPException(status_code=400, detail="Image data is empty")

    result = image_news_predictor(request.image)

    # Add content for history tracking
    result['content'] = result.get('extracted_text', 'Image analysis')[:500]

    return result

# ---------------- SOURCE VERIFICATION ENDPOINT ----------------
@app.post("/verify-sources")
def verify_sources(
    request: SourceRequest,
    authorization: str = Header(None)
):
    """
    Standalone endpoint: search the web for sources related to the news text.
    """
    if authorization:
        pass
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input text is empty")
    try:
        return verify_news(request.text)
    except Exception as e:
        print(f"Source verification error: {e}")
        raise HTTPException(status_code=500, detail=f"Source verification failed: {str(e)}")

# ---------------- HEALTH CHECK ----------------
@app.get("/")
def home():
    model_names = list(MODELS.keys()) if MODELS else []
    return {
        "status": "Fake News Detection API running successfully",
        "login": "Optional",
        "modes": ["Login User", "Guest User"],
        "models": model_names,
        "model_type": "Ensemble (Logistic Regression + Random Forest + XGBoost)",
        "models_loaded": len(MODELS) > 0,
        "image_ocr": "Available" if HAS_OCR else "Not Available (install Tesseract)",
        "source_verification": "Available"
    }
