const express = require('express');

const connectDb = require("./config/database")
const app = express();

const User = require("./models/user")

app.use(express.json())//reads json object , converts it in js object and we can read that body
app.post('/signup', async (req, res) => {

    //creating a new instance of user model
    try {

        const user = new User(req.body)
        await user.save();
        res.send("User added successfully")

    }
    catch (e) {
      res.status(400).send("error saving the user"+ e.message)
    }
})

app.get("/user",async(req,res)=>{
   const email = req.body.emailId
   const user =await User.find({emailId:email})
   res.send(user)
})

app.get("/feed",async(req,res)=>{
   
    try{
        const user =await User.find({})
       res.send(user)
    }
    catch(e)
    {
        res.status(400).send("something went wrong")
    }
})

 app.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId; // move inside try!
        const user = await User.findByIdAndDelete(userId)
        res.send("User deleted successfully!")
    } catch(e) {
        res.status(400).send("something went wrong")
    }
})

app.patch("/user",async(req,res)=>{
    try {
        const updates =req.body
        const userId = req.body.userId; // move inside try!
        const user = await User.findByIdAndUpdate(userId,updates)
        res.send("User updated successfully!")
    } catch(e) {
        res.status(400).send("something went wrong")
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
