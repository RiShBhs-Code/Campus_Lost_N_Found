require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const lostItemRoutes = require("./routes/lostItemRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Campus Lost and Found API is Running");
});

app.use("/api/items", lostItemRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
