
const mongoose = require("mongoose");
const colors = require("colors");

console.log("MongoDB Connection URL From Mongodb File:", process.env.MONGODB_URL); 

const connect_DB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Database connected successfully on host: ${mongoose.connection.host}`.bgGreen.white);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`.bgRed.white);
    }
};

module.exports = connect_DB;

