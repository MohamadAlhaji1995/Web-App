const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const server = require("../server");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let mongoDbServer;
let testUser;
let adminToken;

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

describe("userController", () => {
  beforeEach(async () => {
    // Erstellen eines Testbenutzers mit Admin-Rechten vor jedem Test
    testUser = new User({
      name: "Testuser",
      email: "testuser@test.com",
      password: await bcrypt.hash("password", 10),
      role: "admin",
    });
    await testUser.save();

    // Generieren eines gültigen Tokens für den Admin-Benutzer
    adminToken = jwt.sign(
      { id: testUser._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );
  });

  // Test: Keine Benutzer vorhanden
  test("leere Liste zurückgeben,falls keine Benutzer vorhanden sind", async () => {
    await User.deleteMany({});
    const response = await request(server)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send();
    expect(response.body.length).toBe(0);
  });

  // Test: Benutzer erfolgreich aktualisieren
  test("sollte einen Benutzer erfolgreich aktualisieren", async () => {
    const updateData = { name: "UpdatedUser" };

    const response = await request(server)
      .put(`/api/users/${testUser._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updateData);

    expect(response.body.name).toBe("UpdatedUser");
  });

  // Test: Benutzer erfolgreich löschen
  test("Benutzer erfolgreich löschen", async () => {
    // Löschen des Testbenutzers mit Admin-Token
    const response = await request(server)
      .delete(`/api/users/${testUser._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send();

    expect(response.body.message).toBe("Benutzer erfolgreich gelöscht");
  });
});
