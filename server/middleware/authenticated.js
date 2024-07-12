const jwt = require("../utils/jwt")

function asureAuth(req, res, next) {
    // se valida si existe la cabecera de autenticacion
    if (!req.headers.authorization) return res.status(403).send({ msg: "La petición no tiene la cabecera de autenticación" })

    //obtenemos el token sin la palabra Bearer
    const token = req.headers.authorization.replace("Bearer ", "")

    try {
        //contenido del Token
        const payload = jwt.decode(token)
        //recuperar la fecha de exp del payload
        const { exp } = payload
        const currentDate = new Date().getTime()

        //Comparar si el token ya expiró
        if (exp <= currentDate) {
            res.status(400).send({msg:"El token ha expirado"})
        }

        //si el token no ha expirado
        req.user = payload
    } catch (error) {
        res.status(400).send({ msg: "Token invalido" })
    }
    next()
}
module.exports = {
    asureAuth,
}