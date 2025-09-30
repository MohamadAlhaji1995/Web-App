const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const connectDB = require("../config/db");

let mongoDbServer;

beforeAll(async () => {
  mongoDbServer = await MongoMemoryServer.create();
  const uri = mongoDbServer.getUri();
  process.env.MONGODB_URI = uri;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoDbServer.stop();
});

describe("MongoDB Connection", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test("Erfolgreich Verbindung", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    await connectDB();

    expect(mongoose.connection.readyState).toBe(1);
    expect(consoleLogSpy).toHaveBeenCalledWith("Verbindung ist erfolgreich ");
  });

  test("Fehler beim Verbinden ", async () => {
    const invalidUri = "mongodb://invalid:27017/test";
    process.env.MONGODB_URI = invalidUri;

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const processExitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation(() => {});

    await connectDB();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Kontakt mit MongoDb hat fehlgeschagen :(",
      expect.any(Error)
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
