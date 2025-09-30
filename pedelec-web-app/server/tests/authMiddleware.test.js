const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../server');
const User = require('../models/userSchema');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'; 

let mongoDbServer;

beforeAll(async () => {
  try {
    mongoDbServer = await MongoMemoryServer.create();
    const uri = mongoDbServer.getUri();
    await mongoose.connect(uri);
  } catch (error) {
    console.error('Fehler bei der Verbindung zur Datenbank:', error);
  }
});

afterAll(async () => {
  try {
    await mongoose.disconnect();
    await mongoDbServer.stop();
  } catch (error) {
    console.error('Fehler beim Trennen der Datenbankverbindung:', error);
  }
});

afterEach(async () => {
  await User.deleteMany({});
});

// Tests für die authMiddleware
describe('authMiddleware', () => {
  test('wenn ein gültiges Token bereitgestellt wird, wird den Zugriff erlaubt', async () => {
    const user = new User({
      name: 'user',
      email: 'user@test.com',
      password: '123456',
      role: 'user'
    });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '10h' });

    const response = await request(server)
      .get('/api/eBikes') 
      .set('Authorization', `Bearer ${token}`)
      .send();
    
    
    expect(response.body).toBeDefined();  // Sollte eine Liste von eBikes zurückgeben
  });

  // Test für Benutzer mit gültigem Token aber ohne Adminrolle
  test('wenn ein gültiges Token aber keine Adminrolle vorhanden ist, gib 403 zurück', async () => {
    const user = new User({
      name: ' UserOhneAdminRechte',
      email: 'UserOhneAdminRechte@test.com',
      password: '123456',
      role: 'user'
    });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '10h' });

    const response = await request(server)
      .get('/api/users') 
      .set('Authorization', `Bearer ${token}`)
      .send();

      
    expect(response.body.message).toBe('Zugriff verweigert, nur Admins erlaubt');
  });
  
});
