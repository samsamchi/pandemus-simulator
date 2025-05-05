const asyncHandler = require('express-async-handler')
const prisma = require('../prisma')
const { Prisma } = require('../../generated/prisma')
const { validationResult, matchedData } = require('express-validator')
const queryIdValidator = require('../validators/queryIdValidator')

module.exports = [
    queryIdValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json( {error: errors.array()} )
        }

        try {
            const { id } = matchedData(req)
            const deleted = await prisma.simulation.delete({
                where: {
                    id: parseInt(id)
                }
            })
            return res.status(200).json({ deleted })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    return res.status(404).json({ error: 'Simulation does not exist'})
                }
            }
            console.error(e)
            return res.status(500).json({ error: "Internal server error" })
        }
    })
]