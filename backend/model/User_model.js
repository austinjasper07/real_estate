import mongoose from "mongoose";

const User_schema = new mongoose.Schema(
  {
    googleAuth: {
      type: Boolean,
      default: false,
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
    zipCode: {
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
