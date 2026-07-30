const mongoose = require("mongoose");
const { log } = require("winston");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongDB Connected Successfully.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
