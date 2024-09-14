import express from "express";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../model/User_model.js";

import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


router.post("/sign_up", async (req, res) => {
  const {password, email, firstname, lastname, isProfessional, profession, zipCode, phone } = req.body;

  try {
    if (isProfessional) {
      if (!profession || !zipCode || !phone || !password || !email || !firstname || !lastname) {
        throw new Error("All fields are required");
      }
    }
    if (!isProfessional) {
      if (!password || !email) {
        throw new Error("All fields are required");
      }
    }

    const userAlreadyExists = (await User.findOne({ email }));

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const hashed_password = bcryptjs.hashSync(password, 12);
   
    // Generate verification token before saving the user
    const verificationToken = crypto.randomInt(100000, 1000000).toString();

    // Sending Email verification using Mailtrap
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      throw new Error("Failed to send verification email. Please try again.");
    }

    // If email is sent successfully, proceed to save the user
    const user = new User({
      password: hashed_password,
      email,
      firstname,
      lastname,
      isProfessional,
      profession,
      zipCode,
      phone,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 1 * 60 * 60 * 1000, // Expires in 1 hour
    });

    await user.save();

    res.status(202).json({
      success: true,
      message:
        "User created successfully. Check your email for the verification code",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/OAuth", async (req, res) => {
  const { firstname, lastname, email, phone, isVerified, imageUrl } = req.body;
  try {
    const existingUser = await User.findOne({ email }).select("-password");
    if (existingUser) {
      const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      existingUser.lastLogin = Date.now();
      await existingUser.save()
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .status(202)
        .json({
          success: true,
          message: "Login successful. Redirecting to Dashboard",
          user: existingUser,
        });
    } else {
      try {
        const user = new User({
          firstname,
          lastname,
          email,
          phone,
          OAuth: true,
          isVerified,
          imageUrl,
          isProfessional: false,
          lastLogin: Date.now(),
        });
        await user.save();
        // await sendWelcomeEmail(email, firstname);
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        console.log(user)
        res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .status(202)
        .json({
          success: true,
          message: "Registration successful. Redirecting to Dashboard",
          user,
        });
        
        
      } catch (error) {
        throw new Error(error);
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
  
})

router.post("/verify_email", async (req, res) => {
  const { verificationCode } = req.body;

  try {
    if(!verificationCode) throw new Error("All fields are required");
    
    const user = await User.findOne({
      verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired verification code");
    } else {
      user.isVerified = true; // setting the user to verified in

      // removing these properties from the user because it is not needed again.
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save(); // updating the user
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(202)
      .json({
        success: true,
        message: "Verification successful. Redirecting to Dashboard",
        user: {
          ...user._doc,
          password: undefined,
          resetPasswordToken: undefined,
          resetPasswordExpiresAt: undefined,
        },
      });
    
    await sendWelcomeEmail(user.email, user.firstname); // sending welcome email

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    console.log(user)

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!user.password && user.OAuth) {
      return res
      .status(401)
      .json({ success: false, message: "You previously signed up with a social account" });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "User not verified" });
    }

    const isMatch = bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(202)
      .json({
        success: true,
        message: "Login successful. Redirecting to dashboard",
        user: {
          ...user._doc,
          password: undefined,
          resetPasswordToken: undefined,
          resetPasswordExpiresAt: undefined,

        },
      });

  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "An error occurred during login" });
  }
});

router.post("/logout", async (req, res) => {
 // Clear the cookie named "access_token"
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });

    // Send a success response
    res.status(200).json({ success: true, message: "Logout successful" });
});

router.post("/forgot_password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    if (user.isVerified) {
      
      user.resetPasswordToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
      await user.save();
  
      await sendPasswordResetEmail(
        user.email,
        `${process.env.CLIENT_URL}/reset-password/${user.resetPasswordToken}`
      );
    }else throw new Error("Email not verified");
    
    return res.status(200).json({
      success: true,
      message: "Password reset link sent successfully"
    })

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
})

router.post("/reset_password/:token", async (req, res) => {
  const { password, confirm_password } = req.body;
  const {token} = req.params;
  try {
    if (!password || !confirm_password) {
      throw new Error("All fields are required");
    }
    if (password !== confirm_password) {
      throw new Error("Password mismatch");
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }
    });
    if (!user) {
      throw new Error("Invalid or expired reset token");
    } else {
      bcryptjs.hash(password, 12, async (err, hash) => {
        if (err) {
          return res.status(500).json({ success: false, message: "An error occurred during password comparison" });
        }
        user.password = hash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();
      });
      await sendResetSuccessEmail(user.email);
      return res.status(202).json({ success: true, message: "Password reset successfully" });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
})

router.get("/check_auth", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // the .select("-password") removes the password field from the user object
    
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
    
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
})

router.post("/resend_verifyCode", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
  
    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    
    try {
      await sendVerificationEmail(email, verificationCode, user.firstname);
      
    } catch (error) {
      throw new Error("Failed to send verification email. Please try again.");
    }
    user.verificationToken = verificationCode;
    user.verificationTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000, // Expires in 1 hour
    await user.save();
    
    res.status(200).json({ success: true, message: "Email verification code sent successfully" });
 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})
 


export default router;
