# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Open the Website
Simply open `index.html` in your web browser:
- Double-click the file, or
- Right-click → Open with → Your preferred browser

**No installation or server required!**

---

### Step 2: Explore the Features

#### 🏠 Home Page
- View the introduction and feature overview
- Click "Start Detection" to try the analysis tool

#### 📖 About Page
- Learn how the fake news detection works
- Understand the technology behind it

#### 🔍 Detect Page
Choose between two modes:

**Text Mode:**
1. Click the "Text" button
2. Paste news content (minimum 50 characters)
3. Click "Analyze Text"
4. View results with confidence score

**Image Mode:**
1. Click the "Image" button
2. Drag & drop an image OR click to browse
3. Upload a screenshot of news (JPG, PNG, GIF - max 5MB)
4. Click "Analyze Image"
5. View results with explanation

#### 🤖 Chatbot Page
Ask questions about fake news detection:

**Try these questions:**
- "How to spot fake news?"
- "How do I verify sources?"
- "What is media bias?"
- "social media tips"
- "help" (for full command list)

---

### Step 3: Integrate with Your Backend (Optional)

To connect to a real API:

1. Open `js/upload.js`
2. Find line ~10:
   ```javascript
   apiEndpoint: 'https://fake-news-api.example.com/detect'
   ```
3. Replace with your actual API URL
4. Ensure your API accepts this format:
   ```json
   POST /detect
   {
     "type": "text" | "image",
     "content": "content here",
     "timestamp": "2026-01-10T12:00:00.000Z"
   }
   ```

---

## 📱 Mobile Testing

Open on your phone by:
1. Start a local server (optional but recommended):
   ```bash
   python -m http.server 8000
   ```
2. Find your computer's IP address
3. Open `http://YOUR_IP:8000` on your phone

Or simply copy the files to your phone and open `index.html`

---

## 🎯 Chatbot Commands

Quick reference for chatbot interactions:

| Command | Response |
|---------|----------|
| hello, hi, hey | Greeting message |
| spot fake news | Tips on identifying fake news |
| verify sources | Source verification methods |
| bias | Understanding media bias |
| fact check | Fact-checking resources |
| social media | Social media safety tips |
| images | Image verification techniques |
| deepfake | Deepfake detection info |
| clickbait | Identifying clickbait |
| conspiracy | Evaluating conspiracy theories |
| help | Complete command list |

---

## ⚡ Keyboard Shortcuts

- **Tab**: Navigate between interactive elements
- **Enter**: Submit forms, send chat messages
- **Escape**: Close mobile menu (when open)

---

## 🎨 Customize the Design

Want to change colors?

1. Open `css/style.css`
2. Edit the CSS variables at the top:
   ```css
   :root {
     --primary-color: #1e3a8a;  /* Change this */
     --primary-light: #3b82f6;  /* And this */
     /* ... */
   }
   ```
3. Refresh your browser to see changes

---

## 🐛 Troubleshooting

**Issue: API not working**
- Check browser console (F12) for errors
- Verify API endpoint URL
- Ensure CORS is enabled on your backend
- Currently shows mock results for demo

**Issue: Images not uploading**
- Check file size (max 5MB)
- Verify file type (JPG, PNG, GIF only)
- Try a different image

**Issue: Mobile menu not working**
- Clear browser cache
- Try in incognito/private mode
- Check browser console for errors

**Issue: Chatbot not responding**
- Refresh the page
- Check browser console
- Try "help" command

---

## 📊 Browser Compatibility

✅ **Works best in:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (14+)

⚠️ **Avoid:**
- Internet Explorer (not supported)
- Very old mobile browsers

---

## 💡 Tips for Best Experience

1. **Use a modern browser** (Chrome, Firefox, Safari, Edge)
2. **Enable JavaScript** (required for functionality)
3. **Test on mobile** for responsive design
4. **Try the chatbot** with different questions
5. **Upload various content types** to see results

---

## 📚 Next Steps

After exploring the website:

1. Read `README.md` for detailed documentation
2. Check `PROJECT_SUMMARY.md` for technical details
3. Review the code files to understand implementation
4. Customize colors and text to match your brand
5. Integrate with your backend API
6. Deploy to a web server or hosting platform

---

## 🚀 Deploy to Production

Ready to go live? See the **Publish tab** in your development environment.

Or deploy manually to:
- **GitHub Pages** (free)
- **Netlify** (free tier available)
- **Vercel** (free tier available)
- **Your own web server**

Simply upload all files maintaining the folder structure!

---

## 📞 Need Help?

- Check inline code comments
- Review README.md for detailed info
- Inspect browser console (F12) for errors
- Check PROJECT_SUMMARY.md for features list

---

## ✨ Enjoy Your Fake News Detection Website!

**Happy detecting! 🕵️**
