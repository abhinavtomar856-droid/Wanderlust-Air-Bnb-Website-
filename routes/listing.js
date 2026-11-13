const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../listingSchema.js")
const listing = require("../models/listing.js");

//Arrow function to check for errors.
//listing validations.
const validatelisting = (req,res,next) =>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//Index Route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Create Route
router.post("/",validatelisting,wrapAsync (async(req,res,next) =>{
    const newListing = new listing(req.body.listing)
    await newListing.save();
    req.flash("success","New Listing Created")
    res.redirect("/listings");
}));

//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let searchData = await listing.findById(id).populate("reviews");
    if(!searchData){
        req.flash("error","Listing you are requested for does not exist!!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing : searchData});
}));

//Edit Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let editlisting = await listing.findById(id);
    if(!editlisting){
        req.flash("error","Listing you are requested for does not exist!!");
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{editlisting});
}));

// Update Route
router.put("/:id",validatelisting,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body.listing;
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
    console.log(updateListing);
    req.flash("success","Listing Updated")
    res.redirect("/listings");
}));

//Delete Route
router.delete("/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await listing.findByIdAndDelete(id);
    console.log("Delete Listing is:")
    console.log(deleteListing);
    req.flash("success","Listing Deleted")
    res.redirect("/listings");
}));

module.exports = router;