const API_URL = 'http://localhost:3000/api';
let allBookings = [];
let currentFilter = 'all';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return token;
}

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
}

// Get auth headers
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${checkAuth()}`
    };
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`, {
            headers: getAuthHeaders()
        });
        
        if (response.status === 401) {
            logout();
            return;
        }
        
        const stats = await response.json();
        
        document.getElementById('totalBookings').textContent = stats.total || 0;
        document.getElementById('pendingBookings').textContent = stats.pending || 0;
        document.getElementById('confirmedBookings').textContent = stats.confirmed || 0;
        document.getElementById('completedBookings').textContent = stats.completed || 0;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load bookings
async function loadBookings() {
    if (!checkAuth()) return;
    
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            headers: getAuthHeaders()
        });
        
        if (response.status === 401) {
            logout();
            return;
        }
        
        allBookings = await response.json();
        
        displayBookings(allBookings);
        loadStats();
    } catch (error) {
        console.error('Error loading bookings:', error);
        document.getElementById('bookingsContainer').innerHTML = 
            '<div class="empty-state">Failed to load bookings. Make sure the server is running.</div>';
    }
}

// Display bookings
function displayBookings(bookings) {
    const container = document.getElementById('bookingsContainer');
    
    if (bookings.length === 0) {
        container.innerHTML = '<div class="empty-state">No bookings found.</div>';
        return;
    }

    const table = `
        <table class="bookings-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${bookings.map(booking => `
                    <tr>
                        <td>${booking.id}</td>
                        <td>${booking.name}</td>
                        <td>${booking.phone}</td>
                        <td>${booking.service}</td>
                        <td>${booking.date}</td>
                        <td>${booking.time}</td>
                        <td>
                            <span class="status-badge status-${booking.status}">
                                ${booking.status}
                            </span>
                        </td>
                        <td>
                            <div class="action-btns">
                                ${booking.status === 'pending' ? 
                                    `<button class="btn-small btn-confirm" onclick="updateStatus(${booking.id}, 'confirmed')">Confirm</button>` : ''}
                                ${booking.status === 'confirmed' ? 
                                    `<button class="btn-small btn-complete" onclick="updateStatus(${booking.id}, 'completed')">Complete</button>` : ''}
                                <button class="btn-small btn-delete" onclick="deleteBooking(${booking.id})">Delete</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = table;
}

// Update booking status
async function updateStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/bookings/${id}/status`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            loadBookings();
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status');
    }
}

// Delete booking
async function deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/bookings/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            loadBookings();
        }
    } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking');
    }
}

// Filter bookings
function filterBookings(status) {
    currentFilter = status;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === status) {
            btn.classList.add('active');
        }
    });
    
    const filtered = status === 'all' 
        ? allBookings 
        : allBookings.filter(b => b.status === status);
    
    displayBookings(filtered);
}

// Event listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        filterBookings(btn.dataset.filter);
    });
});

// Initial load
loadBookings();
