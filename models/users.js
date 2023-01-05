const mongoose = require('mongoose');


const userDataSchema = new mongoose.Schema({
    fname:{
       type:String,
       required:[true,'Enter Valid ID'],
    },
    lname:{
        type:String
    },
    email:{
        type:String,
        required:[true,'Enter Email']
    },
    pass:{
        type:String,
        required:[true,"Enter Valid Password"]
    }, 
});

module.exports = mongoose.model('User',userDataSchema)