const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const {postgres_config} = require('../secrets/secrets');

//creating a new sequalize instance with our local db
const sequelize = new Sequelize(postgres_config);

//testing the connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


//creating users model
const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    hooks: {
        beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        }
    }
});

//creating table 'users' in the chatappdb if it doesn't exist yet
sequelize.sync()
    .then(() => console.log('Users table has been successfully created.'))
    .catch(err => console.log(err));

module.exports = User;