const express = require('express');
const app = express();

//this will only handle GET call to /user
app.get("/user",(req,res)=>{
    res.send({
        firstName:"Priyank",
        lastName : "Gaur",
        age: 27
    })
})

app.post("/user",(req,res)=>{
    //console.log("Save data to database");
    res.send("Data saved to database")
})




//this will match all the http api call to /test
app.use('/test',(req,res)=>{
    res.send("hello from test route server")
})



// app.use('/hello/2',(req,res)=>{
//     res.send("abracadabra")
// })

// app.use('/hello',(req,res)=>{
//     res.send("hello hello hello")
// })

// app.use((req,res)=>{
//     res.send("hello from server")
// })


app.listen(3000,()=>{
    console.log("server listening at 3000")
});

//Express reads routes TOP TO BOTTOM
// First match wins!

// Specific routes → always on top
// Generic/catch-all → always at bottom ✅