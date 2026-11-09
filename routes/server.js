const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


const sessionOptions = {
    secret:"mysecretstring",
    resave : false,
    saveUninitialized : true
}    

app.use(session(sessionOptions));
app.use(flash());

//Middleware.
app.use((req,res,next) =>{
    res.locals.successMsg = req.flash("success");
    res.locals.errMsg = req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let{name = "I dont know"} = req.query;
    req.session.name = name;
    if(name == "I dont know"){
        req.flash("error","User not registered")
    }
    else{
        req.flash("success","User registered successfully!");
    }
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name: req.session.name});
})

// app.get("/reqcount",(req,res) =>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You send the request ${req.session.count} times`)
// })

app.listen(3000, () =>{
    console.log("Server is listening for the port 3000");
})
