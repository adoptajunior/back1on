const express = require('express')
const router = express.Router()
const PostController = require('../controllers/PostController')

// importamos el middleware de autenticación
const { authentication, isAdmin } = require('../middlewares/authentication')

// router.post('/', PostController.create)
// router.get('/', PostController.getAll)
// router.get('/id/:id', PostController.getById)
// router.get('/title/:title', PostController.getOneByName)
// router.delete('/id/:id', PostController.delete)

router.get('/', PostController.getAll)

// implementamos el middleware
router.get('/:id', PostController.getById)
router.get('/title/:title', PostController.getOneByName)
router.post('/', authentication, PostController.create)
router.delete('/:id', authentication, isAdmin, PostController.delete)
router.put('/:id', authentication, PostController.update)

module.exports = router