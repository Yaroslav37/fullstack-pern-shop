TRUNCATE TABLE log, product, promocode, game, "user", role RESTART IDENTITY CASCADE;

-- Вставка данных в таблицу ролей
INSERT INTO role (name)
VALUES 
    ('Admin'),
    ('User')
ON CONFLICT DO NOTHING;

-- Вставка данных в таблицу пользователей
INSERT INTO "user" (username, email, password_hash, role_id)
VALUES
    ('admin', 'admin@example.com', '$2b$10$eBsEjO6bZKjW1dBsh0uLbeSkI0pOQaDO1SEyIo6cqlu5z5Jj.sZ1y', 1), -- Пароль: "adminpassword"
    ('user1', 'user1@example.com', '$2b$10$ptQzSNF.oD.titMOpfrpUuF8Bd35dyAfQsAZZSSvd20/MJZ1ByWti', 2) -- Пароль: "userpassword"
ON CONFLICT DO NOTHING;

-- Вставка данных в таблицу игр
INSERT INTO game (name, description, publisher, icon_url)
VALUES
    ('Game One', 'Description for Game One', 'Publisher A', 'http://example.com/icon1.png'),
    ('Game Two', 'Description for Game Two', 'Publisher B', 'http://example.com/icon2.png')
ON CONFLICT DO NOTHING;

-- Вставка данных в таблицу продуктов
INSERT INTO product (name, game_id, description, price, stock, image_url)
VALUES
    ('Product One', 1, 'Description for Product One', 9.99, 100, 'http://example.com/product1.png'),
    ('Product Two', 2, 'Description for Product Two', 19.99, 200, 'http://example.com/product2.png')
ON CONFLICT DO NOTHING;

-- Вставка данных в таблицу промокодов
INSERT INTO promocode (code, discount, expiration_date, is_active)
VALUES
    ('PROMO10', 10.00, '2024-12-31', TRUE),
    ('PROMO20', 20.00, '2024-12-31', TRUE)
ON CONFLICT DO NOTHING;

-- Вставка тестовых данных в таблицу логов
INSERT INTO log (user_id, action, details)
VALUES
    (1, 'Created', '{"table": "product", "details": "Added Product One"}'),
    (2, 'Updated', '{"table": "cart", "details": "Added Product Two to Cart"}')
ON CONFLICT DO NOTHING;