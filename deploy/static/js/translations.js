/**
 * Multi-language Translations
 * Supports: English, Spanish, French, German, Chinese, Arabic, Hindi
 */

const translations = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.detect': 'Detect',
        'nav.history': 'History',
        'nav.about': 'About',
        
        // Hero Section
        'hero.badge': 'REALIX - AI-Powered Detection',
        'hero.title1': 'Combat',
        'hero.title2': 'Misinformation',
        'hero.title3': 'with AI Precision',
        'hero.description': 'Leverage cutting-edge artificial intelligence to detect fake news instantly. Upload text or images for real-time authenticity verification.',
        'hero.startBtn': 'Start Detection',
        'hero.learnBtn': 'Learn More',
        'hero.stat1': 'Accuracy',
        'hero.stat2': 'Checks',
        'hero.stat3': 'Response',
        'hero.card1': 'Protected',
        'hero.card2': 'Verified',
        'hero.card3': 'AI-Powered',
        
        // Detection Section
        'detect.badge': 'Detection Tool',
        'detect.title': 'Check News Authenticity',
        'detect.subtitle': 'Upload content in multiple formats for instant AI-powered analysis',
        'detect.uploadTitle': 'Submit Content',
        'detect.textMode': 'Text',
        'detect.imageMode': 'Image',
        'detect.textLabel': 'Paste News Content',
        'detect.textPlaceholder': 'Paste the news article text here...',
        'detect.characters': 'characters',
        'detect.imageLabel': 'Upload Screenshot',
        'detect.dragDrop': 'Drag & drop an image or click to browse',
        'detect.fileHint': 'JPG, PNG, GIF (Max 5MB)',
        'detect.analyzeBtn': 'Analyze Content',
        'detect.resultsTitle': 'Analysis Results',
        'detect.emptyTitle': 'Ready for Analysis',
        'detect.emptyText': 'Submit content to see detection results here',
        
        // History Section
        'history.badge': 'Detection History',
        'history.title': 'Your Analysis History',
        'history.subtitle': 'View all your previous fake news detection results',
        'history.all': 'All',
        'history.real': 'Real',
        'history.fake': 'Fake',
        'history.clearBtn': 'Clear History',
        'history.empty': 'No detection history yet. Start analyzing content!',
        
        // About Section
        'about.badge': 'About Us',
        'about.title': 'How TruthVerify Works',
        'about.subtitle': 'Advanced AI technology for detecting misinformation',
        'about.mission': 'Our Mission',
        'about.missionText': 'Combat the spread of misinformation by providing accessible, AI-powered fake news detection tools to everyone worldwide.',
        'about.technology': 'AI Technology',
        'about.technologyText': 'Utilizing cutting-edge natural language processing and computer vision to analyze content patterns and credibility indicators.',
        'about.privacy': 'Privacy First',
        'about.privacyText': 'Your data is encrypted and never stored permanently. We prioritize your privacy and security in every analysis.',
        
        // Footer
        'footer.tagline': 'Empowering truth in the digital age',
        'footer.product': 'Product',
        'footer.detection': 'Detection Tool',
        'footer.api': 'API Access',
        'footer.pricing': 'Pricing',
        'footer.company': 'Company',
        'footer.aboutUs': 'About Us',
        'footer.blog': 'Blog',
        'footer.contact': 'Contact',
        'footer.legal': 'Legal',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms of Service',
        'footer.cookies': 'Cookie Policy',
        'footer.rights': 'All rights reserved.',
        
        // Chatbot
        'chatbot.name': 'REALIX Bot',
        'chatbot.online': 'Online',
        'chatbot.welcome': 'Hi! I\'m TruthBot. Ask me anything about fake news detection!',
        'chatbot.placeholder': 'Type your question...',
        
        // Loading
        'loading.text': 'Analyzing content...'
    },
    
    es: {
        // Spanish translations
        'nav.home': 'Inicio',
        'nav.detect': 'Detectar',
        'nav.history': 'Historial',
        'nav.about': 'Acerca de',
        
        'hero.badge': 'Detección con IA',
        'hero.title1': 'Combate',
        'hero.title2': 'Desinformación',
        'hero.title3': 'con Precisión de IA',
        'hero.description': 'Aproveche la inteligencia artificial de vanguardia para detectar noticias falsas al instante. Cargue texto o imágenes para verificación de autenticidad en tiempo real.',
        'hero.startBtn': 'Comenzar Detección',
        'hero.learnBtn': 'Saber Más',
        'hero.stat1': 'Precisión',
        'hero.stat2': 'Verificaciones',
        'hero.stat3': 'Respuesta',
        
        'detect.badge': 'Herramienta de Detección',
        'detect.title': 'Verificar Autenticidad de Noticias',
        'detect.subtitle': 'Cargue contenido en múltiples formatos para análisis instantáneo con IA',
        'detect.textPlaceholder': 'Pegue el texto del artículo aquí...',
        'detect.analyzeBtn': 'Analizar Contenido',
        
        'history.title': 'Tu Historial de Análisis',
        'history.subtitle': 'Ver todos tus resultados anteriores de detección de noticias falsas',
        
        'about.title': 'Cómo Funciona TruthVerify',
        'about.subtitle': 'Tecnología de IA avanzada para detectar desinformación',
        
        'chatbot.welcome': '¡Hola! Soy TruthBot. ¡Pregúntame sobre detección de noticias falsas!',
        'loading.text': 'Analizando contenido...'
    },
    
    fr: {
        // French translations
        'nav.home': 'Accueil',
        'nav.detect': 'Détecter',
        'nav.history': 'Historique',
        'nav.about': 'À propos',
        
        'hero.badge': 'Détection par IA',
        'hero.title1': 'Combattez',
        'hero.title2': 'Désinformation',
        'hero.title3': 'avec Précision IA',
        'hero.description': 'Exploitez l\'intelligence artificielle de pointe pour détecter instantanément les fausses nouvelles. Téléchargez du texte ou des images pour une vérification d\'authenticité en temps réel.',
        'hero.startBtn': 'Commencer la Détection',
        'hero.learnBtn': 'En Savoir Plus',
        
        'detect.title': 'Vérifier l\'Authenticité des Nouvelles',
        'detect.analyzeBtn': 'Analyser le Contenu',
        
        'chatbot.welcome': 'Salut! Je suis TruthBot. Demandez-moi sur la détection de fausses nouvelles!',
        'loading.text': 'Analyse du contenu...'
    },
    
    de: {
        // German translations
        'nav.home': 'Startseite',
        'nav.detect': 'Erkennen',
        'nav.history': 'Verlauf',
        'nav.about': 'Über uns',
        
        'hero.badge': 'KI-gestützte Erkennung',
        'hero.title1': 'Bekämpfen Sie',
        'hero.title2': 'Fehlinformation',
        'hero.title3': 'mit KI-Präzision',
        'hero.description': 'Nutzen Sie modernste künstliche Intelligenz zur sofortigen Erkennung von Fake News. Laden Sie Text oder Bilder zur Echtzeit-Authentizitätsprüfung hoch.',
        'hero.startBtn': 'Erkennung Starten',
        'hero.learnBtn': 'Mehr Erfahren',
        
        'detect.title': 'Nachrichten-Authentizität Prüfen',
        'detect.analyzeBtn': 'Inhalt Analysieren',
        
        'chatbot.welcome': 'Hallo! Ich bin TruthBot. Fragen Sie mich über Fake-News-Erkennung!',
        'loading.text': 'Inhalt wird analysiert...'
    },
    
    zh: {
        // Chinese translations
        'nav.home': '首页',
        'nav.detect': '检测',
        'nav.history': '历史',
        'nav.about': '关于',
        
        'hero.badge': 'AI驱动检测',
        'hero.title1': '打击',
        'hero.title2': '虚假信息',
        'hero.title3': '用AI精度',
        'hero.description': '利用尖端人工智能即时检测假新闻。上传文本或图像进行实时真实性验证。',
        'hero.startBtn': '开始检测',
        'hero.learnBtn': '了解更多',
        
        'detect.title': '检查新闻真实性',
        'detect.analyzeBtn': '分析内容',
        
        'chatbot.welcome': '你好！我是TruthBot。问我关于假新闻检测的问题！',
        'loading.text': '正在分析内容...'
    },
    
    ar: {
        // Arabic translations
        'nav.home': 'الرئيسية',
        'nav.detect': 'كشف',
        'nav.history': 'السجل',
        'nav.about': 'حول',
        
        'hero.badge': 'الكشف بالذكاء الاصطناعي',
        'hero.title1': 'محاربة',
        'hero.title2': 'المعلومات المضللة',
        'hero.title3': 'بدقة الذكاء الاصطناعي',
        'hero.description': 'استفد من الذكاء الاصطناعي المتطور للكشف الفوري عن الأخبار المزيفة. قم بتحميل نص أو صور للتحقق من الأصالة في الوقت الفعلي.',
        'hero.startBtn': 'ابدأ الكشف',
        'hero.learnBtn': 'اعرف المزيد',
        
        'detect.title': 'تحقق من صحة الأخبار',
        'detect.analyzeBtn': 'تحليل المحتوى',
        
        'chatbot.welcome': 'مرحبا! أنا TruthBot. اسألني عن كشف الأخبار المزيفة!',
        'loading.text': 'جار تحليل المحتوى...'
    },
    
    hi: {
        // Hindi translations
        'nav.home': 'होम',
        'nav.detect': 'पता लगाएं',
        'nav.history': 'इतिहास',
        'nav.about': 'के बारे में',
        
        'hero.badge': 'AI-संचालित पहचान',
        'hero.title1': 'लड़ो',
        'hero.title2': 'गलत सूचना',
        'hero.title3': 'AI सटीकता के साथ',
        'hero.description': 'फर्जी समाचारों का तुरंत पता लगाने के लिए अत्याधुनिक कृत्रिम बुद्धिमत्ता का लाभ उठाएं। वास्तविक समय प्रामाणिकता सत्यापन के लिए टेक्स्ट या चित्र अपलोड करें।',
        'hero.startBtn': 'पहचान शुरू करें',
        'hero.learnBtn': 'और जानें',
        
        'detect.title': 'समाचार प्रामाणिकता जांचें',
        'detect.analyzeBtn': 'सामग्री का विश्लेषण करें',
        
        'chatbot.welcome': 'नमस्ते! मैं TruthBot हूं। मुझसे फर्जी समाचार पहचान के बारे में पूछें!',
        'loading.text': 'सामग्री का विश्लेषण हो रहा है...'
    }
};

// Get current language from localStorage or default to English
let currentLang = localStorage.getItem('language') || 'en';

/**
 * Apply translations to the page
 * @param {string} lang - Language code
 */
function applyTranslations(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Update current language display
    const langMap = {
        'en': 'EN',
        'es': 'ES',
        'fr': 'FR',
        'de': 'DE',
        'zh': '中文',
        'ar': 'AR',
        'hi': 'HI'
    };
    
    const currentLangElement = document.getElementById('currentLang');
    if (currentLangElement) {
        currentLangElement.textContent = langMap[lang] || 'EN';
    }
    
    // Update HTML dir attribute for RTL languages
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
}

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @returns {string} Translated text
 */
function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || key;
}

// Export functions
window.i18n = {
    applyTranslations,
    t,
    currentLang: () => currentLang
};
