import express from 'express';
const router=express.Router();
import { bookUnbookmark,createTweet ,deleteTweet,editTweet,likeDislike,getAllTweets,getUserTweets,getFollowingTweets,addComment} from '../controllers/tweetController.js';
import protectRoute from '../middlewares/isAuthenticated.js'


router.post("/create",protectRoute,createTweet);
router.put("/delete/:id",protectRoute,deleteTweet);
router.put("/like/:id",protectRoute,likeDislike);
router.post("/comment/:id",protectRoute,addComment);
router.put("/bookmark/:id",protectRoute,bookUnbookmark);
router.put("/edit/:id",protectRoute,editTweet);
router.get('/all',protectRoute,getAllTweets);
router.get('/myTweets',protectRoute,getUserTweets);
router.get('/followingTweets',protectRoute,getFollowingTweets);

export default router;