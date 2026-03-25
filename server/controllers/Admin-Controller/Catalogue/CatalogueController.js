import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../../middlewares/errors.js";
import { Make, City } from "../../../models/catalogueSchema.js";

// ==================== MAKES ====================
export const getMakes = catchAsyncError(async (req, res, next) => {
    const { active = true } = req.query;

    const filter = {};
    if (active === "true") filter.isActive = true;

    const makes = await Make.find(filter).sort({ name: 1 });

    res.status(200).json({
        success: true,
        makes,
        total: makes.length
    });
});

export const getMakeById = catchAsyncError(async (req, res, next) => {
    const make = await Make.findById(req.params.makeId);

    if (!make) {
        return next(new ErrorHandler("Make not found", 404));
    }

    res.status(200).json({
        success: true,
        make
    });
});

export const addMake = catchAsyncError(async (req, res, next) => {
    const { name, models } = req.body;

    if (!name || name.trim().length === 0) {
        return next(new ErrorHandler("Make name is required", 400));
    }

    const existingMake = await Make.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (existingMake) {
        return next(new ErrorHandler("Make already exists", 409));
    }

    const make = await Make.create({
        name: name.trim(),
        models: models || []
    });

    res.status(201).json({
        success: true,
        message: "Make added successfully",
        make
    });
});

export const updateMake = catchAsyncError(async (req, res, next) => {
    const { name, models, isActive } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (models) updateData.models = models;
    if (isActive !== undefined) updateData.isActive = isActive;

    const make = await Make.findByIdAndUpdate(
        req.params.makeId,
        updateData,
        { new: true, runValidators: true }
    );

    if (!make) {
        return next(new ErrorHandler("Make not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Make updated successfully",
        make
    });
});

export const deleteMake = catchAsyncError(async (req, res, next) => {
    const make = await Make.findByIdAndDelete(req.params.makeId);

    if (!make) {
        return next(new ErrorHandler("Make not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Make deleted successfully"
    });
});

export const addModelToMake = catchAsyncError(async (req, res, next) => {
    const { makeId } = req.params;
    const { modelName, years } = req.body;

    if (!modelName || modelName.trim().length === 0) {
        return next(new ErrorHandler("Model name is required", 400));
    }

    const make = await Make.findById(makeId);
    if (!make) {
        return next(new ErrorHandler("Make not found", 404));
    }

    const modelExists = make.models.some(m => m.name.toLowerCase() === modelName.toLowerCase());
    if (modelExists) {
        return next(new ErrorHandler("Model already exists for this make", 409));
    }

    make.models.push({
        name: modelName.trim(),
        years: years || []
    });

    await make.save();

    res.status(201).json({
        success: true,
        message: "Model added to make",
        make
    });
});

// ==================== CITIES ====================
export const getCities = catchAsyncError(async (req, res, next) => {
    const { active = true, province } = req.query;

    const filter = {};
    if (active === "true") filter.isActive = true;
    if (province) filter.province = province;

    const cities = await City.find(filter).sort({ name: 1 });

    res.status(200).json({
        success: true,
        cities,
        total: cities.length
    });
});

export const getCityById = catchAsyncError(async (req, res, next) => {
    const city = await City.findById(req.params.cityId);

    if (!city) {
        return next(new ErrorHandler("City not found", 404));
    }

    res.status(200).json({
        success: true,
        city
    });
});

export const addCity = catchAsyncError(async (req, res, next) => {
    const { name, province, regionCode } = req.body;

    if (!name || name.trim().length === 0) {
        return next(new ErrorHandler("City name is required", 400));
    }

    if (!province || !["Punjab", "Sindh", "KPK", "Balochistan", "AJK", "GB", "FATA", "ICT"].includes(province)) {
        return next(new ErrorHandler("Valid province is required", 400));
    }

    const existingCity = await City.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (existingCity) {
        return next(new ErrorHandler("City already exists", 409));
    }

    const city = await City.create({
        name: name.trim(),
        province,
        regionCode: regionCode || null
    });

    res.status(201).json({
        success: true,
        message: "City added successfully",
        city
    });
});

export const updateCity = catchAsyncError(async (req, res, next) => {
    const { name, province, regionCode, isActive } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (province) updateData.province = province;
    if (regionCode) updateData.regionCode = regionCode;
    if (isActive !== undefined) updateData.isActive = isActive;

    const city = await City.findByIdAndUpdate(
        req.params.cityId,
        updateData,
        { new: true, runValidators: true }
    );

    if (!city) {
        return next(new ErrorHandler("City not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "City updated successfully",
        city
    });
});

export const deleteCity = catchAsyncError(async (req, res, next) => {
    const city = await City.findByIdAndDelete(req.params.cityId);

    if (!city) {
        return next(new ErrorHandler("City not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "City deleted successfully"
    });
});
