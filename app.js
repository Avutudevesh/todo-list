const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
var items = [];
app.get("/", function(req, res) {
	res.render("list", { todoItems: items });
});

app.post("/", function(req, res) {
	items.push(req.body.todoItem);
	res.redirect("/");
});

app.listen(3001, function() {
	console.log("App started on port 3000");
});
