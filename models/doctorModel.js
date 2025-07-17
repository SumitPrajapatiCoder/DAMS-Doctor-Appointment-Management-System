const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    firstName:{
        type:String,
        required:[true,'First Name Is Required']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name Is Required']
    },
    phone:{
        type:String,
        required:[true,'Phone No. Is required']
    },
    email:{
        type:String,
        required:[true,'Email Is Required']
    },
    website:{
        type:String,

    },
    address:{
        type:String,
        required:[true,'Address Is Required']
    },
    specialization:{
        type:String,
        required:[true,'specialization Is Required']
    },
    experience:{
        type:String,
        required:[true,'Experience is Required']
    },
    status:{
        type:String,
        default:'pending'
    },
    feesPerConsultation:{
        type:Number,
        required:[true,'Fee Is Required']
    },
    timings:{
        type:Object,
        required:[true,'Work Timing Is Required']
    },
    
    image: {
        type: String,
        default: "",
    },

},{timestamps:true});

const doctorModel = mongoose.model('doctors',doctorSchema)

module.exports=doctorModel

