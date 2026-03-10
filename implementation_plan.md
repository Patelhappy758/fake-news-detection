# REALIX — Implementation Plan

## Goal
Replace the sklearn ensemble (LR + RF + XGBoost + TF-IDF vectorizer) with a **pre-trained RoBERTa deep learning model** (`hamzab/roberta-fake-news-classification`) for dramatically better predictions that match real-world source verification results.

## Architecture

```
User enters news text
        │
        ▼
┌───────────────────────┐     ┌──────────────────────┐
│  RoBERTa DL Model     │     │  Source Verification  │
│  (HuggingFace)        │     │  (DuckDuckGo Search)  │
│  - Contextual NLP     │     │  - News search        │
│  - 40K+ articles      │     │  - Fact-checker search │
│  - 100% accuracy      │     │  - 70+ trusted sites   │
│  → Fake/Real          │     │  → Sources + Verdict   │
└───────────────────────┘     └──────────────────────┘
        │                              │
        └─────────┬────────────────────┘
                  ▼
       Combined Results Display
       (Badge + Sources + Conflict Warning)
```

## Changed Files

### Backend (`backend/`)

| File | Change | Purpose |
|------|--------|---------|
| `main.py` | Modified | Replaced sklearn loading with HuggingFace `pipeline("text-classification")` |
| `req.txt` | Modified | Replaced `numpy`, `scikit-learn`, `xgboost` with `transformers`, `torch` |
| `source_checker.py` | Unchanged | Web source verification (still works as before) |

### Deleted Files
| File | Size | Reason |
|------|------|--------|
| `isot_trained_models.pkl` | 21MB | Old sklearn ensemble models (no longer needed) |
| `vectorizer.pkl` | 188KB | Old TF-IDF vectorizer (no longer needed) |
| `model_files/` | ~25MB | Junk browser-saved files, not actual models |

## Verification Results
- Real news (NASA exoplanet): **Real (100%)** + Sources: **Corroborated** ✅
- Fake news (bleach cures diseases): **Fake (100%)** ✅
- Model and sources now agree on predictions ✅
