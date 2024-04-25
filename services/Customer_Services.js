const { findUser } = require("../utils/UserUtils");
const { DB_addCustomerInfo } = require("./User_Services");

const addCustomerInfo = async (userID, insertionTable, data, res) => {
    try {
        const searchTable = "customer";
        await findUser(searchTable, userID, res);

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
