const { DB_searchUser } = require("../services/User_Services");

const findUser = async (searchTable, userID, res) => {
    try {
        const searchResult = await DB_searchUser(searchTable, userID, res);

        if (searchResult[0].length === 0) {
            res.status(404);
            throw new Error("User not found");
        }

        return searchResult[0];
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { findUser };
