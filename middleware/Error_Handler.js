const { constants } = require("../utils/Constants");

exports.errorHandler = (err, req, res, next) => {
    const statuscode = res.statusCode ? res.statusCode : 500;

    res.status(statuscode);

    switch (statuscode) {
        case constants.VALIDATION_ERROR:
            res.json({
                title: "Validation Error",
                message: err.message,
                stackTrace: err.stack,
            });
            break;

        case constants.CONFLICT_ERROR:
            res.json({
                title: "conflict Error",
                message: err.message,
                stackTrace: err.stack,
            });
            break;

        case constants.NOT_FOUND:
            res.json({
                title: "Not Found",
                message: err.message,
                stackTrace: err.stack,
            });
            break;

        case constants.SERVER_ERROR:
            res.json({
                title: "Server Error",
                message: err.message,
                stackTrace: err.stack,
            });
            break;

        default:
            break;
    }
};
