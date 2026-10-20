const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    },
},
    price: Number,
    location: String,
    country: String,
})

const listing = mongoose.model("listing",listSchema);
module.exports = listing;