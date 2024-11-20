CREATE TABLE promocode (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    discount DECIMAL(5, 2) NOT NULL,
    expiration_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
