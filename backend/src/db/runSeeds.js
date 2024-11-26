const fs = require('fs')
const path = require('path')
const client = require('./dbClient') // Подключение к базе данных

const seedFilePath = path.join(__dirname, '../seeds/seeds.sql')

const runSeeds = async () => {
  try {
    await client.connect()
    console.log('Подключение к базе данных установлено.')

    const seedSQL = fs.readFileSync(seedFilePath, 'utf-8')
    await client.query(seedSQL)

    console.log('Сиды успешно применены.')
  } catch (error) {
    console.error('Ошибка выполнения сидов:', error.message)
  } finally {
    await client.end()
    console.log('Подключение к базе данных закрыто.')
  }
}

runSeeds()
