TRUNCATE TABLE log, product, promocode, game, "user", role RESTART IDENTITY CASCADE;

-- Вставка данных в таблицу ролей
INSERT INTO role (name)
VALUES 
    ('Admin'),
    ('User')
ON CONFLICT DO NOTHING;

-- Вставка данных в таблицу пользователей
INSERT INTO "user" (username, email, password_hash, role_id, balance)
VALUES
    ('admin', 'admin@example.com', '$2b$10$eBsEjO6bZKjW1dBsh0uLbeSkI0pOQaDO1SEyIo6cqlu5z5Jj.sZ1y', 1, 1000.00), -- Пароль: "adminpassword"
    ('user1', 'user1@example.com', '$2b$10$ptQzSNF.oD.titMOpfrpUuF8Bd35dyAfQsAZZSSvd20/MJZ1ByWti', 2, 500.00) -- Пароль: "userpassword"
ON CONFLICT DO NOTHING;

-- Вставка данных в таблицу игр
INSERT INTO game (name, description, publisher, icon_url)
VALUES
    ('Brawl Stars', 'Brawl Stars — игра для мобильных устройств в жанрах MOBA и геройский шутер, разработанная и изданная финской компанией Supercell.', 'SuperCell', 'https://play-lh.googleusercontent.com/qMI5vUc_ECxZdWaCiPuRWAOVlxf2H8GzmRbChPr2915xmyAYtIepSz98opcZCJTjNw=w240-h480-rw'),
    ('Clash Of Clans', 'Clash of Сlans — стратегическая игра, созданная финской студией-разработчиком Supercell для мобильных устройств.', 'SuperCell', 'https://m.media-amazon.com/images/I/81Z+V7GJIEL.png'),
    ('Clash royale', 'Clash Royale — мобильная игра в жанре RTS с элементами ККИ, доступная на платформах Android и iOS, выпущенная 2 марта 2016 года компанией Supercell.', 'SuperCell', 'https://play-lh.googleusercontent.com/gnSC6s8-6Tjc4uhvDW7nfrSJxpbhllzYhgX8y374N1LYvWBStn2YhozS9XXaz1T_Pi2q')
ON CONFLICT DO NOTHING;

-- Вставка данных в таблицу продуктов
INSERT INTO product (name, game_id, description, price, stock, image_url)
VALUES
    ('Fang', 1, 'Description for Product One', 7.99, 100, 'https://game-assets.store.supercell.com/brawlstars/a92dc117-27a1-488a-8464-33e25028a1cd.webm'),
    ('CyberBea', 2, 'Description for Product Two', 3.99, 200, 'https://game-assets.store.supercell.com/brawlstars/9f372224-ae68-4307-8e79-7a8887f9945a.webm'),
    ('Shade', 2, 'Description for Product Two', 17.99, 200, 'https://game-assets.store.supercell.com/brawlstars/d2bebe42-48be-4df5-950e-461ba0b1a61d.webm')
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