// ===== EmpyreLab — App Logic =====

// Navigation
function showDashboard() {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    startClock();
    startLifeClock();
    updateGreeting();
}

function showLanding() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('landing').classList.remove('hidden');
}

// Tab Switching
function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    
    if (tab === 'life') {
        document.getElementById('lifeOS').classList.remove('hidden');
        document.getElementById('businessOS').classList.add('hidden');
    } else {
        document.getElementById('lifeOS').classList.add('hidden');
        document.getElementById('businessOS').classList.remove('hidden');
        animateStats();
    }
}

// Life Clock
function startLifeClock() {
    function update() {
        const now = new Date();
        const h = now.getHours().toString().padStart(2, '0');
        const m = now.getMinutes().toString().padStart(2, '0');
        const el = document.getElementById('bigTime');
        if (el) el.textContent = `${h}:${m}`;
        
        const dateEl = document.getElementById('dateLine');
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString('en-US', {
                weekday: 'long', month: 'short', day: 'numeric'
            });
        }
    }
    update();
    setInterval(update, 10000);
}

// Greeting
function updateGreeting() {
    const hour = new Date().getHours();
    const el = document.getElementById('greeting');
    const name = document.getElementById('userName')?.value || 'Dylan';
    let greeting, emoji, sub;
    
    if (hour < 5) { greeting = 'Night owl'; emoji = '🌙'; sub = "Burning the midnight oil"; }
    else if (hour < 12) { greeting = 'Good morning'; emoji = '☀️'; sub = "Here's your day at a glance"; }
    else if (hour < 17) { greeting = 'Good afternoon'; emoji = '🌤️'; sub = "How's your day going?"; }
    else if (hour < 21) { greeting = 'Good evening'; emoji = '🌅'; sub = "Winding down for the day"; }
    else { greeting = 'Good night'; emoji = '🌙'; sub = "Let's wrap things up"; }
    
    if (el) el.innerHTML = `${greeting}, <span class="gradient-text">${name}</span> ${emoji}`;
    
    const subEl = document.getElementById('greetingSub');
    if (subEl) subEl.textContent = sub;
}

function updateUserName(name) {
    updateGreeting();
}

// Business Clock
function startClock() {
    function update() {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
        });
        const date = now.toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric'
        });
        const el = document.getElementById('currentTime');
        if (el) el.textContent = `${date} • ${time}`;
    }
    update();
    setInterval(update, 1000);
}

// AI Search
function handleAISearch(e) {
    if (e.key === 'Enter') submitAISearch();
}

function submitAISearch() {
    const input = document.getElementById('aiSearchInput');
    const query = input.value.trim();
    if (!query) return;
    
    const responses = {
        'weather': '☀️ Currently 72°F and sunny in Phoenix, AZ. High of 78°F today. Perfect day to be outside!',
        'tasks': 'You have 4 incomplete tasks today: Complete Gumroad payment setup (urgent), Send Menyum orders, Screen record Empyre AI video, Theoretika Short #2.',
        'revenue': 'Current MTD revenue: $0. Your Kurzgesagt Prompt Pack ($9+) is ready but blocked by Gumroad payment setup. Once published, projected first-month revenue: $50-200.',
        'agent': 'Dylbot is currently ONLINE and building EmpyreLab v2 with LifeOS + BusinessOS tabs. Completed 7 tasks today including: video fixes, audio downloads, prompt pack creation, and dashboard deployment.',
        'kalshi': 'Kalshi portfolio: $5.73 cash + $4.86 in positions. 7 trades placed, 57% win rate. Weather scanner is active monitoring NYC, Chicago, Denver, Austin.',
        'menyum': '⚠️ Menyum deadline is March 10 — 10 days away! Orders collected so far: Audrey\'s In-N-Out order, Taco Bell. Still need more restaurant orders from you.',
        'youtube': 'Theoretika: 8 videos, 26 shorts, 1,247 views, 42 subscribers. Estimated RPM: $9-14. Next short scheduled: "The Day Earth\'s Core Stops Spinning".',
    };
    
    // Find matching response
    let response = null;
    const q = query.toLowerCase();
    for (const [key, val] of Object.entries(responses)) {
        if (q.includes(key)) { response = val; break; }
    }
    
    if (!response) {
        response = `I'd answer "${query}" but I'm running in demo mode! In the full version, this connects to your AI agent for real-time answers about your business, schedule, and life.`;
    }
    
    showAIResponse(response);
    input.value = '';
}

function showAIResponse(text) {
    const panel = document.getElementById('aiResponse');
    const body = document.getElementById('aiResponseText');
    body.textContent = text;
    panel.classList.remove('hidden');
    
    // Auto-hide after 15s
    setTimeout(() => { panel.classList.add('hidden'); }, 15000);
}

function closeAIResponse() {
    document.getElementById('aiResponse').classList.add('hidden');
}

// Settings
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    document.getElementById('notifPanel').classList.add('hidden');
    panel.classList.toggle('hidden');
}

function toggleNotifications() {
    const panel = document.getElementById('notifPanel');
    document.getElementById('settingsPanel').classList.add('hidden');
    panel.classList.toggle('hidden');
}

// Accent Color
function setAccent(el) {
    const color = el.dataset.color;
    document.documentElement.style.setProperty('--accent', color);
    const r = parseInt(color.slice(1,3), 16);
    const g = parseInt(color.slice(3,5), 16);
    const b = parseInt(color.slice(5,7), 16);
    document.documentElement.style.setProperty('--accent-glow', `rgba(${r},${g},${b},0.15)`);
    document.documentElement.style.setProperty('--accent-glow-strong', `rgba(${r},${g},${b},0.3)`);
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
}

// Background Theme
function setBg(theme) {
    document.body.className = document.body.className.replace(/bg-\w+/g, '').replace(/style-\w+/g, '');
    if (theme !== 'dark') document.body.classList.add(`bg-${theme}`);
    // Re-apply panel style
    const ps = document.getElementById('panelStyle');
    if (ps && ps.value !== 'glass') document.body.classList.add(`style-${ps.value}`);
}

// Panel Style
function setPanelStyle(style) {
    document.body.className = document.body.className.replace(/style-\w+/g, '');
    if (style !== 'glass') document.body.classList.add(`style-${style}`);
}

// Toggle Animations
function toggleAnimations() {
    // placeholder
}

// Animate stats
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
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * eased);
        el.textContent = prefix + current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// Add Task (Business)
function addTask() {
    const name = prompt('Task name:');
    if (!name) return;
    const list = document.getElementById('taskList');
    const item = document.createElement('div');
    item.className = 'task-item';
    item.innerHTML = `<input type="checkbox" onclick="this.parentElement.classList.toggle('done')"><span>${name}</span>`;
    list.appendChild(item);
}

// Add Task (Life)
function addLifeTask() {
    const name = prompt('What do you need to do?');
    if (!name) return;
    const list = document.getElementById('lifeTaskList');
    const item = document.createElement('div');
    item.className = 'task-item';
    item.innerHTML = `<input type="checkbox" onclick="this.parentElement.classList.toggle('done')"><span>${name}</span><span class="task-tag">📌</span>`;
    list.appendChild(item);
}

// Add Reminder
function addReminder() {
    const text = prompt('Reminder:');
    if (!text) return;
    const list = document.getElementById('reminderList');
    const item = document.createElement('div');
    item.className = 'reminder-item';
    item.innerHTML = `
        <div class="reminder-icon">📌</div>
        <div class="reminder-content">
            <div class="reminder-text">${text}</div>
            <div class="reminder-meta">Just added</div>
        </div>
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
        document.getElementById('aiSearchInput')?.focus();
    }
});

// Smooth scroll
function scrollTo(selector) {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#dashboard') showDashboard();
});
