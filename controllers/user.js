const User = require("../models/user")
const bcrypt = require("bcryptjs")

async function getMe(req, res) {
    //obteiene el id por medio del payload que se hizo en el middleware
    const { user_id } = req.user

    //buscar usuario por el id
    const response = await User.findById(user_id)

    if (!response) {
        res.status(400).send({ msg: "No se ha encontrado el usuario" })
    } else {
        res.status(200).send(response)
    }
}

async function getUsers(req, res) {
    //se recupera active por el query
    const { active } = req.query
    let response = null
    if (active === undefined) {
        response = await User.find()
    } else {
        response = await User.find({ active })
    }
    res.status(200).send(response)
}

async function createUser(req, res) {
    const { password } = req.body;
    const user = new User(req.body);
    console.log(user);

    /* const password = "123" */
    const salt = bcrypt.genSaltSync(10);
    const hasPassword = bcrypt.hashSync(password, salt);
    user.password = hasPassword;
   /*  user.firstname = "Juan"
    user.username = "juan123"
 */
    user.save((error, userStored) => {
        if (error) {
            res.status(400).send({ msg: "Error al crear el usuario" });
        } else {
            res.status(201).send(userStored);
        }
    });
}

async function updateUser(req, res) {
    const { id } = req.params
    const userData = req.body

    //Update Password
    if (userData.password) {
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(userData.password, salt)
        userData.password = hashPassword
    } else {
        delete userData.password
    }

    //Find User By Id
    User.findByIdAndUpdate({ _id: id }, userData, (error) => {
        if (error) {
            res.status(400).send({ msg: "Error al actualizar el usuario" })
        } else {
            res.status(200).send({ msg: "Actualización correcta" })
        }
    })
}

async function deleteUser(req, res) {
    const { id } = req.params

    User.findByIdAndDelete({ _id: id }, (error) => {
        if (error) {
            res.status(400).send({ msg: "Error al eliminar usuario" })
        } else {
            res.status(200).send({ msg: "Eliminación correcta" })
        }
    })
}

module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser
}