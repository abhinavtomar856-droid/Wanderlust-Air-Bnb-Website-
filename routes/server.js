const express = require("express");
const app = express();
const session = require("express-session");

app.use(session(
    {
        secret:"mysecretstring",
        resave : false,
        saveUninitialized : true
    }    
))

app.get("/reqcount",(req,res) =>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send(`You send the request ${req.session.count} times`)
})

app.get("/",(req,res) =>{
    res.send("Welcome to the Home Page")
})
app.get("/test",(req,res) =>{
    res.send("Test Successful")
})

app.listen(3000, () =>{
    console.log("Server is listening for the port 3000")
})
