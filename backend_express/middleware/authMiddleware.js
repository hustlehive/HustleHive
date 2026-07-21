const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");


const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check Authorization Header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Extract Token
            token = req.headers.authorization.split(" ")[1];

            // Verify Token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // Get User
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                res.status(401);
                throw new Error("User not found");
            }

            if (req.user.isDeleted) {
                res.status(401);
                throw new Error("Account has been deleted");
            }

            next();

        } catch (error) {
            res.status(401);
            throw new Error(error.message || "Not authorized, token failed");
        }

    }


    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});


module.exports = {
    protect
};