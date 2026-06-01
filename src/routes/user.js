const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest")

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const requests = await ConnectionRequest.find({
            receiverId: loggedInUser._id,
            status: "interested"
        })
        .populate("senderId", "firstName lastName photoUrl about skills age gender")

        res.json({
            message: "Requests fetched successfully!",
            data: requests
        })

    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                { senderId: loggedInUser._id, status: "accepted" },
                { receiverId: loggedInUser._id, status: "accepted" }
            ]
        })
        .populate("senderId", "firstName lastName photoUrl about skills")
        .populate("receiverId", "firstName lastName photoUrl about skills")

        // extract only the OTHER person 
        const data = connections.map(connection => {
            if(connection.senderId._id.toString() === loggedInUser._id.toString()) {
                return connection.receiverId // I was sender → show receiver
            }
            return connection.senderId // I was receiver → show sender
        })

        res.json({ 
            message: "Connections fetched successfully!",
            data
        })

    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})


userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // pagination params
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50 ? 50 : limit
        const skip = (page - 1) * limit;

        // 1. find all connections/requests of logged in user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { senderId: loggedInUser._id },
                { receiverId: loggedInUser._id }
            ]
        }).select("senderId receiverId");

        // 2. extract all user ids to hide from feed
        const hideUsersFromFeed = new Set();

        // add yourself
        hideUsersFromFeed.add(loggedInUser._id.toString());

        // add all connected/requested users
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.senderId.toString());
            hideUsersFromFeed.add(req.receiverId.toString());
        })

        // 3. find users NOT in hideUsersFromFeed
        const users = await User.find({
            _id: { $nin: Array.from(hideUsersFromFeed) }//convert set in array
        })
        .select("firstName lastName photoUrl about skills age gender")
        .skip(skip)
        .limit(limit)

        res.json({
            message: "Feed fetched successfully!",
            data: users,
            page,
            limit
        })

    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = userRouter