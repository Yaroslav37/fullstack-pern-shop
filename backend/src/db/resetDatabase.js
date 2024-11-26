const client = require('./dbClient')
const fs = require('fs')
const path = require('path')

const cleanFilePath = path.join(__dirname, '../migrations/clean.sql')

const cleanDatabase = async () => {
  try {
    await client.connect()
    console.log('Подключение к базе данных установлено.')

    const cleanSQL = fs.readFileSync(cleanFilePath, 'utf-8')
    await client.query(cleanSQL)

    console.log('Очистка базы данных выполнена успешно.')
  } catch (err) {
    console.error('Ошибка очистки базы данных:', err.message)
  } finally {
    await client.end()
    console.log('Подключение к базе данных закрыто.')
  }
}

cleanDatabase()
