module.exports = {
  development: {
    username: 'root',
    password: process.env.PASSWORD,
    database: 'vacation_db',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
  },
  test: {
    username: 'root',
    password: null,
    database: 'testdb',
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  },
  production: {
    use_env_variable: 'JAWSDB_URL',
    dialect: 'mysql'
  }
}
