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

async function runMigrations() {
  try {
    // Подключаемся к базе данных
    await client.connect()

    // Получаем список всех файлов миграций в папке migrations
    const migrationFiles = fs
      .readdirSync(path.join(__dirname, '../migrations'))
      .sort()

    // Выполняем каждую миграцию
    for (const file of migrationFiles) {
      const filePath = path.join(__dirname, '../migrations', file)
      const sql = fs.readFileSync(filePath, 'utf8')
      console.log(`Running migration: ${file}`)

      // Выполняем SQL запрос для миграции
      await client.query(sql)
      console.log(`Migration ${file} completed.`)
    }

    console.log('All migrations have been executed successfully!')
  } catch (err) {
    console.error('Error running migrations:', err)
  } finally {
    // Закрываем соединение с базой данных
    await client.end()
  }
}

// Запускаем выполнение миграций
runMigrations()
