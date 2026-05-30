const express = require("express");
const {userAuth} = require("../middlewares/auth")

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest",async (req,res)=>{

})


module.exports = requestRouter;