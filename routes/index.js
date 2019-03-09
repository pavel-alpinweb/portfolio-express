const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const db = require("../models/db");
const psw = require("../libs/password");

const isAdmin = (req, res, next) => {
  // если в сессии текущего пользователя есть пометка о том, что он является
  // администратором
  if (req.session.isAdmin) {
    // то всё хорошо :)
    return next();
  }
  // если нет, то перебросить пользователя на главную страницу сайта
  res.redirect("/");
};

const ctrlHome = require("../controllers/home");
const ctrlLogin = require("../controllers/login");
const ctrlAdmin = require("../controllers/admin");

router.post("/", (req, res) => {
  const { email, password } = req.body;
  const user = db.getState().user;
  if (user.login === email && psw.validPassword(password)) {
    req.session.isAdmin = true;
    res.redirect("/admin");
  } else {
    req.session.isAdmin = false;
    res.redirect("/login");
  }
});

router.post("/admin/skills", ctrlAdmin.skills);

router.post("/admin/upload", ctrlAdmin.upload);

router.get("/", ctrlHome.get);

router.get("/login", ctrlLogin.get);
router.get("/admin", isAdmin, ctrlAdmin.get);

module.exports = router;
