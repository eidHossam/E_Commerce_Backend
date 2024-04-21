const { DB_searchUser, DB_addCustomerInfo } = require("./User_Services");

const addCustomerInfo = async (userID, insertionTable, data, res) => {
    try {
        const searchTable = "customer";
        const searchResult = await DB_searchUser(searchTable, userID, res);

        if (searchResult[0].length === 0) {
            res.status(404);
            throw new Error("User not found");
        }

        const DBResult = await DB_addCustomerInfo(
            insertionTable,
            userID,
            data,
            res
        );

        return DBResult;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = addCustomerInfo;
