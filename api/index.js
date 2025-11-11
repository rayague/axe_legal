const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import de la logique du serveur
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Données en mémoire (comme dans index-simple.js)
let users = [
  {
    id: '1',
    email: 'admin@axelegal.bj',
    password: '$2b$10$rQ4YjH8ZPKz.jH8qY5H8qeH8qY5H8qeH8qY5H8qeH8qY5H8qeH8qY',
    name: 'Administrateur',
    role: 'admin'
  }
];

let services = [];
let teamMembers = [];
let processSteps = [];
let testimonials = [];
let announcements = [];
let businessHours = {
  weekdays: '08:00 - 18:00',
  saturday: '09:00 - 13:00',
  sunday: 'Fermé'
};
let messages = [];
let consultations = [];

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// Routes d'authentification
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Routes CRUD pour les services
app.get('/api/services', (req, res) => res.json(services));
app.post('/api/services', authMiddleware, (req, res) => {
  const newService = { id: Date.now().toString(), ...req.body };
  services.push(newService);
  res.status(201).json(newService);
});
app.put('/api/services/:id', authMiddleware, (req, res) => {
  const index = services.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Service non trouvé' });
  services[index] = { ...services[index], ...req.body };
  res.json(services[index]);
});
app.delete('/api/services/:id', authMiddleware, (req, res) => {
  services = services.filter(s => s.id !== req.params.id);
  res.status(204).send();
});

// Routes pour les autres ressources
app.get('/api/team', (req, res) => res.json(teamMembers));
app.post('/api/team', authMiddleware, (req, res) => {
  const newMember = { id: Date.now().toString(), ...req.body };
  teamMembers.push(newMember);
  res.status(201).json(newMember);
});
app.put('/api/team/:id', authMiddleware, (req, res) => {
  const index = teamMembers.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Membre non trouvé' });
  teamMembers[index] = { ...teamMembers[index], ...req.body };
  res.json(teamMembers[index]);
});
app.delete('/api/team/:id', authMiddleware, (req, res) => {
  teamMembers = teamMembers.filter(m => m.id !== req.params.id);
  res.status(204).send();
});

app.get('/api/process', (req, res) => res.json(processSteps));
app.post('/api/process', authMiddleware, (req, res) => {
  const newStep = { id: Date.now().toString(), ...req.body };
  processSteps.push(newStep);
  res.status(201).json(newStep);
});
app.put('/api/process/:id', authMiddleware, (req, res) => {
  const index = processSteps.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Étape non trouvée' });
  processSteps[index] = { ...processSteps[index], ...req.body };
  res.json(processSteps[index]);
});
app.delete('/api/process/:id', authMiddleware, (req, res) => {
  processSteps = processSteps.filter(s => s.id !== req.params.id);
  res.status(204).send();
});

app.get('/api/testimonials', (req, res) => res.json(testimonials));
app.post('/api/testimonials', authMiddleware, (req, res) => {
  const newTestimonial = { id: Date.now().toString(), ...req.body };
  testimonials.push(newTestimonial);
  res.status(201).json(newTestimonial);
});
app.put('/api/testimonials/:id', authMiddleware, (req, res) => {
  const index = testimonials.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Témoignage non trouvé' });
  testimonials[index] = { ...testimonials[index], ...req.body };
  res.json(testimonials[index]);
});
app.delete('/api/testimonials/:id', authMiddleware, (req, res) => {
  testimonials = testimonials.filter(t => t.id !== req.params.id);
  res.status(204).send();
});

app.get('/api/announcements', (req, res) => res.json(announcements));
app.post('/api/announcements', authMiddleware, (req, res) => {
  const newAnnouncement = { id: Date.now().toString(), ...req.body };
  announcements.push(newAnnouncement);
  res.status(201).json(newAnnouncement);
});
app.put('/api/announcements/:id', authMiddleware, (req, res) => {
  const index = announcements.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Annonce non trouvée' });
  announcements[index] = { ...announcements[index], ...req.body };
  res.json(announcements[index]);
});
app.delete('/api/announcements/:id', authMiddleware, (req, res) => {
  announcements = announcements.filter(a => a.id !== req.params.id);
  res.status(204).send();
});

app.get('/api/business-hours', (req, res) => res.json(businessHours));
app.put('/api/business-hours', authMiddleware, (req, res) => {
  businessHours = { ...businessHours, ...req.body };
  res.json(businessHours);
});

app.get('/api/messages', authMiddleware, (req, res) => res.json(messages));
app.post('/api/messages', (req, res) => {
  const newMessage = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});
app.delete('/api/messages/:id', authMiddleware, (req, res) => {
  messages = messages.filter(m => m.id !== req.params.id);
  res.status(204).send();
});

app.get('/api/consultations', authMiddleware, (req, res) => res.json(consultations));
app.post('/api/consultations', (req, res) => {
  const newConsultation = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  consultations.push(newConsultation);
  res.status(201).json(newConsultation);
});
app.put('/api/consultations/:id', authMiddleware, (req, res) => {
  const index = consultations.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Consultation non trouvée' });
  consultations[index] = { ...consultations[index], ...req.body };
  res.json(consultations[index]);
});
app.delete('/api/consultations/:id', authMiddleware, (req, res) => {
  consultations = consultations.filter(c => c.id !== req.params.id);
  res.status(204).send();
});

// Route pour le profil admin
app.put('/api/admin/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    if (newPassword && currentPassword) {
      const isValidPassword = await bcrypt.compare(currentPassword, users[userIndex].password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      }
      users[userIndex].password = await bcrypt.hash(newPassword, 10);
    }
    users[userIndex].name = name;
    users[userIndex].email = email;
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Export comme fonction serverless pour Vercel
module.exports = (req, res) => {
  return app(req, res);
};
