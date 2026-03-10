# REALIX — Feature Walkthrough

## 1. Source Verification Feature (March 2026)

### What Was Added
Real-time web source verification using DuckDuckGo — searches trusted news outlets and fact-checking sites when user submits news text.

### Features
- DuckDuckGo news + text search with 70+ trusted domain classification
- Fact-checker specific search (Snopes, PolitiFact, AltNews, etc.)
- Credibility verdict (Corroborated / Partially-Verified / Low-Coverage / Inconclusive)
- Source cards with clickable links and trust badges
- Conflict detection banner (when AI and sources disagree)

---

## 2. Deep Learning Model Upgrade (March 2026)

### What Changed
Replaced the old sklearn ensemble (Logistic Regression + Random Forest + XGBoost with TF-IDF) with a **pre-trained RoBERTa deep learning model** (`hamzab/roberta-fake-news-classification`) from HuggingFace.

### Why
The old sklearn ensemble was predicting everything as "Fake" because TF-IDF word counting can't understand context. RoBERTa uses deep contextual understanding of text.

### Results
| Input | Old Model | New DL Model | Sources |
|-------|-----------|-------------|---------|
| NASA exoplanet discovery | Fake (88%) ❌ | **Real (100%)** ✅ | Corroborated ✅ |
| Bleach cures diseases | Fake | **Fake (100%)** ✅ | Inconclusive ✅ |
| Pope endorses Trump | Fake | **Fake (99.9%)** ✅ | — |

### Files Changed
- `backend/main.py` — HuggingFace pipeline replaces sklearn ensemble
- `backend/req.txt` — `transformers` + `torch` replace `scikit-learn` + `xgboost`
- `backend/source_checker.py` — Unchanged (still works as before)
- `frontend/.../js/upload-enhanced.js` — Unchanged (still works as before)

### Deleted Files
- `backend/isot_trained_models.pkl` (21MB) — Old sklearn models
- `backend/vectorizer.pkl` (188KB) — Old TF-IDF vectorizer
- `backend/model_files/` directory — Junk browser files
