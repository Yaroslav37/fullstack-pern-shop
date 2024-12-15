const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const client = require('../db/dbClient')
const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router()

const SECRET_KEY = 'your_secret_key'

router.post('/register', async (req, res) => {
  const { username, email, password, role_id } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Все поля обязательны.' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const query = `
      INSERT INTO "user" (username, email, password_hash, role_id, balance) 
      VALUES ($1, $2, $3, $4, 0.00) 
      RETURNING id, username, email;
    `
    const values = [username, email, hashedPassword, role_id || null]
    const result = await client.query(query, values)

    res
      .status(201)
      .json({ message: 'Пользователь зарегистрирован.', user: result.rows[0] })
  } catch (error) {
    console.error('Ошибка регистрации:', error.message)
    if (error.code === '23505') {
      return res
        .status(400)
        .json({ error: 'Пользователь с таким email уже существует.' })
    }
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

router.get('/user', authenticateToken, async (req, res) => {
  const userId = req.user.id

  try {
    const query =
      'SELECT id, username, email, role_id, balance FROM "user" WHERE id = $1'
    const result = await client.query(query, [userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден.' })
    }

    const user = result.rows[0]

    res.status(200).json({ user })
  } catch (error) {
    console.error('Ошибка получения данных о пользователе:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Все поля обязательны.' })
  }

  try {
    const query = 'SELECT * FROM "user" WHERE email = $1'
    const result = await client.query(query, [email])

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль.' })
    }

    const user = result.rows[0]

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверный email или пароль.' })
    }

    // Генерация токена
    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id },
      SECRET_KEY,
      {
        expiresIn: '1h',
      }
    )

    res.status(200).json({
      message: 'Успешный вход.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        balance: user.balance,
      },
    })
  } catch (error) {
    console.error('Ошибка входа:', error.message)
    res.status(500).json({ error: 'Ошибка сервера.' })
  }
})

module.exports = router
