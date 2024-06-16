import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("twitter_token", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // MS
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: "None", // CSRF attacks cross-site request forgery attacks
		secure:true
	});
};

export default generateTokenAndSetCookie;