const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  //read the token from req cookies, validate token, and find wether that user exists or not
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send("Token is not valid!")
        }

        const decodedMessage = await jwt.verify(token, "DevTinder@Secret");//verifying the token
        const { _id } = decodedMessage;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).send("User not found!")
        }

        req.user = user; // attach user to request ✅
        next();

    } catch(e) {
        res.status(400).send("ERROR!" + e.message)
    }
}

module.exports = { userAuth };