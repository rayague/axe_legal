const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'data.sqlite');
const db = new Database(dbPath);

// Create users table
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  isAdmin INTEGER DEFAULT 0
);
`);

module.exports = db;
