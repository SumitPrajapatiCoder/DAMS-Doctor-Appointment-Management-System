
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
    }
}, { timestamps: true });

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
