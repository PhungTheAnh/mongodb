import mongoose from "mongoose";

const mongoose = require("mongoose");
const connectMongo = async () =>
  mongoose.connect("mongodb://localhost:27017/Posts");

export default connectMongo;
 