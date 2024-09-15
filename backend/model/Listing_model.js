import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  bedroom: {
    type: Number,
    required: true,
  },
  bathroom: {
    type: Number,
    required: true,
  },
  furnished: {
    type: Boolean,
    required: true,
  },
  parking: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    enum: ["rent", "sell"],
    required: true,
  },
  isOffer: {
    type: Boolean,
    required: true,
  },
  imageUrls: {
    type: Array,
    required: true,
  }
}, {timestamps: true});

const Listing = mongoose.model("Listing", listingSchema)
export default Listing;