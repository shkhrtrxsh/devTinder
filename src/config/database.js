const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://shkhrtrxsh:mongodb@cluster0.kad9e.mongodb.net/"
  );
  console.log("Connected to MongoDB");
};

module.exports = connectDB;
