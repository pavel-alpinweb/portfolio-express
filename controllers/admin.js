const db = require("../models/db");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");

module.exports.get = function(req, res) {
  res.render("pages/admin", { title: "admin" });
};

module.exports.upload = function(req, res, next) {
  // const { photo, name, price } = req.body;
  let form = new formidable.IncomingForm();
  let upload = path.join("./public", "upload");

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, function(err, fields, files) {
    if (err) {
      return next(err);
    }

    const fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, function(err) {
      if (err) {
        console.error(err.message);
        return;
      }

      db.get("works")
        .push({
          src: `./upload/${files.photo.name}`,
          name: fields.name,
          price: fields.price
        })
        .write();
      res.redirect("/#product");
    });
  });
};

module.exports.skills = function(req, res) {
  const { age, concerts, cities, years } = req.body;
  db.set("skills", [
    {
      number: age,
      text: "Возраст начала занятий на скрипке"
    },
    {
      number: concerts,
      text: "Концертов отыграл"
    },
    {
      number: cities,
      text: "Максимальное число городов в туре"
    },
    {
      number: years,
      text: "Лет на сцене в качестве скрипача"
    }
  ]).write();
  res.redirect("/#life");
};
