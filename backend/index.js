const express = require('express')
const bodyParser = require('body-parser')
const client = require('./src/db/dbClient')
const authRoutes = require('./src/routes/authRoutes')
const productRoutes = require('./src/routes/productRoutes')
const promocodeRoutes = require('./src/routes/promocodeRoutes')
const userRoutes = require('./src/routes/userRoutes')
const cors = require('cors')

const app = express()
const PORT = 4000

app.use(cors())

app.use(bodyParser.json())
app.use('/auth', authRoutes)
app.use('/', productRoutes)
app.use('/', promocodeRoutes)
app.use('/users', userRoutes)
;(async () => {
  try {
    await client.connect()
    console.log('Подключение к базе данных установлено.')

    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Ошибка подключения к базе данных:', err.message)
    process.exit(1)
  }
})()
