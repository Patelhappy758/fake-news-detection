/**
 * History Module
 * Manages detection history storage and display
 */

document.addEventListener('DOMContentLoaded', function() {
    initHistory();
});

/**
 * Initialize history functionality
 */
function initHistory() {
    const clearHistoryBtn = document.getElementById('clearHistory');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Load and display history
    displayHistory();
    
    // Clear history button
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all history?')) {
                clearHistory();
            }
        });
    }
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterHistory(filter);
        });
    });
}

/**
 * Add item to history
 * @param {Object} item - History item
 */
function addToHistory(item) {
    const history = getHistory();
    
    // Add timestamp and ID
    item.timestamp = new Date().toISOString();
    item.id = 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Add to beginning of array
    history.unshift(item);
    
    // Limit to 50 items
    if (history.length > 50) {
        history.pop();
    }
    
    // Save to localStorage
    localStorage.setItem('detectionHistory', JSON.stringify(history));
    
    // Update display
    displayHistory();
}

/**
 * Get history from localStorage
 * @returns {Array} History items
 */
function getHistory() {
    const history = localStorage.getItem('detectionHistory');
    return history ? JSON.parse(history) : [];
}

/**
 * Clear all history
 */
function clearHistory() {
    localStorage.removeItem('detectionHistory');
    displayHistory();
    window.appUtils.showNotification('History cleared', 'success');
}

/**
 * Display history items
 * @param {Array} items - Items to display (optional, defaults to all)
 */
function displayHistory(items = null) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const history = items || getHistory();
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history"></i>
                <p data-i18n="history.empty">No detection history yet. Start analyzing content!</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = history.map(item => createHistoryItemHTML(item)).join('');
    
    // Add event listeners to history items
    attachHistoryItemEvents();
}

/**
 * Create HTML for history item
 * @param {Object} item - History item
 * @returns {string} HTML string
 */
function createHistoryItemHTML(item) {
    const date = new Date(item.timestamp);
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(date);
    
    const isReal = item.result.toLowerCase() === 'real';
    const iconClass = isReal ? 'fa-check-circle' : 'fa-exclamation-triangle';
    const resultClass = isReal ? 'real' : 'fake';
    
    // Truncate content preview
    const preview = item.content ? 
        (item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content) :
        'Image analysis';
    
    return `
        <div class="history-item" data-id="${item.id}" data-result="${resultClass}">
            <div class="history-icon ${resultClass}">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="history-content">
                <div class="history-title">${preview}</div>
                <div class="history-meta">
                    <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    <span><i class="fas fa-clock"></i> ${formattedTime}</span>
                    <span><i class="fas fa-chart-line"></i> ${Math.round(item.confidence * 100)}%</span>
                </div>
            </div>
            <div class="history-actions">
                <button class="history-action-btn view-btn" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="history-action-btn delete-btn" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

/**
 * Attach event listeners to history items
 */
function attachHistoryItemEvents() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const deleteBtns = document.querySelectorAll('.delete-btn');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.history-item');
            const id = item.getAttribute('data-id');
            viewHistoryItem(id);
        });
    });
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.history-item');
            const id = item.getAttribute('data-id');
            deleteHistoryItem(id);
        });
    });
    
    // Click on item to view
    const items = document.querySelectorAll('.history-item');
    items.forEach(item => {
        item.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            viewHistoryItem(id);
        });
    });
}

/**
 * View history item details
 * @param {string} id - Item ID
 */
function viewHistoryItem(id) {
    const history = getHistory();
    const item = history.find(h => h.id === id);
    
    if (!item) return;
    
    // Scroll to detect section
    const detectSection = document.getElementById('detect');
    if (detectSection) {
        detectSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Display the results
    setTimeout(() => {
        window.uploadHandler.displayResults(item);
        window.appUtils.showNotification('Viewing history item', 'info');
    }, 500);
}

/**
 * Delete history item
 * @param {string} id - Item ID
 */
function deleteHistoryItem(id) {
    let history = getHistory();
    history = history.filter(item => item.id !== id);
    
    localStorage.setItem('detectionHistory', JSON.stringify(history));
    displayHistory();
    
    window.appUtils.showNotification('Item deleted', 'success');
}

/**
 * Filter history by type
 * @param {string} filter - Filter type ('all', 'real', 'fake')
 */
function filterHistory(filter) {
    const history = getHistory();
    
    if (filter === 'all') {
        displayHistory(history);
        return;
    }
    
    const filtered = history.filter(item => {
        const result = item.result.toLowerCase();
        return result === filter;
    });
    
    displayHistory(filtered);
}

/**
 * Format date
 * @param {Date} date - Date object
 * @returns {string} Formatted date
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

/**
 * Format time
 * @param {Date} date - Date object
 * @returns {string} Formatted time
 */
function formatTime(date) {
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString(undefined, options);
}

/**
 * Get history statistics
 * @returns {Object} Statistics
 */
function getHistoryStats() {
    const history = getHistory();
    
    const total = history.length;
    const real = history.filter(item => item.result.toLowerCase() === 'real').length;
    const fake = history.filter(item => item.result.toLowerCase() === 'fake').length;
    
    return { total, real, fake };
}

// Export functions
window.historyModule = {
    addToHistory,
    getHistory,
    clearHistory,
    displayHistory,
    getHistoryStats
};
