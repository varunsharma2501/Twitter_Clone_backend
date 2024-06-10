import express from 'express';
import protectRoute from '../middlewares/isAuthenticated.js'
import {bookmark,getProfile,getFollowers,getFollowing,addFollower,getUsers,removeFollower}  from '../controllers/userController.js';
const router=express.Router();

router.put("/bookmark/:id",protectRoute,bookmark);
router.get("/profile/:id",protectRoute,getProfile);
router.get("/getUsers",protectRoute,getUsers);
router.get("/getFollowers",protectRoute,getFollowers);
router.get("/getFollowing",protectRoute,getFollowing);
router.put("/follow/:id",protectRoute,addFollower);
router.put("/unfollow/:id",protectRoute,removeFollower);

export default router;