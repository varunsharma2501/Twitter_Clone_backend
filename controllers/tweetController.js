import Tweet from "../models/tweetModel.js";
import User from "../models/userModel.js";


const createTweet=async(req,res)=>{
    try {
        const {description}=req.body;
        const userId=req.user._id;

        // check user exists
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"User not found111"});
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


const likeDislike = async (req, res) => {
    try {
        const userId = req.user._id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            return res.status(404).json({ error: "Tweet not found" });
        }

        const index = tweet.likes.indexOf(userId);
        let message = "";

        if (index !== -1) {
            // If the user has already liked the tweet, remove their ID from the likes array
            await Tweet.findByIdAndUpdate(tweetId, { $pull: { likes: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { likes: tweetId } }); // Corrected this line
            message = "Removed from likes";
        } else {
            // If the user has not liked the tweet, add their ID to the likes array
            await Tweet.findByIdAndUpdate(tweetId, { $push: { likes: userId } });
            await User.findByIdAndUpdate(userId, { $push: { likes: tweetId } }); // Corrected this line
            message = "Liked";
        }

        res.status(200).json({ message, success: true });

    } catch (error) {
        console.error(error); // Better to log the actual error
        res.status(500).json({ error: "Internal server error" });
    }
};

const bookUnbookmark = async (req, res) => {
    try {
        const userId = req.user._id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);
        // console.log("book" ,userId,tweetId);
        if (!tweet) {
            return res.status(404).json({ error: "Tweet not found" });
        }

        const index = tweet.bookmarks.indexOf(userId);
        let message = "";

        if (index !== -1) {
            // If the user has already liked the tweet, remove their ID from the likes array
            await Tweet.findByIdAndUpdate(tweetId, { $pull: { bookmarks: userId } });
            await User.findByIdAndUpdate(userId,{$pull:{bookmarks:tweetId}});

            message = "Removed from bookmarks";
            
        } else {
            // If the user has not liked the tweet, add their ID to the likes array
            await Tweet.findByIdAndUpdate(tweetId, { $push: { bookmarks: userId } });
            await User.findByIdAndUpdate(userId,{$push:{bookmarks:tweetId}});
            message = "Bookmarked";
        }

        res.status(200).json({ message, success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const addComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            return res.status(404).json({ error: "Tweet not found" });
        }

        const comment = req.body.comment;

        // Add the comment
        await Tweet.findByIdAndUpdate(
            tweetId, 
            { $push: { comments: { user: userId, message: comment } } },
            { new: true }
        );

        // Populate the comments with user details
        const updatedTweet = await Tweet.findById(tweetId);

        res.status(200).json({ message: "Comment Added", success: true, tweet: updatedTweet });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const editTweet = async (req, res) => {
    try {
        const userId=req.user._id;
        const { id } = req.params;
        const { description } = req.body;

        // Find the tweet by its ID
        const tweet = await Tweet.findById(id);
        
        // Check if the tweet exists
        if (!tweet) {
            return res.status(404).json({ error: "Tweet not found" });
        }

        if (!tweet.author.equals(userId)) {
            return res.status(403).json({ error: "You are not authorized to edit this tweet" });
        }
        // Update the description of the tweet
        tweet.description = description;
        await tweet.save();

        res.status(200).json({ message: "Tweet updated successfully", success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getAllTweets=async(req,res)=>{
    try {
        const userId = req.user._id;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Get the tweets authored by other users
        const tweets = await Tweet.find()
        . populate('author', 'fullname username');

        res.status(200).json({ tweets });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getUserTweets = async (req, res) => {
    try {
        // Get the ID of the logged-in user
        const userId = req.user._id;

        // Find the tweets authored by the logged-in user
        const tweets = await Tweet.find({ author: userId })
        . populate('author', 'fullname username');

        res.status(200).json({ tweets });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getFollowingTweets = async (req, res) => {
    try {
        const userId = req.user._id; // Get the ID of the logged-in user

        // Find the logged-in user to get the list of users they are following
        const user = await User.findById(userId).populate("following", "_id")

        // Extract the IDs of users the logged-in user is following
        const followingIds = user.following.map(user => user._id);

        // Find all tweets where the author ID is in the list of following IDs
        const tweets = await Tweet.find({ author: { $in: followingIds } })
        . populate('author', 'fullname username');

        res.status(200).json({ tweets });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export {createTweet,deleteTweet,likeDislike,editTweet,getAllTweets,getUserTweets,getFollowingTweets,bookUnbookmark,addComment}