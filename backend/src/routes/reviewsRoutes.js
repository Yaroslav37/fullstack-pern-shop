const express = require('express')
const client = require('../db/dbClient')
const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router()

/**
 * @route GET /reviews/can-review
 * @desc Проверка, может ли пользователь оставить отзыв о магазине
 * @access Private
 */
router.get('/can-review', authenticateToken, async (req, res) => {
  const userId = req.user.id

  try {
    const query = `
      SELECT can_review($1) AS can_review;
    `
    const values = [userId]
    const result = await client.query(query, values)

    if (result.rows[0].can_review) {
      res.status(200).json({ canReview: true })
      console.log('fds')
    } else {
      console.log('fds2')
      res.status(200).json({ canReview: false })
    }
  } catch (error) {
    console.error('Ошибка проверки возможности оставить отзыв:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

/**
 * @route POST /reviews
 * @desc Оставить отзыв о магазине
 * @access Private
 */
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const { rating, comment } = req.body

  try {
    const query = `
      SELECT add_review($1, $2, $3) AS result;
    `
    const values = [userId, rating, comment]
    const result = await client.query(query, values)

    if (result.rows[0].result.includes('успешно')) {
      res.status(200).json({ message: result.rows[0].result })
    } else {
      res.status(400).json({ error: result.rows[0].result })
    }
  } catch (error) {
    console.error('Ошибка добавления отзыва:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

/**
 * @route GET /reviews
 * @desc Получение всех отзывов о магазине
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT r.rating, r.comment, r.created_at, u.username
      FROM review r
      JOIN "user" u ON r.user_id = u.id
      ORDER BY r.created_at DESC;
    `
    const result = await client.query(query)

    res.status(200).json(result.rows)
  } catch (error) {
    console.error('Ошибка получения отзывов:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

module.exports = router
