require("dotenv").config();
const data = require("./data.json");
const connectDB = require("./db/connect");
const Job = require("./models/jobs");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    await Job.create(data);

    console.log("Success!!!");

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
