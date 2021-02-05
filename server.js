const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const uri = process.env.MONGODB_URI || "mongodb://localhost/workoutTrackerdb";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const databaseUrl = "workoutTrackerdb";
const collections = ["workouts"];

const db = mongojs(databaseUrl, collections);

db.on("error", (error) => {
  console.log("Database Error:", error);
});

//Get Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/stats.html"));
});

app.get("/api/workouts/range", (req, res) => {
  db.Workout.find()
    .sort({ x: -1 })
    .toArray(function (err, result) {
      if (err) throw err;

      res.json(result);
      console.log(result);
    });
});

app.get("/api/workouts", (req, res) => {
  let collection = db.collection("Workout");
  collection.find({}, (error, found) => {
    if (error) {
      console.log(error);
    } else {
      res.send(found);
    }
  });
});

//Post Routes
app.post("/api/workouts", (req, res) => {
  console.log(req.body);

  db.Workout.save(req.body, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

//Put Routes
app.put("/api/workouts/:id", (req, res) => {
  db.Workout.update(
    { _id: mongojs.ObjectId(req.params.id) },

    { $push: { exercises: req.body } },

    (error, saved) => {
      if (error) {
        console.log(error);
      } else {
        console.log(saved);
      }
    }
  );

  db.Workout.update(
    { _id: mongojs.ObjectId(req.params.id) },
    {
      $currentDate: { day: { $type: "date" } },
    },

    (error, saved) => {
      if (error) {
        console.log(error);
      } else {
      }
    }
  );

  db.Workout.update(
    { _id: mongojs.ObjectId(req.params.id) },
    {
      $inc: { totalDuration: req.body.duration },
    },
    {
      $currentDate: { day: { $type: "date" } },
    },

    (error, saved) => {
      if (error) {
        console.log(error);
      } else {
        res.send(saved);
      }
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log("App running!");
});
