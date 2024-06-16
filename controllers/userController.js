import User from "../models/userModel.js";

const bookmark = async (req, res) => {
    try {
        const userId = req.user._id;
        const tweetId = req.params.id;
        const user = await User.findById(userId);
        console.log(userId+"  "+tweetId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const index = user.bookmarks.indexOf(tweetId);
        let message = "";

        if (index !== -1) {
            // If the tweet is already bookmarked, remove it from bookmarks
            await User.findByIdAndUpdate(userId, { $pull: { bookmarks: tweetId } });
            message = "Removed from bookmarks";
        } else {
            // If the tweet is not bookmarked, add it to bookmarks
            await User.findByIdAndUpdate(userId, { $push: { bookmarks: tweetId } });
            message = "Bookmarked";
        }


        res.status(200).json({ message, success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getProfile=async(req,res)=>{
    try {
        const id=req.params.id;
        console.log("param ",id);
        const user=await User.findById(id).select("-password");
        console.log(user);
        return res.status(200).json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getUsers = async (req, res) => {
    try {
        console.log("Inside getUsers1");
        // Get the ID of the logged-in user
        const userId = req.user._id;
        console.log("userID",userID);
        // Find the logged-in user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get the IDs of users the logged-in user is following
        const followingIds = user.following.map(follow => follow._id);

        // Find all users except the logged-in user and the users the logged-in user is following
        const otherUsers = await User.find({
            _id: { $nin: [userId, ...followingIds] } // Exclude the logged-in user and users the logged-in user is following
        });
        console.log("otherusers are :",otherUsers);
        res.status(200).json({ otherUsers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const getFollowers = async (req, res) => {
    try {
        // Get the ID of the logged-in user
        const userId = req.user._id;

        // Find the logged-in user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get the IDs of followers
        const followerIds = user.followers.map(follower => follower._id);

        // Find all followers
        const followers = await User.find({
            _id: { $in: followerIds } // Include only users who are followers
        });

        res.status(200).json({ followers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getFollowing = async (req, res) => {
    try {
        // Get the ID of the logged-in user
        const userId = req.user._id;

        // Find the logged-in user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get the IDs of followers
        const followingIds = user.following.map(following => following._id);

        // Find all followers
        const following = await User.find({
            _id: { $in: followingIds } // Include only users who are followers
        });

        res.status(200).json({ following });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const addFollower = async (req, res) => {
    try {
        const userId = req.user._id;
        const otherUserId = req.params.id;

        const user = await User.findById(userId);
        const otherUser = await User.findById(otherUserId);

        if(userId.toString()===otherUserId){
            return res.status(404).send("You cant Follow yourself");
        }
        if (!user || !otherUser) {
            return res.status(404).send("Either user is incorrect");
        }
        if (user.following.includes(otherUserId)) {
            return res.status(400).json({ error: "User is already being followed" });
        }
        // Push otherUserId to the following array of the logged-in user
        user.following.push(otherUserId);
        await user.save();

        // Push userId to the followers array of the other user
        otherUser.followers.push(userId);
        await otherUser.save();

        res.status(200).json({ success: true, message: "Followed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const removeFollower = async (req, res) => {
    try {
        const userId = req.user._id;
        const otherUserId = req.params.id;

        const user = await User.findById(userId);
        const otherUser = await User.findById(otherUserId);

        if (!user || !otherUser) {
            return res.status(404).send("Either user is incorrect");
        }
        
        // Check if the user is already following the other user
        const index = user.following.indexOf(otherUserId);
        if (index === -1) {
            return res.status(400).json({ error: "User is not being followed" });
        }

        // Remove otherUserId from the following array of the logged-in user
        user.following.splice(index, 1);
        await user.save();

        // Remove userId from the followers array of the other user
        const followerIndex = otherUser.followers.indexOf(userId);
        if (followerIndex !== -1) {
            otherUser.followers.splice(followerIndex, 1);
            await otherUser.save();
        }

        res.status(200).json({ success: true, message: "Unfollowed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export {bookmark,getProfile,getUsers,getFollowers,getFollowing,addFollower,removeFollower}; 