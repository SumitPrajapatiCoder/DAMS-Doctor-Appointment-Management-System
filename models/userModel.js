
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name Is required']
    },
    email: {
        type: String,
        required: [true, 'Email Is Required']
    },
    password: {
        type: String,
        required: [true, 'Password Is Required']
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isDoctor: {
        type: Boolean,
        default: false,
    },

    isPatient: {
        type: Boolean,
        default: false,
    },
    notification: {
        type: Array,
        default: [],
    },
    seenNotification: {
        type: Array,
        default: [],
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    hasRoleStatus: {
        type: String, 
        default: null, 
    },
    patientInfo: {
        age: Number,
        gender: String,
        medicalHistory: [String], // ["diabetes", "heart"]
        image: String
    },
    medicalHistory: {
        type: [String], // list of specializations or conditions
        default: [],
    },

}, { timestamps: true });

module.exports =
    mongoose.models.users ||
    mongoose.model("users", userSchema);

