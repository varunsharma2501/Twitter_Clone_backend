import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    }],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        }],
    tweets:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tweet',
            default: [],  // Initializes as an empty array, not an array within an array
        }
    ],
},{timestamps:true})

const User=mongoose.model('User',userSchema);

export default User;