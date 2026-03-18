export const sendToken = async (user, statusCode, message, res, rememberMe = false) => {

    const token = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await user.save({ validateModifiedOnly: true });
    
    const refreshTokenExpire = rememberMe
    ? 30 * 24 * 60 * 60 * 1000  // 30 days
    : 24 * 60 * 60 * 1000;       // 1 day

    res
        .status(statusCode)

        // Access token cookie
        .cookie("token", token, {
            expires: new Date(Date.now() + 15 * 60 * 1000),
            httpOnly: true,
            sameSite: "strict",
            path: "/"
        })

        // Refresh token cookie
        .cookie("refreshToken", refreshToken, {
            expires: new Date(Date.now() + refreshTokenExpire),
            httpOnly: true,
            sameSite: "strict",
            path: "/"
        })

        .json({
            success: true,
            message: message || "Account Verified.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
            },
        });
};