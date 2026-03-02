import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import crypto from "crypto"

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
        enum: ["user", "admin"],
        default: 'user'
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
    },
}, {
    timestamps: true
})



/**
 * Mongoose pre-save hook
 * Hashes the password only if it has been modified.
 * Prevents double-hashing on updates.
 */
userSchema.pre("save", async function () {
    // If password field was not modified, skip hashing
    if (!this.isModified("password")) {
        return;
    }

    // Hash the password before saving to the database
    this.password = await bcrypt.hash(this.password, 10);
});





/**
 * Generates a 5-digit numeric verification code
 * and sets its expiration time on the user document.
 */
userSchema.methods.generateVerificationCode = function () {
    /**
     * Generates a random 5-digit number where
     * the first digit is never zero.
     */
    function generateRandomFiveDigitNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainingDigits = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0");

        return parseInt(firstDigit + remainingDigits, 10);
    }


    const verificationCode = generateRandomFiveDigitNumber();
    this.verificationCode = verificationCode;

    this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;

    return verificationCode;
};

userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE?.trim(),
    });
};

export const User = mongoose.model("User", userSchema)