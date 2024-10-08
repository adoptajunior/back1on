const { Product } = require('../models/index.js')

const ProductController = {

    create(req, res) {
        // importamos nuestro modelo Product
        // usamos el método create de sequelize 
        // que nos hace un insert del usuario
        req.body.role = 'product'
        Product.create(req.body)
            .then((product) =>
                res.status(201).send({ message: 'Usuario creado con éxito', product })
            )
            .catch((err) => console.error(err))
    },
}
module.exports = ProductController