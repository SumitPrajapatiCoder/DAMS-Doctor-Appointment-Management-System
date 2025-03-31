
const dotenv = require("dotenv");
dotenv.config();  
const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const connect_DB = require("./configure/mongodb");
const cors = require("cors");

console.log("MongoDB Connection URL From Server File:", process.env.MONGODB_URL);

// MongoDB Connection
connect_DB();

// Rest Object
const app = express();

// MiddleWares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// Routes
app.use('/api/v1/user', require("./routes/userRoute"));
app.use('/api/v1/admin', require("./routes/adminRoute"));
app.use('/api/v1/doctor',require("./routes/doctorRoute"));



// Listen Port
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server Running In ${process.env.NODE_MODE} Mode on Port ${port}`.bgCyan.white);
});


