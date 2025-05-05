const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// API URL: http://localhost:3000/api
// db port: 5432

/**
 * @route   GET /api
 * @desc    Endpoint base para verificar se o backend está rodando corretamente.
 * @access  Público
 */
app.get("/api", async (req, res) => {
  return res.status(200).json({ message: "Pandemus backend" })
});

const createSimulation = require('./controllers/createSimulation')
/**
 * @route   POST /api/simulation/create
 * @desc    Cria uma nova simulação com os dados fornecidos (name, days, infected, dead, recovered).
 * @body    { name?: string, days?: number, infected: number[], dead: number[], recovered: number[] }
 * @access  Público
 */
app.post("/api/simulation/create", createSimulation)

const getAllSimulations = require('./controllers/getAllSimulations')
/**
 * @route   GET /api/simulation/list
 * @desc    Retorna uma lista com todas as simulações cadastradas no banco de dados.
 * @access  Público
 */
app.get("/api/simulation/list", getAllSimulations)

const getSimulation = require('./controllers/getSimulation')
/**
 * @route   GET /api/simulation/:id
 * @desc    Retorna uma simulação específica com base no ID passado como parâmetro.
 * @param   id - ID da simulação (int)
 * @access  Público
 */
app.get("/api/simulation/:id", getSimulation)

const deleteSimulation = require('./controllers/deleteSimulation')
/**
 * @route   DELETE /api/simulation/:id/delete
 * @desc    Deleta uma simulação específica com base no ID passado como parâmetro.
 * @param   id - ID da simulação (int)
 * @access  Público
 */
app.delete("/api/simulation/:id/delete", deleteSimulation)

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
