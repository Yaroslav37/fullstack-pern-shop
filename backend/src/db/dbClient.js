const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'gameshop',
  password: 'postgres',
  port: 5436,
})

module.exports = client
