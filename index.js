const express = require('express')

const app = express()

// importamos el middleware
const { typeError } = require('./middlewares/errors')

// le doy un número distinto a 3000 para evitar conflictos
const PORT = 3003

// conversor
app.use(express.json())

// importamos nuestras rutas de users
app.use('/users', require('./routes/users'))
// importamos nuestras rutas de posts
app.use('/posts', require('./routes/posts'))
// importamos nuestras rutas de products
app.use('/products', require('./routes/products'))

// ejecutamos el middleware
app.use(typeError)

app.listen(PORT, () =>
    console.log(`server on ${PORT}`)
)