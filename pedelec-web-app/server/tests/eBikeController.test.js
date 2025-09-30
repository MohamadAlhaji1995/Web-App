const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const server = require("../server");
const EBike = require("../models/eBikeSchema");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { validateEBikeData } = require("../controllers/eBikeController");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

let mongoDbServer;
let adminToken;
let userToken;

beforeAll(async () => {
  mongoDbServer = await MongoMemoryServer.create();
  const uri = mongoDbServer.getUri();
  await mongoose.connect(uri);

  // Erstellen eines Admins und eines normalen Benutzers für die Tests
  const adminUser = new User({
    name: "admin",
    email: "admin@test.com",
    password: "123456",
    role: "admin",
  });
  await adminUser.save();
  adminToken = jwt.sign(
    { userId: adminUser._id, role: adminUser.role },
    JWT_SECRET,
    { expiresIn: "10h" }
  );

  const normalUser = new User({
    name: "user",
    email: "user@test.com",
    password: "123456",
    role: "user",
  });
  await normalUser.save();
  userToken = jwt.sign(
    { userId: normalUser._id, role: normalUser.role },
    JWT_SECRET,
    { expiresIn: "10h" }
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoDbServer.stop();
});

afterEach(async () => {
  await EBike.deleteMany({});
});

describe("eBikeController", () => {
  // Test für das Hinzufügen eines E-Bikes mit gültigen Daten (Admin)
  test("E-Bike hinzufügen", async () => {
    const response = await request(server)
      .post("/api/eBikes")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Bike1",
        color: "Rot",
        brand: "Bmw",
        price: 15000,
        rent: 2000,
      });
    expect(response.body.message).toBe("E-Bike erfolgreich hinzugefügt");
  });

  // Test für das Löschen eines E-Bikes (Admin)
  test("E-Bike löschen", async () => {
    const eBikeLoeschen = new EBike({
      name: "Bike1",
      color: "Gelb",
      brand: "Bmw",
      price: 12000,
      rent: 1000,
    });
    await eBikeLoeschen.save();

    const response = await request(server)
      .delete(`/api/eBikes/${eBikeLoeschen._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send();
    expect(response.body.message).toBe("E-Bike erfolgreich gelöscht");
  });

  test("ungültige E-Bike-ID", async () => {
    // Verwenden eine ungültige ObjectId
    const ungueltigId = "ungueltigeId";

    const response = await request(server)
      .delete(`/api/eBikes/${ungueltigId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.body.error).toBe("Fehler beim Löschen des E-Bikes");
  });

  test("sollte 404 zurückgeben, wenn das E-Bike nicht gefunden wird", async () => {
    const nichtexistierendeID = new mongoose.Types.ObjectId();

    const response = await request(server)
      .delete(`/api/eBikes/${nichtexistierendeID}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.body.message).toBe("E-Bike nicht gefunden");
  });

  // Test für die validateEBikeData Funktion
  describe("validateEBikeData", () => {
    test("Name fehlt zurückgeben", () => {
      const result = validateEBikeData(null, "Gelb", "Bmw", 1000, 2000);
      expect(result).toBe("Name fehlt");
    });

    test('sollte "Farbe fehlt zurückgeben', () => {
      const result = validateEBikeData("Bike1", null, "Bmw", 1000, 2000);
      expect(result).toBe("Farbe fehlt");
    });

    test("Marke fehlt zurückgeben", () => {
      const result = validateEBikeData("Bike1", "Rot", null, 1000, 2000);
      expect(result).toBe("Marke fehlt");
    });

    test("Ungültiger Preis zurückgeben", () => {
      const result = validateEBikeData("Bike1", "Rot", "Bmw", -5000, 2000);
      expect(result).toBe("Ungültiger Preis");
    });

    test("Ungültiger Mietpreis zurückgeben", () => {
      const result = validateEBikeData("Bike1", "Rot", "Bmw", 1000, -2000);
      expect(result).toBe("Ungültiger Mietpreis");
    });

    test("true zurückgeben", () => {
      const result = validateEBikeData("Bike1", "Rot", "Bmw", 10000, 2000);
      expect(result).toBe(true);
    });
  });
});
