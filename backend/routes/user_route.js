import express from "express";
import User from "../model/User_model.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/update", verifyToken, async (req, res) => {
    console.log("Request Body:", req.body); // Check the incoming data
    const { firstname, lastname, imageUrl, phone, aboutMe, address, zipCode, country, city } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.userId },
            { $set: { firstname, lastname, imageUrl, phone, aboutMe, address, zipCode, country, city } },
            { new: true, runValidators: true, useFindAndModify: false }
        );
       
        if (!user) throw new Error("User not found");

        res.status(200).json({success: true, user, message: "Update was successful"})

    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
    
})


export default router;
