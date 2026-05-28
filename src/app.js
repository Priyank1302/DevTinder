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
      e.status(400).send("error saving the user"+ e.message)
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
