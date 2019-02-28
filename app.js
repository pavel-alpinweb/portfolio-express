var express = require("express");
var app = express();

app.get("/", function(req, res) {
  res.send("Hello Express!");
});

app.listen(8000, function() {
  console.log("Портфолио на express запущенно на порту 8000!");
});
