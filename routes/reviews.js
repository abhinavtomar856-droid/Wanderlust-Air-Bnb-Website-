const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const listing = require("../models/listing.js");
const {reviewSchema} = require("../listingSchema.js");

//review validations.
const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//Review Route
router.post("/",validateReview, wrapAsync(async(req,res) =>{
    let ListingDoc = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    ListingDoc.reviews.push(newReview);

    await newReview.save();
    await ListingDoc.save();
    console.log("Review added successfully");
    res.redirect(`/listings/${ListingDoc._id}`);
}));

//Delete review route
router.delete("/:reviewId",wrapAsync(async(req,res) =>{
    let {id,reviewId} = req.params
    await listing.findByIdAndUpdate(id,{$pull : {reviews: reviewId}})
    await listing.findByIdAndDelete(reviewId);
    
    res.redirect(`/listings/${id}`)
}));

module.exports = router;