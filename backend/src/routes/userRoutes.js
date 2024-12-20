const express = require('express')
const client = require('../db/dbClient')
const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router()

/**
 * @route PUT /users/:id/assign-admin
 * @desc Назначение пользователя администратором
 * @access Private
 */
router.put('/:id/assign-admin', async (req, res) => {
  const { id } = req.params

  try {
    const query = `
      UPDATE "user"
      SET role_id = (SELECT id FROM role WHERE name = 'Admin')
      WHERE id = $1
      RETURNING *;
    `
    const values = [id]
    const result = await client.query(query, values)

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Пользователь не найден.' })
    }

    res.status(200).json({
      message: 'Пользователь назначен администратором.',
      user: result.rows[0],
    })
  } catch (error) {
    console.error('Ошибка назначения администратора:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

/**
 * @route GET /users/balance
 * @desc Получение баланса пользователя
 * @access Private
 */
router.get('/balance', authenticateToken, async (req, res) => {
  const userId = req.user.id

  try {
    const query = 'SELECT balance FROM "user" WHERE id = $1'
    const result = await client.query(query, [userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден.' })
    }

    const balance = result.rows[0].balance

    res.status(200).json({ balance })
  } catch (error) {
    console.error('Ошибка получения баланса:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

/**
 * @route PUT /users/balance
 * @desc Пополнение баланса пользователя
 * @access Private
 */
router.put('/balance', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const { amount } = req.body

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Некорректная сумма пополнения.' })
  }

  try {
    const query = `
      UPDATE "user"
      SET balance = balance + $1
      WHERE id = $2
      RETURNING balance;
    `
    const values = [amount, userId]
    const result = await client.query(query, values)

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Пользователь не найден.' })
    }

    const balance = result.rows[0].balance

    res.status(200).json({ message: 'Баланс пополнен.', balance })
  } catch (error) {
    console.error('Ошибка пополнения баланса:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

module.exports = router
