const express = require("express");
const router = express.Router();
const db = require("../models/db");
const psw = require("../libs/password");
const nodemailer = require("nodemailer");
const config = require("../config.json");

const works = db.getState().works || [];
const skills = db.getState().skills || [];

const isAdmin = (req, res, next) => {
  // если в сессии текущего пользователя есть пометка о том, что он является
  // администратором
  if (req.session.isAdmin) {
    // то всё хорошо :)
    return next();
  }
  // если нет, то перебросить пользователя на главную страницу сайта
  res.redirect("/login");
};

const ctrlHome = require("../controllers/home");
const ctrlLogin = require("../controllers/login");
const ctrlAdmin = require("../controllers/admin");

router.post("/login/admin", (req, res) => {
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

router.post("/", (req, res, next) => {
  // требуем наличия имени, обратной почты и текста
  if (!req.body.name || !req.body.email || !req.body.message) {
    // если что-либо не указано - сообщаем об этом
    return res.json({ msg: "Все поля нужно заполнить!", status: "Error" });
  }
  // инициализируем модуль для отправки писем и указываем данные из конфига
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text:
      req.body.message.trim().slice(0, 500) +
      `\n Отправлено с: <${req.body.email}>`
  };
  // отправляем почту
  transporter.sendMail(mailOptions, function(error, info) {
    // если есть ошибки при отправке - сообщаем об этом
    if (error) {
      return res.render("pages/index", {
        products: works,
        skills: skills,
        msg: `При отправке письма произошла ошибка!: ${error}`
      });
    }
    res.render("pages/index", {
      products: works,
      skills: skills,
      msg: `Письмо успешно отправлено: ${error}`
    });
  });
});

module.exports = router;
