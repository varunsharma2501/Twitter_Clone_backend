import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.twitter_token;
        // console.log("token value is ",token );
        if (!token) {
            console.log("No token provided22 ");
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        // Log the token and the secret for debugging
        // console.log("Token: ", token);
        // console.log("JWT_SECRET: ", process.env.JWT_SECRET);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Log the decoded token for debugging
        // console.log("Decoded token: ", decoded);

        if (!decoded) {
            console.log("Invalid token");
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default protectRoute;
