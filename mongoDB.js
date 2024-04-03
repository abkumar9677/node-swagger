// mongoDB.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let db;

async function connectDB() {
  try {
    if (!db) {
      await mongoose.connect(process.env.MONGO_URI);
      db = mongoose.connection;
      console.log("Database connected successfully");
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

module.exports = {
  getCollection: async (collectionName) => {
    try {
      await connectDB();
      return db.collection(collectionName);
    } catch (error) {
      console.error("Error getting collection:", error);
      throw error; // Rethrow the error to handle it in the calling code
    }
  },
  closeConnection: () => {
    if (db) {
      db.close();
      console.log("Database connection closed");
    }
  },
};
