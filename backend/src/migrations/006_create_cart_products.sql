CREATE TABLE cart_product (
    id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES cart(id),
    product_id INT REFERENCES product(id),
    quantity INT NOT NULL
);
