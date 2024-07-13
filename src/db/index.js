import pg from 'pg'
const { Client } = pg
// const client = new Client({
//     user: 'my_admin',
//     password: 'my_admin',
//     host: 'localhost',
//     port: 5334,
//     database: 'database-name',
// })

const {Pool} = pg
const pool = new Pool({
  user: 'my_admin',
  host: 'localhost',
  database: 'quotesbook',
  password: 'my_admin',
  port: 5432,
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    
  })

export {pool}