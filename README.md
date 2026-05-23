# 📅 Calendly Clone — Scheduling Platform

A full-stack scheduling and booking web application that replicates Calendly's core experience. Users can create event types, set weekly availability, and share a public booking link so others can schedule meetings with them.

---

## 🚀 Live Demo

- **Frontend:** https://calendly-frontend-amber.vercel.app/
- **Backend API:** https://calendly-backend-api.onrender.com

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Email | Nodemailer (Gmail SMTP) |
| HTTP Client | Axios |

---

## ✅ Features Implemented

### Core Features
- **Event Types** — Create, edit, and delete event types with a name, duration (minutes), and unique URL slug
- **Availability Settings** — Set available days and multiple time intervals per day, with timezone support
- **Public Booking Page** — Month calendar view, available time slot listing, booking form with name and email
- **Double-booking Prevention** — Slots already booked are excluded from available slots in real time
- **Booking Confirmation** — Confirmation screen shown after a successful booking
- **Meetings Dashboard** — View upcoming and past meetings, cancel any scheduled meeting

### Bonus Features
- ✉️ Email notifications on booking confirmation and cancellation (Nodemailer)
- 📱 Responsive design (mobile, tablet, desktop)
- 🕐 Multiple time intervals per day (e.g. 9–12 AM and 2–5 PM)
- 🌐 Timezone selection on the availability settings page

---

## 🗄 Database Schema

```
event_types
  id            INT PK AUTO_INCREMENT
  title         VARCHAR
  slug          VARCHAR UNIQUE
  duration      INT (minutes)
  created_at    TIMESTAMP
  updated_at    TIMESTAMP

availability
  id            INT PK AUTO_INCREMENT
  day_of_week   VARCHAR  (e.g. "Monday")
  start_time    TIME
  end_time      TIME
  timezone      VARCHAR
  created_at    TIMESTAMP
  updated_at    TIMESTAMP

bookings
  id            INT PK AUTO_INCREMENT
  event_type_id INT FK → event_types.id
  invitee_name  VARCHAR
  invitee_email VARCHAR
  booking_date  DATE
  start_time    TIME
  end_time      TIME
  status        ENUM('scheduled', 'cancelled')
  notes         TEXT NULL
  created_at    TIMESTAMP
  updated_at    TIMESTAMP
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL 8+
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) generated

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/calendly-clone.git
cd calendly-clone
```

---

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=calendly_clone

# Gmail SMTP (use an App Password, NOT your Gmail login password)
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

Create the database and tables:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE calendly_clone;
USE calendly_clone;

CREATE TABLE event_types (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  slug       VARCHAR(255) NOT NULL UNIQUE,
  duration   INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE availability (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  day_of_week VARCHAR(20) NOT NULL,
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  timezone    VARCHAR(100) DEFAULT 'Asia/Kolkata',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  event_type_id INT NOT NULL,
  invitee_name  VARCHAR(255) NOT NULL,
  invitee_email VARCHAR(255) NOT NULL,
  booking_date  DATE NOT NULL,
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  status        ENUM('scheduled', 'cancelled') DEFAULT 'scheduled',
  notes         TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE CASCADE
);

-- Seed sample data
INSERT INTO event_types (title, slug, duration) VALUES
  ('Quick Chat', 'quick-chat', 15),
  ('30 Min Meeting', '30-min-meeting', 30),
  ('1 Hour Session', '1-hour-session', 60);

INSERT INTO availability (day_of_week, start_time, end_time, timezone) VALUES
  ('Monday',    '09:00:00', '17:00:00', 'Asia/Kolkata'),
  ('Tuesday',   '09:00:00', '17:00:00', 'Asia/Kolkata'),
  ('Wednesday', '09:00:00', '17:00:00', 'Asia/Kolkata'),
  ('Thursday',  '09:00:00', '17:00:00', 'Asia/Kolkata'),
  ('Friday',    '09:00:00', '17:00:00', 'Asia/Kolkata');
```

Start the backend server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

---

### 3. Frontend setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 📡 API Reference

### Event Types
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/event/` | List all event types |
| POST | `/api/v1/event/` | Create an event type |
| PUT | `/api/v1/event/:id` | Update an event type |
| DELETE | `/api/v1/event/:id` | Delete an event type |

### Availability
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/availability/` | Get all availability slots |
| POST | `/api/v1/availability/` | Create an availability slot |
| DELETE | `/api/v1/availability/:id` | Delete an availability slot |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/bookings` | Get all bookings |
| GET | `/api/v1/bookings/:id` | Get a booking by ID |
| POST | `/api/v1/bookings` | Create a booking |
| DELETE | `/api/v1/bookings/:id` | Cancel a booking |
| GET | `/api/v1/bookings/slot/:slug?date=YYYY-MM-DD` | Get available slots |

---

## 💡 Assumptions Made

- A single default user is assumed to be logged in for the admin side (event types, availability, meetings). No authentication system was built as per the assignment instructions.
- Availability is set on a **weekly recurring** basis (same hours every Monday, etc.), not per specific date.
- The public booking page is accessible to anyone with the event type's slug link — no login required.
- All times are stored in **24-hour format** (`HH:MM:SS`) in the database and converted to 12-hour AM/PM format in the UI.
- Cancelling a booking updates its status to `'cancelled'` rather than deleting the row, so meeting history is preserved.
- Email sending is best-effort — a failure to send an email does not fail the booking itself.

---

## 🔑 Environment Variables Summary

### Server (`server/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Port the Express server listens on |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | MySQL database name |
| `EMAIL_USER` | Gmail address used to send emails |
| `EMAIL_PASS` | Gmail App Password (not your login password) |

### Client (`client/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Base URL of the backend API |

---
