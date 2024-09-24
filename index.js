const express = require("express");
const users = require("./users.json");
const cors = require("cors");
const app = express();
const fs = require("fs");
const dbConn = require("./config/db");
const apiRoutes = require("./routes/apiRoutes");


dbConn();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// api routes
app.use("/api",apiRoutes);

app.listen(80, () => {
    console.log("app is running at port 80");
});
