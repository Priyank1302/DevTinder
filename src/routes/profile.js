const express = require("express");
const {userAuth} = require("../middlewares/auth")
const { validateProfileData } = require('../utils/validation')
const bcrypt = require("bcrypt");
const validator = require("validator");

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

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
   try{
    const {oldPassword,newPassword} = req.body;
    const isOldPasswordValid = await req.user.validatePassword(oldPassword);

    if (!isOldPasswordValid) {
        return res.status(400).send("Old password is incorrect!")
    }

    if (!validator.isStrongPassword(newPassword)) {
        return res.status(400).send("Please choose a strong password!")
    }

    const hashedNewPassword = await bcrypt.hash(newPassword,10);
    req.user.password = hashedNewPassword;
    await req.user.save()
    res.send("Password updated successfully!")


}
   catch(err)
   {
      res.status(400).send("ERROR:" + err.message);
   }
    
})



module.exports = profileRouter;