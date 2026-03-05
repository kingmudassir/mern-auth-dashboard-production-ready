export const sendToken = (user, statusCode, message, res) => {
    const token = user.generateToken();
    const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE, 10) || 1

    res
        .status(statusCode)
        .cookie("token", token, {
        expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
        })
        .json({
        success: true,
        message: message || "Account Verified.",
        user: {
            email: user.email,
            accountVerified: user.accountVerified,
        },
        token,
        });
};