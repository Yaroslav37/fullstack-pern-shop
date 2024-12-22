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

/**
 * @route GET /users/:id/logs
 * @desc Получение логов пользователя по ID
 * @access Private
 */
router.get('/:id/logs', authenticateToken, async (req, res) => {
  const { id } = req.params

  try {
    const query = `
      SELECT action, details, timestamp
      FROM log
      WHERE user_id = $1
      ORDER BY timestamp DESC;
    `
    const values = [id]
    const result = await client.query(query, values)

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'Логи не найдены для данного пользователя.' })
    }

    const logs = result.rows
      .map((row) => {
        let details = JSON.parse(row.details)
        let formattedDetails = ''

        switch (details.action) {
          case 'balance_update':
            formattedDetails = `Списано ${
              details.old_balance - details.new_balance
            } дата и время: ${row.timestamp}`
            break
          case 'cart_product_insert':
            formattedDetails = `Добавлен товар в корзину: ${details.product_name}, количество: ${details.quantity}, дата и время: ${row.timestamp}`
            break
          case 'cart_product_update':
            formattedDetails = `Обновлен товар в корзине: ${details.product_name}, количество: ${details.quantity}, дата и время: ${row.timestamp}`
            break
          case 'cart_product_delete':
            formattedDetails = `Удален товар из корзины: ${details.product_name}, дата и время: ${row.timestamp}`
            break
          case 'order_insert':
            formattedDetails = `Создан заказ: ${details.order_id}, сумма: ${details.total_amount}, статус: ${details.status}, дата и время: ${row.timestamp}`
            break
          default:
            formattedDetails = `Действие: ${details.action}, дата и время: ${row.timestamp}`
        }

        return formattedDetails
      })
      .join('\n')

    res.status(200).send(logs)
  } catch (error) {
    console.error('Ошибка получения логов:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

/**
 * @route POST /users/apply-promocode
 * @desc Применение промокода
 * @access Private
 */
router.post('/apply-promocode', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const { code } = req.body

  if (!code) {
    return res.status(400).json({ error: 'Промокод не указан.' })
  }

  try {
    const query = `
      SELECT apply_promocode($1, $2) AS result;
    `
    const values = [userId, code]
    const result = await client.query(query, values)

    if (
      result.rows[0].result.includes('недействителен') ||
      result.rows[0].result.includes('уже активировали')
    ) {
      return res.status(400).json({ error: result.rows[0].result })
    }

    res.status(200).json({ message: result.rows[0].result })
  } catch (error) {
    console.error('Ошибка применения промокода:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

module.exports = router
