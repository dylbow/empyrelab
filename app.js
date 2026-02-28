// ===== EmpyreLab — App Logic =====

// Navigation
function showDashboard() {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    startClock();
    animateStats();
}

function showLanding() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('landing').classList.remove('hidden');
}

// Clock
function startClock() {
    function update() {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false 
        });
        const date = now.toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric'
        });
        document.getElementById('currentTime').textContent = `${date} • ${time}`;
    }
    update();
    setInterval(update, 1000);
}

// Settings
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    const notif = document.getElementById('notifPanel');
    notif.classList.add('hidden');
    panel.classList.toggle('hidden');
}

function toggleNotifications() {
    const panel = document.getElementById('notifPanel');
    const settings = document.getElementById('settingsPanel');
    settings.classList.add('hidden');
    panel.classList.toggle('hidden');
}

// Accent Color
function setAccent(el) {
    const color = el.dataset.color;
    document.documentElement.style.setProperty('--accent', color);
    
    // Calculate glow
    const r = parseInt(color.slice(1,3), 16);
    const g = parseInt(color.slice(3,5), 16);
    const b = parseInt(color.slice(5,7), 16);
    document.documentElement.style.setProperty('--accent-glow', `rgba(${r},${g},${b},0.15)`);
    document.documentElement.style.setProperty('--accent-glow-strong', `rgba(${r},${g},${b},0.3)`);
    
    // Update active swatch
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
}

// Dashboard Title
function updateTitle(val) {
    document.getElementById('dashboardTitle').textContent = val;
}

// Background Theme
function setBg(theme) {
    document.body.className = document.body.className.replace(/bg-\w+/g, '');
    if (theme !== 'dark') {
        document.body.classList.add(`bg-${theme}`);
    }
}

// Panel Style
function setPanelStyle(style) {
    document.body.className = document.body.className.replace(/style-\w+/g, '');
    if (style !== 'glass') {
        document.body.classList.add(`style-${style}`);
    }
}

// Toggle Animations
function toggleAnimations() {
    const enabled = document.getElementById('animToggle').checked;
    if (!enabled) {
        document.body.style.setProperty('--transition', 'none');
    } else {
        document.body.style.removeProperty('--transition');
    }
}

// Animate stats on dashboard load
function animateStats() {
    animateValue('revenueMTD', 0, 0, '$', '.00');
    animateValue('ytViews', 0, 1247);
    animateValue('ytSubs', 0, 42);
}

function animateValue(id, start, end, prefix = '', suffix = '') {
    const el = document.getElementById(id);
    if (!el) return;
    
    const duration = 1500;
    const startTime = performance.now();
    
    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * eased);
        
        el.textContent = prefix + current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    }
    
    requestAnimationFrame(tick);
}

// Add Task
function addTask() {
    const name = prompt('Task name:');
    if (!name) return;
    
    const list = document.getElementById('taskList');
    const item = document.createElement('div');
    item.className = 'task-item';
    item.innerHTML = `
        <input type="checkbox" onclick="this.parentElement.classList.toggle('done')">
        <span>${name}</span>
    `;
    list.appendChild(item);
}

// Task checkbox toggle
document.addEventListener('click', (e) => {
    if (e.target.type === 'checkbox' && e.target.closest('.task-item')) {
        e.target.closest('.task-item').classList.toggle('done', e.target.checked);
    }
});

// Keyboard shortcut: Cmd+K for search
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('searchInput');
        if (input) input.focus();
    }
});

// Smooth scroll for landing page
function scrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Auto-refresh activity feed with typing animation
function addActivity(icon, text) {
    const feed = document.getElementById('activityFeed');
    if (!feed) return;
    
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.style.opacity = '0';
    item.style.transform = 'translateY(-10px)';
    item.innerHTML = `
        <span class="activity-time">${time}</span>
        <span class="activity-icon">${icon}</span>
        <span class="activity-text">${text}</span>
    `;
    
    feed.insertBefore(item, feed.firstChild);
    
    // Animate in
    requestAnimationFrame(() => {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check URL hash
    if (window.location.hash === '#dashboard') {
        showDashboard();
    }
});
