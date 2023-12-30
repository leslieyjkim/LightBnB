DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);
DROP TABLE IF EXISTS reservations CASCADE;
CREATE TABLE reservations (
    id serial PRIMARY KEY,
    start_date DATE,
    end_date DATE,
    property_id INTEGER not null REFERENCES properties(id) ON DELETE CASCADE,
    guest_id INTEGER not null REFERENCES users(id) ON DELETE CASCADE
);
DROP TABLE IF EXISTS property_reviews CASCADE;
CREATE TABLE property_reviews (
    id serial PRIMARY KEY,
    guest_id  INTEGER not null REFERENCES users(id) ON DELETE CASCADE,
    property_id INTEGER not null REFERENCES properties(id) ON DELETE CASCADE,
    reservation_id INTEGER not null REFERENCES reservations(id) ON DELETE CASCADE,
    rating SMALLINT,
    message TEXT
);
DROP TABLE IF EXISTS properties CASCADE;
CREATE TABLE properties (
    id serial PRIMARY KEY,
    owner_id INTEGER not null REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    thumbnail_photo_url VARCHAR(255),
    cover_photo_url VARCHAR(255),
    cost_per_night INTEGER,
    parting_spaces INTEGER,
    number_of_bathrooms INTEGER,
    number_of_bedrooms INTEGER,
    country VARCHAR(255),
    street VARCHAR(255),
    city VARCHAR(255),
    province VARCHAR(255),
    post_code VARCHAR(255),
    active BOOLEAN
);