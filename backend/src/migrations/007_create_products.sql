CREATE TABLE "order" (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id),
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
