import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name."],
            minLength: [3, "Name must be at least 3 characters."],
            maxLength: [50, "Name cannot exceed 50 characters."],
            trim: true
        },

        email: {
            type: String,
            required: [true, "Please add an email."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."]
        },

        // NOTE: Do NOT validate password format here via match/regex.
        // By the time Mongoose validators run on re-save, the value is
        // already a bcrypt hash — the regex will always fail.
        // Validate password strength in your controller or middleware instead.
        password: {
            type: String,
            required: [true, "Please add a password."],
            // No trim — spaces in passwords are intentional and valid.
            // No match — see note above.
            select: false
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true, // optional, if no two users can share the same number
            trim: true,
            validate: {
                validator: function(v) {
                // Accepts either +92XXXXXXXXXX or 03XXXXXXXXX
                return /^(\+92|0)[0-9]{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid Pakistani phone number!`
            }
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        isAccountVerified: {
            type: Boolean,
            default: false
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        // Stores a SHA-256 hash of the verification code, not the raw code.
        // Raw code is returned from the method and sent to the user via email.
        emailVerificationCode: {
            type: String
        },

        emailVerificationCodeExpire: {
            type: Date
        },

        // Stores a SHA-256 hash of the reset token, not the raw token.
        resetPasswordToken: {
            type: String
        },

        resetPasswordExpire: {
            type: Date
        },

        // Stores a SHA-256 hash of the refresh token, not the raw token.
        refreshToken: {
            type: String
        },

        refreshTokenExpire: {
            type: Date
        },

        deleteAccountRequestAt: {
            type: Date,
            default: undefined
        },

        deletionPausedUntil: {
            type: Date,
            default: undefined
        },

        pendingEmail: {
            type: String,
            lowercase: true,
            trim: true,
        },

        emailChangeToken: {
            type: String,
        },

        emailChangeTokenExpire: {
            type: Date,
        },
    },
    {
        timestamps: true
    }
);

// =========================
// Hash password before save
// =========================
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    try {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        next(error);
    }
});

// =========================
// Compare entered password with stored hash
// =========================
userSchema.methods.comparePassword = async function (enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        console.error("Password comparison failed:", error);
        return false;
    }
};

// =========================
// Generate 6-digit OTP verification code
// Stores hashed version in DB, returns raw code to send via email
// =========================
userSchema.methods.generateVerificationCode = function () {
    const rawCode = (crypto.randomInt(0, 900000) + 100000).toString();

    this.emailVerificationCode = crypto
        .createHash("sha256")
        .update(rawCode)
        .digest("hex");

    this.emailVerificationCodeExpire = Date.now() + 1 * 60 * 1000; // 10 minutes

    return rawCode; 
};

// =========================
// Generate password reset token
// Stores hashed version in DB, returns raw token to send via email
// =========================
userSchema.methods.generateResetPasswordToken = function () {
    const rawToken = crypto.randomBytes(32).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

    return rawToken;
};

// =========================
// Generate JWT access token
// =========================
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE?.trim()
    });
};

// =========================
// Generate and store hashed refresh token
// Returns raw token to be sent to client (httpOnly cookie)
// =========================
userSchema.methods.generateRefreshToken = function (expireMs = 30 * 24 * 60 * 60 * 1000) {
    const rawToken = crypto.randomBytes(64).toString("hex");
    this.refreshToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    this.refreshTokenExpire = Date.now() + expireMs;
    return rawToken;
};

export const User = mongoose.model("User", userSchema);