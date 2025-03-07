const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Connected to MongoDB");
};

module.exports = connectDB;
