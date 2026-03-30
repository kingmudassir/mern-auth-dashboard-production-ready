import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import ErrorHandler from "../../middlewares/errors.js";
import { Car } from "../../models/carSchema.js";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

// ── Helper: upload a single base64 image to Cloudinary ───────────
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

    // ── Upload buffers to Cloudinary ──────────────────────────────
    let uploadedImages;
    try {
        uploadedImages = await Promise.all(
            req.files.map((f) => uploadBufferToCloudinary(f.buffer))
        );
    } catch (err) {
        return next(new ErrorHandler(`Image upload failed: ${err.message}`, 500));
    }

    // ── Parse features (sent as JSON string from FormData) ─────────
    let parsedFeatures = [];
    try {
        parsedFeatures = features ? JSON.parse(features) : [];
    } catch {
        parsedFeatures = [];
    }

    // ── Create ────────────────────────────────────────────────────
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
    });

    res.status(201).json({
        success: true,
        message: "Your ad has been posted successfully.",
        car: {
            _id: car._id,
            make: car.make,
            model: car.model,
            year: car.year,
            price: car.price,
            city: car.city,
            images: car.images,
            createdAt: car.createdAt,
        },
    });
});

// ── GET /api/cars  (marketplace listing) ─────────────────────────
export const getCars = catchAsyncError(async (req, res, next) => {
    const {
        make, model, city, minPrice, maxPrice,
        condition, transmission, fuel, bodyType,
        minYear, maxYear, sort = "newest",
        page = 1, limit = 20,
    } = req.query;

    const filter = { isActive: true, isDeleted: false };

    if (make)        filter.make        = new RegExp(make, "i");
    if (model)       filter.model       = new RegExp(model, "i");
    if (city)        filter.city        = new RegExp(city, "i");
    if (condition)   filter.condition   = condition;
    if (transmission) filter.transmission = transmission;
    if (fuel)        filter.fuel        = fuel;
    if (bodyType)    filter.bodyType    = bodyType;

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
        newest:      { createdAt: -1 },
        oldest:      { createdAt: 1  },
        price_asc:   { price: 1      },
        price_desc:  { price: -1     },
    };
    const sortQuery = sortMap[sort] || sortMap.newest;

    const skip = (Number(page) - 1) * Number(limit);
    const [cars, total] = await Promise.all([
        Car.find(filter)
            .sort(sortQuery)
            .skip(skip)
            .limit(Number(limit))
            .select("make model variant year condition price city images negotiable transmission fuel createdAt")
            .lean(),
        Car.countDocuments(filter),
    ]);

    res.status(200).json({
        success: true,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        cars,
    });
});

// ── GET /api/cars/:id  ────────────────────────────────────────────
export const getCarById = catchAsyncError(async (req, res, next) => {
    const car = await Car.findOne({
        _id: req.params.id,
        isActive: true,
        isDeleted: false,
    }).populate("postedBy", "name createdAt");

    if (!car) return next(new ErrorHandler("Listing not found.", 404));

    // Increment view count — fire and forget, don't await
    Car.findByIdAndUpdate(car._id, { $inc: { views: 1 } }).exec();

    res.status(200).json({ success: true, car });
});

// ── GET /api/cars/my-ads  ─────────────────────────────────────────
export const getMyAds = catchAsyncError(async (req, res, next) => {
    const cars = await Car.find({
        postedBy: req.user._id,
        isDeleted: false,
    })
        .sort({ createdAt: -1 })
        .select("make model variant year price city images isActive isSold createdAt");

    res.status(200).json({ success: true, count: cars.length, cars });
});

// ── DELETE /api/cars/:id  ─────────────────────────────────────────
export const deleteAd = catchAsyncError(async (req, res, next) => {
    const car = await Car.findOne({
        _id: req.params.id,
        isDeleted: false,
    });

    if (!car) return next(new ErrorHandler("Listing not found.", 404));

    // Only the owner or an admin can delete
    const isOwner = car.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin" || req.user.role === "moderator";

    if (!isOwner && !isAdmin)
        return next(new ErrorHandler("Not authorized to delete this listing.", 403));

    // Soft delete
    car.isDeleted = true;
    car.isActive  = false;
    car.deletedAt = new Date();
    await car.save({ validateModifiedOnly: true });

    res.status(200).json({ success: true, message: "Listing deleted." });
});