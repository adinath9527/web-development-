// List of all available time zones
const TIMEZONES = [
    // Americas
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Anchorage',
    'Pacific/Honolulu',
    'America/Toronto',
    'America/Vancouver',
    'America/Mexico_City',
    'America/Buenos_Aires',
    'America/Sao_Paulo',

    // Europe
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Madrid',
    'Europe/Rome',
    'Europe/Amsterdam',
    'Europe/Brussels',
    'Europe/Vienna',
    'Europe/Prague',
    'Europe/Budapest',
    'Europe/Istanbul',
    'Europe/Moscow',
    'Europe/Dublin',
    'Europe/Lisbon',

    // Asia
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Bangkok',
    'Asia/Singapore',
    'Asia/Hong_Kong',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Asia/Manila',
    'Asia/Jakarta',
    'Asia/Kuala_Lumpur',
    'Asia/Manila',
    'Asia/Ho_Chi_Minh',
    'Asia/Karachi',
    'Asia/Kabul',
    'Asia/Tehran',
    'Asia/Baghdad',
    'Asia/Beirut',
    'Asia/Jerusalem',
    'Asia/Amman',
    'Asia/Riyadh',

    // Africa
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Africa/Lagos',
    'Africa/Casablanca',
    'Africa/Nairobi',
    'Africa/Addis_Ababa',
    'Africa/Mauritius',

    // Oceania
    'Australia/Sydney',
    'Australia/Melbourne',
    'Australia/Brisbane',
    'Australia/Perth',
    'Australia/Adelaide',
    'Australia/Hobart',
    'Pacific/Auckland',
    'Pacific/Fiji',
    'Pacific/Tahiti'
];

// Timezone display names
const TIMEZONE_NAMES = {
    'America/New_York': 'New York (EST/EDT)',
    'America/Chicago': 'Chicago (CST/CDT)',
    'America/Denver': 'Denver (MST/MDT)',
    'America/Los_Angeles': 'Los Angeles (PST/PDT)',
    'America/Anchorage': 'Anchorage (AKST/AKDT)',
    'Pacific/Honolulu': 'Honolulu (HST)',
    'America/Toronto': 'Toronto (EST/EDT)',
    'America/Vancouver': 'Vancouver (PST/PDT)',
    'America/Mexico_City': 'Mexico City (CST/CDT)',
    'America/Buenos_Aires': 'Buenos Aires (ART)',
    'America/Sao_Paulo': 'São Paulo (BRT)',
    'Europe/London': 'London (GMT/BST)',
    'Europe/Paris': 'Paris (CET/CEST)',
    'Europe/Berlin': 'Berlin (CET/CEST)',
    'Europe/Madrid': 'Madrid (CET/CEST)',
    'Europe/Rome': 'Rome (CET/CEST)',
    'Europe/Amsterdam': 'Amsterdam (CET/CEST)',
    'Europe/Brussels': 'Brussels (CET/CEST)',
    'Europe/Vienna': 'Vienna (CET/CEST)',
    'Europe/Prague': 'Prague (CET/CEST)',
    'Europe/Budapest': 'Budapest (CET/CEST)',
    'Europe/Istanbul': 'Istanbul (EET/EEST)',
    'Europe/Moscow': 'Moscow (MSK)',
    'Europe/Dublin': 'Dublin (GMT/IST)',
    'Europe/Lisbon': 'Lisbon (WET/WEST)',
    'Asia/Dubai': 'Dubai (GST)',
    'Asia/Kolkata': 'India - Delhi (IST)',
    'Asia/Bangkok': 'Bangkok (ICT)',
    'Asia/Singapore': 'Singapore (SGT)',
    'Asia/Hong_Kong': 'Hong Kong (HKT)',
    'Asia/Shanghai': 'Shanghai (CST)',
    'Asia/Tokyo': 'Tokyo (JST)',
    'Asia/Seoul': 'Seoul (KST)',
    'Asia/Manila': 'Manila (PHT)',
    'Asia/Jakarta': 'Jakarta (WIB)',
    'Asia/Kuala_Lumpur': 'Kuala Lumpur (MYT)',
    'Asia/Ho_Chi_Minh': 'Ho Chi Minh (ICT)',
    'Asia/Karachi': 'Karachi (PKT)',
    'Asia/Kabul': 'Kabul (AFT)',
    'Asia/Tehran': 'Tehran (IRST)',
    'Asia/Baghdad': 'Baghdad (AST)',
    'Asia/Beirut': 'Beirut (EET)',
    'Asia/Jerusalem': 'Jerusalem (IST)',
    'Asia/Amman': 'Amman (EET)',
    'Asia/Riyadh': 'Riyadh (AST)',
    'Africa/Cairo': 'Cairo (EET)',
    'Africa/Johannesburg': 'Johannesburg (SAST)',
    'Africa/Lagos': 'Lagos (WAT)',
    'Africa/Casablanca': 'Casablanca (WET/WEST)',
    'Africa/Nairobi': 'Nairobi (EAT)',
    'Africa/Addis_Ababa': 'Addis Ababa (EAT)',
    'Africa/Mauritius': 'Mauritius (MUT)',
    'Australia/Sydney': 'Sydney (AEST/AEDT)',
    'Australia/Melbourne': 'Melbourne (AEST/AEDT)',
    'Australia/Brisbane': 'Brisbane (AEST)',
    'Australia/Perth': 'Perth (AWST)',
    'Australia/Adelaide': 'Adelaide (ACST/ACDT)',
    'Australia/Hobart': 'Hobart (AEST/AEDT)',
    'Pacific/Auckland': 'Auckland (NZST/NZDT)',
    'Pacific/Fiji': 'Fiji (FJT)',
    'Pacific/Tahiti': 'Tahiti (TAHT)'
};

// DOM Elements
const clocksGrid = document.getElementById('clocksGrid');
const addClockBtn = document.getElementById('addClockBtn');
const resetBtn = document.getElementById('resetBtn');
const toggle12Hour = document.getElementById('toggle12Hour');
const modalAddClock = document.getElementById('modalAddClock');
const timezoneSearch = document.getElementById('timezoneSearch');
const timezoneList = document.getElementById('timezoneList');

// State
let activeTimezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney', 'America/Los_Angeles'];
let use12HourFormat = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeClocks();
    updateAllClocks();
    setInterval(updateAllClocks, 1000);
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    addClockBtn.addEventListener('click', openModal);
    resetBtn.addEventListener('click', resetToDefault);
    toggle12Hour.addEventListener('change', (e) => {
        use12HourFormat = e.target.checked;
        updateAllClocks();
    });
    timezoneSearch.addEventListener('input', searchTimezones);
}

// Initialize clocks display
function initializeClocks() {
    populateTimezoneList();
}

// Update all clocks
function updateAllClocks() {
    const now = new Date();
    
    activeTimezones.forEach(timezone => {
        updateClock(timezone, now);
    });
}

// Update a single clock
function updateClock(timezone, now) {
    const timeElement = document.querySelector(`#clock-${timezone} .time`);
    const periodElement = document.querySelector(`#clock-${timezone} .period`);
    const dateElement = document.querySelector(`#date-${timezone}`);
    const offsetElement = document.querySelector(`#offset-${timezone}`);

    if (!timeElement) return;

    // Get time in specified timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const dateParts = formatter.formatToParts(now);
    let hours = parseInt(dateParts.find(p => p.type === 'hour').value);
    const minutes = dateParts.find(p => p.type === 'minute').value;
    const seconds = dateParts.find(p => p.type === 'second').value;

    let period = 'AM';
    let displayHours = hours;

    if (use12HourFormat) {
        if (hours >= 12) {
            period = 'PM';
            displayHours = hours > 12 ? hours - 12 : 12;
        } else {
            period = 'AM';
            displayHours = hours === 0 ? 12 : hours;
        }
        periodElement.textContent = period;
        periodElement.classList.add('show');
    } else {
        periodElement.classList.remove('show');
        displayHours = hours;
    }

    const time = `${String(displayHours).padStart(2, '0')}:${minutes}:${seconds}`;
    timeElement.textContent = time;

    // Update date
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: '2-digit'
    });

    dateElement.textContent = dateFormatter.format(now);

    // Update offset
    updateTimezoneOffset(timezone, offsetElement);
}

// Update timezone offset
function updateTimezoneOffset(timezone, offsetElement) {
    const now = new Date();
    
    // Create two dates to calculate offset
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const parts = formatter.formatToParts(now);
    const tzHours = parseInt(parts.find(p => p.type === 'hour').value);
    const tzMinutes = parseInt(parts.find(p => p.type === 'minute').value);

    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();

    let offsetHours = tzHours - utcHours;
    let offsetMinutes = tzMinutes - utcMinutes;

    // Handle day boundary
    if (offsetHours > 12) offsetHours -= 24;
    if (offsetHours < -12) offsetHours += 24;

    const sign = offsetHours >= 0 ? '+' : '';
    const offsetStr = offsetMinutes === 0 
        ? `UTC${sign}${offsetHours}` 
        : `UTC${sign}${offsetHours}:${String(Math.abs(offsetMinutes)).padStart(2, '0')}`;
    
    offsetElement.textContent = offsetStr;
}

// Populate timezone list
function populateTimezoneList() {
    timezoneList.innerHTML = '';
    
    TIMEZONES.forEach(timezone => {
        const isActive = activeTimezones.includes(timezone);
        const item = document.createElement('div');
        item.className = `timezone-item ${isActive ? 'active' : ''}`;
        item.textContent = TIMEZONE_NAMES[timezone] || timezone;
        item.onclick = () => toggleTimezone(timezone, item);
        timezoneList.appendChild(item);
    });
}

// Toggle timezone
function toggleTimezone(timezone, itemElement) {
    if (activeTimezones.includes(timezone)) {
        activeTimezones = activeTimezones.filter(tz => tz !== timezone);
        itemElement.classList.remove('active');
        removeClock(timezone);
    } else {
        activeTimezones.push(timezone);
        itemElement.classList.add('active');
        addClockToDOM(timezone);
    }
}

// Add clock to DOM
function addClockToDOM(timezone) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.dataset.timezone = timezone;
    card.innerHTML = `
        <div class="clock-header">
            <h2>${TIMEZONE_NAMES[timezone].split(' (')[0]}</h2>
            <span class="timezone-info">${TIMEZONE_NAMES[timezone].split(' (')[1].slice(0, -1)}</span>
        </div>
        <div class="digital-clock" id="clock-${timezone}">
            <span class="time">00:00:00</span>
            <span class="period">AM</span>
        </div>
        <div class="date-display" id="date-${timezone}">Mon, Jan 01</div>
        <div class="offset" id="offset-${timezone}">UTC+0</div>
        <button class="btn-remove" onclick="removeClock('${timezone}')">✕</button>
    `;
    
    clocksGrid.appendChild(card);
    updateClock(timezone, new Date());
    
    // Trigger animation
    setTimeout(() => {
        card.style.animation = 'slideUp 0.6s ease';
    }, 10);
}

// Remove clock
function removeClock(timezone) {
    activeTimezones = activeTimezones.filter(tz => tz !== timezone);
    
    const card = document.querySelector(`[data-timezone="${timezone}"]`);
    if (card) {
        card.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            card.remove();
        }, 300);
    }
    
    // Update list
    const item = Array.from(timezoneList.children).find(el => 
        el.textContent === (TIMEZONE_NAMES[timezone] || timezone)
    );
    if (item) {
        item.classList.remove('active');
    }
}

// Open modal
function openModal() {
    modalAddClock.classList.add('show');
    timezoneSearch.focus();
}

// Close modal
function closeModal() {
    modalAddClock.classList.remove('show');
    timezoneSearch.value = '';
    populateTimezoneList();
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modalAddClock) {
        closeModal();
    }
});

// Search timezones
function searchTimezones() {
    const searchTerm = timezoneSearch.value.toLowerCase();
    
    if (!searchTerm) {
        populateTimezoneList();
        return;
    }
    
    timezoneList.innerHTML = '';
    
    const filtered = TIMEZONES.filter(timezone => {
        const name = TIMEZONE_NAMES[timezone] || timezone;
        return name.toLowerCase().includes(searchTerm);
    });
    
    filtered.forEach(timezone => {
        const isActive = activeTimezones.includes(timezone);
        const item = document.createElement('div');
        item.className = `timezone-item ${isActive ? 'active' : ''}`;
        item.textContent = TIMEZONE_NAMES[timezone] || timezone;
        item.onclick = () => {
            toggleTimezone(timezone, item);
            closeModal();
        };
        timezoneList.appendChild(item);
    });
}

// Reset to default
function resetToDefault() {
    activeTimezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney', 'America/Los_Angeles'];
    toggle12Hour.checked = false;
    use12HourFormat = false;
    
    // Clear current clocks
    clocksGrid.innerHTML = '';
    
    // Recreate default clocks
    activeTimezones.forEach(timezone => {
        addClockToDOM(timezone);
    });
    
    populateTimezoneList();
}

// Keyboard shortcut to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
