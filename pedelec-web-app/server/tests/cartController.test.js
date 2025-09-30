const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../server');
const Cart = require('../models/cartSchema');
const EBike = require('../models/eBikeSchema');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

const generateToken = (userId) => {
  return jwt.sign({ userId, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
};

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
  await Cart.deleteMany({});
  await EBike.deleteMany({});
});

describe('CartController', () => {
  let userId;
  let token;

  beforeEach(() => {
    userId = new mongoose.Types.ObjectId();
    token = generateToken(userId);
  });

  test('sollte ein Produkt zum Warenkorb hinzufügen', async () => {
    const eBike = await createEBike('Rotes Bike', 'Bmw', 'Rot', 1000, 100);

    const response = await request(server)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: eBike._id, quantity: 1 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Produkt erfolgreich zum Warenkorb hinzugefügt');
  });

  test('sollte das gleiche Produkt nicht zweimal zum Warenkorb hinzufügen', async () => {
    const eBike = await createEBike('Rotes Bike', 'Bmw', 'Rot', 1000, 100);

    await request(server)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: eBike._id, quantity: 1 });

    const response = await request(server)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: eBike._id, quantity: 1 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Dieses Produkt befindet sich bereits im Warenkorb.');
  });

  test('sollte den Warenkorb für einen Benutzer abrufen', async () => {
    const eBike = await createEBike('Rotes Bike', 'Bmw', 'Rot', 1000, 100);
    await request(server)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: eBike._id, quantity: 1 });

    const response = await request(server)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.items.length).toBe(1);
    expect(response.body.items[0].eBike._id).toBe(eBike._id.toString());
  });

  test('sollte ein Produkt aus dem Warenkorb entfernen', async () => {
    const eBike = await createEBike('Rotes Bike', 'Bmw', 'Rot', 1000, 100);
    await request(server)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: eBike._id, quantity: 1 });

    const response = await request(server)
      .delete(`/api/cart/remove/${eBike._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.items.length).toBe(0);
  });

  test('sollte die Menge eines Produkts im Warenkorb erhöhen', async () => {
    const eBike = await createEBike('Rotes Bike', 'Bmw', 'Rot', 1000, 100);
    await request(server)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: eBike._id, quantity: 1 });

    const response = await request(server)
      .post('/api/cart/update-quantity')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: eBike._id, action: 'increase' });

    expect(response.status).toBe(200);
    expect(response.body.items[0].quantity).toBe(2);
  });

  test('sollte die Menge eines Produkts im Warenkorb verringern und das Produkt entfernen, wenn die Menge null erreicht', async () => {
    const eBike = await createEBike('Rotes Bike', 'Bmw', 'Rot', 1000, 100);
    await request(server)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: eBike._id, quantity: 1 });

    const response = await request(server)
      .post('/api/cart/update-quantity')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: eBike._id, action: 'decrease' });

    expect(response.status).toBe(200);
    expect(response.body.items.length).toBe(0);
  });
});

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
});