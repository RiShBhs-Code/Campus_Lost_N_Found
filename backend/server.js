require("dotenv").config();

const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { Server } = require("socket.io");
const lostItemRoutes = require("./routes/lostItemRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// Configure allowed frontend origins (configurable via CLIENT_URL / CLIENT_ORIGIN on Render)
const allowedOrigin = process.env.CLIENT_URL || process.env.CLIENT_ORIGIN || "*";
const corsOptions = {
  origin: allowedOrigin === "*" ? "*" : [allowedOrigin, "http://localhost:3000", "http://localhost:5173", "http://localhost:8080"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
};

// Initialize Socket.IO with production & development CORS
const io = new Server(server, {
  cors: corsOptions
});

// Attach io instance to express app so route handlers can broadcast events
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`Socket client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

app.use(cors(corsOptions));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Campus Lost and Found API is Running");
});

app.use("/api/items", lostItemRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
