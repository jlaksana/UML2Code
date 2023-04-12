import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000/");
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));
