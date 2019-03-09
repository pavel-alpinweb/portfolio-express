const db = require("../models/db");
module.exports.get = function(req, res) {
  const works = db.getState().works || [];
  res.render("pages/index", { products: works });
};
