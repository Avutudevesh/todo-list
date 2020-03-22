const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const todoItemSchema = new mongoose.Schema({
	todoItem: String
});

const TODOITEM = mongoose.model("TodoItem", todoItemSchema);

const customListSchema = {
	name: String,
	items: [todoItemSchema]
};

const CUSTOMLIST = mongoose.model("CustomList", customListSchema);

const item1 = new TODOITEM({
	todoItem: "Welcome to your todo list!"
});

const item2 = new TODOITEM({
	todoItem: "Press the + button to add an item"
});

const item3 = new TODOITEM({
	todoItem: "<-- Press this to mark it as done"
});

const welcomeItems = [item1, item2, item3];

app.get("/", function(req, res) {
	const items = [];
	// mongoose.connect("mongodb://localhost:27017/todolistDB", {
	// 	useNewUrlParser: true,
	// 	useUnifiedTopology: true
	// });

	TODOITEM.find(function(err, dbItems) {
		if (err) {
			console.log("Error");
		} else {
			if (dbItems.length === 0) {
				TODOITEM.insertMany(welcomeItems, function(err) {
					if (err) {
						console.log("Error while saving items");
					} else {
						console.log("Sucessfully saved welcome items to db");
					}
				});
				res.redirect("/");
			} else {
				res.render("list", { todoItems: dbItems, dateHeading: "Today" });
			}
		}
	});
});

app.get("/:customListName", function(req, res) {
	const customListName = _.capitalize(req.params.customListName);
	CUSTOMLIST.findOne({ name: customListName }, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			if (result === null) {
				const customItem = new CUSTOMLIST({
					name: customListName,
					items: welcomeItems
				});
				customItem.save();
				console.log("Created new list");
				res.redirect("/" + customListName);
			} else {
				res.render("list", {
					todoItems: result.items,
					dateHeading: customListName
				});
			}
		}
	});
});

app.post("/", function(req, res) {
	const newItem = new TODOITEM({ todoItem: req.body.todoItem });
	const listName = req.body.button;
	if (listName == "Today") {
		newItem.save();

		res.redirect("/");
	} else {
		CUSTOMLIST.findOne({ name: listName }, function(err, customList) {
			customList.items.push(newItem);
			customList.save();
			res.redirect("/" + listName);
		});
	}
});

app.post("/delete", function(req, res) {
	const checkedItemId = req.body.checkbox;
	const listName = req.body.listName;
	if (listName == "Today") {
		TODOITEM.deleteOne({ _id: checkedItemId }, function(err, result) {
			if (err) {
				console.log(err);
			} else {
				console.log(result);
			}
		});
		res.redirect("/");
	} else {
		CUSTOMLIST.findOneAndUpdate(
			{ name: listName },
			{ $pull: { items: { _id: checkedItemId } } },
			function(err, customList) {
				if (!err) {
					res.redirect("/" + listName);
				}
			}
		);
	}
});

app.listen(3001, function() {
	console.log("App started on port 3000");
});
