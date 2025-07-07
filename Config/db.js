const mongoose = require("mongoose");
const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
  const dbName = mongoose.connection.name;
  console.log(`✅ Connected to MongoDB: ${dbName}`);
    // console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
 
module.exports = connectToDb;
