const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", function() {});

app.listen(3000, function() {
	console.log("App started on port 3000");
});
