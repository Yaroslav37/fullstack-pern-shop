-- Удаление индексов
DROP INDEX IF EXISTS idx_user_email;
DROP INDEX IF EXISTS idx_cart_user_id;
DROP INDEX IF EXISTS idx_order_user_id;
DROP INDEX IF EXISTS idx_transaction_user_id;
DROP INDEX IF EXISTS idx_review_user_id;

-- Удаление триггеров
DROP TRIGGER IF EXISTS log_cart_product_insert ON cart_product;
DROP TRIGGER IF EXISTS log_cart_product_update ON cart_product;
DROP TRIGGER IF EXISTS log_cart_product_delete ON cart_product;
DROP TRIGGER IF EXISTS log_order_insert ON "order";
DROP TRIGGER IF EXISTS log_user_balance_update ON "user";

-- Удаление функций
DROP FUNCTION IF EXISTS log_action;
DROP FUNCTION IF EXISTS apply_promocode;
DROP FUNCTION IF EXISTS can_review;
DROP FUNCTION IF EXISTS add_review;

-- Удаление представлений
DROP VIEW IF EXISTS product_view;

-- Удаление зависимостей
ALTER TABLE cart_product DROP CONSTRAINT IF EXISTS cart_product_cart_id_fkey;
ALTER TABLE cart_product DROP CONSTRAINT IF EXISTS cart_product_product_id_fkey;
ALTER TABLE cart DROP CONSTRAINT IF EXISTS cart_user_id_fkey;
ALTER TABLE "order" DROP CONSTRAINT IF EXISTS order_user_id_fkey;
ALTER TABLE transaction DROP CONSTRAINT IF EXISTS transaction_user_id_fkey;
ALTER TABLE review DROP CONSTRAINT IF EXISTS review_user_id_fkey;
ALTER TABLE promocode_activation DROP CONSTRAINT IF EXISTS promocode_activation_promocode_id_fkey;
ALTER TABLE promocode_activation DROP CONSTRAINT IF EXISTS promocode_activation_user_id_fkey;

-- Удаление таблиц
DROP TABLE IF EXISTS log;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS promocode_activation;
DROP TABLE IF EXISTS promocode;
DROP TABLE IF EXISTS transaction;
DROP TABLE IF EXISTS "order";
DROP TABLE IF EXISTS cart_product;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS role;