const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/UserController')

router.post('/', ProductController.create)

module.exports = router