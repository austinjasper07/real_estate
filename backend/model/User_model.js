import mongoose from "mongoose";

const User_schema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: function () {
        return this.isProfessional;
      },
    },
    lastname: {
      type: String,
      required: function () {
        return this.isProfessional;
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.googleAuth;
      },
    },
    imageUrl: String,
    aboutMe: String,
    country: {
      type: String,
      required: function () {
        return this.isProfessional;
      },
    },
    city: {
      type: String,
      required: function () {
        return this.isProfessional;
      },
    },
    phone: {
      type: String,
      required: function () {
        return this.isProfessional;
      },
      match: /^[0-9]{11}$/,
    },
    OAuth: {
      type: Boolean,
      default: false,
    },
    zipCode: {
      type: String,
      required: function () {
        return this.isProfessional;
      },
    },
    oAuthType: {
      type: String,
      enum: ["google", "facebook"],
    },
    isProfessional: {
      type: Boolean,
      default: false,
      required: true,
    },
    profession: {
      type: String,
      enum: ["landlord", "agent"],
      required: function () {
        return this.isProfessional;
      },
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", User_schema);
export default User;
