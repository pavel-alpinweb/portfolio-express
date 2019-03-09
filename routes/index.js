const express = require("express");
const router = express.Router();

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

router.post("/", (req, res, next) => {
  req.session.isAdmin = true;
  console.log(req.body);
  res.redirect("/admin");
});

router.get("/", ctrlHome.get);

router.get("/login", ctrlLogin.get);
router.get("/admin", isAdmin, ctrlAdmin.get);

module.exports = router;
