const asyncHanlder = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHanlder(async (req, res, next) => {
    //Get the authorization token from the headers
    const authHeader = req.headers.authorization || req.headers.Authorization;

    //Make sure the authorization header isn't empty and that it uses Bearer protocol.
    if (authHeader && authHeader.startsWith("Bearer ")) {
        //Extract the token from the authorization header
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            //If the token is invalid throw an error
            if (err) {
                res.status(401);
                throw new Error("User not authorized.");
            }

            //If the token is valid put the decoded information into the request body.
            req.user = decoded.userID;
            next();
        });
    } else {
        res.status(401);
        throw new Error("User is not authorized or token is missing.");
    }
});

module.exports = validateToken;
