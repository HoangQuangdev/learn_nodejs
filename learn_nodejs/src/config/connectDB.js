const sql = require('mssql');
require('dotenv').config();


const server_sql = process.env.SERVER_SQL
const database_sql = process.env.DATABASE_SQL
const username_sql = process.env.USERNAME_SQL
const password_sql = process.env.PASSWORD_SQL
const config = {
  user: username_sql,
  password: password_sql,
  server: server_sql,
  database: database_sql,
  pool:{
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // Sử dụng mã hóa (nếu bạn đang sử dụng kết nối HTTPS)
    trustServerCertificate: false
  },
};


async function connectSql() {
  try {
    const pool = await sql.connect(config)
    console.log("thanh cong")
    return pool
    
  } catch (error) {
    console.log("🚀 ~ connectSql ~ error:", error)
    throw error
  }
}

module.exports = { connectSql, sql };

