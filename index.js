const dotenv = require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth.js");
const connectDB = require("./connection.js");
const cookiParser = require("cookie-parser");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 3000;
connectDB();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookiParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);

app.listen(PORT, (req, res) => {
  console.log(`server is running on port ${PORT}`);
});
