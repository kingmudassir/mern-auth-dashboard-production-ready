import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import { Car } from "../../../models/carSchema.js";

export const getAllListings = catchAsyncError(async (req, res, next) => {
    // 1. Extract filters from query
    const { 
        page = 1, 
        limit = 100, 
        sortBy = "createdAt", 
        order = "desc",
        status,
        search 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: order === "desc" ? -1 : 1 };

    // 2. Build Query Object
    let query = { isDeleted: false };

    // Support status tabs (active, pending, flagged, etc.)
    if (status && status !== 'all') {
        query.status = status;
    }

    // Support the search bar functionality server-side
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { make: { $regex: search, $options: "i" } },
            { model: { $regex: search, $options: "i" } },
            { city: { $regex: search, $options: "i" } }
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

    // 3. Normalize for AllCarListings.jsx
    const normalized = listings.map((doc) => ({
        ...doc,
        // Frontend expects 'seller', backend uses 'createdBy'
        seller: doc.postedBy || { name: "Unknown", email: "—" },
        // Frontend uses 'fuelType', ensure it is mapped if backend uses 'fuel'
        fuelType: doc.fuelType || doc.fuel || "—",
        // Ensure reportCount exists for the "Flagged" logic
        reportCount: doc.reportCount || 0 
    }));

    res.status(200).json({
        success: true,
        listings: normalized,
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
    });
});