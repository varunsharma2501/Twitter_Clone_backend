import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return next();
        }
        const user = await User.findById(decoded.userId).select('-password');
        if (user) {
            req.user = user;
        }
        next();
    });
};

export default verifyToken;
