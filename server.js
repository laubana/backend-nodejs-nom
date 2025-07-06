const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");

const corsConfig = require("./configs/corsConfig");
const connect = require("./services/db");

dotenv.config();

connect();

const app = express();
app.use(cookieParser());
app.use(cors(corsConfig));
app.use(express.json());
app.use(morgan("dev"));

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/stripeRoutes"));
app.use("/api", require("./routes/ratingRoutes"));
app.use("/api", require("./routes/discountRoutes"));
app.use("/api", require("./routes/menuDiscountRoutes"));
app.use("/api", require("./routes/consumerDiscountRoutes"));
app.use("/api", require("./routes/transactionRoutes"));
app.use("/api", require("./routes/menuRoutes"));
app.use("/api", require("./routes/adRoutes"));

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File is too large",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "File limit reached.",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "File must be an image.",
      });
    }
  }
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to Database");
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

module.exports = app;
