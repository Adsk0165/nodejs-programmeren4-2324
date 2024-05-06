const database = require('../dao/inmem-db')
const logger = require('../util/logger')

const userService = {
    create: (user, callback) => {
        logger.info('create user', user)
        database.add(user, (err, data) => {
            if (err) {
                logger.info(
                    'error creating user: ',
                    err.message || 'unknown error'
                )
                callback(err, null)
            } else {
                logger.trace(`User created with id ${data.id}.`)
                callback(null, {
                    message: `User created with id ${data.id}.`,
                    data: data
                })
            }
        })
    },

    getAll: (callback) => {
        logger.info('getAll')
        database.getAll((err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Found ${data.length} users.`,
                    data: data
                })
            }
        })
    },

    getById: (userId, callback) => {
        logger.info('getById', userId)
        database.getById(userId, (err, user) => {
            if (err) {
                logger.error('Error retrieving user:', err.message || 'unknown error')
                callback(err, null)
            } else if (!user) {
                logger.warn(`User with ID ${userId} not found`)
                callback({ status: 404, message: 'User not found' }, null)
            } else {
                logger.trace(`User retrieved with id ${user.id}.`)
                callback(null, {
                    message: `User retrieved with id ${user.id}.`,
                    data: user
                })
            }
        })
    } ,

    deleteById(userId, callback) {
        logger.info('deleteById', userId)
        database.deleteById(userId, (err, result) => {
            if (err) {
                logger.error('Error deleting user:', err.message || 'unknown error')
                callback(err, null)
            } else {
                logger.trace('User deleted successfully')
                callback(null, { message: result.message })
            }
        })
    },

    updateById: (userId, updatedUser, callback) => {
        logger.info('updateById', userId);
        database.getById(userId, (err, user) => {
            if (err) {
                logger.error('Error retrieving user:', err.message || 'unknown error');
                callback(err, null);
            } else if (!user) {
                logger.warn(`User with ID ${userId} not found`);
                callback({ status: 404, message: 'User not found' }, null);
            } else {
                // Update user fields
                Object.assign(user, updatedUser);
                // Update the user in the database
                database._data[userId] = user;
                logger.trace('User updated successfully');
                callback(null, {
                    message: `User updated successfully`,
                    data: user
                });
            }
        });
    }
    
    
    
    

   
}

module.exports = userService
