const express = require('express')
const client = require('../db/dbClient')

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

// Получение всех товаров
router.get('/products', async (req, res) => {
  try {
    const query = 'SELECT * FROM product;'
    const result = await client.query(query)

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
    const query = 'SELECT * FROM product WHERE id = $1;'
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

module.exports = router
