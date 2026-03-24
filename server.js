const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const connect_DB = require("./config/mongodb");
const cors = require("cors");
const path = require("path");

connect_DB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ SINGLE, CORRECT STATIC SERVE
app.use("/public/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/v1/user", require("./routes/userRoute"));
app.use("/api/v1/admin", require("./routes/adminRoute"));
app.use("/api/v1/doctor", require("./routes/doctorRoute"));
app.use("/api/v1/payment", require("./routes/paymentRoutes"));

// Test Route
app.use("/api/test", require("./routes/testRoute"));

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(
        `Server Running In ${process.env.NODE_MODE} Mode on Port ${port}`.bgCyan
            .white
    );
});


