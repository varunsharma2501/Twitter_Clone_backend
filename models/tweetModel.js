import mongoose from "mongoose";

const tweetSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
    },
    media:{
        type:String,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[],
        }
    ],
    bookmarks:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[],
        }
    ],
    comments:[{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
      }],
},{timestamps:true});

const Tweet=mongoose.model('Tweet',tweetSchema);
export default Tweet;

