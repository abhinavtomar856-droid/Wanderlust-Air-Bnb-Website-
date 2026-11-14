const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

//Signup Form.
router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
});

//Add User.
router.post("/signup", wrapAsync(async(req,res) =>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
        let regUser = await User.register(newUser,password);
        console.log(regUser);
        req.flash("success","New User added successfully");
        res.redirect("/listings");
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

//Login Form
router.get("/login",(req,res) =>{
    res.render("user/login.ejs");
});

// //Authentication for User.
// My code without using passport.
// router.post("/login",async(req,res)=>{
//     let{username,email,password} = req.body;
//     let existingUser = await User.findOne({ username });
//     if(existingUser){
//         console.log("User already registered");
//         res.redirect("/listings");
//     }
//     else{
//         req.flash("error","Username does not exist Pls login first");
//         res.redirect("/login");
//     }
// });

//Authentication for User.
router.post("/login",passport.authenticate("local",{
    failureRedirect : "/login",
    failureFlash : true,
})
,async(req,res) =>{
    req.flash("success","Welcome back to wanderlust");
    res.redirect("/listings");
});

module.exports = router;