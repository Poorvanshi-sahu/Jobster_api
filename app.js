const express = require("express");
require("dotenv").config();
require("express-async-errors");
const notFound = require("./middleware/notFound");
const authRoutes = require("./routes/auth");
const jobsRoute = require("./routes/jobs");
const connectDB = require("./db/connect");
const errorHandler = require("./middleware/errorHandler");
const isAuthenticated = require("./middleware/authentication");
const path = require("path");

// security
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

const app = express();
// middlewares for security

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.json());

app.set("trust proxy", 1);

app.use(express.static(path.resolve(__dirname, "./client/build")));

const port = process.env.PORT || 3000;

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", isAuthenticated, jobsRoute);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFound);

app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI).then(() => console.log("Connected"));
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log(error.message);
  }
};

start();
