/**
 * Upload Handler JavaScript File
 * Handles file uploads, text submissions, and API communication
 */

// Configuration
const CONFIG = {
    // API endpoints
    apiEndpoint: 'http://127.0.0.1:8000/predict',
    imageApiEndpoint: 'http://127.0.0.1:8000/predict-image',

    // File upload constraints
    maxFileSize: 5, // MB
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],

    // Text constraints
    maxTextLength: 10000,
    minTextLength: 50
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initUploadForms();
    initToggleButtons();
    initTextCounter();
    initFileUpload();
});

/**
 * Initialize upload form handlers
 */
function initUploadForms() {
    const textForm = document.getElementById('textForm');
    const imageForm = document.getElementById('imageForm');

    // Handle text form submission
    if (textForm) {
        textForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const textContent = document.getElementById('textContent').value.trim();

            // Validate text input
            if (!validateTextInput(textContent)) return;

            // Submit to API
            await submitToAPI('text', textContent);
        });
    }

    // Handle image form submission
    if (imageForm) {
        imageForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const fileInput = document.getElementById('imageFile');
            const file = fileInput.files[0];

            if (!file) {
                window.appUtils.showNotification('Please select an image file', 'error');
                return;
            }

            if (!validateImageFile(file)) return;

            try {
                const base64Data = await window.appUtils.fileToBase64(file);
                await submitToAPI('image', base64Data);
            } catch (error) {
                console.error('Error converting file:', error);
                window.appUtils.showNotification('Failed to process image file', 'error');
            }
        });
    }
}

/**
 * Initialize toggle buttons for switching between text and image modes
 */
function initToggleButtons() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const textForm = document.getElementById('textForm');
    const imageForm = document.getElementById('imageForm');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const mode = this.getAttribute('data-mode');

            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            if (mode === 'text') {
                textForm.classList.add('active');
                imageForm.classList.remove('active');
            } else {
                textForm.classList.remove('active');
                imageForm.classList.add('active');
            }

            clearResults();
        });
    });
}

/**
 * Initialize character counter for text input
 */
function initTextCounter() {
    const textContent = document.getElementById('textContent');
    const charCount = document.getElementById('charCount');

    if (textContent && charCount) {
        textContent.addEventListener('input', function () {
            const count = this.value.length;
            charCount.textContent = count;
            charCount.style.color = count > CONFIG.maxTextLength
                ? '#ef4444'
                : count >= CONFIG.minTextLength
                    ? '#10b981'
                    : '#94a3b8';
        });
    }
}

/**
 * Initialize file upload drag and drop functionality
 */
function initFileUpload() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('imageFile');
    const imagePreview = document.getElementById('imagePreview');

    if (!fileUploadArea || !fileInput) return;

    fileUploadArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) handleFileSelect(file);
    });

    fileUploadArea.addEventListener('dragover', e => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#3b82f6';
        fileUploadArea.style.background = '#f1f5f9';
    });

    fileUploadArea.addEventListener('dragleave', e => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#e2e8f0';
        fileUploadArea.style.background = '';
    });

    fileUploadArea.addEventListener('drop', e => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#e2e8f0';
        fileUploadArea.style.background = '';

        const file = e.dataTransfer.files[0];
        if (file) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            handleFileSelect(file);
        }
    });

    function handleFileSelect(file) {
        if (!validateImageFile(file)) {
            fileInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <p style="margin-top: 0.5rem; color: #64748b; font-size: 0.875rem;">
                    ${file.name} (${window.appUtils.formatFileSize(file.size)})
                </p>
            `;
            imagePreview.classList.add('active');
        };
        reader.readAsDataURL(file);

        window.appUtils.showNotification('Image loaded successfully', 'success');
    }
}

/**
 * Validate text input
 */
function validateTextInput(text) {
    if (text.length < CONFIG.minTextLength) {
        window.appUtils.showNotification(`Text must be at least ${CONFIG.minTextLength} characters`, 'error');
        return false;
    }
    if (text.length > CONFIG.maxTextLength) {
        window.appUtils.showNotification(`Text must not exceed ${CONFIG.maxTextLength} characters`, 'error');
        return false;
    }
    return true;
}

/**
 * Validate image file
 */
function validateImageFile(file) {
    if (!window.appUtils.validateFileType(file, CONFIG.allowedImageTypes)) {
        window.appUtils.showNotification('Invalid file type. Please upload JPG, PNG, or GIF images only', 'error');
        return false;
    }
    if (!window.appUtils.validateFileSize(file, CONFIG.maxFileSize)) {
        window.appUtils.showNotification(`File size must not exceed ${CONFIG.maxFileSize}MB`, 'error');
        return false;
    }
    return true;
}

/**
 * Submit content to API for analysis
 */
async function submitToAPI(type, content) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    try {
        loadingOverlay.classList.add('active');

        let endpoint;
        let requestData;

        if (type === 'text') {
            endpoint = CONFIG.apiEndpoint;
            requestData = { text: content };
        } else {
            // Image mode: send to /predict-image endpoint
            endpoint = CONFIG.imageApiEndpoint;
            requestData = { image: content };
        }

        console.log(`Submitting to ${endpoint}:`, type === 'text' ? requestData : '{image: [base64 data]}');

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API returned status ${response.status}`);
        }

        const result = await response.json();

        // Attach original content for history tracking (fallback if backend didn't include it)
        if (!result.content) {
            if (type === 'text') {
                result.content = content.substring(0, 500);
            } else {
                result.content = result.extracted_text || 'Image analysis';
            }
        }

        displayResults(result, type);
        window.appUtils.showNotification('Analysis completed successfully', 'success');
    } catch (error) {
        console.error('API Error:', error);
        window.appUtils.showNotification(
            error.message.includes('fetch')
                ? 'Cannot connect to API server. Is the backend running?'
                : error.message,
            'error'
        );
    } finally {
        loadingOverlay.classList.remove('active');
    }
}

/**
 * Build the source verification HTML section
 */
function buildSourceVerificationHTML(data) {
    if (!data.sources && !data.credibility) return '';

    const sources = data.sources || [];
    const credibility = data.credibility || {};

    // Credibility verdict colors
    const verdictStyles = {
        'corroborated': { bg: '#059669', icon: 'fa-check-double', label: 'Corroborated' },
        'fact-checked': { bg: '#7c3aed', icon: 'fa-search', label: 'Fact-Checked' },
        'partially-verified': { bg: '#d97706', icon: 'fa-exclamation-circle', label: 'Partially Verified' },
        'low-coverage': { bg: '#dc2626', icon: 'fa-question-circle', label: 'Low Coverage' },
        'inconclusive': { bg: '#6b7280', icon: 'fa-minus-circle', label: 'Inconclusive' },
        'error': { bg: '#6b7280', icon: 'fa-times-circle', label: 'Unavailable' },
    };

    const style = verdictStyles[credibility.verdict] || verdictStyles['inconclusive'];

    // Build credibility banner
    let html = `
        <div class="source-verification-section" style="margin-top: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <i class="fas fa-globe" style="color: var(--accent-primary); font-size: 1.1rem;"></i>
                <h4 style="margin: 0; font-size: 1.05rem; color: var(--text-primary);">Source Verification</h4>
                ${data.verification_time ? `<span style="margin-left: auto; font-size: 0.75rem; color: var(--text-tertiary);">⏱ ${data.verification_time}</span>` : ''}
            </div>

            <div class="credibility-banner" style="
                padding: 1rem 1.25rem;
                border-radius: 0.75rem;
                background: ${style.bg}15;
                border-left: 4px solid ${style.bg};
                margin-bottom: 1rem;
            ">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem;">
                    <span style="
                        display: inline-flex; align-items: center; gap: 0.4rem;
                        padding: 0.25rem 0.75rem; border-radius: 2rem;
                        background: ${style.bg}; color: #fff; font-size: 0.8rem; font-weight: 600;
                    ">
                        <i class="fas ${style.icon}"></i> ${style.label}
                    </span>
                    <span style="font-size: 0.8rem; color: var(--text-tertiary);">
                        ${credibility.trusted_count || 0} trusted · ${credibility.fact_check_count || 0} fact-checkers · ${credibility.total_sources || 0} total
                    </span>
                </div>
                <p style="margin: 0; font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5;">
                    ${credibility.message || ''}
                </p>
            </div>
    `;

    // Build source cards
    if (sources.length > 0) {
        html += `<div class="source-cards" style="
            max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.6rem;
            padding-right: 0.25rem;
        ">`;

        for (const s of sources) {
            const typeColors = {
                'trusted': { bg: '#059669', label: '✓ Trusted Source' },
                'fact-checker': { bg: '#7c3aed', label: '🔍 Fact Checker' },
                'general': { bg: '#6b7280', label: 'General' },
            };
            const t = typeColors[s.source_type] || typeColors['general'];

            html += `
                <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="source-card-link" style="
                    display: block; text-decoration: none; color: inherit;
                    padding: 0.85rem 1rem; border-radius: 0.6rem;
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color, #e2e8f0);
                    transition: all 0.2s ease;
                " onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'"
                   onmouseout="this.style.transform='none';this.style.boxShadow='none'">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                        <span style="
                            display: inline-block; padding: 0.15rem 0.5rem; border-radius: 1rem;
                            background: ${t.bg}20; color: ${t.bg}; font-size: 0.7rem; font-weight: 600;
                        ">${t.label}</span>
                        <span style="font-size: 0.7rem; color: var(--text-tertiary); margin-left: auto;">
                            ${s.source_name || s.domain}
                        </span>
                    </div>
                    <div style="font-size: 0.875rem; font-weight: 600; color: var(--text-primary); line-height: 1.4; margin-bottom: 0.3rem;">
                        ${s.title || 'Untitled'}
                    </div>
                    <div style="font-size: 0.78rem; color: var(--text-tertiary); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${s.snippet || ''}
                    </div>
                    <div style="margin-top: 0.35rem; font-size: 0.7rem; color: var(--accent-primary);">
                        <i class="fas fa-external-link-alt"></i> Read full article
                    </div>
                </a>
            `;
        }

        html += `</div>`;
    } else {
        html += `
            <div style="padding: 1rem; text-align: center; color: var(--text-tertiary); font-size: 0.875rem;">
                <i class="fas fa-search" style="font-size: 1.5rem; opacity: 0.4; display: block; margin-bottom: 0.5rem;"></i>
                No related articles found in web search.
            </div>
        `;
    }

    html += `</div>`;
    return html;
}

/**
 * Display analysis results
 */
function displayResults(data, type) {
    const resultsContent = document.getElementById('resultsContent');

    // Handle error results from image OCR
    if (data.result === 'Error') {
        resultsContent.innerHTML = `
            <div class="result-badge" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                <i class="fas fa-exclamation-circle"></i>
                OCR ERROR
            </div>
            <div class="result-explanation">
                <h4><i class="fas fa-info-circle"></i> What Happened</h4>
                <p>${data.explanation}</p>
            </div>
            ${data.extracted_text ? `
            <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-tertiary); border-radius: 0.75rem;">
                <h4 style="margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                    <i class="fas fa-font"></i> Extracted Text
                </h4>
                <p style="font-size: 0.875rem; color: var(--text-tertiary); font-style: italic;">
                    ${data.extracted_text}
                </p>
            </div>` : ''}
        `;
        return;
    }

    const isFake = data.result.toLowerCase() === 'fake';
    const confidence = Math.round(data.confidence * 100);

    // Build extracted text section for image results
    let extractedTextHTML = '';
    if (data.extracted_text) {
        extractedTextHTML = `
            <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-tertiary); border-radius: 0.75rem; border-left: 4px solid var(--accent-primary);">
                <h4 style="margin-bottom: 0.5rem; font-size: 0.95rem; color: var(--text-primary);">
                    <i class="fas fa-font"></i> Extracted Text from Image
                </h4>
                <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; max-height: 200px; overflow-y: auto;">
                    ${data.extracted_text}
                </p>
            </div>
        `;
    }

    // Build source verification section
    const sourceVerificationHTML = buildSourceVerificationHTML(data);

    // Build per-model breakdown if available
    let modelsDetailHTML = '';
    if (data.models_detail && data.models_detail.length > 0) {
        modelsDetailHTML = `
            <div style="margin-top: 1.25rem; padding: 1rem; background: var(--bg-tertiary); border-radius: 0.75rem;">
                <h4 style="margin: 0 0 0.75rem 0; font-size: 0.95rem; color: var(--text-primary);">
                    <i class="fas fa-cubes"></i> Individual Model Predictions
                </h4>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${data.models_detail.map(m => {
            const mIsFake = m.result.toLowerCase() === 'fake';
            const mConf = Math.round(m.confidence * 100);
            const mAcc = m.accuracy ? Math.round(m.accuracy * 100) : null;
            const mColor = mIsFake ? '#ef4444' : '#10b981';
            const mIcon = mIsFake ? 'fa-exclamation-triangle' : 'fa-check-circle';
            return `
                            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 0.5rem; background: ${mColor}10; border-left: 3px solid ${mColor};">
                                <i class="fas ${mIcon}" style="color: ${mColor}; font-size: 1rem;"></i>
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary);">${m.name}</div>
                                    ${mAcc ? `<div style="font-size: 0.7rem; color: var(--text-tertiary);">Training accuracy: ${mAcc}%</div>` : ''}
                                </div>
                                <div style="text-align: right;">
                                    <span style="font-weight: 700; color: ${mColor}; font-size: 0.9rem;">${m.result}</span>
                                    <div style="font-size: 0.75rem; color: var(--text-tertiary);">${mConf}% confident</div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    }

    // Detect conflict between ML model and source verification
    let conflictHTML = '';
    const cred = data.credibility || {};
    const verdict = cred.verdict || '';
    const trustedCount = cred.trusted_count || 0;

    if (isFake && (verdict === 'corroborated' || (verdict === 'partially-verified' && trustedCount >= 1))) {
        conflictHTML = `
            <div style="
                margin-top: 1.25rem; padding: 1rem 1.25rem; border-radius: 0.75rem;
                background: linear-gradient(135deg, #fef3c720, #fbbf2420);
                border: 1px solid #fbbf24; border-left: 4px solid #f59e0b;
            ">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                    <i class="fas fa-exclamation-triangle" style="color: #f59e0b; font-size: 1.1rem;"></i>
                    <strong style="color: #b45309; font-size: 0.9rem;">Conflicting Signals</strong>
                </div>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                    The AI models flagged this as <strong>Fake</strong>, but <strong>${trustedCount} trusted news source(s)</strong> are reporting similar content.
                    The web sources suggest this news is likely <strong>legitimate</strong>. We recommend checking the source links below.
                </p>
            </div>
        `;
    } else if (!isFake && (verdict === 'low-coverage' || verdict === 'inconclusive')) {
        conflictHTML = `
            <div style="
                margin-top: 1.25rem; padding: 1rem 1.25rem; border-radius: 0.75rem;
                background: linear-gradient(135deg, #fef3c720, #fbbf2420);
                border: 1px solid #fbbf24; border-left: 4px solid #f59e0b;
            ">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                    <i class="fas fa-exclamation-triangle" style="color: #f59e0b; font-size: 1.1rem;"></i>
                    <strong style="color: #b45309; font-size: 0.9rem;">Caution Advised</strong>
                </div>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                    The AI models classified this as <strong>Real</strong>, but very few web sources were found covering this story.
                    Limited online coverage may indicate this news hasn't been widely verified yet.
                </p>
            </div>
        `;
    }

    resultsContent.innerHTML = `
        <div class="result-badge ${isFake ? 'fake' : 'real'}">
            <i class="fas fa-${isFake ? 'exclamation-triangle' : 'check-circle'}"></i>
            ${data.result.toUpperCase()}
        </div>
        <div class="confidence-bar">
            <div class="confidence-label">
                <span>Ensemble Confidence Score</span>
                <span>${confidence}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${confidence}%"></div>
            </div>
        </div>
        <div class="result-explanation">
            <h4><i class="fas fa-robot"></i> AI Ensemble Analysis</h4>
            <p>${data.explanation || 'The content has been analyzed using an ensemble of 3 ML models to determine its authenticity.'}</p>
        </div>
        ${modelsDetailHTML}
        ${conflictHTML}
        ${extractedTextHTML}
        ${sourceVerificationHTML}
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-tertiary); border-radius: 0.75rem; font-size: 0.875rem; color: var(--text-secondary);">
            <p><strong>Note:</strong> This analysis combines predictions from Logistic Regression, Random Forest, and XGBoost models with real-time web source verification. When there is a conflict, the source verification results from trusted outlets are generally more reliable.</p>
        </div>
    `;

    // Save to history — content is now always available from backend or submitToAPI fallback
    const historyContent = data.content || (type === 'image' ? (data.extracted_text || 'Image analysis') : 'Analysis result');
    if (window.historyModule && historyContent) {
        window.historyModule.addToHistory({
            type: data.type || type || 'text',
            content: historyContent,
            result: data.result,
            confidence: data.confidence,
            explanation: data.explanation
        });
    }

    const resultsCard = document.querySelector('.results-card');
    if (resultsCard) resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Clear results display
 */
function clearResults() {
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <p>No analysis yet. Upload content to get started.</p>
        </div>
    `;
}

/**
 * Reset upload forms
 */
function resetForms() {
    document.getElementById('textForm').reset();
    document.getElementById('imageForm').reset();
    document.getElementById('charCount').textContent = '0';

    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';
    imagePreview.classList.remove('active');

    clearResults();
}

// Export functions
window.uploadHandler = { submitToAPI, displayResults, resetForms, clearResults };
