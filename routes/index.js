const express = require("express");
const router = express.Router();

const ctrlHome = require("../controllers/home");
const ctrlLogin = require("../controllers/login");
const ctrlAdmin = require("../controllers/admin");

const isAdmin = (req, res, next) => {
  // если в сессии текущего пользователя есть пометка о том, что он является
  // администратором
  if (req.session.isAdmin) {
    // то всё хорошо :)
    return next();
  }
  // если нет, то перебросить пользователя на главную страницу сайта
  res.render("pages/login", { title: "login" });
};

router.post("/login/admin", ctrlLogin.enter);

router.post("/admin/skills", ctrlAdmin.skills);

router.post("/admin/upload", ctrlAdmin.upload);

router.get("/", ctrlHome.get);

router.get("/login", isAdmin, ctrlAdmin.get);
router.get("/admin", isAdmin, ctrlAdmin.get);

router.post("/", ctrlHome.postMail);

module.exports = router;
