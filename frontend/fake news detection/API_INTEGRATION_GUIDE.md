# REALIX API Integration Guide

## 📡 Complete API Documentation

This guide explains how to integrate your backend API with the REALIX frontend and where to make changes.

---

## 🎯 Quick Start

### Current API Endpoint (Placeholder)
```javascript
https://fake-news-api.example.com/detect
```

### Where to Change It
**File:** `js/upload-enhanced.js`  
**Line:** ~9

---

## 📋 Table of Contents

1. [API Configuration](#api-configuration)
2. [Request Format](#request-format)
3. [Response Format](#response-format)
4. [Frontend Files to Modify](#frontend-files-to-modify)
5. [Step-by-Step Integration](#step-by-step-integration)
6. [Error Handling](#error-handling)
7. [Testing Guide](#testing-guide)
8. [Example Code](#example-code)

---

## 🔧 API Configuration

### Location in Code

**File:** `js/upload-enhanced.js`

```javascript
// Line ~6-18
const CONFIG = {
    // API endpoint (placeholder - replace with actual backend URL)
    apiEndpoint: 'https://fake-news-api.example.com/detect',
    
    // File upload constraints
    maxFileSize: 5, // MB
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    
    // Text constraints
    maxTextLength: 10000,
    minTextLength: 50
};
```

### What to Change

1. **API Endpoint:**
   ```javascript
   apiEndpoint: 'https://your-actual-api.com/detect'
   ```

2. **File Size Limit:**
   ```javascript
   maxFileSize: 10, // Change to your desired MB limit
   ```

3. **Allowed File Types:**
   ```javascript
   allowedImageTypes: [
       'image/jpeg', 
       'image/png',
       'image/webp'
       // Add or remove types as needed
   ],
   ```

4. **Text Constraints:**
   ```javascript
   maxTextLength: 15000,  // Maximum characters
   minTextLength: 100,    // Minimum characters
   ```

---

## 📤 Request Format

### API Endpoint
```
POST https://your-api-domain.com/detect
```

### Request Headers
```javascript
{
    'Content-Type': 'application/json',
    // Add your authentication headers if needed:
    // 'Authorization': 'Bearer YOUR_TOKEN',
    // 'X-API-Key': 'your-api-key'
}
```

### Request Body - Text Analysis

```json
{
    "type": "text",
    "content": "The news article text content goes here...",
    "timestamp": "2026-01-10T12:34:56.789Z"
}
```

**Parameters:**
- `type` (string, required): Must be "text"
- `content` (string, required): The news text to analyze (50-10,000 chars)
- `timestamp` (string, optional): ISO 8601 format timestamp

### Request Body - Image Analysis

```json
{
    "type": "image",
    "content": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "timestamp": "2026-01-10T12:34:56.789Z"
}
```

**Parameters:**
- `type` (string, required): Must be "image"
- `content` (string, required): Base64 encoded image data with MIME type prefix
- `timestamp` (string, optional): ISO 8601 format timestamp

### Example Request (Full)

```javascript
// Text Request
{
    "type": "text",
    "content": "Breaking news: Scientists discover new planet...",
    "timestamp": "2026-01-10T15:30:00.000Z"
}

// Image Request
{
    "type": "image",
    "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
    "timestamp": "2026-01-10T15:30:00.000Z"
}
```

---

## 📥 Response Format

### Success Response

**HTTP Status:** 200 OK

```json
{
    "result": "Fake",
    "confidence": 0.85,
    "explanation": "The content shows characteristics commonly associated with misinformation, including sensational language, lack of credible sources, and emotional manipulation tactics.",
    "analysis_time": "1.23s",
    "metadata": {
        "sources_checked": 15,
        "fact_check_score": 2.3,
        "credibility_score": 3.5
    }
}
```

**Required Parameters:**
- `result` (string, required): "Fake" or "Real" (case-insensitive)
- `confidence` (float, required): 0.0 to 1.0 (e.g., 0.85 = 85%)
- `explanation` (string, required): Detailed analysis explanation

**Optional Parameters:**
- `analysis_time` (string): Time taken for analysis
- `metadata` (object): Additional analysis data
- `warning` (string): Any warnings or notes
- `sources` (array): List of sources checked

### Error Response

**HTTP Status:** 400, 500, etc.

```json
{
    "error": true,
    "message": "Invalid content format",
    "code": "INVALID_FORMAT",
    "details": "Text content must be at least 50 characters"
}
```

**Parameters:**
- `error` (boolean): Always true
- `message` (string): Human-readable error message
- `code` (string): Error code for debugging
- `details` (string): Additional error information

---

## 📁 Frontend Files to Modify

### 1. Main Upload Handler
**File:** `js/upload-enhanced.js`

**Lines to Modify:**

```javascript
// Line ~9: API Endpoint
apiEndpoint: 'https://your-api.com/detect',

// Line ~13: File Size Limit
maxFileSize: 5, // MB

// Line ~14: Allowed Image Types
allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],

// Line ~17-18: Text Length Constraints
maxTextLength: 10000,
minTextLength: 50
```

**Functions to Review:**
- `submitToAPI()` (Line ~200): Main API call function
- `displayResults()` (Line ~260): Results display function
- `validateTextInput()` (Line ~150): Text validation
- `validateImageFile()` (Line ~170): Image validation

### 2. Authentication Headers (if needed)

**File:** `js/upload-enhanced.js`  
**Location:** Inside `submitToAPI()` function (Line ~215)

```javascript
// Add authentication headers
const response = await fetch(CONFIG.apiEndpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // Add your auth headers here:
        'Authorization': 'Bearer YOUR_TOKEN',
        'X-API-Key': 'your-api-key'
    },
    body: JSON.stringify(requestData)
});
```

### 3. CORS Configuration

If you encounter CORS errors, your backend needs to allow:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 🔄 Step-by-Step Integration

### Step 1: Update API Endpoint

**File:** `js/upload-enhanced.js` (Line ~9)

```javascript
// BEFORE
apiEndpoint: 'https://fake-news-api.example.com/detect',

// AFTER
apiEndpoint: 'https://your-actual-backend.com/api/v1/detect',
```

### Step 2: Add Authentication (Optional)

**File:** `js/upload-enhanced.js` (Line ~215)

```javascript
// Find this section:
const response = await fetch(CONFIG.apiEndpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // Add your headers below:
        'Authorization': `Bearer ${getAuthToken()}`,
        'X-API-Key': 'your-api-key-here'
    },
    body: JSON.stringify(requestData)
});
```

### Step 3: Adjust Validation Limits

**File:** `js/upload-enhanced.js`

```javascript
// Change file size limit
maxFileSize: 10, // Increase to 10MB

// Change text limits
maxTextLength: 15000, // Allow longer text
minTextLength: 100,   // Require more text
```

### Step 4: Customize Response Handling

**File:** `js/upload-enhanced.js` (Line ~260)

```javascript
function displayResults(data) {
    // data.result - "Fake" or "Real"
    // data.confidence - 0.0 to 1.0
    // data.explanation - Analysis text
    
    // Add custom fields if your API returns them:
    // data.sources
    // data.fact_check_score
    // data.credibility_score
}
```

### Step 5: Test the Integration

1. Open browser console (F12)
2. Submit test content
3. Check network tab for API calls
4. Verify request/response format

---

## 🛠️ Error Handling

### Current Error Handling

**File:** `js/upload-enhanced.js` (Line ~235)

```javascript
try {
    // API call code
} catch (error) {
    console.error('API Error:', error);
    
    // Shows mock data for demo
    window.appUtils.showNotification(
        'Using mock data (API endpoint not available)',
        'warning'
    );
    
    displayMockResults(type, content);
}
```

### Customize Error Messages

```javascript
catch (error) {
    console.error('API Error:', error);
    
    // Check error type
    if (error.message.includes('Failed to fetch')) {
        window.appUtils.showNotification(
            'Network error. Please check your connection.',
            'error'
        );
    } else if (error.message.includes('500')) {
        window.appUtils.showNotification(
            'Server error. Please try again later.',
            'error'
        );
    } else {
        window.appUtils.showNotification(
            'Analysis failed. Please try again.',
            'error'
        );
    }
}
```

### Handle Specific HTTP Status Codes

```javascript
// After fetch, add status checking
const response = await fetch(CONFIG.apiEndpoint, {...});

if (!response.ok) {
    if (response.status === 400) {
        throw new Error('Invalid request format');
    } else if (response.status === 401) {
        throw new Error('Authentication required');
    } else if (response.status === 429) {
        throw new Error('Rate limit exceeded');
    } else if (response.status === 500) {
        throw new Error('Server error');
    } else {
        throw new Error(`API returned status ${response.status}`);
    }
}
```

---

## 🧪 Testing Guide

### 1. Test with Mock Data

The frontend currently uses mock data if API fails:

```javascript
// File: js/upload-enhanced.js
// Function: displayMockResults() (Line ~280)

// This generates realistic fake results for testing
// Remove or comment out this function when using real API
```

### 2. Test API Endpoint

**Using cURL:**
```bash
curl -X POST https://your-api.com/detect \
  -H "Content-Type: application/json" \
  -d '{
    "type": "text",
    "content": "Test news article...",
    "timestamp": "2026-01-10T12:00:00.000Z"
  }'
```

**Using JavaScript Console:**
```javascript
fetch('https://your-api.com/detect', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        type: 'text',
        content: 'Test content here...',
        timestamp: new Date().toISOString()
    })
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e));
```

### 3. Enable Debugging

**File:** `js/upload-enhanced.js`

```javascript
// Add console logging
console.log('Submitting to API:', { type, contentLength: content.length });
console.log('API Response:', result);
console.log('Parsed Data:', data);
```

### 4. Check Browser Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Submit content
4. Check the request/response
5. Verify headers, payload, status

---

## 💻 Example Code

### Complete API Integration Example

**File:** `js/upload-enhanced.js`

```javascript
// Configuration
const CONFIG = {
    apiEndpoint: 'https://your-backend-api.com/api/v1/detect',
    apiKey: 'your-api-key-here', // Store securely!
    maxFileSize: 5,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxTextLength: 10000,
    minTextLength: 50
};

// Submit to API function
async function submitToAPI(type, content) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    try {
        // Show loading
        loadingOverlay.classList.add('active');
        
        // Prepare request
        const requestData = {
            type: type,
            content: content,
            timestamp: new Date().toISOString()
        };
        
        console.log('Submitting to API:', { type, size: content.length });
        
        // Make API call
        const response = await fetch(CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.apiKey,
                // Add more headers as needed
            },
            body: JSON.stringify(requestData)
        });
        
        // Check response status
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP ${response.status}`);
        }
        
        // Parse response
        const result = await response.json();
        console.log('API Response:', result);
        
        // Validate response format
        if (!result.result || result.confidence === undefined) {
            throw new Error('Invalid response format from API');
        }
        
        // Display results
        displayResults({
            type: type,
            content: content,
            result: result.result,
            confidence: result.confidence,
            explanation: result.explanation || 'Analysis completed.'
        });
        
        // Show success notification
        window.appUtils.showNotification('Analysis completed successfully', 'success');
        
    } catch (error) {
        console.error('API Error:', error);
        
        // Handle different error types
        let errorMessage = 'Analysis failed. ';
        
        if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Please check your internet connection.';
        } else if (error.message.includes('401')) {
            errorMessage += 'Authentication failed.';
        } else if (error.message.includes('429')) {
            errorMessage += 'Too many requests. Please wait.';
        } else {
            errorMessage += error.message;
        }
        
        window.appUtils.showNotification(errorMessage, 'error');
        
        // Optional: Show mock results for testing
        // displayMockResults(type, content);
        
    } finally {
        // Always hide loading
        loadingOverlay.classList.remove('active');
    }
}
```

---

## 🔐 Security Best Practices

### 1. Never Store API Keys in Frontend Code

**❌ Bad:**
```javascript
apiKey: 'sk_live_123456789abcdef' // Visible to everyone!
```

**✅ Good:**
Use environment variables or backend proxy:
```javascript
// Let backend handle authentication
apiEndpoint: 'https://your-backend.com/api/detect'
// Backend adds API key before calling ML service
```

### 2. Use HTTPS Only

```javascript
// Always use HTTPS
apiEndpoint: 'https://your-api.com/detect' // ✅
// Never HTTP in production
apiEndpoint: 'http://your-api.com/detect'  // ❌
```

### 3. Implement Rate Limiting

```javascript
// Add request throttling
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds

async function submitToAPI(type, content) {
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
        throw new Error('Please wait before submitting again');
    }
    lastRequestTime = now;
    
    // Continue with API call...
}
```

### 4. Validate Input Before Sending

```javascript
// Always validate on frontend AND backend
if (content.length < CONFIG.minTextLength) {
    throw new Error('Content too short');
}
if (content.length > CONFIG.maxTextLength) {
    throw new Error('Content too long');
}
```

---

## 📊 API Response Examples

### Example 1: Fake News Detected

```json
{
    "result": "Fake",
    "confidence": 0.87,
    "explanation": "The article contains multiple red flags: sensational headline, lack of credible sources, emotional language, and unverified claims that contradict established facts.",
    "analysis_time": "1.45s",
    "metadata": {
        "sources_checked": 23,
        "credibility_score": 2.1,
        "fact_check_score": 1.8,
        "linguistic_indicators": {
            "emotional_language": 0.92,
            "sensationalism": 0.85,
            "bias_score": 0.78
        }
    }
}
```

### Example 2: Real News Verified

```json
{
    "result": "Real",
    "confidence": 0.94,
    "explanation": "The content appears authentic with multiple credible source citations, balanced reporting, verifiable facts, and professional journalistic standards. Cross-referenced with 18 trusted news outlets.",
    "analysis_time": "1.67s",
    "metadata": {
        "sources_checked": 18,
        "credibility_score": 8.9,
        "fact_check_score": 9.2,
        "verified_sources": [
            "Reuters",
            "Associated Press",
            "BBC News"
        ]
    }
}
```

### Example 3: Error Response

```json
{
    "error": true,
    "message": "Content too short for reliable analysis",
    "code": "CONTENT_TOO_SHORT",
    "details": "Minimum 50 characters required, received 32",
    "timestamp": "2026-01-10T15:30:45.123Z"
}
```

---

## 🔍 Debugging Checklist

### When API Integration Doesn't Work:

1. **Check Console Errors**
   - Open DevTools (F12)
   - Look for red error messages
   - Note the error type

2. **Verify API Endpoint**
   ```javascript
   console.log('API Endpoint:', CONFIG.apiEndpoint);
   ```

3. **Check Request Format**
   ```javascript
   console.log('Request Data:', JSON.stringify(requestData, null, 2));
   ```

4. **Inspect Network Tab**
   - Request URL correct?
   - Request headers included?
   - Response status code?
   - Response body?

5. **Test CORS**
   - CORS errors in console?
   - Backend allows your origin?
   - Proper headers configured?

6. **Validate Response**
   ```javascript
   console.log('Response:', await response.text());
   ```

7. **Check Authentication**
   - API key valid?
   - Token not expired?
   - Headers formatted correctly?

---

## 📋 Quick Reference

### Files to Modify
```
js/upload-enhanced.js  → Main API integration
Line ~9                → API endpoint
Line ~13-18           → Validation limits
Line ~215             → Authentication headers
Line ~260             → Response handling
```

### Request Format
```javascript
{
    type: "text" | "image",
    content: string,
    timestamp: ISO 8601 string
}
```

### Response Format
```javascript
{
    result: "Fake" | "Real",
    confidence: 0.0 - 1.0,
    explanation: string
}
```

### Common Status Codes
```
200 → Success
400 → Bad Request (invalid format)
401 → Unauthorized (auth required)
429 → Too Many Requests (rate limited)
500 → Server Error (backend issue)
503 → Service Unavailable (maintenance)
```

---

## 📞 Support

### Need Help?

1. **Check documentation** in this file
2. **Review console errors** (F12)
3. **Test API directly** with cURL
4. **Verify backend** is running
5. **Check CORS configuration**

### Common Issues

**Issue:** CORS Error
**Solution:** Configure backend CORS headers

**Issue:** 401 Unauthorized
**Solution:** Check API key/token

**Issue:** Network Error
**Solution:** Verify API endpoint URL

**Issue:** Invalid Response
**Solution:** Check response format matches expected structure

---

## ✅ Final Checklist

Before deploying:

- [ ] API endpoint updated
- [ ] Authentication headers added (if needed)
- [ ] Validation limits configured
- [ ] Error handling customized
- [ ] Response format verified
- [ ] CORS configured on backend
- [ ] API tested with real data
- [ ] Error messages user-friendly
- [ ] Loading states working
- [ ] Results display correctly
- [ ] History integration working
- [ ] Mobile tested
- [ ] Production URL used (not localhost)

---

**Document Version:** 1.0  
**Last Updated:** January 10, 2026  
**Status:** Complete

Your REALIX frontend is ready for API integration! 🚀
