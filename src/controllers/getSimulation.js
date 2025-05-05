const asyncHandler = require('express-async-handler')
const prisma = require('../prisma')
const { validationResult, matchedData } = require('express-validator')
const queryIdValidator = require('../validators/queryIdValidator')

module.exports = [
    queryIdValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() })
        }

        const { id } = matchedData(req)

        const simulation = await prisma.simulation.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if (simulation) {
            return res.status(200).json({ simulation })
        }

        return res.status(404).json({ error: "Simulation not found" })
    })
]