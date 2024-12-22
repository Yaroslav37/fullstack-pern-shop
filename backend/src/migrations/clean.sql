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
DROP FUNCTION IF EXISTS has_purchase;
DROP FUNCTION IF EXISTS add_review;

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