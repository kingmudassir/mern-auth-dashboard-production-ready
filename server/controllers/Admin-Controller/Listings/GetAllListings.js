import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import { Car } from "../../../models/carSchema.js";

export const getAllListings = catchAsyncError(async (req, res, next) => {
    const {
        page = 1,
        limit = 100,
        sortBy = "createdAt",
        order = "desc",
        status,
        search,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: order === "desc" ? -1 : 1 };

    // Base query — never show hard-deleted records
    const query = { isDeleted: false };

    // Status tab filtering — uses the status field directly
    if (status && status !== "all") {
        query.status = status;
    }

    // Search bar
    if (search) {
        query.$or = [
            { make: { $regex: search, $options: "i" } },
            { model: { $regex: search, $options: "i" } },
            { city: { $regex: search, $options: "i" } },
            { variant: { $regex: search, $options: "i" } },
        ];
    }

    const [listings, total] = await Promise.all([
        Car.find(query)
            .populate("postedBy", "name email phone")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Car.countDocuments(query),
    ]);

    // Normalize: AllCarListings.jsx reads `seller`, backend stores `postedBy`
    const normalized = listings.map((doc) => ({
        ...doc,
        seller: doc.postedBy || { name: "Unknown", email: "—" },
        // fuelType alias for components that use either key
        fuelType: doc.fuelType || doc.fuel || "—",
        reportCount: doc.reportCount || 0,
    }));

    res.status(200).json({
        success: true,
        listings: normalized,
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
    });
});