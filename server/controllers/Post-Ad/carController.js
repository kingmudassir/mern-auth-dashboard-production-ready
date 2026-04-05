import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/errors.js";
import { Car } from "../../models/carSchema.js";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

// ── Helper: upload a single buffer to Cloudinary ─────────────────
function uploadBufferToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
            {
                folder: "paiyya/cars",
                transformation: [
                    { width: 1200, crop: "limit" },
                    { quality: "auto:good" },
                ],
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
}

// ── Helpers ───────────────────────────────────────────────────────

const formatRelativeTime = (date) => {
    if (!date) return "Unknown";
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) {
        const h = Math.floor(seconds / 3600);
        return `${h} hour${h !== 1 ? "s" : ""} ago`;
    }
    const days = Math.floor(seconds / 86400);
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
    if (days < 30) {
        const weeks = Math.floor(days / 7);
        return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    }
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
};

/**
 * normalizeAd
 *
 * Uses doc.status as the single source of truth.
 * No longer derives status from isActive/isSold booleans.
 */
const normalizeAd = (doc) => {
    const now = new Date();
    let expiresIn = null;

    if (doc.expiresAt) {
        const msLeft = new Date(doc.expiresAt) - now;
        if (msLeft > 0) {
            const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
            expiresIn = `${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;
        }
    }

    return {
        _id: doc._id.toString(),
        id: doc._id.toString(),
        make: doc.make,
        model: doc.model,
        variant: doc.variant ?? null,
        year: doc.year,
        price: doc.price,
        city: doc.city,
        fuel: doc.fuel,
        transmission: doc.transmission,
        mileage: doc.mileage,
        condition: doc.condition,
        color: doc.color,
        // Use the stored status field directly
        status: doc.status ?? "pending",
        rejectionReason: doc.rejectionReason ?? null,
        images: doc.images?.length > 0 ? doc.images : [],
        views: doc.views ?? 0,
        saves: doc.saves ?? 0,
        postedAt: formatRelativeTime(doc.createdAt),
        expiresIn,
        featured: doc.featured ?? false,
    };
};

// ── POST /api/v2/cars ─────────────────────────────────────────────
export const postAd = catchAsyncError(async (req, res, next) => {
    const {
        make, model, variant, year, condition,
        bodyType, color, engineCC, assembly,
        transmission, fuel, mileage, registeredIn,
        features, price, negotiable,
        description, city, area, phone, whatsapp,
    } = req.body;

    // ── Validate ──────────────────────────────────────────────────
    if (!make || !model || !year)
        return next(new ErrorHandler("Make, model, and year are required.", 400));

    if (!fuel || !transmission || !bodyType || !color)
        return next(new ErrorHandler("Fuel, transmission, body type, and color are required.", 400));

    if (!price || isNaN(Number(price)) || Number(price) <= 0)
        return next(new ErrorHandler("Enter a valid price.", 400));

    if (!description || description.trim().length < 30)
        return next(new ErrorHandler("Description must be at least 30 characters.", 400));

    if (condition !== "New" && !mileage)
        return next(new ErrorHandler("Mileage is required for used vehicles.", 400));

    if (!city)
        return next(new ErrorHandler("City is required.", 400));

    if (!phone || !/^(\+92|0)[0-9]{10}$/.test(phone))
        return next(new ErrorHandler("Enter a valid Pakistani phone number.", 400));

    if (!req.files || req.files.length === 0)
        return next(new ErrorHandler("At least one photo is required.", 400));

    // ── Upload to Cloudinary ──────────────────────────────────────
    let uploadedImages;
    try {
        uploadedImages = await Promise.all(
            req.files.map((f) => uploadBufferToCloudinary(f.buffer))
        );
    } catch (err) {
        return next(new ErrorHandler(`Image upload failed: ${err.message}`, 500));
    }

    // ── Parse features ────────────────────────────────────────────
    let parsedFeatures = [];
    try {
        parsedFeatures = features ? JSON.parse(features) : [];
    } catch {
        parsedFeatures = [];
    }

    // ── Create — status defaults to "pending", isActive to false ──
    const car = await Car.create({
        make: make.trim(),
        model: model.trim(),
        variant: variant?.trim() || undefined,
        year: Number(year),
        condition: condition || "Used",
        bodyType: bodyType.trim(),
        color: color.trim(),
        engineCC: engineCC ? Number(engineCC) : undefined,
        assembly: assembly || "Local",
        transmission,
        fuel: fuel.trim(),
        mileage: mileage ? Number(mileage) : undefined,
        registeredIn: registeredIn?.trim() || undefined,
        features: parsedFeatures,
        price: Number(price),
        negotiable: negotiable === "true" || negotiable === true,
        description: description.trim(),
        city: city.trim(),
        area: area?.trim() || undefined,
        phone: phone.trim(),
        whatsapp: whatsapp === "true" || whatsapp === true,
        images: uploadedImages,
        postedBy: req.user._id,
        // Explicit — schema defaults handle this, but being explicit is safer
        status: "pending",
        isActive: false,
    });

    res.status(201).json({
        success: true,
        message: "Your ad has been submitted for review. It will go live once approved by our team.",
        car: {
            _id: car._id,
            make: car.make,
            model: car.model,
            year: car.year,
            price: car.price,
            city: car.city,
            images: car.images,
            status: car.status,
            createdAt: car.createdAt,
        },
    });
});

// ── GET /api/v2/cars (public marketplace) ────────────────────────
// Only shows listings with status === "active"
export const getCars = catchAsyncError(async (req, res, next) => {
    const {
        make, model, city, minPrice, maxPrice,
        condition, transmission, fuel, bodyType,
        minYear, maxYear, sort = "newest",
        page = 1, limit = 20,
    } = req.query;

    // Only serve active (admin-approved) listings to the public marketplace
    const filter = { status: "active", isDeleted: false };

    if (make)         filter.make         = new RegExp(make, "i");
    if (model)        filter.model        = new RegExp(model, "i");
    if (city)         filter.city         = new RegExp(city, "i");
    if (condition)    filter.condition    = condition;
    if (transmission) filter.transmission = transmission;
    if (fuel)         filter.fuel         = fuel;
    if (bodyType)     filter.bodyType     = bodyType;

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minYear || maxYear) {
        filter.year = {};
        if (minYear) filter.year.$gte = Number(minYear);
        if (maxYear) filter.year.$lte = Number(maxYear);
    }

    const sortMap = {
        newest:     { createdAt: -1 },
        oldest:     { createdAt: 1 },
        price_asc:  { price: 1 },
        price_desc: { price: -1 },
        year_desc:  { year: -1 },
        year_asc:   { year: 1 },
    };
    const sortQuery = sortMap[sort] || sortMap.newest;

    const skip = (Number(page) - 1) * Number(limit);
    const [cars, total] = await Promise.all([
        Car.find(filter)
            .sort(sortQuery)
            .skip(skip)
            .limit(Number(limit))
            .select("make model variant year condition price city images negotiable transmission fuel mileage createdAt")
            .lean(),
        Car.countDocuments(filter),
    ]);

    const carsWithSavedStatus = cars.map(car => ({
        ...car,
        isSaved: req.user 
            ? req.user.savedAds.some(id => id.toString() === car._id.toString()) 
            : false
    }));

    res.status(200).json({
        success: true,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        cars: carsWithSavedStatus,
    });
});


export const getCarById = catchAsyncError(async (req, res, next) => {
    const car = await Car.findOne({ 
        _id: req.params.id, 
        isDeleted: false 
    }).populate("postedBy", "name createdAt");

    if (!car) return next(new ErrorHandler("Listing not found.", 404));

    const isOwner = req.user && car.postedBy._id.toString() === req.user._id.toString();
    const isActive = car.status === "active";

    if (!isActive && !isOwner) {
        return next(new ErrorHandler("Listing not found or pending review.", 404));
    }

    if (isActive && !isOwner) {
        Car.findByIdAndUpdate(car._id, { $inc: { views: 1 } }).exec();
    }

    // --- LOGIC TO PERSIST SAVE STATUS ON REFRESH ---
    const carObj = car.toObject(); // Convert Mongoose doc to plain JS object
    
    // Check if req.user exists (is logged in) and has the ID in their savedAds
    carObj.isSaved = req.user 
        ? req.user.savedAds.some(id => id.toString() === car._id.toString()) 
        : false;

    res.status(200).json({ success: true, car: carObj });
});

// ── GET /api/v2/cars/my-ads ───────────────────────────────────────
// Returns all non-deleted ads for the authenticated user, any status
export const getMyAds = catchAsyncError(async (req, res, next) => {
    const ads = await Car.find({ postedBy: req.user._id, isDeleted: false })
        .select(
            "make model variant year price city fuel transmission mileage " +
            "condition color views saves expiresAt featured createdAt images " +
            "status rejectionReason isActive isSold isDeleted"
        )
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json({
        success: true,
        count: ads.length,
        ads: ads.map(normalizeAd),
    });
});

// ── DELETE /api/v2/cars/:id ───────────────────────────────────────
export const deleteAd = catchAsyncError(async (req, res, next) => {
    const ad = await Car.findOneAndDelete({
        _id: req.params.id,
        postedBy: req.user._id,
    });

    if (!ad) return next(new ErrorHandler("Ad not found or access denied", 404));

    res.status(200).json({ success: true, message: "Ad deleted successfully" });
});

// ── PATCH /api/v2/cars/:id/status ────────────────────────────────
// User-facing status patch. Only "sold" and "pending" (resubmit) allowed.
export const patchMyAdStatus = catchAsyncError(async (req, res, next) => {
    const { status } = req.body;

    const allowedUserStatuses = ["sold", "pending"];
    if (!allowedUserStatuses.includes(status)) {
        return next(new ErrorHandler("You can only set status to 'sold' or 'pending'.", 400));
    }

    const updateFields = { status };

    if (status === "sold") {
        updateFields.isSold = true;
        updateFields.isActive = false;
    } else if (status === "pending") {
        // Seller resubmitting a rejected ad for re-review
        updateFields.isActive = false;
        updateFields.isSold = false;
        updateFields.rejectionReason = undefined;
        updateFields.rejectedBy = undefined;
        updateFields.rejectedAt = undefined;
    }

    const ad = await Car.findOneAndUpdate(
        { _id: req.params.id, postedBy: req.user._id, isDeleted: false },
        updateFields,
        { new: true, runValidators: true }
    ).lean();

    if (!ad) return next(new ErrorHandler("Ad not found or access denied", 404));

    res.status(200).json({ success: true, ad: normalizeAd(ad) });
});

// ── PATCH /api/v2/cars/update/:id ────────────────────────────────
export const updateAd = catchAsyncError(async (req, res, next) => {
    // 1. Fetch the existing ad to check ownership and current status
    const ad = await Car.findOne({
        _id: req.params.id,
        postedBy: req.user._id,
        isDeleted: false,
    });

    if (!ad) {
        return next(new ErrorHandler("Ad not found or access denied", 404));
    }

    const {
        features,
        existingImages,
        images: ignoredImages,
        ...otherFields
    } = req.body;

    // ── Handle Images ─────────────────────────────────────────────
    let finalImages = [];

    // Preserve existing images the frontend wants to keep
    try {
        const imagesToKeepUrls = existingImages ? JSON.parse(existingImages) : [];
        const orderedExisting = imagesToKeepUrls
            .map((url) => ad.images.find((img) => img.url === url))
            .filter(Boolean);
        finalImages = [...orderedExisting];
    } catch {
        finalImages = [...ad.images];
    }

    // Upload new files if provided
    if (req.files?.length > 0) {
        try {
            const newUploaded = await Promise.all(
                req.files.map((f) => uploadBufferToCloudinary(f.buffer))
            );
            finalImages = [...finalImages, ...newUploaded];
        } catch (err) {
            return next(new ErrorHandler(`Cloudinary upload failed: ${err.message}`, 500));
        }
    }

    if (finalImages.length === 0) {
        return next(new ErrorHandler("At least one photo is required.", 400));
    }

    // ── Parse Features ────────────────────────────────────────────
    let parsedFeatures;
    try {
        parsedFeatures = typeof features === "string" ? JSON.parse(features) : features;
    } catch {
        parsedFeatures = ad.features;
    }

    // ── Reset Logic ───────────────────────────────────────────────
    // If the ad was already "active", "rejected", or even "sold", 
    // any edit should trigger a re-review.
    const needsReview = ["active", "rejected", "sold"].includes(ad.status);

    const updatedAd = await Car.findByIdAndUpdate(
        req.params.id,
        {
            ...otherFields,
            features: parsedFeatures,
            images: finalImages,
            // Ensure numeric types are correctly cast
            price: otherFields.price ? Number(otherFields.price) : ad.price,
            year: otherFields.year ? Number(otherFields.year) : ad.year,
            mileage: otherFields.mileage ? Number(otherFields.mileage) : ad.mileage,
            engineCC: otherFields.engineCC ? Number(otherFields.engineCC) : ad.engineCC,
            // Ensure booleans are correctly cast
            negotiable: otherFields.negotiable === "true" || otherFields.negotiable === true,
            whatsapp: otherFields.whatsapp === "true" || otherFields.whatsapp === true,

            // Mandatory Status Reset for Edits
            ...(needsReview && {
                status: "pending",
                isActive: false,
                isSold: false,
                // Clear the Audit Trail
                rejectionReason: undefined,
                rejectedBy: undefined,
                rejectedAt: undefined,
                approvedBy: undefined,
                approvedAt: undefined,
                soldAt: undefined,
            }),
        },
        { new: true, runValidators: true }
    ).lean();

    res.status(200).json({
        success: true,
        message: needsReview
            ? "Ad updated. It has been re-submitted for review before going live."
            : "Ad updated successfully.",
        ad: normalizeAd(updatedAd),
    });
});