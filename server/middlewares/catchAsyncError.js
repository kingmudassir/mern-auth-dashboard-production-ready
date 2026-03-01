export const catchAsyncError = (anyFunction) => {
    return (req, res, next) => {
        Promise.resolve(anyFunction(req, res, next)).catch(next)
    }
}