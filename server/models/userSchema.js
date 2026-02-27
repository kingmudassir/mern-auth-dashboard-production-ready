import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name."],
        minLength: 3,
        maxLength: 50,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address. [userSchema.js - email]"]
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minLength:[8, "Password must have at least 8 characters. [userSchema.js - password]"],
        maxLength: [128, "Password cannot have more than 128 characters. [userSchema.js - password]"],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, "Password must contain uppercase, lowercase, number, and special character"],
        select: false
    },

    role: {
        type: String,
        enum: ["user, admin"],
        default: ["user"]
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    emailVerificationToken: {
        type: String,
        default: null
    },

    emailVerificationTokenExpire: {
        type: Date,
        default: null
    },

    resetPasswordToken: {
        type: String,
        default: null
    },

    resetPasswordExpire: {
        type: Date,
        default: null
    },

    refreshToken: {
        type: String,
        default: null
    }

}, {
    timestamps: true
})

