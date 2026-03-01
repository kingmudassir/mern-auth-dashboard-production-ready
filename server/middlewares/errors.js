class ErrorHandler extends Error {
    constructor (message, statusCode) {
        super(message)
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}

const ErrorMap = {
    Error: {
        statusCode: 500,
        message: "I haven't defined this yet!"
    },
    
    DocumentNotFoundError: {
        statusCode: 404,
        message: "Document not found!"
    },
    
    MongooseServerSelectionError: {
        statusCode: 503,
        message: "Cannot connect to MongoDB server!"
    },

    MongoServerError: {
        statusCode: 409,
        message: (error) => {
            if (error.code === 11000) {
                return `${Object.values(error.errors.name || {}).map()}`
            }
        }
    },

    MongooseServerSelectionError: {
        statusCode: 503,
        message: "Cannot connect to MongoDB server!"
    },

    MongooseServerSelectionError: {
        statusCode: 503,
        message: "Cannot connect to MongoDB server!"
    },

    MongooseServerSelectionError: {
        statusCode: 503,
        message: "Cannot connect to MongoDB server!"
    },

    MongooseServerSelectionError: {
        statusCode: 503,
        message: "Cannot connect to MongoDB server!"
    },

    MongooseServerSelectionError: {
        statusCode: 503,
        message: "Cannot connect to MongoDB server!"
    },

    MongooseServerSelectionError: {
        statusCode: 503,
        message: "Cannot connect to MongoDB server!"
    },


}