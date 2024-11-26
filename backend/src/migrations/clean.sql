-- Удаление индексов
DROP INDEX IF EXISTS idx_user_email;
DROP INDEX IF EXISTS idx_cart_user_id;
DROP INDEX IF EXISTS idx_order_user_id;

-- Удаление таблиц
DROP TABLE IF EXISTS log;
DROP TABLE IF EXISTS promocode;
DROP TABLE IF EXISTS transaction;
DROP TABLE IF EXISTS "order";
DROP TABLE IF EXISTS cart_product;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS role;