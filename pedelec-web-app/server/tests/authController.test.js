const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../server');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');

let mongoDbServer;

beforeAll(async () => {
  mongoDbServer = await MongoMemoryServer.create();
  const uri = mongoDbServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoDbServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('authController', () => {

  test('Benutzer sollte erfolgreich registrieren', async () => {
    const response = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'user',
        email: 'user@test.com',
        password: '123456'
      });
    expect(response.body.message).toBe('Benutzer erfolgreich registriert');
  });

  

  test('Benutzer sollte mit bestehender E-Mail nicht registrieren', async () => {
    const user = new User({
      name: 'user',
      email: 'user@test.com',
      password: '123456'
    });
    await user.save();

    const response = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'user',
        email: 'user@test.com',
        password: '123456'
      });
    expect(response.body.message).toBe('Benutzer ist bereits vorhanden');
  });

  test('Benutzer sollte erfolgreich einloggen', async () => {
    const user = new User({
      name: 'user',
      email: 'user@test.com',
      password: await bcrypt.hash('123456', 10)
    });
    await user.save();

    const response = await request(server)
      .post('/api/auth/logIn')
      .send({
        email: 'user@test.com',
        password: '123456'
      });
    expect(response.body.message).toBe('Sie haben sich eingeloggt');
  });

  test('Benutzer sollte mit falschen Passwort nicht einloggen', async () => {
    const user = new User({
      name: 'user',
      email: 'user@test.com',
      password: await bcrypt.hash('123456', 10)
    });
    await user.save();

    const response = await request(server)
      .post('/api/auth/logIn')
      .send({
        email: 'user@test.com',
        password: '111111'
      });
    expect(response.body.message).toBe('Username oder Password ist nicht korrekt');
  });

  test('sollte einen nicht existierenden Benutzer nicht einloggen', async () => {
    const response = await request(server)
      .post('/api/auth/logIn')
      .send({
        email: 'Benutzernichtrexistiert@test.com',
        password: '123456'
      });

    expect(response.body.error).toBe('Benutzer nicht gefunden');
  });

  test('mit fehlenden Feldern sollte der Benutzer nicht einloggen', async () => {
    const response = await request(server)
      .post('/api/auth/logIn')
      .send({
        email: 'user@test.com'
      });
    expect(response.body.message).toBe('Fehlende Felder');
  });

  test('mit fehlenden Feldern sollte der Benutzer nicht registrieren', async () => {
    const fehlderTest = [
      { email: 'user@test.com', password: '123456', message: 'Fehlende Felder' },
      { name: 'user', password: '123456', message: 'Fehlende Felder' },
      { name: 'user', email: 'user@test.com', message: 'Fehlende Felder' }
    ];

    for (const test of fehlderTest) {
      const response = await request(server)
        .post('/api/auth/register')
        .send(test);
      expect(response.body.message).toBe(test.message);
    }
  });

  test('Benutzer sollte mit ungültiger E-Mail nicht registrieren', async () => {
    const response = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'user',
        email: 'ungueltigeE-mail',
        password: '123456'
      });

    expect(response.body.message).toBe('Ungültige E-Mail-Adresse');
  });

  test('Benutzer sollte mit zu kurzem Passwort nicht registrieren', async () => {
    const response = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'user',
        email: 'user@test.com',
        password: '123'
      });
    expect(response.body.message).toBe('Das Passwort muss mindestens 6 Zeichen lang sein');
  });
});


