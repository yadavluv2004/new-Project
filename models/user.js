const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
//no need to add username and password as passport local mongoose defaultly add these fields

});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);