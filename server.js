const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const usersRouter = require("./routes/User_Routes");
const errorHandler = require("./middleware/Error_Handler");

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", usersRouter);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server listening on port:${port}`);
});
