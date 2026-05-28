const express = require('express');

const connectDb = require("./config/database")
const app = express();

const User = require("./models/user")


app.post('/signup',async(req,res)=>{
    const userObj = {
        firstName: "Virat",
        lastName:" Kohli",
        emailId: "viratmsd007@gmail.com",
        password:"virat@123",
        age: 37,
        gender:"Male"
    }
    //creating a new instance of user model
    const user = new User(userObj)
    await user.save();
    res.send("User added successfully")
})

connectDb().then(()=>{
    console.log("DB connection established")
    app.listen(3000,()=>{
        console.log("server listening at 3000")
    });
 }).catch((error)=>{
   console.error("error connecting to db",error)
 })
