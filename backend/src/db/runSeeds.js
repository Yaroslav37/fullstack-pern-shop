const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

// Подключение к базе данных
const client = new Client({
  user: 'user', // Замените на ваше имя пользователя
  host: 'localhost',
  database: 'gameshop', // Замените на вашу базу данных
  password: 'password', // Замените на ваш пароль
  port: 5432,
})

async function runSeeds() {
  try {
    // Подключаемся к базе данных
    await client.connect()

    // Получаем список всех файлов сидов в папке seeds
    const seedFiles = fs.readdirSync(path.join(__dirname, '../seeds')).sort()

    // Выполняем каждый сид
    for (const file of seedFiles) {
      const filePath = path.join(__dirname, '../seeds', file)
      const sql = fs.readFileSync(filePath, 'utf8')
      console.log(`Running seed: ${file}`)

      // Выполняем SQL запрос для сида
      await client.query(sql)
      console.log(`Seed ${file} completed.`)
    }

    console.log('All seeds have been executed successfully!')
  } catch (err) {
    console.error('Error running seeds:', err)
  } finally {
    // Закрываем соединение с базой данных
    await client.end()
  }
}

// Запускаем выполнение сидов
runSeeds()
