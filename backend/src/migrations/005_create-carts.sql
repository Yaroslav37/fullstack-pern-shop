CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
