import { getDocQueries } from "./types";
import { Request, Response } from "express";

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();

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

// Get routes
app.get("/some", async (req, res) => {
  const users = await User.find({});
  console.log(users);
  res.send("Hello World!");
});

app.get("/getDoc", async (req: Request, res: Response) => {
  let Model: typeof User | typeof Chat;
  const query = {};
  const { collectionName, condition } = req.query as getDocQueries;

  if (collectionName === "users") {
    Model = User;
  }
  if (collectionName === "chats") {
    Model = Chat;
  }

  const { field, conditionType, value } = condition;

  if (conditionType == "==") {
    if (mongoose.isValidObjectId(value)) {
      query[field] = new mongoose.Types.ObjectId(value);
    } else {
      query[field] = value;
    }

    try {
      const data = await Model.findOne(query);
      if (data) {
        return res.send({ success: true, data });
      } else {
        return res.send({ success: false, message: "Doc not found" });
      }
    } catch (e) {
      console.error(e.message);
      return res.status(400).send({ success: false, message: e.message });
    }
  }
});
