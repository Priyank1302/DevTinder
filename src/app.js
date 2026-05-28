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

app.patch("/user/:userId",async(req,res)=>{
    try {

        // {
        //     "userId":"6a181718052ef82f4376bf82",
        //     "age": 30,
        //     "gender": "female"
        //  } we willl loop thriugh every keys of object requested by user and will check if only every allowed updates is there
        const updates =req.body
        const userId = req.params?.userId; // move inside try!
        const ALLOWED_UPDATES = ["photoURL","about","gender","age","skills"];
        const isUpdateAllowed = Object.keys(updates).every(k=>ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed)
        {
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
