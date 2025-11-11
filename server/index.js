const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_me_to_secure_value';

app.use(cors());
app.use(express.json());

// Seed an admin user if none exists (development convenience)
function seedAdmin() {
  const row = db.prepare('SELECT COUNT(*) as c FROM users').get();
  if (row && row.c === 0) {
    const password = 'ChangeMe123!';
    const hash = bcrypt.hashSync(password, 10);
    db.prepare('INSERT INTO users (email, password, name, isAdmin) VALUES (?, ?, ?, ?)')
      .run('admin@axe.local', hash, 'Admin', 1);
    console.log('Seeded admin user: admin@axe.local / ChangeMe123! (please change)');
  }
}

seedAdmin();

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const payload = { id: user.id, email: user.email, isAdmin: !!user.isAdmin, name: user.name };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: payload });
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

app.get('/api/admin/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/admin/dashboard', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  // return some dummy dashboard data
  res.json({ stats: { users: 12, clients: 500, cases: 1000 }, message: 'Welcome to the admin dashboard' });
});

// Simple endpoint to create new admin user (protected by JWT in env or disabled in production)
app.post('/api/admin/create', (req, res) => {
  const { email, password, name, isAdmin } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email & password required' });
  const hash = bcrypt.hashSync(password, 10);
  try {
    const info = db.prepare('INSERT INTO users (email, password, name, isAdmin) VALUES (?, ?, ?, ?)').run(email, hash, name || null, isAdmin ? 1 : 0);
    res.json({ id: info.lastInsertRowid });
  } catch (e) {
    res.status(500).json({ message: 'Could not create user', error: String(e) });
  }
});

app.listen(PORT, () => console.log(`Auth server listening on http://localhost:${PORT}`));
