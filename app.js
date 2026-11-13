const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js")
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {
    secret:"mysecretstring",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};   

app.use(session(sessionOptions));
app.use(flash());


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs",ejsMate);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
.then(()=>{
    console.log("Database Connected Successfully")
})
.catch(err => console.log(err));

//Home Route
app.get("/",(req,res)=>{
    res.send("Home Page working");
});

//Middleware for flash messages.
app.use((req,res,next) =>{
    res.locals.success = req.flash("success")
    next();
})


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

//Creating a middleware to handle the error
app.use((err,req,res,next)=>{
    let{ statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
})

//Server listend for the port 8080
app.listen(8080,(req,res)=>{
    console.log("Server is listening for the port 8080");
});