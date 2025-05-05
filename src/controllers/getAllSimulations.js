const asyncHandler = require('express-async-handler')
const prisma = require('../prisma')

module.exports = (asyncHandler (async (req, res) => {
    const allSimulations = await prisma.simulation.findMany()
    return res.status(200).json({ simulations: allSimulations })
}))