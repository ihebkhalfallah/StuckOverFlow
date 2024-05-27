import mongoose from "mongoose";

const {Schema,model} =mongoose;

const userSchema = new Schema({
    firstName:{
        type:String,
        required : true
    },
    lastName:{
        type:String,
        required : true
    },
    nickName:{
        type:String,
        required : true,
        unique:true
    },
    birthDate:{
        type:Date,
        required : true,
    },
    role:{
        type:String,
        enum:["ADMIN","COACH","NUTRITIONNISTE", "USER"],
        default:"USER",
        required : true,
    },
    email:{
        type:String,
        required : true,
        unique:true
    },
    password:{
        type:String,
        required : true,
    },
    adresse:{
        type:String,
    },
    phoneNumber:{
        type:Number,
        unique:true
    },
    weight:{
        type:Number
    }
    ,height:{
        type:String
    },rating:{
        type:String
    },active:{
        type:Boolean,
        default:true
    }
    },
    {
        timestamps : true
    }
);

export default model('User', userSchema);
