const express = require('express')
const client = require('../db/dbClient')

const router = express.Router()

/**
 * @route GET /promocodes
 * @desc Получение всех промокодов
 * @access Public
 */
router.get('/promocodes', async (req, res) => {
  try {
    const query = 'SELECT * FROM promocode;'
    const result = await client.query(query)

    res.status(200).json({ promocodes: result.rows })
  } catch (error) {
    console.error('Ошибка получения промокодов:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

/**
 * @route POST /promocodes
 * @desc Создание нового промокода
 * @access Public
 */
router.post('/promocodes', async (req, res) => {
  const { code, amount, expiration_date, activation_limit } = req.body

  if (!code || !amount || !expiration_date || !activation_limit) {
    return res.status(400).json({ error: 'Все поля обязательны.' })
  }

  try {
    const query = `
      INSERT INTO promocode (code, amount, expiration_date, activation_limit)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `
    const values = [code, amount, expiration_date, activation_limit]
    const result = await client.query(query, values)

    res
      .status(201)
      .json({ message: 'Промокод создан.', promocode: result.rows[0] })
  } catch (error) {
    console.error('Ошибка создания промокода:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

/**
 * @route PUT /promocodes/:id
 * @desc Изменение существующего промокода
 * @access Public
 */
router.put('/promocodes/:id', async (req, res) => {
  const { id } = req.params
  const { code, amount, expiration_date, activation_limit } = req.body

  if (!code || !amount || !expiration_date || !activation_limit) {
    return res.status(400).json({ error: 'Все поля обязательны.' })
  }

  try {
    const query = `
      UPDATE promocode
      SET code = $1, amount = $2, expiration_date = $3, activation_limit = $4
      WHERE id = $5
      RETURNING *;
    `
    const values = [code, amount, expiration_date, activation_limit, id]
    const result = await client.query(query, values)

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Промокод не найден.' })
    }

    res
      .status(200)
      .json({ message: 'Промокод обновлен.', promocode: result.rows[0] })
  } catch (error) {
    console.error('Ошибка обновления промокода:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

/**
 * @route DELETE /promocodes/:id
 * @desc Удаление промокода
 * @access Public
 */
router.delete('/promocodes/:id', async (req, res) => {
  const { id } = req.params

  try {
    const query = 'DELETE FROM promocode WHERE id = $1 RETURNING *;'
    const result = await client.query(query, [id])

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Промокод не найден.' })
    }

    res
      .status(200)
      .json({ message: 'Промокод удален.', promocode: result.rows[0] })
  } catch (error) {
    console.error('Ошибка удаления промокода:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

module.exports = router
