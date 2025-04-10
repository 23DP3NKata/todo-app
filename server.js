// npm install

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", () => console.log("Connected to MongoDB"));

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/tasks", taskRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));