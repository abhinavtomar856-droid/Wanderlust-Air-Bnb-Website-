const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

//Cookie Parser Middleware.
app.use(cookieParser("secretcode"))

app.get("/getcookies",(req,res) =>{
    res.cookie("Greet" , "Namaste");
    res.cookie("MadeInIndia","Hello")
    res.send("Get some cookies")
})

app.get("/getsignedcookie",(req,res) =>{
    res.cookie("made-in","India",{signed:true})
    res.send("Sent")
})

app.get("/verify",(req,res) =>{
    console.log(req.cookies)
    res.send("verified")
})

app.get("/",(req,res)=>{
    console.dir(req.signedCookies);
    res.send("Hi i am the root page");
})

app.listen(3000, () =>{
    console.log("Server is listening for the port 3000")
})
