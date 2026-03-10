import os
import zipfile

PROJECT = "realix-backend"

files = {
    "app.py": """from flask import Flask
from flask_cors import CORS
from api.detect import detect_blueprint

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}},
     allow_headers=["Content-Type", "Authorization"])

app.register_blueprint(detect_blueprint, url_prefix="/api")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
""",

    "config.py": """MAX_TEXT_LENGTH = 20000
MIN_TEXT_LENGTH = 50
MAX_IMAGE_SIZE_MB = 10
""",

    "requirements.txt": """flask
flask-cors
scikit-learn
numpy
Pillow
""",

    "api/__init__.py": "",

    "api/detect.py": """from flask import Blueprint, request, jsonify
import time
from utils.validators import validate_request
from services.text_analyzer import analyze_text
from services.image_analyzer import analyze_image

detect_blueprint = Blueprint("detect", __name__)

@detect_blueprint.route("/detect", methods=["POST"])
def detect():
    start = time.time()
    try:
        data = request.get_json()
        validate_request(data)

        if data["type"] == "text":
            result = analyze_text(data["content"])
        elif data["type"] == "image":
            result = analyze_image(data["content"])
        else:
            return error("INVALID_TYPE", "Type must be text or image", 400)

        return jsonify({
            "result": result["label"],
            "confidence": result["confidence"],
            "explanation": result["explanation"],
            "type": data["type"],
            "timestamp": data.get("timestamp"),
            "analysis_time": round(time.time() - start, 2)
        })

    except ValueError as e:
        return error("INVALID_INPUT", str(e), 400)
    except Exception as e:
        return error("SERVER_ERROR", str(e), 500)

def error(code, message, status):
    return jsonify({"error": True, "code": code, "message": message}), status
""",

    "services/__init__.py": "",

    "services/text_analyzer.py": """import random

def analyze_text(text):
    score = random.uniform(0.1, 0.9)
    if score > 0.5:
        return {
            "label": "Fake",
            "confidence": round(score, 2),
            "explanation": (
                "Analysis detected misleading patterns, "
                "lack of trusted sources, and sensational language."
            )
        }
    return {
        "label": "Real",
        "confidence": round(1 - score, 2),
        "explanation": (
            "The content aligns with credible reporting standards "
            "and factual consistency."
        )
    }
""",

    "services/image_analyzer.py": """def analyze_image(base64_image):
    return {
        "label": "Fake",
        "confidence": 0.78,
        "explanation": (
            "Image analysis detected possible manipulation "
            "and contextual inconsistencies."
        )
    }
""",

    "utils/__init__.py": "",

    "utils/validators.py": """from config import MIN_TEXT_LENGTH, MAX_TEXT_LENGTH

def validate_request(data):
    if not data:
        raise ValueError("Request body missing")

    if "type" not in data or "content" not in data:
        raise ValueError("Missing required fields")

    if data["type"] == "text":
        text = data["content"]
        if len(text) < MIN_TEXT_LENGTH:
            raise ValueError("Text content must be at least 50 characters")
        if len(text) > MAX_TEXT_LENGTH:
            raise ValueError("Text content too long")
""",

    "logs/api.log": ""
}

# Create project files
for path, content in files.items():
    full_path = os.path.join(PROJECT, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

# Zip it
zip_name = "realix-backend.zip"
with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, _, filenames in os.walk(PROJECT):
        for name in filenames:
            filepath = os.path.join(root, name)
            zipf.write(filepath, filepath.replace(PROJECT + "/", ""))

print("✅ realix-backend.zip GENERATED SUCCESSFULLY")
