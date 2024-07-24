import { Request, Response } from "express";
import mongoose from "mongoose";
import { getDocQueries } from "../types";
const { User, Chat } = require("../models");

export const getDoc = async (req: Request, res: Response) => {
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
    if (typeof value === "string" && mongoose.isValidObjectId(value)) {
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
};

export const getDocs = async (req: Request, res: Response) => {
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

  // if (req.query.populateArr) {
  //   console.log(req.query.populate);
  // }

  if (conditionType == "==") {
    if (typeof value === "string" && mongoose.isValidObjectId(value)) {
      query[field] = new mongoose.Types.ObjectId(value);
    } else {
      query[field] = value;
    }

    try {
      let data = await Model.find(query).populate(req.query.populateArr);
      if (data) {
        return res.send({ success: true, data });
      } else {
        return res.send({ success: false, message: "Doc not found" });
      }
    } catch (e) {
      console.error("Catched error at getDocs: ", e.message);
      return res.status(400).send({ success: false, message: e.message });
    }
  }
};

module.exports = { getDoc, getDocs };
