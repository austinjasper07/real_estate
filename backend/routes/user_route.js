import express from "express";
import mongoose from "mongoose";
import User from "../model/User_model.js";
import Listing from "../model/Listing_model.js"
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();
// const ObjectId = new mongoose.Types.ObjectId;

router.post("/update", verifyToken, async (req, res) => {
    const { firstname, lastname, imageUrl, phone, aboutMe, address, zipCode, country, city } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.userId },
            { $set: { firstname, lastname, imageUrl, phone, aboutMe, address, zipCode, country, city } },
            { new: true, runValidators: true, useFindAndModify: false }
        );
       
        if (!user) throw new Error("User not found");

        res.status(200).json({ success: true, user, message: "Update was successful" })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
    
});

router.get("/user_listings", verifyToken, async (req, res) => {
    try {
    const listings = await Listing.find({userRef: req.userId})
    res.status(200).json({listings});
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user listings" });
    }
})

router.post("/edit_listing", verifyToken, async (req, res) => {
    try {
        const listing = await Listing.findOneAndUpdate(
            { _id: req.body._id },
            { $set: { ...req.body } },
            { new: true, runValidators: true, useFindAndModify: false }
        );
        console.log(listing)
        res.status(202).json({ success: true, message: "Update was successful" });
    } catch (error) {
        res.status(500).json({ message: "Error modifying listings" });
    }
});

router.post("/delete_listing", verifyToken, async (req, res) => {
    try {
        console.log("the delete call came", req.body)
        await Listing.findByIdAndDelete({ _id: req.body.id });
        res.status(202).json({ success: true, message: "Listing deleted successful" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting listings" });
    }
})


export default router;
