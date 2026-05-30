const express = require("express");
const {userAuth} = require("../middlewares/auth")
const { validateProfileData } = require('../utils/validation')

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        // user already attached by userAuth! 
        res.send(req.user)
    } catch(e) {
        res.status(400).send("something went wrong: " + e.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
    try
    {
        if(!validateProfileData(req))
        {
            throw new Error("Invalid edit request");
        }

        const loggedInUser = req.user;//in userAuth where we are validating token, we are already attaching user in req so we can access it
    
        const keys = Object.keys(req.body);

        keys.forEach(key=>{
            loggedInUser[key] = req.body[key]
        })

        await loggedInUser.save();
        res.send(`${loggedInUser.firstName}, your profile is updated successfully`)


    }
    catch(err)

    {
        res.status(400).send("something went wrong: " + err.message)
    }
})



module.exports = profileRouter;