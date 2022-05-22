module.exports = {
  development: {
    client: 'pg',
    connection: {
        database: 'recipes',
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PWD || 'password',
        port: process.env.DB_PORT || 5432
    },
    migrations: {
      directory: './data/migrations'
    },
    seeds: { directory: './data/seeds' }
  },

  testing: {
    client: 'pg',
    connection: {
        database: 'recipes',
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'me',
        password: process.env.DB_PWD || 'password',
        port: process.env.DB_PORT || 5432
    },
    migrations: {
      directory: './data/migrations'
    },
    seeds: { directory: './data/seeds' }
  },

  production: {
    client: 'pg',
    connection: {
        database: 'recipes',
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'me',
        password: process.env.DB_PWD || 'password',
        port: process.env.DB_PORT || 5432
    },
    migrations: {
      directory: './data/migrations'
    },
    seeds: { directory: './data/seeds' }
  }
}
