const express = require("express");
const controller = require("./home.controller");
const auth = require("./../../middlewares/auth")
const router = express.Router();

// app.get("/", (req, res) => {
//   return res.render("index");
// });

router.route("/").get(auth, controller.showHomePage);

module.exports = router;
