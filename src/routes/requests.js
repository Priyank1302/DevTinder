const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest")


requestRouter.post("/request/send/:status/:receiverId", userAuth, async (req,res)=>{
    try{
        // 1. get data
        const senderId = req.user._id;
        const { status, receiverId } = req.params;

        // 2. validate status 
        const ALLOWED_STATUS = ["interested", "ignored"];
        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).send("Invalid status type!")
        }

        // 3. cant send to yourself
        if (senderId.toString() === receiverId.toString()) {
            return res.status(400).send("Cannot send request to yourself!")
        }

        // 4. check receiver exists
        const receiver = await User.findById(receiverId);
        if(!receiver)
        {
            return res.status(404).send("User not found!")
        }

        // 5. check if request already exists
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })
        if (existingRequest) {
            return res.status(400).send("Request already exists!")
        }

         // 6. create connection request
         const connectionRequest = new ConnectionRequest({
            senderId,
            receiverId,
            status
        })

        await connectionRequest.save();
        res.json({
            message: `${req.user.firstName} is ${status} in ${receiver.firstName}`,
            connectionRequest
        })


    }
    catch(err)
    {
        res.status(400).send("ERROR: " + err.message)
    }

})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const receiverId = req.user._id;

         // 1. validate status
        const ALLOWED_STATUS = ["accepted", "rejected"];
        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).send("Invalid status!")
        }

        // 2. find request AND verify logged in user is receiver
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            receiverId: receiverId,
            status: "interested"
        })

        if (!connectionRequest) {
            return res.status(404).send("Connection request not found!")
        }

         // 3. update status
        connectionRequest.status = status;
        await connectionRequest.save();

        res.json({
            message: `Request ${status} successfully!`,
            connectionRequest
        })

    } catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})


module.exports = requestRouter;