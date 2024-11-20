CREATE TABLE transaction (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES "order"(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(20),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
