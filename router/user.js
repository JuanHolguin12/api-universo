const express = require("express")
const userController = require("../controllers/user")
const md_auth = require("../middleware/authenticated")

const api = express.Router()

api.get("/user/me",[md_auth.asureAuth], userController.getMe)
api.get("/users",[md_auth.asureAuth], userController.getUsers)
api.post("/create-user",[md_auth.asureAuth], userController.createUser)
api.patch("/user/:id",[md_auth.asureAuth], userController.updateUser)
api.delete("/user/:id",[md_auth.asureAuth], userController.deleteUser)

module.exports = api