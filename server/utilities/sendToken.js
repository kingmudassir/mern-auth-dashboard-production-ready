export const sendToken = async (user, statusCode, message, res) => {

    const token = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await user.save({ validateModifiedOnly: true });

    res
        .status(statusCode)

        // Access token cookie
        .cookie("token", token, {
            expires: new Date(Date.now() + 15 * 60 * 1000),
            httpOnly: true,
            path: "/"
        })

        // Refresh token cookie
        .cookie("refreshToken", refreshToken, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
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