const express = require('express');

const app = express();
const cors = require('cors');
const { DBConnection } = require("./Database/db");

const PORT = process.env.PORT || 3000;
const problemRoutes = require("./routes/problemRoutes");
const authRoute= require("./routes/auth.route");
const compilerRoute = require("./routes/compiler.route");
//require("dotenv").config(); 
app.use(cors({
    origin: 'https://oj-codearena.vercel.app',
    credentials: true
}));


DBConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", authRoute);
app.use("/problems", problemRoutes);
app.use("/compiler", compilerRoute);

app.get("/", (req, res) => {
    res.send("hello worldkk");

})


console.log("reached");
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);

})