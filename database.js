const Database = require('better-sqlite3');
const db = new Database('stitchdoor.db');

// Create bookings table
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    service TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert booking
const insertBooking = db.prepare(`
  INSERT INTO bookings (name, phone, email, address, service, date, time, details)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Get all bookings
const getAllBookings = db.prepare(`
  SELECT * FROM bookings ORDER BY created_at DESC
`);

// Get booking by id
const getBookingById = db.prepare(`
  SELECT * FROM bookings WHERE id = ?
`);

// Update booking status
const updateBookingStatus = db.prepare(`
  UPDATE bookings SET status = ? WHERE id = ?
`);

// Delete booking
const deleteBooking = db.prepare(`
  DELETE FROM bookings WHERE id = ?
`);

// Get statistics
const getStats = db.prepare(`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
    SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
  FROM bookings
`);

module.exports = {
  insertBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getStats
};
