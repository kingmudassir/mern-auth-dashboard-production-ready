import { User } from "../models/userSchema.js";
import crypto from "crypto";

const handleRefresh = async (refreshTokenFromClient, res) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(refreshTokenFromClient)
        .digest("hex");

    const user = await User.findOne({
        refreshToken: hashedToken,
        refreshTokenExpire: { $gt: Date.now() }
    });

    if (!user) return null;

    // Generate NEW tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    await user.save(); // IMPORTANT: no validateModifiedOnly shortcut

    // Set cookies
    res.cookie("token", newAccessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 60 * 1000),
        sameSite: "strict",
        path: "/"
    });

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        expires: new Date(user.refreshTokenExpire),
        sameSite: "strict",
        path: "/"
    });

    return user;
};

export default handleRefresh