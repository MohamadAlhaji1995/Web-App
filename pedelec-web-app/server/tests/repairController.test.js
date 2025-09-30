const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const server = require("../server");
const RepairRequest = require("../models/repairSchema");

let mongoDbServer;

const createRepairRequest = async (bikeName, description, contactEmail) => {
  const repairRequest = new RepairRequest({
    bikeName,
    description,
    contactEmail,
  });
  await repairRequest.save();
  return repairRequest;
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
  await RepairRequest.deleteMany({});
});

describe("repairController", () => {
  // Test: Abrufen aller Reparaturanfragen mit Paginierung (nur für Admin)
  test("sollte alle Reparaturanfragen mit Paginierung zurückgeben (nur für Admin)", async () => {
    await createRepairRequest("Bike 1", "Platten", "user1@example.com");
    await createRepairRequest("Bike 2", "Bremse kaputt", "user2@example.com");

    const response = await request(server)
      .get("/api/reparatur-anfrage?page=1")
      .set("Authorization", "Bearer AdminToken");

    expect(response.status).toBe(200);
    expect(response.body.anfragen.length).toBe(2);
    expect(response.body.currentPage).toBe(1);
  });

  // Test: Status einer Reparaturanfrage aktualisieren
  test("sollte den Status einer Reparaturanfrage aktualisieren", async () => {
    const repairRequest = await createRepairRequest(
      "Bike 3",
      "Lenker locker",
      "user3@example.com"
    );

    const response = await request(server)
      .put(`/api/reparatur-anfrage/${repairRequest._id}`)
      .send({ status: "Fertig" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("Fertig");
  });

  // Test: Aktualisierung einer nicht vorhandenen Reparaturanfrage
  test("sollte 404 zurückgeben, wenn die Reparaturanfrage nicht gefunden wird", async () => {
    const nonExistingId = new mongoose.Types.ObjectId();

    const response = await request(server)
      .put(`/api/reparatur-anfrage/${nonExistingId}`)
      .send({ status: "Fertig" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Anfrage nicht gefunden");
  });

  // Test: Abrufen von Reparaturanfragen, wenn keine existieren (nur für Admin)
  test("sollte eine leere Liste zurückgeben, wenn keine Reparaturanfragen existieren (nur für Admin)", async () => {
    const response = await request(server)
      .get("/api/reparatur-anfrage?page=1")
      .set("Authorization", "Bearer AdminToken");

    expect(response.status).toBe(200);
    expect(response.body.anfragen.length).toBe(0);
  });
});
