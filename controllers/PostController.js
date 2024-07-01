// importamos además del modelo Post el modelo User
const { Post, User, Sequelize, sequelize } = require('../models/index.js')
const { Op } = Sequelize

const PostController = {
    create(req, res) {
        // igualamos el id de usuario recuperado del token
        Post.create({ ...req.body, UserId: req.user.id })
            .then((post) =>
                res.status(201).send({ message: 'Publicación creada con éxito', post })
            )
            .catch(console.error)
    },
    // Crearemos un nuevo método en PostController que nos 
    // traerá todos los posts juntos al usuario propietario de dicho post.

    getAll(req, res) {
        // con include importamos el usuario que hizo el post
        Post.findAll({ include: [User] })
            .then((posts) => res.send(posts))
            .catch((err) => {
                console.log(err)
                res.status(500).send({
                    message: 'Ha habido un problema al cargar las publicaciones',
                })
            })
    },

    // con el findByPk, nos buscará el post por su Primary Key
    // y nos devolverá el mismo 
    getById(req, res) {
        Post.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['name'] }],
        }).then((post) => res.send(post))
    },

    getOneByName(req, res) {
        // Definimos las distintas opciones/condiciones
        Post.findOne({
            where: {
                title: {
                    [Op.like]: `%${req.params.title}%`,
                },
            },
            include: [User],
        }).then((post) => res.send(post))
    },

    // El método destroy más el where elimina el Post que cumpla la condición.
    async delete(req, res) {
        await Post.destroy({
            // eliminamos el Post que coincida con el id que le pasamos por parámetro
            where: {
                id: req.params.id,
            },
        })
        res.send('La publicación ha sido eliminada con éxito')
    },

    // put / update
    async update(req, res) {
        await User.update(
            { name: req.body.name, email: req.body.email },
            { where: { id: req.params.id } }
        )
        res.send('Usuario actualizado con éxito')
    }

}

module.exports = PostController