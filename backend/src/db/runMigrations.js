const client = require('./dbClient')
const fs = require('fs')
const path = require('path')

const migrationFilePath = path.join(__dirname, '../migrations/migrations.sql')

const migrate = async () => {
  try {
    await client.connect()
    console.log('Подключение к базе данных установлено.')

    const migrationSQL = fs.readFileSync(migrationFilePath, 'utf-8')
    await client.query(migrationSQL)

    console.log('Миграции выполнены успешно.')
  } catch (err) {
    console.error('Ошибка выполнения миграций:', err.message)
  } finally {
    await client.end()
    console.log('Подключение к базе данных закрыто.')
  }
}

migrate()
