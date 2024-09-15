import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import Listing from "../model/Listing_model.js";

const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
  try {
    const property = await Listing.create(req.body);
    if (property) {
      res.status(201).json({ success: true, property, message: "Listing successful" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating listing" });
  }
});


export default router;