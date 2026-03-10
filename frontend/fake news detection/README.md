# Fake News Detection Website

A modern, fully-responsive frontend web application for detecting fake news using image or text analysis. Built with vanilla HTML, CSS, and JavaScript.

## 🎯 Project Overview

This project provides an intuitive interface for users to detect fake news by uploading images (screenshots) or text content. It features a conversational chatbot to answer questions about fake news detection and provides educational content about misinformation.

## ✨ Features

### Currently Completed Features

1. **Multi-Page Navigation System**
   - Home: Landing page with introduction to fake news detection
   - About: Information about the tool and how it works
   - Detect: Main detection interface for uploading content
   - Chatbot: Interactive conversational assistant

2. **Fake News Detection Interface**
   - Upload images (screenshots of news articles)
   - Submit text content for analysis
   - Toggle between image and text input modes
   - Real-time API integration with backend service
   - Loading spinner during analysis
   - Styled result display with confidence scores
   - Error handling and user feedback

3. **JavaScript-Based Chatbot**
   - Conversational interface with predefined responses
   - Keyword matching for intelligent responses
   - Tips on spotting fake news
   - Information about verification techniques
   - Chat history with styled message bubbles
   - Smooth animations and transitions

4. **Modern UI/UX Design**
   - Professional blue and white color scheme
   - Gradient backgrounds and glassmorphism effects
   - Smooth CSS animations and transitions
   - High-quality icons from Font Awesome
   - Fully responsive design (mobile, tablet, desktop)
   - Accessibility features (semantic HTML, alt text)

5. **Additional Enhancements**
   - Fade-in animations on page load
   - Hover effects on interactive elements
   - Professional footer with copyright
   - Smooth scrolling and transitions
   - Form validation and error messages

## 📁 Project Structure

```
fake-news-detection/
│
├── index.html              # Main HTML file with all sections
├── README.md               # This file
│
├── css/
│   └── style.css          # Global styles, animations, and responsive design
│
├── js/
│   ├── main.js            # Core functionality and navigation
│   ├── upload.js          # Upload handling and API integration
│   └── chatbot.js         # Chatbot logic and responses
│
└── images/
    └── (placeholder for logos, icons, backgrounds)
```

## 🚀 How to Run the Project

### Option 1: Direct Browser Access
1. Download/clone the project to your local machine
2. Navigate to the project folder
3. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
4. The website will load and be fully functional

### Option 2: Local Server (Optional)
If you want to test with a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000
```
Then open `http://localhost:8000` in your browser.

## 🔌 API Integration

### Backend API Endpoint
The project is configured to connect to a fake news detection API:

**Endpoint:** `https://fake-news-api.example.com/detect`

**Method:** POST

**Request Format:**
```javascript
{
  type: "text" | "image",
  content: "text content" | "base64 image data"
}
```

**Response Format:**
```javascript
{
  result: "Fake" | "Real",
  confidence: 0.85,  // 0-1 scale
  explanation: "Detailed analysis..."
}
```

### ⚠️ Important Note
The API endpoint is currently a **placeholder**. To make the detection feature fully functional:

1. Replace the API URL in `js/upload.js` (line ~10) with your actual backend endpoint
2. Ensure your backend API accepts POST requests with the format above
3. Configure CORS headers on your backend to allow browser requests
4. The frontend will handle all data formatting and error cases

## 🎨 Design Features

### Color Scheme
- Primary: #1e3a8a (Deep Blue) - Trust and reliability
- Secondary: #3b82f6 (Bright Blue) - Modern and tech-forward
- Accent: #60a5fa (Light Blue) - Highlights and interactions
- Success: #10b981 (Green) - Positive results
- Error: #ef4444 (Red) - Warnings and fake news
- Background: #f8fafc (Light Gray) - Clean and professional

### Animations
- Fade-in effects on page load
- Smooth hover transitions
- Loading spinners during API calls
- Chat message slide-in animations
- Button press effects

### Responsive Breakpoints
- Desktop: 1024px and above
- Tablet: 768px - 1023px
- Mobile: 320px - 767px

## 🤖 Chatbot Commands

The chatbot responds to various keywords and questions:

- **"hello", "hi", "hey"** - Greeting
- **"fake news", "spot fake", "identify"** - Tips on detection
- **"verify", "check sources"** - Source verification tips
- **"bias", "biased"** - Information about media bias
- **"fact check", "fact-check"** - Fact-checking resources
- **"social media"** - Social media misinformation tips
- **"help"** - Available commands
- **Default** - Fallback response for unknown queries

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Font Awesome 6** - Icons via CDN
- **Google Fonts** - Inter font family

## 📱 Browser Compatibility

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Opera 76+ ✅

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- Alt text for all images
- High contrast color ratios
- Focus indicators on interactive elements

## 🔄 Features Not Yet Implemented

1. **Backend API** - Python backend for actual fake news detection
2. **User Authentication** - Login/signup functionality
3. **History/Dashboard** - Save and view previous detection results
4. **Advanced Chatbot** - AI-powered responses using NLP
5. **Multi-language Support** - Internationalization
6. **Dark Mode** - Theme toggle option
7. **Social Sharing** - Share results on social media
8. **Detailed Analytics** - Charts and statistics dashboard

## 🎯 Recommended Next Steps

1. **Implement Backend API**
   - Develop Python Flask/FastAPI backend
   - Integrate ML model for fake news detection
   - Add image processing (OCR for screenshots)
   - Deploy API with proper CORS configuration

2. **Enhanced Data Storage**
   - Implement local storage for chat history
   - Save user preferences
   - Cache previous detection results

3. **Advanced Features**
   - Add URL analysis (paste article links)
   - Implement batch processing
   - Add browser extension version
   - Create mobile app version

4. **Performance Optimization**
   - Implement lazy loading for images
   - Add service worker for offline functionality
   - Optimize asset loading and caching

5. **Testing & Quality**
   - Add unit tests for JavaScript functions
   - Implement E2E testing
   - Perform security audit
   - Conduct accessibility audit

## 📄 License

This project is created as a demonstration. Feel free to use and modify as needed.

## 👤 Author

Created as a fake news detection educational tool.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Community resources on fake news detection

---

**Last Updated:** 2026-01-10

For questions or issues, please refer to the inline code comments or documentation.
