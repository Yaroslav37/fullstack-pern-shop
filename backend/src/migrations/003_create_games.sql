CREATE TABLE game (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    publisher VARCHAR(100)
);
