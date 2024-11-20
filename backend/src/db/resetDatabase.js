const { Client } = require('pg')
const fs = require('fs')

// Подключение к базе данных
const client = new Client({
  user: 'user', // Замените на ваше имя пользователя
  host: 'localhost',
  database: 'gameshop', // Замените на вашу базу данных
  password: 'password', // Замените на ваш пароль
  port: 5432,
})

async function resetDatabase() {
  try {
    // Подключаемся к базе данных
    await client.connect()

    // Получаем список всех таблиц в базе данных
    const res = await client.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE';
        `)

    const tableNames = res.rows.map((row) => row.table_name)

    if (tableNames.length === 0) {
      console.log('No tables found to delete or truncate.')
      return
    }

    // 1. Очищаем таблицы
    for (let tableName of tableNames) {
      console.log(`Truncating table: ${tableName}`)
      await client.query(
        `TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`
      )
    }

    console.log('All tables have been truncated successfully.')

    // 2. Удаляем таблицы
    for (let tableName of tableNames) {
      console.log(`Dropping table: ${tableName}`)
      await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE;`)
    }

    console.log('All tables have been dropped successfully.')
  } catch (err) {
    console.error('Error resetting the database:', err)
  } finally {
    // Закрываем соединение с базой данных
    await client.end()
  }
}

resetDatabase()
