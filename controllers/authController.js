import bcrypt from "bcryptjs";
import User from "../models/userModel.js"
import generateTokenAndSetCookie from "../utils/generateToken.js";

const signup = async (req, res) => {
	try {
		const {fullname, username, password, confirmPassword, email} = req.body;

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		const user = await User.findOne({ username });
		console.log("inside the signup")
		if (user) {
			return res.status(400).json({ error: "Username already exists" });
			}
			
			// HASH PASSWORD HERE
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			
			const newUser = new User({
				fullname,
				username,
				password: hashedPassword,
				email
				});
				
		console.log("inside the signup2")
		if (newUser) {
			// Generate JWT token here
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullname: newUser.fullname,
				username: newUser.username,
				user
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const login = async (req, res) => {
	try {
		// if (req.user) {
		// 	return res.status(400).json({ error: "You are already logged in. Please log out first." });
		// }

		console.log("in login 1");
		const { username, password } = req.body;
		console.log(username +" "+ password);
		const user = await User.findOne({ username });
		console.log(user);
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}
		console.log("in login 2");
		generateTokenAndSetCookie(user._id, res);
		console.log("in login 3");
		res.status(200).json({
			_id: user._id,
			fullname: user.fullname,
			username: user.username,
			user
		});
		console.log("after res");
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


export {signup,login,logout};
