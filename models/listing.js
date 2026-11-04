const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { listingSchema } = require("../listingSchema.js");

//Schema define for document
const listSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1500534623283-312aade485b7",
        set: (v) =>
            v === "" ? "https://images.unsplash.com/photo-1500534623283-312aade485b7" : v,
    }
},
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    price: Number,
    location: String,
    country: String,
})

listSchema.post("findOneAndDelete",async(listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in :listing.reviews}})
    }
})

const listing = mongoose.model("listing",listSchema);
module.exports = listing;