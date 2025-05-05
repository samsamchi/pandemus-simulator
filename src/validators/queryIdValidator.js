const { param } = require('express-validator')

module.exports = param('id')
                .notEmpty()
                .isInt()
                .withMessage('id must be a non-empty integer')
