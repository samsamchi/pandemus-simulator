const asyncHandler = require('express-async-handler')
const { validationResult, matchedData } = require('express-validator')
const prisma = require('../prisma')
const simulationValidator = require('../validators/simulationValidator')

const createSimulation = [
    simulationValidator,
    asyncHandler (async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const data = matchedData(req)
        const createdSimulation = await prisma.simulation.create({ data })

        return res.status(201).json({ created: createdSimulation })

    })
];

module.exports = createSimulation

