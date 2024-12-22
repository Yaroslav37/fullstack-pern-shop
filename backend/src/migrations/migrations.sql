-- Создание таблицы ролей
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Создание таблицы пользователей
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES role(id) DEFAULT 2, -- По умолчанию role_id = 2
    balance DECIMAL(10, 2) DEFAULT 0.00, -- Добавлен столбец balance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы игр
CREATE TABLE game (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    publisher VARCHAR(100),
    icon_url VARCHAR(255) -- Добавлен столбец icon_url
);

-- Создание таблицы продуктов
CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    game_id INT REFERENCES game(id) ON DELETE CASCADE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(255), -- Добавлен столбец image_url
    UNIQUE (name, game_id)
);

-- Создание таблицы корзин
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы продуктов в корзине
CREATE TABLE cart_product (
    id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES cart(id) ON DELETE CASCADE,
    product_id INT REFERENCES product(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    UNIQUE (cart_id, product_id)
);

-- Создание таблицы заказов
CREATE TABLE "order" (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pending', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы транзакций
CREATE TABLE transaction (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE, -- Изменено на user_id
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('replenishment', 'withdrawal', 'promocode')), -- Добавлен тип транзакции
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы промокодов
CREATE TABLE promocode (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0), -- Изменено на amount
    expiration_date DATE NOT NULL,
    activation_limit INT NOT NULL DEFAULT 1, -- Добавлено поле количества активаций
    activation_count INT NOT NULL DEFAULT 0 -- Добавлено поле текущего количества активаций
);

-- Создание таблицы логов
CREATE TABLE log (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы отзывов
CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Оценка от 1 до 5
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для хранения информации об активациях промокодов
CREATE TABLE promocode_activation (
    id SERIAL PRIMARY KEY,
    promocode_id INT REFERENCES promocode(id) ON DELETE CASCADE,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для повышения производительности
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_order_user_id ON "order"(user_id);
CREATE INDEX idx_transaction_user_id ON transaction(user_id); -- Добавлен индекс для user_id в таблице transaction
CREATE INDEX idx_review_user_id ON review(user_id);

-- Функция для проверки наличия хотя бы одной покупки у пользователя
CREATE OR REPLACE FUNCTION has_purchase(user_id INT)
RETURNS BOOLEAN AS $$
DECLARE
    purchase_count INT;
BEGIN
    SELECT COUNT(*)
    INTO purchase_count
    FROM "order"
    WHERE user_id = user_id;

    RETURN purchase_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Функция для добавления отзыва о магазине
CREATE OR REPLACE FUNCTION add_review(user_id INT, rating INT, comment TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Проверка наличия хотя бы одной покупки
    IF NOT has_purchase(user_id) THEN
        RETURN 'Пользователь не имеет покупок в магазине.';
    END IF;

    -- Добавление отзыва
    INSERT INTO review (user_id, rating, comment)
    VALUES (user_id, rating, comment);

    RETURN 'Отзыв успешно добавлен.';
END;
$$ LANGUAGE plpgsql;

-- Функция для применения промокода
CREATE OR REPLACE FUNCTION apply_promocode(input_user_id INT, promo_code VARCHAR)
RETURNS TEXT AS $$
DECLARE
    promo RECORD;
    new_balance DECIMAL;
BEGIN
    -- Проверка наличия и активности промокода
    SELECT * INTO promo FROM promocode 
    WHERE promocode.code = promo_code 
    AND activation_count < activation_limit 
    AND expiration_date >= CURRENT_DATE;
    
    IF NOT FOUND THEN
        RETURN 'Промокод недействителен, уже использован или истек срок действия.';
    END IF;

    -- Проверка, активировал ли пользователь промокод ранее
    IF EXISTS (SELECT 1 FROM promocode_activation WHERE promocode_id = promo.id AND promocode_activation.user_id = input_user_id) THEN
        RETURN 'Вы уже активировали этот промокод.';
    END IF;

    -- Обновление баланса пользователя
    UPDATE "user"
    SET balance = balance + promo.amount
    WHERE "user".id = input_user_id
    RETURNING balance INTO new_balance;

    -- Запись транзакции
    INSERT INTO transaction (user_id, amount, type)
    VALUES (input_user_id, promo.amount, 'promocode');

    -- Запись информации об активации промокода
    INSERT INTO promocode_activation (promocode_id, user_id)
    VALUES (promo.id, input_user_id);

    -- Обновление количества активаций промокода
    UPDATE promocode
    SET activation_count = activation_count + 1
    WHERE promocode.id = promo.id;

    RETURN 'Промокод успешно применен. Новый баланс: ' || new_balance;
END;
$$ LANGUAGE plpgsql;

-- Обновленная функция для записи логов
CREATE OR REPLACE FUNCTION log_action()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'cart_product' THEN
        INSERT INTO log (user_id, action, details, timestamp)
        VALUES (
            (SELECT user_id FROM cart WHERE id = NEW.cart_id),
            TG_ARGV[0],
            json_build_object(
                'cart_id', NEW.cart_id,
                'product_id', NEW.product_id,
                'product_name', (SELECT name FROM product WHERE id = NEW.product_id),
                'quantity', NEW.quantity,
                'action', TG_ARGV[0]
            ),
            CURRENT_TIMESTAMP
        );
    ELSIF TG_TABLE_NAME = 'order' THEN
        INSERT INTO log (user_id, action, details, timestamp)
        VALUES (
            NEW.user_id,
            TG_ARGV[0],
            json_build_object(
                'order_id', NEW.id,
                'total_amount', NEW.total_price,
                'status', NEW.status,
                'action', TG_ARGV[0]
            ),
            CURRENT_TIMESTAMP
        );
    ELSIF TG_TABLE_NAME = 'user' AND TG_OP = 'UPDATE' THEN
        IF OLD.balance <> NEW.balance THEN
            INSERT INTO log (user_id, action, details, timestamp)
            VALUES (
                NEW.id,
                'balance_update',
                json_build_object(
                    'old_balance', OLD.balance,
                    'new_balance', NEW.balance,
                    'action', 'balance_update'
                ),
                CURRENT_TIMESTAMP
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для записи логов при добавлении продукта в корзину
CREATE TRIGGER log_cart_product_insert
AFTER INSERT ON cart_product
FOR EACH ROW
EXECUTE FUNCTION log_action('cart_product_insert');

-- Триггер для записи логов при обновлении продукта в корзине
CREATE TRIGGER log_cart_product_update
AFTER UPDATE ON cart_product
FOR EACH ROW
EXECUTE FUNCTION log_action('cart_product_update');

-- Триггер для записи логов при удалении продукта из корзины
CREATE TRIGGER log_cart_product_delete
AFTER DELETE ON cart_product
FOR EACH ROW
EXECUTE FUNCTION log_action('cart_product_delete');

-- Триггер для записи логов при создании заказа
CREATE TRIGGER log_order_insert
AFTER INSERT ON "order"
FOR EACH ROW
EXECUTE FUNCTION log_action('order_insert');

-- Триггер для записи логов при обновлении баланса пользователя
CREATE TRIGGER log_user_balance_update
AFTER UPDATE ON "user"
FOR EACH ROW
WHEN (OLD.balance IS DISTINCT FROM NEW.balance)
EXECUTE FUNCTION log_action();