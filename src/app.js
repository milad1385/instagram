const express = require("express");
const path = require("path");

const { setHeaders } = require("./middlewares/headers");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

//* BodyParser
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

//* Cors Policy
app.use(setHeaders);

//* Static Folders
app.use(express.static(path.join(__dirname, "..", "public")));

//* Template Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//* Routes
app.get("/", (req, res) => {
  return res.render("index");
});

//* 404 Error Handler
app.use((req, res) => {
  console.log("this path is not found:", req.path);
  return res
    .status(404)
    .json({ message: "404! Path Not Found. Please check the path/method" });
});

// TODO: Needed Feature
app.use(errorHandler)

module.exports = app;
