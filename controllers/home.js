const db = require("../models/db");
module.exports.get = function(req, res) {
  const works = db.getState().works || [];
  const skills = db.getState().skills || [];
  res.render("pages/index", { products: works, skills: skills });
};
