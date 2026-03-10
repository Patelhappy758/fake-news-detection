/**
 * Chatbot JavaScript File
 * Implements a conversational chatbot with keyword-based responses
 */

// Chatbot knowledge base and responses
const CHATBOT_DATA = {
    greetings: {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
        responses: [
            'Hello! How can I help you today? Feel free to ask me about fake news detection! 👋',
            'Hi there! I\'m here to help you understand and identify fake news. What would you like to know?',
            'Hey! Welcome! Ask me anything about verifying news authenticity.',
        ]
    },
    
    spotFakeNews: {
        keywords: ['spot fake', 'identify fake', 'how to tell', 'recognize fake', 'detect fake', 'find fake'],
        response: `Here are key signs to spot fake news:

📌 **Check the Source** - Is it from a reputable news outlet?
📌 **Examine the Author** - Are they credible and qualified?
📌 **Look for Evidence** - Are claims backed by reliable sources?
📌 **Check the Date** - Is the information current and relevant?
📌 **Assess the Language** - Is it sensational or emotional?
📌 **Verify Images** - Use reverse image search to check authenticity
📌 **Cross-Reference** - Check if other credible sources report the same story

Always be skeptical and verify before sharing!`
    },
    
    verifySources: {
        keywords: ['verify', 'check source', 'credible source', 'reliable source', 'trust source'],
        response: `To verify news sources effectively:

✅ **Check Domain Names** - Look for official .org, .gov, or established .com sites
✅ **About Page** - Legitimate sites have clear "About" sections
✅ **Contact Information** - Real news sites provide contact details
✅ **Professional Design** - Quality sites have professional layouts
✅ **Editorial Standards** - Look for stated editorial policies
✅ **SSL Certificate** - Check for "https://" in the URL
✅ **User Reviews** - Search for reviews of the source online

Use fact-checking websites like Snopes, FactCheck.org, or PolitiFact to verify claims.`
    },
    
    mediaBias: {
        keywords: ['bias', 'biased', 'political bias', 'media bias', 'partisan'],
        response: `Understanding media bias is crucial:

🎯 **Types of Bias:**
• Selection Bias - What stories are chosen/ignored
• Omission Bias - Key facts left out
• Placement Bias - Story prominence and positioning
• Labeling Bias - Use of loaded language
• Spin Bias - Tone and framing of information

🎯 **How to Identify:**
• Compare multiple sources
• Look for balanced coverage
• Notice emotional language
• Check what's being emphasized or omitted
• Consider the source's political leanings

🎯 **What to Do:**
• Read from diverse sources
• Focus on facts, not opinions
• Be aware of your own biases
• Use bias-checking tools like AllSides or Media Bias/Fact Check`
    },
    
    factCheck: {
        keywords: ['fact check', 'fact-check', 'verify facts', 'check facts', 'fact checking'],
        response: `Reliable fact-checking resources:

🔍 **Major Fact-Checking Sites:**
• Snopes.com - General fact-checking
• FactCheck.org - Political claims
• PolitiFact.com - Political statements with ratings
• Full Fact (UK) - UK-focused fact-checking
• AFP Fact Check - International coverage

🔍 **How to Fact-Check:**
1. Identify the claim clearly
2. Search fact-checking websites
3. Look for original sources
4. Check publication dates
5. Verify with multiple independent sources
6. Use Google reverse image search for photos
7. Check video metadata and context

Remember: Extraordinary claims require extraordinary evidence!`
    },
    
    socialMedia: {
        keywords: ['social media', 'facebook', 'twitter', 'instagram', 'tiktok', 'viral'],
        response: `Fake news spreads rapidly on social media. Here's how to stay safe:

📱 **Red Flags on Social Media:**
• Sensational headlines designed for clicks
• Posts with all caps or excessive punctuation!!!
• Missing or suspicious source links
• Requests to share immediately
• Appeals to emotion rather than facts
• Unverified "breaking news"

📱 **Best Practices:**
• Verify before sharing
• Check the original source
• Look at posting date and context
• Be wary of memes as news
• Don't judge by engagement numbers
• Report misinformation when you see it
• Use platform fact-checking features

Think before you click and share!`
    },
    
    help: {
        keywords: ['help', 'commands', 'what can you do', 'options', 'assist'],
        response: `I can help you with the following topics:

💬 **Ask me about:**
• How to spot fake news
• Verifying sources and credibility
• Understanding media bias
• Fact-checking resources and methods
• Social media misinformation
• Image and video verification
• News literacy tips
• Common fake news tactics

🎯 **Quick Commands:**
Type "spot fake" for detection tips
Type "verify" for source verification info
Type "bias" to learn about media bias
Type "fact check" for fact-checking resources
Type "social media" for social media tips

Just ask me anything about fake news detection!`
    },
    
    images: {
        keywords: ['image', 'photo', 'picture', 'verify image', 'fake image', 'photoshop'],
        response: `Verifying images and detecting manipulated photos:

📸 **Verification Tools:**
• Google Reverse Image Search - Find original sources
• TinEye - Reverse image search engine
• InVID - Browser extension for video/image verification
• FotoForensics - Detect image manipulation

📸 **What to Check:**
• Image quality and resolution
• Inconsistent lighting or shadows
• Strange edges around subjects
• Metadata (EXIF data) for date/location
• Context - does the image match the story?

📸 **Common Tricks:**
• Old photos presented as recent
• Images from different events
• Digitally altered photos
• AI-generated images (deepfakes)
• Photos taken out of context

Always reverse search suspicious images before believing or sharing!`
    },
    
    deepfakes: {
        keywords: ['deepfake', 'deep fake', 'ai generated', 'synthetic media', 'fake video'],
        response: `Understanding deepfakes and synthetic media:

🎬 **What are Deepfakes?**
AI-generated videos or images that manipulate faces, voices, or entire scenes to create realistic but fake content.

🎬 **How to Spot Deepfakes:**
• Unnatural facial movements or expressions
• Weird blinking patterns or no blinking
• Poor lip-syncing
• Inconsistent lighting on face vs. body
• Strange artifacts around face edges
• Unnatural skin texture
• Audio doesn't match video perfectly

🎬 **Protection Tips:**
• Be skeptical of shocking videos
• Check multiple credible sources
• Look for verification from experts
• Use deepfake detection tools
• Consider the context and source

The technology is improving rapidly, so always verify sensational videos!`
    },
    
    clickbait: {
        keywords: ['clickbait', 'click bait', 'sensational', 'headline'],
        response: `Identifying and avoiding clickbait:

🎣 **Common Clickbait Tactics:**
• "You Won't Believe..."
• "This ONE Trick..."
• "What Happens Next Will SHOCK You..."
• Numbered lists (often exaggerated)
• Vague, mysterious headlines
• Emotional manipulation
• Misleading thumbnails

🎣 **Why It's Harmful:**
• Often leads to low-quality content
• May contain misinformation
• Wastes your time
• Generates ad revenue for deceptive sites
• Manipulates emotions rather than informs

🎣 **What to Do:**
• Read beyond the headline
• Check the actual source
• Look for substantive information
• Avoid sharing clickbait
• Use browser extensions that flag clickbait

Quality journalism doesn't need tricks to get your attention!`
    },
    
    conspiracy: {
        keywords: ['conspiracy', 'theory', 'cover up', 'secret'],
        response: `Evaluating conspiracy theories critically:

🔎 **Warning Signs:**
• Relies on "secret knowledge" only a few people know
• Dismisses evidence as "part of the conspiracy"
• Claims "they" don't want you to know
• Connects unrelated events without solid evidence
• Resists fact-checking or verification
• Appeals to fear and distrust

🔎 **Critical Thinking:**
• Extraordinary claims need extraordinary evidence
• Consider Occam's Razor - simplest explanation is often correct
• Look for peer-reviewed research
• Check expert consensus
• Question the source's motivations
• Distinguish between skepticism and paranoia

🔎 **Legitimate Concerns vs. Conspiracies:**
Real issues are supported by verifiable evidence, expert consensus, and can withstand scrutiny. Conspiracy theories typically can't.

Stay curious but critical!`
    }
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
    initFloatingChatbot();
});

/**
 * Initialize floating chatbot
 */
function initFloatingChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotMinimize = document.getElementById('chatbotMinimize');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    
    // Toggle chatbot window
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function() {
            chatbotWindow.classList.toggle('active');
            
            // Hide badge when opened
            const badge = this.querySelector('.chatbot-badge');
            if (badge && chatbotWindow.classList.contains('active')) {
                badge.style.display = 'none';
            }
            
            // Focus input when opened
            if (chatbotWindow.classList.contains('active')) {
                setTimeout(() => chatbotInput.focus(), 300);
            }
        });
    }
    
    // Minimize chatbot
    if (chatbotMinimize) {
        chatbotMinimize.addEventListener('click', function(e) {
            e.stopPropagation();
            chatbotWindow.classList.remove('active');
        });
    }
    
    // Close chatbot
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function(e) {
            e.stopPropagation();
            chatbotWindow.classList.remove('active');
        });
    }
    
    // Handle chatbot form submission
    if (chatbotForm) {
        chatbotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const message = chatbotInput.value.trim();
            if (message) {
                handleUserMessage(message, 'chatbotMessages');
                chatbotInput.value = '';
            }
        });
    }
}

/**
 * Initialize chatbot functionality
 */
function initChatbot() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const clearButton = document.getElementById('clearChat');
    
    // Handle form submission
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const message = chatInput.value.trim();
            if (message) {
                handleUserMessage(message);
                chatInput.value = '';
            }
        });
    }
    
    // Handle clear chat button
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            clearChatHistory();
        });
    }
}

/**
 * Handle user message
 * @param {string} message - User's message
 * @param {string} containerId - ID of messages container (default: 'chatMessages')
 */
function handleUserMessage(message, containerId = 'chatMessages') {
    // Display user message
    addMessage(message, 'user', containerId);
    
    // Get bot response with slight delay for natural feel
    setTimeout(() => {
        const response = generateResponse(message);
        addMessage(response, 'bot', containerId);
    }, 500);
}

/**
 * Add message to chat
 * @param {string} content - Message content
 * @param {string} sender - 'user' or 'bot'
 * @param {string} containerId - ID of messages container
 */
function addMessage(content, sender, containerId = 'chatMessages') {
    const chatMessages = document.getElementById(containerId);
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = sender === 'bot' ? 
        '<i class="fas fa-robot"></i>' : 
        '<i class="fas fa-user"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Convert markdown-like formatting to HTML
    const formattedContent = formatMessage(content);
    contentDiv.innerHTML = formattedContent;
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Format message content with basic markdown-like styling
 * @param {string} content - Raw message content
 * @returns {string} Formatted HTML content
 */
function formatMessage(content) {
    // Convert line breaks to <br>
    let formatted = content.replace(/\n/g, '<br>');
    
    // Convert **bold** to <strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert bullet points
    formatted = formatted.replace(/• /g, '<li>');
    formatted = formatted.replace(/📌 /g, '<li>');
    formatted = formatted.replace(/✅ /g, '<li>');
    formatted = formatted.replace(/🎯 /g, '<li>');
    formatted = formatted.replace(/🔍 /g, '<li>');
    formatted = formatted.replace(/📱 /g, '<li>');
    formatted = formatted.replace(/💬 /g, '<li>');
    formatted = formatted.replace(/📸 /g, '<li>');
    formatted = formatted.replace(/🎬 /g, '<li>');
    formatted = formatted.replace(/🎣 /g, '<li>');
    formatted = formatted.replace(/🔎 /g, '<li>');
    
    // Wrap lists
    if (formatted.includes('<li>')) {
        formatted = formatted.replace(/(<li>.*?)<br>/g, '$1</li>');
        formatted = formatted.replace(/(<li>(?:(?!<li>).)*?)(?=<li>|$)/gs, '<ul>$1</ul>');
    }
    
    return formatted;
}

/**
 * Generate bot response based on user input
 * @param {string} userMessage - User's message
 * @returns {string} Bot's response
 */
function generateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for greetings first
    if (matchesKeywords(lowerMessage, CHATBOT_DATA.greetings.keywords)) {
        return getRandomResponse(CHATBOT_DATA.greetings.responses);
    }
    
    // Check for help command
    if (matchesKeywords(lowerMessage, CHATBOT_DATA.help.keywords)) {
        return CHATBOT_DATA.help.response;
    }
    
    // Check for specific topics
    if (matchesKeywords(lowerMessage, CHATBOT_DATA.spotFakeNews.keywords)) {
        return CHATBOT_DATA.spotFakeNews.response;
    }
    
    if (matchesKeywords(lowerMessage, CHATBOT_DATA.verifySources.keywords)) {
        return CHATBOT_DATA.verifySources.response;
    }
    
    if (matchesKeywords(lowerMessage, CHATBOT_DATA.mediaBias.keywords)) {
        return CHATBOT_DATA.mediaBias.response;
    }
    
    if (matchesKeywords(lowerMessage, CHATBOT_DATA.factCheck.keywords)) {
        return CHATBOT_DATA.factCheck.response;
    }
    
    if (matchesKeywords(lowerMessage, CHATBOT_DATA.socialMedia.keywords)) {
        return CHATBOT_DATA.socialMedia.response;
    }
    
    if (matchesKeywords(lowerMessage, CHATBOT_DATA.images.keywords)) {
        return CHATBOT_DATA.images.response;
    }
    
    if (matchesKeywords(lowerMessage, CHATBOT_DATA.deepfakes.keywords)) {
        return CHATBOT_DATA.deepfakes.response;
    }
    
    if (matchesKeywords(lowerMessage, CHATBOT_DATA.clickbait.keywords)) {
        return CHATBOT_DATA.clickbait.response;
    }
    
    if (matchesKeywords(lowerMessage, CHATBOT_DATA.conspiracy.keywords)) {
        return CHATBOT_DATA.conspiracy.response;
    }
    
    // Check for questions about the tool itself
    if (lowerMessage.includes('what can you') || lowerMessage.includes('how do you work')) {
        return `I'm TruthBot, your fake news detection assistant! I can help you:

• Learn how to spot fake news
• Understand how to verify sources
• Recognize different types of misinformation
• Use fact-checking tools effectively
• Protect yourself on social media

You can also use our detection tool to analyze specific content. Just type "help" to see all my capabilities!`;
    }
    
    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return getRandomResponse([
            'You\'re welcome! Stay vigilant against misinformation! 😊',
            'Happy to help! Remember to always verify before you share!',
            'My pleasure! Feel free to ask if you have more questions about fake news detection.'
        ]);
    }
    
    // Goodbye responses
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you')) {
        return getRandomResponse([
            'Goodbye! Stay informed and always question what you read! 👋',
            'See you later! Keep fighting misinformation!',
            'Take care! Remember to verify news before sharing!'
        ]);
    }
    
    // Default response with suggestions
    return `I'm not sure I understand that specific question, but I'm here to help! 🤔

Here are some things you can ask me about:
• "How to spot fake news?"
• "How to verify sources?"
• "What is media bias?"
• "How to fact-check?"
• "Tips for social media"
• "How to verify images?"

Type "help" for a complete list of topics I can assist with!`;
}

/**
 * Check if message matches any keywords
 * @param {string} message - User message
 * @param {Array} keywords - Array of keywords to match
 * @returns {boolean} True if match found
 */
function matchesKeywords(message, keywords) {
    return keywords.some(keyword => message.includes(keyword));
}

/**
 * Get random response from array
 * @param {Array} responses - Array of possible responses
 * @returns {string} Random response
 */
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Clear chat history
 */
function clearChatHistory() {
    const chatMessages = document.getElementById('chatMessages');
    
    // Confirm before clearing
    if (confirm('Are you sure you want to clear the chat history?')) {
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>Chat history cleared! 🧹</p>
                    <p>How can I help you today?</p>
                </div>
            </div>
        `;
        
        window.appUtils.showNotification('Chat history cleared', 'success');
    }
}

// Export chatbot functions
window.chatbot = {
    handleUserMessage,
    generateResponse,
    clearChatHistory
};
