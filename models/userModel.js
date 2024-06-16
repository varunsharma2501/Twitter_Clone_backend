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
    bookmarks:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Tweet',
            default:[],
        }
    ],
    bio:{
        type:String,
        default: '',
    }
},{timestamps:true})

const User=mongoose.model('User',userSchema);

export default User;