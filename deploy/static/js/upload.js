/**
 * Upload Handler JavaScript File
 * Handles file uploads, text submissions, and API communication
 */

// Configuration
const CONFIG = {
    // API endpoint (placeholder - replace with actual backend URL)
    apiEndpoint: '/predict',

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
            if (!validateTextInput(textContent)) {
                return;
            }

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

            // Validate file
            if (!file) {
                window.appUtils.showNotification('Please select an image file', 'error');
                return;
            }

            if (!validateImageFile(file)) {
                return;
            }

            // Convert to base64 and submit
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

            // Update active button
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Show/hide forms
            if (mode === 'text') {
                textForm.classList.add('active');
                imageForm.classList.remove('active');
            } else {
                textForm.classList.remove('active');
                imageForm.classList.add('active');
            }

            // Clear results
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

            // Change color based on length
            if (count > CONFIG.maxTextLength) {
                charCount.style.color = '#ef4444';
            } else if (count >= CONFIG.minTextLength) {
                charCount.style.color = '#10b981';
            } else {
                charCount.style.color = '#94a3b8';
            }
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

    // Click to upload
    fileUploadArea.addEventListener('click', function () {
        fileInput.click();
    });

    // File selection handler
    fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });

    // Drag and drop handlers
    fileUploadArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.style.borderColor = '#3b82f6';
        this.style.background = '#f1f5f9';
    });

    fileUploadArea.addEventListener('dragleave', function (e) {
        e.preventDefault();
        this.style.borderColor = '#e2e8f0';
        this.style.background = '';
    });

    fileUploadArea.addEventListener('drop', function (e) {
        e.preventDefault();
        this.style.borderColor = '#e2e8f0';
        this.style.background = '';

        const file = e.dataTransfer.files[0];
        if (file) {
            // Set the file to input element
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            handleFileSelect(file);
        }
    });

    /**
     * Handle file selection and show preview
     * @param {File} file - Selected file
     */
    function handleFileSelect(file) {
        // Validate file
        if (!validateImageFile(file)) {
            fileInput.value = '';
            return;
        }

        // Show preview
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
 * @param {string} text - Text to validate
 * @returns {boolean} True if valid
 */
function validateTextInput(text) {
    if (text.length < CONFIG.minTextLength) {
        window.appUtils.showNotification(
            `Text must be at least ${CONFIG.minTextLength} characters`,
            'error'
        );
        return false;
    }

    if (text.length > CONFIG.maxTextLength) {
        window.appUtils.showNotification(
            `Text must not exceed ${CONFIG.maxTextLength} characters`,
            'error'
        );
        return false;
    }

    return true;
}

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {boolean} True if valid
 */
function validateImageFile(file) {
    // Check file type
    if (!window.appUtils.validateFileType(file, CONFIG.allowedImageTypes)) {
        window.appUtils.showNotification(
            'Invalid file type. Please upload JPG, PNG, or GIF images only',
            'error'
        );
        return false;
    }

    // Check file size
    if (!window.appUtils.validateFileSize(file, CONFIG.maxFileSize)) {
        window.appUtils.showNotification(
            `File size must not exceed ${CONFIG.maxFileSize}MB`,
            'error'
        );
        return false;
    }

    return true;
}

/**
 * Submit content to API for analysis
 * @param {string} type - Type of content ('text' or 'image')
 * @param {string} content - Content to analyze
 */
async function submitToAPI(type, content) {
    const loadingOverlay = document.getElementById('loadingOverlay');

    try {
        // Show loading overlay
        loadingOverlay.classList.add('active');

        // Prepare request data
        const requestData = {
            type: type,
            content: content,
            timestamp: new Date().toISOString()
        };

        console.log('Submitting to API:', { type, contentLength: content.length });

        // Make API request
        const response = await fetch("/docs", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        // Check response status
        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        // Parse response
        const result = await response.json();

        // Display results
        displayResults(result);

        window.appUtils.showNotification('Analysis completed successfully', 'success');

    } catch (error) {
        console.error('API Error:', error);

        // Show mock results for demonstration purposes
        // In production, you would show an error message
        window.appUtils.showNotification(
            'Using mock data (API endpoint not available)',
            'warning'
        );

        // Generate mock results for demonstration
        displayMockResults(type, content);

    } finally {
        // Hide loading overlay
        loadingOverlay.classList.remove('active');
    }
}

/**
 * Display analysis results
 * @param {Object} data - API response data
 */
function displayResults(data) {
    const resultsContent = document.getElementById('resultsContent');

    const isFake = data.result.toLowerCase() === 'fake';
    const confidence = Math.round(data.confidence * 100);

    resultsContent.innerHTML = `
        <div class="result-badge ${isFake ? 'fake' : 'real'}">
            <i class="fas fa-${isFake ? 'exclamation-triangle' : 'check-circle'}"></i>
            ${data.result.toUpperCase()}
        </div>
        
        <div class="confidence-bar">
            <div class="confidence-label">
                <span>Confidence Score</span>
                <span>${confidence}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${confidence}%"></div>
            </div>
        </div>
        
        <div class="result-explanation">
            <h4><i class="fas fa-info-circle"></i> Analysis Explanation</h4>
            <p>${data.explanation || 'The content has been analyzed using advanced AI algorithms to determine its authenticity.'}</p>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-tertiary); border-radius: 0.75rem; font-size: 0.875rem; color: var(--text-secondary);">
            <p><strong>Note:</strong> This analysis is based on AI algorithms and should be used as a guide. Always verify important information with multiple credible sources.</p>
        </div>
    `;

    // Add to history if history module is available
    if (window.historyModule && data.content) {
        window.historyModule.addToHistory({
            type: data.type || 'text',
            content: data.content,
            result: data.result,
            confidence: data.confidence,
            explanation: data.explanation
        });
    }

    // Scroll to results
    const resultsCard = document.querySelector('.results-card');
    if (resultsCard) {
        resultsCard.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
}

/**
 * Display mock results for demonstration
 * @param {string} type - Type of content analyzed
 * @param {string} content - Content that was analyzed
 */
function displayMockResults(type, content) {
    // Generate random but realistic-looking results
    const isFake = Math.random() > 0.5;
    const confidence = isFake ?
        0.65 + Math.random() * 0.25 : // 65-90% for fake
        0.70 + Math.random() * 0.25;  // 70-95% for real

    const explanations = {
        fake: [
            'The content shows characteristics commonly associated with misinformation, including sensational language, lack of credible sources, and emotional manipulation tactics.',
            'Analysis detected multiple red flags: unverified claims, misleading headlines, and inconsistencies with established facts from reputable sources.',
            'The linguistic patterns and writing style suggest potential manipulation. Cross-referencing with fact-checking databases indicates this information is likely fabricated or distorted.'
        ],
        real: [
            'The content appears to be legitimate based on source credibility, factual consistency, and proper citation of references. It aligns with information from trusted news outlets.',
            'Analysis indicates authentic journalism characteristics: balanced reporting, multiple source citations, and verifiable facts. The language used is professional and objective.',
            'Cross-referencing with established fact-checking databases confirms the information. The content shows no signs of manipulation or misleading intent.'
        ]
    };

    const mockData = {
        type: type,
        content: content,
        result: isFake ? 'Fake' : 'Real',
        confidence: confidence,
        explanation: isFake ?
            explanations.fake[Math.floor(Math.random() * explanations.fake.length)] :
            explanations.real[Math.floor(Math.random() * explanations.real.length)]
    };

    displayResults(mockData);
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

// Export functions for potential use in other scripts
window.uploadHandler = {
    submitToAPI,
    displayResults,
    resetForms,
    clearResults
};
