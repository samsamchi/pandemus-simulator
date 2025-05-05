const { checkSchema } = require('express-validator')

const checkLength = (arr, req) => {
    const days = parseInt(req.body.days)

    if (arr.length !== days) {
        throw new Error('Array length must match days')
    }

    return true
}

module.exports = checkSchema({
    createdAt: {
        isDate: {
            errorMessage: 'Date format must be YYYY-MM-DD',
            options: { delimiters: ['-'] }
        },
        optional: true
    },
    name: {
        isLength: {
            errorMessage: 'Name must have between 3 and 255 characters',
            options: { min: 3, max: 255}
        },
        optional: true,
        trim: true
    },
    days: {
        isInt: {
            errorMessage: 'Days must be an int >= 1',
            options: { min: 1 }
        }
    },
    infected: {
        isArray: {
            options: { min: 1 },
            errorMessage: 'The field "infected" must be an array with at least one element.',
          },
        custom: {
            options: (value, { req }) => {
                try {
                   return checkLength(value, req)
                } catch(error) {
                    console.error(error)
                    throw error
                }
            }
        }
    },
    'infected.*': {
        isFloat: {
            errorMessage: 'All elements of the array "infected" must be floats',
        }
    },
    dead: {
        isArray: {
            options: { min: 1 },
            errorMessage: 'The field "dead" must be an array with at least one element.',
        },
        custom: {
            options: (value, { req }) => {
                try {
                    return checkLength(value, req)
                } catch(error) {
                    console.error(error)
                    throw error
                }
            }
        }
    },
    'dead.*': {
        isFloat: {
            errorMessage: 'All elements of the array "dead" must be floats',
        }
    },
    recovered: {
        isArray: {
            options: { min: 1 },
            errorMessage: 'The field "recovered" must be an array with at least one element.',
        },
        custom: {
            options: (value, { req }) => {
                try {
                    return checkLength(value, req)
                } catch(error) {
                    console.error(error)
                    throw error
                }
            }
        }
    },
    'recovered.*': {
        isFloat: {
            errorMessage: 'All elements of the array "recovered" must be floats',
        }
    }
})