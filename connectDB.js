const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(`Failed to connect MongoDB: ${err.message}`);
  }
};

module.exports = connectDB;
