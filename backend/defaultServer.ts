import path from "path";
import { startSocketServer } from "./socketServer";

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const authRouter = require("./routers/authRouter");
const getDataRouter = require("./routers/getDataRouter");
const uploadRouter = require("./routers/uploadRouter");

require("dotenv").config();

const { User, Chat } = require("./models");

const { DEFAULT_SERVER_PORT, MONGO_URL, CORS_ORIGIN_URL_WITH_PORT } =
  process.env;

var corsOptions = {
  origin: CORS_ORIGIN_URL_WITH_PORT,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));

app.use("/public", express.static(path.join(__dirname, "public")));

const start = async () => {
  try {
    await mongoose.connect(MONGO_URL).then(() => {
      console.log("Server connected to MongoDB.");
    });
    await app.listen(DEFAULT_SERVER_PORT, () => {
      console.log(`Server listen on port ${DEFAULT_SERVER_PORT}`);
    });
    startSocketServer();
  } catch (e) {
    console.error(
      "Error during starting server or connect to MongoDB: ",
      e.message
    );
  }
};

start();

// Routes
app.use("/getData", getDataRouter);
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
