const express = require('express')
const client = require('../db/dbClient')
const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router()

// Создание игры
router.post('/games', async (req, res) => {
  const { name, description, publisher, icon_url } = req.body

  if (!name) {
    return res.status(400).json({ error: 'Название игры обязательно.' })
  }

  try {
    const query = `
      INSERT INTO game (name, description, publisher, icon_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `
    const values = [name, description, publisher, icon_url]
    const result = await client.query(query, values)

    res.status(201).json({ message: 'Игра создана.', game: result.rows[0] })
  } catch (error) {
    console.error('Ошибка создания игры:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

// Создание товара
router.post('/products', async (req, res) => {
  const { name, game_id, description, price, stock, image_url } = req.body

  if (!name || !game_id || !price || !stock) {
    return res.status(400).json({ error: 'Все поля обязательны.' })
  }

  try {
    const query = `
      INSERT INTO product (name, game_id, description, price, stock, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `
    const values = [name, game_id, description, price, stock, image_url]
    const result = await client.query(query, values)

    res.status(201).json({ message: 'Товар создан.', product: result.rows[0] })
  } catch (error) {
    console.error('Ошибка создания товара:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

// Получение всех игр
router.get('/games', async (req, res) => {
  try {
    const query = 'SELECT * FROM game;'
    const result = await client.query(query)

    res.status(200).json({ games: result.rows })
  } catch (error) {
    console.error('Ошибка получения игр:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

const formatCategory = (category) => {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

router.get('/products', async (req, res) => {
  const { category } = req.query

  try {
    let query
    let values = []

    if (category) {
      query = `
        SELECT p.id, p.name, g.name as game, p.description, p.price, p.stock, p.image_url
        FROM product p
        JOIN game g ON p.game_id = g.id
        WHERE g.name = $1;
      `
      values = [category]
    } else {
      query = `
        SELECT p.id, p.name, g.name as game, p.description, p.price, p.stock, p.image_url
        FROM product p
        JOIN game g ON p.game_id = g.id;
      `
    }

    const result = await client.query(query, values)

    res.status(200).json({ products: result.rows })
  } catch (error) {
    console.error('Ошибка получения товаров:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

// Получение информации о товаре по ID
router.get('/products/:id', async (req, res) => {
  const { id } = req.params

  try {
    const query = `
      SELECT p.id, p.name, g.name as game, p.description, p.price, p.stock, p.image_url
      FROM product p
      JOIN game g ON p.game_id = g.id
      WHERE p.id = $1;
    `
    const result = await client.query(query, [id])

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Товар не найден.' })
    }

    res.status(200).json({ product: result.rows[0] })
  } catch (error) {
    console.error('Ошибка получения информации о товаре:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

// Удаление игры
router.delete('/games/:id', async (req, res) => {
  const { id } = req.params

  try {
    const query = 'DELETE FROM game WHERE id = $1 RETURNING *;'
    const result = await client.query(query, [id])

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Игра не найдена.' })
    }

    res.status(200).json({ message: 'Игра удалена.', game: result.rows[0] })
  } catch (error) {
    console.error('Ошибка удаления игры:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

// Удаление товара
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params

  try {
    const query = 'DELETE FROM product WHERE id = $1 RETURNING *;'
    const result = await client.query(query, [id])

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Товар не найден.' })
    }

    res.status(200).json({ message: 'Товар удален.', product: result.rows[0] })
  } catch (error) {
    console.error('Ошибка удаления товара:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

// Добавление товара в корзину
router.post('/cart', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const { product_id, quantity } = req.body

  if (!product_id || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Некорректные данные.' })
  }

  try {
    console.log(product_id)
    console.log(userId)
    // Проверка наличия корзины у пользователя
    let query = 'SELECT id FROM cart WHERE user_id = $1'
    let result = await client.query(query, [userId])

    let cartId
    if (result.rows.length === 0) {
      // Создание новой корзины
      query = 'INSERT INTO cart (user_id) VALUES ($1) RETURNING id'
      result = await client.query(query, [userId])
      cartId = result.rows[0].id
    } else {
      cartId = result.rows[0].id
    }

    // Проверка наличия товара в корзине
    query =
      'SELECT id, quantity FROM cart_product WHERE cart_id = $1 AND product_id = $2'
    result = await client.query(query, [cartId, product_id])

    if (result.rows.length === 0) {
      // Добавление нового товара в корзину
      query = `
        INSERT INTO cart_product (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *;
      `
      const values = [cartId, product_id, quantity]
      result = await client.query(query, values)
    } else {
      // Обновление количества товара в корзине
      query = `
        UPDATE cart_product
        SET quantity = $1
        WHERE cart_id = $2 AND product_id = $3
        RETURNING *;
      `
      const values = [quantity, cartId, product_id]
      result = await client.query(query, values)
    }

    res.status(200).json({
      message: 'Товар добавлен в корзину.',
      cartProduct: result.rows[0],
    })
  } catch (error) {
    console.error('Ошибка добавления товара в корзину:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

// Получение товаров из корзины
router.get('/cart', authenticateToken, async (req, res) => {
  const userId = req.user.id

  try {
    const query = `
      SELECT p.id, p.name, p.description, p.price, p.image_url, cp.quantity
      FROM cart_product cp
      JOIN product p ON cp.product_id = p.id
      JOIN cart c ON cp.cart_id = c.id
      WHERE c.user_id = $1;
    `
    const result = await client.query(query, [userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Корзина пуста.' })
    }

    res.status(200).json({ cartProducts: result.rows })
  } catch (error) {
    console.error('Ошибка получения товаров из корзины:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

// Удаление товара из корзины
router.delete('/cart', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const { product_id } = req.body

  if (!product_id) {
    return res.status(400).json({ error: 'Некорректные данные.' })
  }

  try {
    // Проверка наличия корзины у пользователя
    let query = 'SELECT id FROM cart WHERE user_id = $1'
    let result = await client.query(query, [userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Корзина не найдена.' })
    }

    const cartId = result.rows[0].id

    // Удаление товара из корзины
    query =
      'DELETE FROM cart_product WHERE cart_id = $1 AND product_id = $2 RETURNING *'
    result = await client.query(query, [cartId, product_id])

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Товар не найден в корзине.' })
    }

    res.status(200).json({
      message: 'Товар удален из корзины.',
      cartProduct: result.rows[0],
    })
  } catch (error) {
    console.error('Ошибка удаления товара из корзины:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

// Покупка всех товаров из корзины
router.post('/cart/checkout', authenticateToken, async (req, res) => {
  const userId = req.user.id

  try {
    // Получение товаров из корзины
    const query = `
      SELECT p.id, p.price, cp.quantity
      FROM cart_product cp
      JOIN product p ON cp.product_id = p.id
      JOIN cart c ON cp.cart_id = c.id
      WHERE c.user_id = $1;
    `
    const result = await client.query(query, [userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Корзина пуста.' })
    }

    const cartProducts = result.rows

    // Подсчет общей стоимости товаров в корзине
    const totalPrice = cartProducts.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)

    // Проверка баланса пользователя
    const balanceQuery = 'SELECT balance FROM "user" WHERE id = $1'
    const balanceResult = await client.query(balanceQuery, [userId])
    const userBalance = balanceResult.rows[0].balance

    if (userBalance < totalPrice) {
      return res.status(400).json({ error: 'Недостаточно средств на балансе.' })
    }

    // Обновление баланса пользователя
    const updateBalanceQuery = `
      UPDATE "user"
      SET balance = balance - $1
      WHERE id = $2
      RETURNING balance;
    `
    const updateBalanceResult = await client.query(updateBalanceQuery, [
      totalPrice,
      userId,
    ])

    // Создание заказа
    const createOrderQuery = `
      INSERT INTO "order" (user_id, total_price, status)
      VALUES ($1, $2, 'Completed')
      RETURNING *;
    `
    const createOrderResult = await client.query(createOrderQuery, [
      userId,
      totalPrice,
    ])
    const order = createOrderResult.rows[0]

    // Очистка корзины
    const clearCartQuery = `
      DELETE FROM cart_product
      WHERE cart_id = (SELECT id FROM cart WHERE user_id = $1);
    `
    await client.query(clearCartQuery, [userId])

    res.status(200).json({
      message: 'Покупка успешно завершена.',
      order,
      balance: updateBalanceResult.rows[0].balance,
    })
  } catch (error) {
    console.error('Ошибка покупки товаров из корзины:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

// Получение истории покупок
router.get('/orders', authenticateToken, async (req, res) => {
  const userId = req.user.id

  try {
    const query = `
      SELECT o.id, o.total_price, o.status, o.created_at
      FROM "order" o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC;
    `
    const result = await client.query(query, [userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'История покупок пуста.' })
    }

    res.status(200).json({ orders: result.rows })
  } catch (error) {
    console.error('Ошибка получения истории покупок:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

module.exports = router
