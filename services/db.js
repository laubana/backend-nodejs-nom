const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (error) {
    console.log(error);

    console.error("Failed to connect to DB 🚨");
  }
};

module.exports = connect;
