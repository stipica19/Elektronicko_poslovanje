import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import bodyParser from "body-parser";
const app = express();
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import indexRoutes from "./routes/index.js";
import cookieparser from "cookie-parser";
import helmet from "helmet";
import methodoverride from "method-override";
import { checkUser } from "./middleware/authMiddleware.js";
const __dirname = path.resolve();

dotenv.config();
app.use(express.static("public")); //omogucava serviranje statickih fajlova u browser

app.use("/", express.static(__dirname + "/"));

app.set("view engine", "ejs");

app.use(helmet());

app.use(cookieparser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodoverride("_method"));

//DB config
const connection_url = process.env.MONGO_URI;

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("DB je konektovana...");
});

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;

  next();
});

app.use(express.json());
app.get("*", checkUser);
app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`SERVER JE STARTOVAN NA PORTU ${PORT}`));
