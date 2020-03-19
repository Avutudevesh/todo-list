const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");

var today = new Date();

app.get("/", function(req, res) {
	var day = today.getDay();
	var weekDay = "";
	switch (day) {
		case 0:
			weekDay = "Sunday";
			break;
		case 1:
			weekDay = "Monday";
			break;
		case 2:
			weekDay = "Tuesday";
			break;
		case 3:
			weekDay = "Wednesday";
			break;
		case 4:
			weekDay = "Thursday";
			break;
		case 5:
			weekDay = "Friday";
			break;
		case 6:
			weekDay = "Saturday";
			break;
	}
	res.render("list", { dayOfWeek: weekDay });
});

app.listen(3001, function() {
	console.log("App started on port 3000");
});
