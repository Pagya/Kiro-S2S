# StitchDoor - Doorstep Stitching Service

A complete web application for a doorstep stitching service with booking system, backend API, and admin dashboard.

## Features

- 🏠 Responsive landing page with service information
- 📅 Online booking system with form validation
- 💾 SQLite database for storing bookings
- 🔧 RESTful API built with Express.js
- 📊 Admin dashboard for managing bookings
- ✅ Status tracking (Pending → Confirmed → Completed)

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: SQLite (better-sqlite3)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd stitchdoor
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser:
   - Main site: http://localhost:3000/index.html
   - Admin dashboard: http://localhost:3000/admin.html

## Project Structure

```
├── index.html          # Homepage
├── booking.html        # Booking form page
├── admin.html          # Admin dashboard
├── styles.css          # Styling
├── script.js           # Frontend logic
├── admin.js            # Admin dashboard logic
├── server.js           # Express server
├── database.js         # Database operations
├── package.json        # Dependencies
└── README.md           # Documentation
```

## API Endpoints

- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/stats` - Get booking statistics

## License

MIT
