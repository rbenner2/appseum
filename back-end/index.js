import express from "express";
import dotenv from "dotenv";
import userRouter from "./router/userRouter.js";
import itemRouter from "./router/itemRouter.js";
const app = express();
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
var mongoDB = "mongodb://127.0.0.1:27017/gallery";
//Get the default connection
var db = mongoose.connection;
import cookieParser from "cookie-parser";

mongoose.connect('mongodb+srv://rbenner2:Reddragon0!@cluster0.khvu2.mongodb.net/gallery?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(cors());
// parse application/x-www-form-urlencoded
//accepting larger image file here to save
app.use(bodyParser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}));
// parse application/json
//accepting larger image file here to save
app.use(bodyParser.json({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}));
app.use(cookieParser());




app.use("/api/users", userRouter);
app.use("/api/items", itemRouter);

dotenv.config();

//if port 4000 is occupied, will go to 5000
const PORT = process.env.PORT || 5000;

//getting the web server. port 4000
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
