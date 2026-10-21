const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const path = require("path");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")

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
.then((res)=>{
    console.log("Database Connected Successfully")
})
.catch(err => console.log(err));

//Home Route
app.get("/",(req,res)=>{
    res.send("Home Page working");
});

//Testing Route
app.get("/testListing",(req,res)=>{
    let samplelisting = new listing({
        title : "My new villa",
        description : "By the beach",
        price : 1200,
        location : "Calangute Goa",
        country : "India",
    })
    samplelisting.save();
    res.send("Saved successfull in database");
})

//Index Route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings = await listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Create Route
app.post("/listings",wrapAsync (async(req,res,next) =>{
    const newListing = new listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let editlisting = await listing.findById(id);
    res.render("listings/edit.ejs",{editlisting});
}));

// Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body;
    let updateListing = await listing.findByIdAndUpdate(
        id,
        {
            title: title,
            description: description,
            image: {
                filename: "listingimage",
                url: image
            },
            price: price,
            location: location,
            country: country
        },
        { new: true }
    );
    console.log("Listing updated successfully");
    res.redirect("/listings");
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Show Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let searchData = await listing.findById(id);
    res.render("listings/show.ejs",{listing :searchData});
}));

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

//Creating a middleware to handle the error
app.use((err,req,res,next)=>{
    let{ statusCode, message } = err;
    res.status(statusCode).send(message);
})

//Server listend for the port 8080
app.listen(8080,(req,res)=>{
    console.log("Server is listening for the port 8080");
});