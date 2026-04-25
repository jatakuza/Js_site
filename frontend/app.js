const API_URL = 'http://localhost:3000/api';


// ================= REGISTER =================
async function registerUser(event) {
    event.preventDefault();

    const full_name = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const user_role = document.getElementById('role').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, email, login, password, user_role })
        });

        const data = await response.json();

        document.getElementById('message').textContent =
            data.message || data.error || 'Registration failed';

        if (response.ok) {
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }

    } catch (error) {
        console.error(error);
        document.getElementById('message').textContent =
            'Server is not available';
    }
}


// ================= LOGIN =================
async function loginUser(event) {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));

            document.getElementById('message').textContent =
                `Welcome, ${data.user.full_name} (${data.user.user_role})`;

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            document.getElementById('message').textContent =
                data.message || data.error || 'Login failed';
        }

    } catch (error) {
        console.error(error);
        document.getElementById('message').textContent =
            'Server is not available';
    }
}


// ================= AUTH =================
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function requireAuth() {
    const user = getCurrentUser();

    if (!user) {
        alert('Please login first');
        window.location.href = 'login.html';
        return false;
    }

    return true;
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}


// ================= USER INFO =================
function showUserInfo() {
    const userBlock = document.getElementById('user-info');
    if (!userBlock) return;

    const user = getCurrentUser();

    if (user) {
        userBlock.innerHTML = `
            <p><strong>User:</strong> ${user.full_name}</p>
            <p><strong>Role:</strong> ${user.user_role}</p>
            <button onclick="logout()">Logout</button>
        `;
    } else {
        userBlock.innerHTML = `
            <p>You are not logged in</p>
            <a href="login.html">Login</a>
        `;
    }
}


// ================= EVENTS =================
async function loadEvents() {
    if (!requireAuth()) return;

    try {
        const response = await fetch(`${API_URL}/events`);
        const events = await response.json();

        const container = document.getElementById('events-list');
        if (!container) return;

        container.innerHTML = '';

        events.forEach((event) => {
            container.innerHTML += `
                <div class="card">
                    <h3>${event.title}</h3>
                    <p>${event.description || 'No description'}</p>
                    <p><strong>Organizer ID:</strong> ${event.organizer_id}</p>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}


// ================= SCHEDULE =================
async function loadSchedules() {
    if (!requireAuth()) return;

    try {
        const response = await fetch(`${API_URL}/schedules`);
        const schedules = await response.json();

        const container = document.getElementById('schedule-list');
        if (!container) return;

        container.innerHTML = '';

        schedules.forEach((item) => {
            container.innerHTML += `
                <div class="card">
                    <p><strong>Event ID:</strong> ${item.event_id}</p>
                    <p><strong>Start:</strong> ${item.start_time}</p>
                    <p><strong>End:</strong> ${item.end_time}</p>
                    <p><strong>Location:</strong> ${item.schedule_location || 'N/A'}</p>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}


// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    showUserInfo();

    if (document.getElementById('events-list')) {
        loadEvents();
    }

    if (document.getElementById('schedule-list')) {
        loadSchedules();
    }
});