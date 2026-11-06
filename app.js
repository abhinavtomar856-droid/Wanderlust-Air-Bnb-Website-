const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");

const ExpressError = require("./utils/ExpressError.js")

const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
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