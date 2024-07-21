const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const app = express();

require("dotenv").config();

const { User } = require("./models");

const { PORT, MONGO_URL, CORS_ORIGIN_URL_WITH_PORT } = process.env;

var corsOptions = {
  origin: CORS_ORIGIN_URL_WITH_PORT,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

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

// Get routes
app.get("/some", async (req, res) => {
  const users = await User.find({});
  console.log(users);
  res.send("Hello World!");
});
