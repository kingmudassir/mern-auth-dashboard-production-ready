import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { User } from "../../../models/userSchema.js";
import { validateEmail } from "../../../utilities/Validators/EmailValidator.js";
import { validateName } from "../../../utilities/Validators/NameValidator.js";
import { validatePhone } from "../../../utilities/Validators/PhoneValidator.js";

export const updateUserInfo = catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;
    const { name, email, phone } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    if (name !== undefined) {
        if (name.trim() === user.name) return next(new ErrorHandler("Name must be different.", 400));
        const nameError = validateName(name);
        if (nameError) return next(new ErrorHandler(nameError, 400));
        user.name = name;
    }

    if (email !== undefined) {
        if (email === user.email) return next(new ErrorHandler("Email must be different.", 400));
        const emailError = validateEmail(email);
        if (emailError) return next(new ErrorHandler(emailError, 400));

        const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
        if (existingEmail) return next(new ErrorHandler("Email already in use.", 409));

        user.email = email;
        user.isEmailVerified = false;
    }

    if (phone !== undefined) {
        if (phone === user.phone) return next(new ErrorHandler("Phone must be different.", 400));
        const phoneError = validatePhone(phone);
        if (phoneError) return next(new ErrorHandler(phoneError, 400));

        const existingPhone = await User.findOne({ phone, _id: { $ne: userId } });
        if (existingPhone) return next(new ErrorHandler("Phone number already in use.", 409));

        user.phone = phone;
    }

    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: "User info updated successfully.",
        user
    });
});