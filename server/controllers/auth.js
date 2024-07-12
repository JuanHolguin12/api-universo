const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("../utils/jwt")

function register(req, res) {
  const { firstname, lastname, password, username } = req.body
  if (!username) res.status(400).send({ msg: "El email es obligatorio" })
  if (!password) res.status(400).send({ msg: "El email es obligatorio" })

  const user = new User({
    firstname,
    lastname,
    username: username.toLowerCase(),
    role: "user",
    active: true,
  })

  //Encrypt password
  const salt = bcrypt.genSaltSync(10)
  const hashPassword = bcrypt.hashSync(password, salt)
  user.password = hashPassword

  user.save((error, userStorage) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el usuario" })
    } else {
      res.status(200).send(userStorage)
    }
  })
}

/* function login(req, res) {
    const { username, password } = req.body;
  
    if (!username) res.status(400).send({ msg: "El usuario es obligatorio" });
    if (!password) res.status(400).send({ msg: "La contraseña es obligatoria" });
  
    const usernameLowerCase = username.toLowerCase();
  
    User.findOne({ username: usernameLowerCase }, (error, userStore) => {
      if (error) {
        console.log(error);
        res.status(500).send({ msg: "Error del servidor" });
      } else {
        bcrypt.compare(password, userStore.password, (bcryptError, check) => {
          if (bcryptError) {
            res.status(500).send({ msg: "Error del servidor" });
          } else if (!check) {
            res.status(400).send({ msg: "Contraseña incorrecta" });
          } else if (!userStore.active) {
            res.status(401).send({ msg: "Usuario no autorizado o no activo" });
          } else {
            res.status(200).send({
              access: jwt.createAccessToken(userStore),
              refresh: jwt.createRefreshToken(userStore),
            });
          }
        });
      }
    });
  } */
function login(req, res) {
  const { username, password } = req.body;

  if (!username) res.status(400).send({ msg: "El username es obligatorio" });
  if (!password) res.status(400).send({ msg: "La contraseña es obligatoria" });

  const usernameLowerCase = username.toLowerCase();

  User.findOne({ username: usernameLowerCase }, (error, userStore) => {
    if (error) {
      res.status(500).send({ msg: "Error del servidor" });
    } else if (userStore) {
      bcrypt.compare(password, userStore.password, (bcryptError, check) => {
        if (bcryptError) {
          res.status(500).send({ msg: "Error del servidor" });
        } else if (!check) {
          res.status(400).send({ msg: "Usuario o Contraseña incorrectos" });
        } else if (!userStore.active) {
          res.status(401).send({ msg: "Usuario no autorizado o no activo" });
        } else {
          res.status(200).send({
            access: jwt.createAccessToken(userStore),
            refresh: jwt.createRefreshToken(userStore),
          });
        }
      });
    }
    else {
      res.status(400).send({ msg: "Usuario o Contraseña incorrectos" });
    }
  });
}

//Refrescar el AccessToken
function refreshAccessToken(req, res) {
  const { token } = req.body
  if (!token) res.status(400).send({ msg: "Token requerido" })

  const { user_id } = jwt.decode(token)

  User.findOne({ _id: user_id }, (error, userStorage) => {
    if (error) {
      res.status(500).send({ msg: "Error del servidor" })
    } else {
      //Si no hay un error genera el nuevo Token
      res.status(200).send({ accessToken: jwt.createAccessToken(userStorage) })
    }
  })
}

module.exports = {
  register,
  login,
  refreshAccessToken
}