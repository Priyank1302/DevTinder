const express = require('express');

const connectDb = require("./config/database")
const app = express();

const User = require("./models/user")
const { validateSignUpData } = require('./utils/validation')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json())//reads json object , converts it in js object and we can read that body
app.post('/signup', async (req, res) => {

    //creating a new instance of user model
    try {
        validateSignUpData(req)
        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({
            firstName, lastName, emailId, password: passwordHash
        })
        await user.save();
        res.send("User added successfully")

    }
    catch (e) {
        res.status(400).send("ERROR" + e.message)
    }
})

app.post("/login",async(req,res)=>{
    try{
        const {emailId,password} = req.body;
        // find user by email
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).send("Your account is not registered with this email id!")
        }

        const isPasswordvalid = await bcrypt.compare(password,user.password)
        if(!isPasswordvalid)
        {
            return res.status(400).send("Invalid credentials!")
        }
        const token = await jwt.sign(
            { _id: user._id },    // payload
            "DevTinder@Secret",   // secret key
            { expiresIn: "1d" }   // expiry
        )
        console.log(token)
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 3600000)
        })
        res.send("User Logged In Successfully!")

    }catch(e)
    {
        res.status(400).send("ERROR :" + e.message)
    }
})

app.get("/user", async (req, res) => {
    const email = req.body.emailId
    const user = await User.find({ emailId: email })
    res.send(user)
})

app.get("/feed", async (req, res) => {

    try {
        const user = await User.find({})
        res.send(user)
    }
    catch (e) {
        res.status(400).send("something went wrong")
    }
})

app.get("/profile", async (req, res) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;

        if (!token) {
            return res.status(401).send("Please login first!")
        }

        const decodedMessage = jwt.verify(token, "DevTinder@Secret")
        const { _id } = decodedMessage;
        const user = await User.findById(_id);
        if(!user)
        {
            throw new Error("User does not exist")
        }
        res.send(user)

    } catch(e) {
        res.status(400).send("something went wrong: " + e.message)
    }
})

app.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId; // move inside try!
        const user = await User.findByIdAndDelete(userId)
        res.send("User deleted successfully!")
    } catch (e) {
        res.status(400).send("something went wrong")
    }
})

app.patch("/user/:userId", async (req, res) => {
    try {

        // {
        //     "userId":"6a181718052ef82f4376bf82",
        //     "age": 30,
        //     "gender": "female"
        //  } we willl loop thriugh every keys of object requested by user and will check if only every allowed updates is there
        const updates = req.body
        const userId = req.params?.userId; // move inside try!
        const ALLOWED_UPDATES = ["photoURL", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(updates).every(k => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            res.status(400).send("Update not allowed")
        }
        if (updates.skills && updates.skills.length > 5) {
            return res.status(400).send("Skills cannot be more than 5!")
        }
        const user = await User.findByIdAndUpdate(
            userId,      // 1st arg → id
            updates,     // 2nd arg → what to update
            {
                runValidators: true,      // runs schema validation
                returnDocument: "after"   // returns updated doc
            }
        )
        res.send("User updated successfully!")
    } catch (e) {
        res.status(400).send("something went wrong");
    }
})

connectDb().then(() => {
    console.log("DB connection established")
    app.listen(3000, () => {
        console.log("server listening at 3000")
    });
}).catch((error) => {
    console.error("error connecting to db", error)
})
