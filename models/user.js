'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Un usuario tiene muchos posts por lo que en este caso 
      // en vez de poner belongsTo, usaremos el hasMany.
      User.hasMany(models.Post)
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      // el campo no puede ser nulo
      allowNull: false,
      validate: {
        notNull: { msg: 'Por favor introduce tu nombre' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Por favor introduce tu correo' },
        // Validamos que el email que se rellena es un correo
        isEmail: { msg: 'Por favor introduce un correo valido' },
      },
    },
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  })

  return User
}