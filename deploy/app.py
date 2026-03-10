from fastapi import FastAPI, HTTPException, Header, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List, Any
import time
import re
import os
import io
import base64
import uuid

# Source verification
from source_checker import verify_news

# Deep Learning model
from transformers import pipeline as hf_pipeline

# Image processing imports
try:
    from PIL import Image, ImageFilter, ImageEnhance
    import pytesseract
    HAS_OCR = True
    # Tesseract is installed via apt in Docker
    print("  Tesseract OCR available")
except ImportError:
    HAS_OCR = False
    print("  WARNING: pytesseract or Pillow not installed. Image OCR disabled.")

# ---------------- TEXT PREPROCESSING (for OCR) ----------------
def clean_text_basic(text):
    if not text or not isinstance(text, str):
        return ""
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = ' '.join(text.split())
    return text.strip()

# ---------------- IMAGE PREPROCESSING ----------------
def preprocess_image_for_ocr(image):
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
    processed = preprocess_image_for_ocr(image)
    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(processed, config=custom_config)
    text = text.strip()
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text

# ---------------- APP INIT ----------------
app = FastAPI(title="REALIX Fake News Detection API", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- LOAD DL MODEL (RoBERTa) ----------------
DL_MODEL_NAME = "hamzab/roberta-fake-news-classification"
try:
    print(f"Loading DL model: {DL_MODEL_NAME} ...")
    classifier = hf_pipeline(
        "text-classification",
        model=DL_MODEL_NAME,
        device=-1,
        truncation=True,
        max_length=512
    )
    print(f"  DL model loaded successfully: {DL_MODEL_NAME}")
except Exception as e:
    print(f"  ERROR loading DL model: {e}")
    classifier = None

# ---------------- SCHEMAS ----------------
class NewsRequest(BaseModel):
    text: str

class ImageRequest(BaseModel):
    image: str

class LoginRequest(BaseModel):
    username: str
    password: str

class SourceRequest(BaseModel):
    text: str

class NewsResponse(BaseModel):
    result: str
    confidence: float
    explanation: str
    analysis_time: str
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
    sources: Optional[List[Any]] = None
    credibility: Optional[Any] = None
    search_query: Optional[str] = None
    verification_time: Optional[str] = None

# ---------------- LOGIN ----------------
@app.post("/login")
def login(user: LoginRequest):
    token = str(uuid.uuid4())
    return {"message": "Login successful", "username": user.username, "token": token}

# ---------------- PREDICTION ----------------
def fake_news_predictor(text: str):
    start_time = time.time()
    if classifier is None:
        raise HTTPException(status_code=503, detail="DL model not loaded.")
    input_text = text[:2000]
    result_list = classifier(input_text)
    prediction = result_list[0]
    label = prediction['label']
    score = prediction['score']

    if label.upper() in ('FAKE', 'LABEL_0'):
        result = 'Fake'
        confidence = score
    else:
        result = 'Real'
        confidence = score

    explanation = (
        f"The RoBERTa deep learning model analyzed the text's context, "
        f"semantics, and linguistic patterns to classify this news as {result.upper()} "
        f"with {round(confidence * 100, 1)}% confidence."
    )
    return {
        "result": result, "confidence": confidence,
        "explanation": explanation, "analysis_time": f"{round(time.time() - start_time, 2)}s"
    }

def image_news_predictor(image_data: str):
    start_time = time.time()
    if not HAS_OCR:
        raise HTTPException(status_code=503, detail="Image OCR not available.")
    try:
        if ',' in image_data:
            image_data = image_data.split(',', 1)[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {str(e)}")
    extracted_text = extract_text_from_image(image)
    if len(extracted_text.strip()) < 10:
        return {
            "result": "Error", "confidence": 0.0,
            "explanation": "Could not extract sufficient text.",
            "extracted_text": extracted_text or "(No text)", "analysis_time": f"{round(time.time() - start_time, 2)}s"
        }
    prediction = fake_news_predictor(extracted_text)
    return {
        "result": prediction["result"], "confidence": prediction["confidence"],
        "explanation": prediction["explanation"], "extracted_text": extracted_text,
        "analysis_time": f"{round(time.time() - start_time, 2)}s"
    }

# ---------------- API ENDPOINTS ----------------
@app.post("/predict", response_model=NewsResponse)
def predict_news(request: NewsRequest, authorization: str = Header(None)):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input text is empty")
    prediction = fake_news_predictor(request.text)
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

@app.post("/predict-image", response_model=ImageNewsResponse)
def predict_image_news(request: ImageRequest, authorization: str = Header(None)):
    if not request.image.strip():
        raise HTTPException(status_code=400, detail="Image data is empty")
    return image_news_predictor(request.image)

@app.post("/verify-sources")
def verify_sources(request: SourceRequest, authorization: str = Header(None)):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input text is empty")
    try:
        return verify_news(request.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Source verification failed: {str(e)}")

# ---------------- SERVE FRONTEND ----------------
# Mount static directories for CSS, JS, images
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "static")

@app.get("/")
def serve_index():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

# Mount static files (css, js, images) AFTER API routes
app.mount("/css", StaticFiles(directory=os.path.join(FRONTEND_DIR, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(FRONTEND_DIR, "js")), name="js")
app.mount("/images", StaticFiles(directory=os.path.join(FRONTEND_DIR, "images")), name="images")
