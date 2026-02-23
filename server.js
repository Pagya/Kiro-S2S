const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Admin credentials (in production, use environment variables and hashed passwords)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Simple token storage (in production, use JWT or session management)
const validTokens = new Set();

// Generate token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Middleware to check authentication
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.substring(7);
  
  if (!validTokens.has(token)) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  next();
}

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = generateToken();
    validTokens.add(token);
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Create booking
app.post('/api/bookings', (req, res) => {
  try {
    const { name, phone, email, address, service, date, time, details } = req.body;
    
    if (!name || !phone || !email || !address || !service || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = db.insertBooking.run(name, phone, email, address, service, date, time, details || '');
    
    res.json({ 
      success: true, 
      bookingId: result.lastInsertRowid,
      message: 'Booking created successfully' 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get all bookings (protected)
app.get('/api/bookings', requireAuth, (req, res) => {
  try {
    const bookings = db.getAllBookings.all();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking by ID (protected)
app.get('/api/bookings/:id', requireAuth, (req, res) => {
  try {
    const booking = db.getBookingById.get(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Update booking status (protected)
app.patch('/api/bookings/:id/status', requireAuth, (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    db.updateBookingStatus.run(status, req.params.id);
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Delete booking (protected)
app.delete('/api/bookings/:id', requireAuth, (req, res) => {
  try {
    db.deleteBooking.run(req.params.id);
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Get statistics (protected)
app.get('/api/stats', requireAuth, (req, res) => {
  try {
    const stats = db.getStats.get();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin.html`);
});
