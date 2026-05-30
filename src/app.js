const express = require('express');
const connectDb = require("./config/database")
const app = express();

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json())//reads json object , converts it in js object and we can read that body

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)


connectDb().then(() => {
    console.log("DB connection established")
    app.listen(3000, () => {
        console.log("server listening at 3000")
    });
}).catch((error) => {
    console.error("error connecting to db", error)
})
