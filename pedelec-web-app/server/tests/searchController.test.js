const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../server');
const EBike = require('../models/eBikeSchema');

let mongoDbServer;

const createEBike = async (name, brand, color, price, rent) => {
  const eBike = new EBike({ name, brand, color, price, rent });
  await eBike.save();
  return eBike;
};

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
  await EBike.deleteMany({});
});

describe('searchController', () => {
  // Test: Suchen nach einem bestimmten Suchbegriff
  test('sollte eBikes zurückgeben, die dem Suchbegriff entsprechen', async () => {
    await createEBike('Rotes Bike', 'Bmw', 'Rot', 1000, 100);
    await createEBike('Blaues Bike', 'Audi', 'Blau', 2000, 150);

    const response = await request(server)
      .post('/api/search')
      .send({ term: 'Rot' });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Rotes Bike');
  });

  // Test: Suchen nach einer bestimmten Marke
  test('sollte eBikes zurückgeben, die der Marke entsprechen', async () => {
    await createEBike('Bike1', 'Bmw', 'Rot', 1000, 100);
    await createEBike('Bike2', 'Audi', 'Blau', 2000, 150);

    const response = await request(server)
      .post('/api/search')
      .send({ brand: 'Bmw' });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].brand).toBe('Bmw');
  });

  // Test: Suchen nach einer bestimmten Farbe
  test('sollte eBikes zurückgeben, die der Farbe entsprechen', async () => {
    await createEBike('Bike1', 'Bmw', 'Rot', 1000, 100);
    await createEBike('Bike2', 'Audi', 'Blau', 2000, 150);

    const response = await request(server)
      .post('/api/search')
      .send({ color: 'Rot' });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].color).toBe('Rot');
  });

  // Test: Suchen innerhalb einer Preisspanne
  test('sollte eBikes zurückgeben, die in der Preisspanne liegen', async () => {
    await createEBike('Bike1', 'Bmw', 'Rot', 1000, 100);
    await createEBike('Bike2', 'Audi', 'Blau', 2000, 150);

    const response = await request(server)
      .post('/api/search')
      .send({ maxPrice: 1500 });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].price).toBe(1000);
  });

  // Test: Suchen ohne Suchkriterien (sollte alle eBikes zurückgeben)
  test('sollte alle eBikes zurückgeben, wenn keine Suchkriterien angegeben sind', async () => {
    await createEBike('Bike1', 'Bmw', 'Rot', 1000, 100);
    await createEBike('Bike2', 'Audi', 'Blau', 2000, 150);

    const response = await request(server)
      .post('/api/search')
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  // Test: Suchen nach einer Marke, die nicht existiert
  test('sollte eine leere Liste zurückgeben, wenn keine eBikes der Marke entsprechen', async () => {
    await createEBike('Bike1', 'Bmw', 'Rot', 1000, 100);

    const response = await request(server)
      .post('/api/search')
      .send({ brand: 'Tesla' });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });

  // Test: Suchen mit ungültigen Preisspannenwerten
  test('sollte eine Fehlermeldung zurückgeben, wenn ungültige Preisspannenwerte angegeben sind', async () => {
    let response = await request(server)
      .post('/api/search')
      .send({ minPrice: 'invalid' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Ungültiger Mindestpreis');

    response = await request(server)
      .post('/api/search')
      .send({ maxPrice: 'invalid' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Ungültiger Höchstpreis');
  });

  // Test: Suchen, wenn keine eBikes in der Preisspanne liegen
  test('sollte eine leere Liste zurückgeben, wenn keine eBikes in der Preisspanne liegen', async () => {
    await createEBike('Bike1', 'Bmw', 'Rot', 5000, 100);

    const response = await request(server)
      .post('/api/search')
      .send({ minPrice: 100, maxPrice: 1000 });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });

  // Test: Suchen mit nur minPrice angegeben
  test('sollte eBikes zurückgeben, die über dem Mindestpreis liegen', async () => {
    await createEBike('Bike1', 'Bmw', 'Rot', 1000, 100);
    await createEBike('Bike2', 'Audi', 'Blau', 2000, 150);

    const response = await request(server)
      .post('/api/search')
      .send({ minPrice: 1500 });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].price).toBe(2000);
  });

  // Test: Suchen mit nur maxPrice angegeben
  test('sollte eBikes zurückgeben, die unter dem Höchstpreis liegen', async () => {
    await createEBike('Bike1', 'Bmw', 'Rot', 1000, 100);
    await createEBike('Bike2', 'Audi', 'Blau', 2000, 150);

    const response = await request(server)
      .post('/api/search')
      .send({ maxPrice: 1500 });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].price).toBe(1000);
  });
});