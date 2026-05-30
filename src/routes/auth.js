const express = require("express");
const { validateSignUpData } = require('../utils/validation')
const User = require('../models/user')

const authRouter = express.Router();
const bcrypt = require("bcrypt");


authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req)
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({
            firstName, lastName, emailId,
            password: passwordHash
        })
        await user.save();
        res.send("User added successfully")
    } catch(e) {
        res.status(400).send("ERROR: " + e.message)
    }
})


authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).send("Your account is not registered!")
        }

        // using schema method instead of bcrypt.compare
        const isPasswordValid = await user.validatePassword(password)
        if (!isPasswordValid) {
            return res.status(400).send("Invalid credentials!")
        }

        // using schema method instead of jwt.sign
        const token = await user.getJWT()

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 3600000)
        })

        res.send("User Logged In Successfully!")

    } catch(e) {
        res.status(400).send("ERROR: " + e.message)
    }
})

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now())
        })
        res.send("Logout successful!")
    } catch(e) {
        res.status(400).send("ERROR: " + e.message)
    }
})

module.exports = authRouter