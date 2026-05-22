CREATE DATABASE IF NOT EXISTS calendly;

USE calendly;


-- =========================================
-- EVENT TYPES TABLE
-- =========================================

CREATE TABLE event_types (
    id INT PRIMARY KEY AUTO_INCREMENT,

    title VARCHAR(255) NOT NULL,

    slug VARCHAR(255) NOT NULL UNIQUE,

    duration INT NOT NULL,

    color VARCHAR(20) NOT NULL DEFAULT '#4F46E5',

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================
-- AVAILABILITY TABLE
-- =========================================

CREATE TABLE availability (
    id INT PRIMARY KEY AUTO_INCREMENT,

    day_of_week ENUM(
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ) NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    timezone VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);



-- =========================================
-- BOOKINGS TABLE
-- =========================================

CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,

    event_type_id INT NOT NULL,

    invitee_name VARCHAR(255) NOT NULL,

    invitee_email VARCHAR(255) NOT NULL,

    booking_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    status ENUM(
        'scheduled',
        'cancelled'
    ) DEFAULT 'scheduled',

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_type
    FOREIGN KEY (event_type_id)
    REFERENCES event_types(id)
    ON DELETE CASCADE
);



-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX idx_event_slug
ON event_types(slug);

CREATE INDEX idx_booking_date
ON bookings(booking_date);

CREATE INDEX idx_booking_status
ON bookings(status);



-- =========================================
-- SAMPLE EVENT TYPES
-- =========================================

INSERT INTO event_types (
    title,
    slug,
    duration,
    description
)
VALUES
(
    '30 Minute Meeting',
    '30-min-meeting',
    30,
    'Quick discussion meeting'
),
(
    '60 Minute Interview',
    '60-min-interview',
    60,
    'Technical interview session'
),
(
    '15 Minute Intro Call',
    '15-min-intro-call',
    15,
    'Short introductory meeting'
);



-- =========================================
-- SAMPLE AVAILABILITY
-- =========================================

INSERT INTO availability (
    day_of_week,
    start_time,
    end_time,
    timezone
)
VALUES
('Monday', '09:00:00', '17:00:00', 'Asia/Kolkata'),
('Tuesday', '09:00:00', '17:00:00', 'Asia/Kolkata'),
('Wednesday', '09:00:00', '17:00:00', 'Asia/Kolkata'),
('Thursday', '09:00:00', '17:00:00', 'Asia/Kolkata'),
('Friday', '09:00:00', '17:00:00', 'Asia/Kolkata');



-- =========================================
-- SAMPLE BOOKINGS
-- =========================================

INSERT INTO bookings (
    event_type_id,
    invitee_name,
    invitee_email,
    booking_date,
    start_time,
    end_time,
    status
)
VALUES
(
    1,
    'Rahul Sharma',
    'rahul@example.com',
    '2026-05-25',
    '10:00:00',
    '10:30:00',
    'scheduled'
),
(
    2,
    'Priya Patel',
    'priya@example.com',
    '2026-05-26',
    '14:00:00',
    '15:00:00',
    'scheduled'
);