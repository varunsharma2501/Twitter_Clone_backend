import Tweet from "../models/tweetModel.js";
import User from "../models/userModel.js";


const createTweet=async(req,res)=>{
    try {
        const {description}=req.body;
        const userId=req.user._id;

        // check user exists
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        // console.log(user);
        const newTweet=new Tweet({
            description,
            author:userId,
        })

        await newTweet.save();

        if (!user.tweets) {
            user.tweets = [];
        }
        user.tweets.push(newTweet._id);
        await user.save();

        res.status(201).json(newTweet);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
}

const deleteTweet=async(req,res)=>{
    try {
        const {id}=req.params;
        await Tweet.findByIdAndDelete(id);
        
        const userId=req.user._id;
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"User not found"});
        }

        user.tweets = user.tweets.filter(tweetId => !tweetId.equals(id));
        await user.save();

        return res.status(200).json({
            message:"Tweet deleted successfully",
            success:true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
}

export {createTweet,deleteTweet}