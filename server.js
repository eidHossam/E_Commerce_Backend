const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/test", (req, res) => {
    console.log(`Request body:`, req.body);

    res.status(201).json({
        data: "Hossam Eid",
    });
});

app.listen(port, () => {
    console.log(`Server listening on port:${port}`);
});
