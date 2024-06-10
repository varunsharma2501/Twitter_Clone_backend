import express from 'express';
const router=express.Router();
import { createTweet ,deleteTweet,editTweet,likeDislike,getAllTweets,getUserTweets,getFollowingTweets} from '../controllers/tweetController.js';
import protectRoute from '../middlewares/isAuthenticated.js'

router.post("/create",protectRoute,createTweet);
router.post("/delete/:id",protectRoute,deleteTweet);
router.put("/like/:id",protectRoute,likeDislike);
router.put("/edit/:id",protectRoute,editTweet);
router.get('/all',protectRoute,getAllTweets);
router.get('/myTweets',protectRoute,getUserTweets);
router.get('/followingTweets',protectRoute,getFollowingTweets);

export default router;