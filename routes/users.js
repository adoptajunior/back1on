const express = require('express')
const router = express.Router()

// usamos el método create de sequelize
// que nos hace un insert del usuario
const UserController = require('../controllers/UserController')

// importamos el middleware de autentificación
const { authentication } = require('../middlewares/authentication')
// lo implementamos en aquellas rutas que queremos 
// que solo se acceda si estas logueado

router.post('/', UserController.create)

// implementado en estas tres
router.get('/', authentication, UserController.getAll)
router.delete('/:id', authentication, UserController.delete)
router.put('/:id', authentication, UserController.update)

router.post('/login', UserController.login)
router.delete('/logout', authentication, UserController.logout)

module.exports = router
