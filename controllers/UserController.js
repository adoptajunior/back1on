// importamos nuestro modelo User
// y también el Post
// y también el Token
// y Sequelize
const { User, Post, Token, Sequelize } = require('../models/index.js')

// importamos bcrypt 
const bcrypt = require('bcryptjs')

// importamos jwt
const jwt = require('jsonwebtoken')
// y nuestro secreto 
const { jwt_secret } = require('../config/config.json')['development']

// para hacer logout
const { Op } = Sequelize


const UserController = {

    // el next para validar el middleware
    async create(req, res, next) {
        try {
            req.body.role = 'user'
            // encriptamos la que nos viene por body (en este caso)
            const password = bcrypt.hashSync(req.body.password, 10)
            // creamos el hash de forma síncrona
            // el número es el salt, las veces que hace la "mezcla"

            // usamos el método create de sequelize 
            // que nos hace un insert del usuario

            // destructuring de boy ... para poder 
            // hacer una copia exacta del objeto
            // pasamos password para que la sobreescriba
            // todo dentro de un objeto { }
            /*
            User.create({ ...req.body, password: password })
                .then((user) =>
                    res.status(201).send({ message: 'Usuario creado con éxito', user })
                )
            */
            const user = await User.create({ ...req.body, password })
            res.send(user)

        } catch (error) {
            console.error(error)
            next(error)
        }
    },

    getAll(req, res) {
        User.findAll({ include: [Post] })
            .then((users) => res.send(users))
            .catch((err) => {
                console.log(err)
                res.status(500).send({
                    message: 'Ha habido un problema al cargar las publicaciones',
                })
            })
    },

    // para eliminar usuario y todos sus posts
    async delete(req, res) {
        await User.destroy({
            where: {
                id: req.params.id,
            },
        })
        // borramos los posts que tengan el id de usuario pasado por parámetro
        await Post.destroy({
            where: {
                UserId: req.params.id,
            },
        })
        res.send('El usuario ha sido eliminado con éxito')
    },

    // para actualizar un usuario
    async update(req, res) {
        await User.update(
            { name: req.body.name, email: req.body.email },
            { where: { id: req.params.id } }
        )
        res.send('Usuario actualizado con éxito')
    },

    // login con bcrypt
    login(req, res) {
        // buscamos al usuario que intenta loguearse por mail
        User.findOne({ where: { email: req.body.email } }).then((user) => {
            if (!user) {
                return res.status(400).send({ message: 'Usuario o contraseña incorrectos' })
            }
            // comparamos la contraseña que le pasamos por el body
            // con la que tenemos en la base de datos
            const isMatch = bcrypt.compareSync(req.body.password, user.password)
            if (!isMatch) {
                return res.status(400).send({ message: 'Usuario o contraseña incorrectos' })
            }
            // generamos el token si el login es correcto
            const token = jwt.sign({ id: user.id }, jwt_secret)
            // Ahora al hacer login, le diremos que nos 
            // guarde el token en la nueva tabla de tokens.
            Token.create({ token, UserId: user.id })

            // res.send(user)
            res.send({ message: 'Bienvenid@ ' + user.name, user, token })

        })
    },

    // logout
    // destruiremos el Token donde el UserId sea el que pasamos por la request 
    // y el token igual al que le pasamos por headers
    async logout(req, res) {
        try {
            await Token.destroy({
                where: {
                    [Op.and]: [
                        { UserId: req.user.id },
                        { token: req.headers.authorization },
                    ],
                },
            })
            res.send({ message: 'Desconectado con éxito' })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'hubo un problema al tratar de desconectarte' })
        }
    },


}

module.exports = UserController