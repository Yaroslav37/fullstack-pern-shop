TRUNCATE TABLE log, product, promocode, game, "user", role, review, transaction, promocode_activation RESTART IDENTITY CASCADE;

-- Вставка данных в таблицу ролей
INSERT INTO role (name)
VALUES 
    ('Admin'),
    ('User')
ON CONFLICT DO NOTHING;

-- Вставка данных в таблицу пользователей
INSERT INTO "user" (username, email, password_hash, role_id, balance)
VALUES
    ('admin', 'admin@bsuir.by', '$2b$10$Kklr6KTYM03j6DOvBx5FHOQTPoGZ7Wzn7uLv3Als.tOo7HRv7oa1.', 1, 1000.00), -- Пароль "adminpassword"
    ('user', 'user@bsuir.by', '$2b$10$Kklr6KTYM03j6DOvBx5FHOQTPoGZ7Wzn7uLv3Als.tOo7HRv7oa1.', 2, 500.00) -- Пароль: "userpassword"
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
    ('CyberBea', 1, 'Description for Product Two', 3.99, 200, 'https://game-assets.store.supercell.com/brawlstars/9f372224-ae68-4307-8e79-7a8887f9945a.webm'),
    ('Shade', 1, 'Description for Product Two', 17.99, 200, 'https://game-assets.store.supercell.com/brawlstars/d2bebe42-48be-4df5-950e-461ba0b1a61d.webm'),
    ('Woody Colt', 1, 'Description ', 11.99, 200, 'https://game-assets.store.supercell.com/brawlstars/5505ad03-b991-49fe-a965-986b754f4a13.webm'),
    ('Jessy', 1, 'Description ', 11.99, 200, 'https://game-assets.store.supercell.com/brawlstars/07ec15ea-62a6-42d8-a135-a72e5c3416da.webm')
    -- ('Woody Colt', 1, 'Description ', 11.99, 200, ''),
    -- ('Woody Colt', 1, 'Description ', 11.99, 200, ''),
    -- ('Woody Colt', 1, 'Description ', 11.99, 200, ''),
    -- ('Woody Colt', 1, 'Description ', 11.99, 200, ''),
    -- ('Woody Colt', 1, 'Description ', 11.99, 200, ''),
    -- ('Woody Colt', 1, 'Description ', 11.99, 200, ''),
ON CONFLICT DO NOTHING;

-- Вставка данных в таблицу промокодов
INSERT INTO promocode (code, amount, expiration_date, activation_limit)
VALUES
    ('PROMO10', 10.00, '2024-12-31', 1),
    ('PROMO20', 20.00, '2024-12-31', 10)
ON CONFLICT DO NOTHING;

-- Вставка тестовых данных в таблицу логов
INSERT INTO log (user_id, action, details)
VALUES
    (1, 'Created', '{"table": "product", "details": "Added Product One"}'),
    (2, 'Updated', '{"table": "cart", "details": "Added Product Two to Cart"}')
ON CONFLICT DO NOTHING;

-- Вставка тестовых данных в таблицу транзакций
INSERT INTO transaction (user_id, amount, type)
VALUES
    (1, 100.00, 'replenishment'),
    (2, 50.00, 'withdrawal')
ON CONFLICT DO NOTHING;

-- Вставка тестовых данных в таблицу отзывов
INSERT INTO review (user_id, rating, comment)
VALUES
    (2, 5, 'Отличный магазин!'),
    (2, 4, 'Хороший магазин, но есть недостатки.')
ON CONFLICT DO NOTHING;