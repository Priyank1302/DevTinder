const express = require('express');
const app = express();

app.use((req,res)=>{
    res.send("hello from server")
})

app.use('/test',(req,res)=>{
    res.send("hello from test route server")
})


app.listen(3000,()=>{
    console.log("server listening at 3000")
});