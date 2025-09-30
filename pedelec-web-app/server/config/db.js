const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/UserDb",
      {}
    );
    console.log("Verbindung ist erfolgreich ");
  } catch (error) {
    console.error("Kontakt mit MongoDb hat fehlgeschagen :(", error);
    process.exit(1);
  }
};

module.exports = connectDB;
