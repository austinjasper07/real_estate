import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import Listing from "../model/Listing_model.js";

const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
  try {
    const userRef = req.userId;
    const listingData = {
      ...req.body,  // Spread all properties from req.body
      userRef
    }
    const property = await Listing.create(listingData);
    if (property) {
      res.status(201).json({ success: true, property, message: "Listing successful" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating listing" });
    console.log(error)
  }
});


export default router;