const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('./db');
const { ObjectId } = require('mongodb');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

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

// Fonction pour initialiser les données par défaut
async function initializeDefaultData(db) {
  const usersCollection = db.collection('users');
  const userCount = await usersCollection.countDocuments();
  
  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await usersCollection.insertOne({
      email: 'admin@axelegal.bj',
      password: hashedPassword,
      name: 'Administrateur',
      role: 'admin',
      createdAt: new Date()
    });
  }
}

// Routes d'authentification
app.post('/api/auth/login', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { email, password } = req.body;
    
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: { ...userWithoutPassword, id: user._id.toString() } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.user.id) });
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ ...userWithoutPassword, id: user._id.toString() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Routes CRUD pour les services
app.get('/api/services', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const services = await db.collection('services').find({}).toArray();
    res.json(services.map(s => ({ ...s, id: s._id.toString() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/services', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('services').insertOne({
      ...req.body,
      createdAt: new Date()
    });
    const service = await db.collection('services').findOne({ _id: result.insertedId });
    res.status(201).json({ ...service, id: service._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/services/:id', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('services').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    res.json({ ...result.value, id: result.value._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/services/:id', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    await db.collection('services').deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Routes pour l'équipe
app.get('/api/team', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const team = await db.collection('team').find({}).toArray();
    res.json(team.map(t => ({ ...t, id: t._id.toString() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/team', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('team').insertOne({
      ...req.body,
      createdAt: new Date()
    });
    const member = await db.collection('team').findOne({ _id: result.insertedId });
    res.status(201).json({ ...member, id: member._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/team/:id', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('team').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return res.status(404).json({ message: 'Membre non trouvé' });
    }
    res.json({ ...result.value, id: result.value._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/team/:id', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    await db.collection('team').deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Routes pour les processus
app.get('/api/process', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const processes = await db.collection('process').find({}).toArray();
    res.json(processes.map(p => ({ ...p, id: p._id.toString() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/process', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('process').insertOne({
      ...req.body,
      createdAt: new Date()
    });
    const process = await db.collection('process').findOne({ _id: result.insertedId });
    res.status(201).json({ ...process, id: process._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/process/:id', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('process').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return res.status(404).json({ message: 'Processus non trouvé' });
    }
    res.json({ ...result.value, id: result.value._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/process/:id', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    await db.collection('process').deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Routes pour les témoignages
app.get('/api/testimonials', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const testimonials = await db.collection('testimonials').find({}).toArray();
    res.json(testimonials.map(t => ({ ...t, id: t._id.toString() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/testimonials', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('testimonials').insertOne({
      ...req.body,
      createdAt: new Date()
    });
    const testimonial = await db.collection('testimonials').findOne({ _id: result.insertedId });
    res.status(201).json({ ...testimonial, id: testimonial._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('testimonials').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return res.status(404).json({ message: 'Témoignage non trouvé' });
    }
    res.json({ ...result.value, id: result.value._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    await db.collection('testimonials').deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Routes pour les annonces
app.get('/api/announcements', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const announcements = await db.collection('announcements').find({}).toArray();
    res.json(announcements.map(a => ({ ...a, id: a._id.toString() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/announcements', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('announcements').insertOne({
      ...req.body,
      createdAt: new Date()
    });
    const announcement = await db.collection('announcements').findOne({ _id: result.insertedId });
    res.status(201).json({ ...announcement, id: announcement._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/announcements/:id', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('announcements').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return res.status(404).json({ message: 'Annonce non trouvée' });
    }
    res.json({ ...result.value, id: result.value._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/announcements/:id', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    await db.collection('announcements').deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Routes pour les horaires d'ouverture
app.get('/api/business-hours', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    let hours = await db.collection('settings').findOne({ key: 'business_hours' });
    if (!hours) {
      hours = {
        weekdays: '08:00 - 18:00',
        saturday: '09:00 - 13:00',
        sunday: 'Fermé'
      };
    } else {
      hours = hours.value;
    }
    res.json(hours);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/business-hours', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    await db.collection('settings').updateOne(
      { key: 'business_hours' },
      { $set: { value: req.body, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Routes pour les messages
app.get('/api/messages', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const messages = await db.collection('messages').find({}).sort({ createdAt: -1 }).toArray();
    res.json(messages.map(m => ({ ...m, id: m._id.toString() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('messages').insertOne({
      ...req.body,
      createdAt: new Date()
    });
    const message = await db.collection('messages').findOne({ _id: result.insertedId });
    res.status(201).json({ ...message, id: message._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/messages/:id', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    await db.collection('messages').deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Routes pour les consultations
app.get('/api/consultations', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const consultations = await db.collection('consultations').find({}).sort({ createdAt: -1 }).toArray();
    res.json(consultations.map(c => ({ ...c, id: c._id.toString() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/consultations', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('consultations').insertOne({
      ...req.body,
      status: 'pending',
      createdAt: new Date()
    });
    const consultation = await db.collection('consultations').findOne({ _id: result.insertedId });
    res.status(201).json({ ...consultation, id: consultation._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/consultations/:id', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('consultations').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return res.status(404).json({ message: 'Consultation non trouvée' });
    }
    res.json({ ...result.value, id: result.value._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/consultations/:id', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    await db.collection('consultations').deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour le profil admin
app.put('/api/admin/profile', authMiddleware, async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { name, email, currentPassword, newPassword } = req.body;
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.user.id) });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    if (newPassword && currentPassword) {
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.collection('users').updateOne(
        { _id: new ObjectId(req.user.id) },
        { $set: { name, email, password: hashedPassword, updatedAt: new Date() } }
      );
    } else {
      await db.collection('users').updateOne(
        { _id: new ObjectId(req.user.id) },
        { $set: { name, email, updatedAt: new Date() } }
      );
    }
    
    const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(req.user.id) });
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({ ...userWithoutPassword, id: updatedUser._id.toString() });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Initialiser les données par défaut au démarrage
(async () => {
  try {
    const { db } = await connectToDatabase();
    await initializeDefaultData(db);
  } catch (error) {
    console.error('Initialization error:', error);
  }
})();

// Export comme fonction serverless pour Vercel
module.exports = async (req, res) => {
  return app(req, res);
};
