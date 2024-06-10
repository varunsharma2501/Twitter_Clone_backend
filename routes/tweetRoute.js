import express from 'express';
const router=express.Router();
import { createTweet ,deleteTweet} from '../controllers/tweetController.js';
import protectRoute from '../middlewares/isAuthenticated.js'

router.post("/create",protectRoute,createTweet);
router.post("/delete/:id",protectRoute,deleteTweet);

export default router;