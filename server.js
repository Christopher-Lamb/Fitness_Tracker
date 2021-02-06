const express = require("express");
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api-routes");
const htmlRoutes = require("./routes/html-routes");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const uri = process.env.MONGODB_URI || "mongodb://localhost/workoutTrackerdb";

try {
  mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected")
  );
} catch (error) {
  console.log("could not connect");
}

// routes
app.use(apiRoutes);
app.use(htmlRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("App running!");
});
