const express = require("express");
const { API_VERSION } = require("./constants")
const bodyParser = require("body-parser")
const cors = require("cors");


const app = express();

//Import routes
const authRoutes = require("./router/auth")
const userRoutes = require("./router/user")
const propertyRoutes = require("./router/property")

//Configure Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Configure static folder
app.use(express.static("uploads"))

//Configure Header HTTP - CORS
app.use(cors());

//Configure routings
app.get(`/api/${API_VERSION}`, (req, res) => {
    return res.json("hello world")
})
app.get(`/`, (req, res) => {
    return res.json("hello world")
})
app.use(`/api/${API_VERSION}`, authRoutes)
app.use(`/api/${API_VERSION}`, userRoutes)
app.use(`/api/${API_VERSION}`, propertyRoutes)

module.exports = app;
