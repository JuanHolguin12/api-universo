const express = require("express")
const propertyController = require("../controllers/property")
const md_auth = require("../middleware/authenticated")

/* const multiparty = require("connect-multiparty")
const md_upload = multiparty({uploadDir: "./uploads/houses"}) */

const multer  = require('multer')
const upload = multer({ dest: './uploads/houses' })


const api = express.Router()

api.get("/properties/:id", propertyController.getProperty)
api.post("/property", [md_auth.asureAuth, upload.array('photos', 10)], propertyController.createProperty)
api.get("/properties", propertyController.getProperties)
api.delete("/property/:id", [md_auth.asureAuth], propertyController.deleteProperty)
api.patch("/property/:id", [md_auth.asureAuth], propertyController.updateProperty)

module.exports = api