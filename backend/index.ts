const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const authRouter = require("./routers/authRouter");
const getDataRouter = require("./routers/getDataRouter");

require("dotenv").config();

const { User, Chat } = require("./models");

const { PORT, MONGO_URL, CORS_ORIGIN_URL_WITH_PORT } = process.env;

var corsOptions = {
  origin: CORS_ORIGIN_URL_WITH_PORT,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

const start = () => {
  try {
    mongoose.connect(MONGO_URL).then(() => {
      console.log("Server connected to MongoDB.");
    });
    app.listen(PORT, () => {
      console.log(`Server listen on port ${PORT}`);
    });
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
