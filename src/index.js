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
 * @example Response
 * HTTP/1.1 200 OK
 * {
 *   "message": "Pandemus backend"
 * }
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
 * @example Request
 * {
 *   "name": "Minha Simulação",
 *   "days": 3,
 *   "infected": [10, 20, 30],
 *   "dead": [0, 1, 2],
 *   "recovered": [0, 5, 10]
 * }
 * @example Success Response
 * HTTP/1.1 201 Created
 * {
 *   "created": {
 *     "id": 1,
 *     "createdAt": "2023-08-25T12:34:56.789Z",
 *     "name": "Minha Simulação",
 *     "days": 3,
 *     "infected": [10, 20, 30],
 *     "dead": [0, 1, 2],
 *     "recovered": [0, 5, 10]
 *   }
 * }
 * @example Error Response (Validation)
 * HTTP/1.1 400 Bad Request
 * {
 *   "errors": [
 *     {
 *       "type": "field",
 *       "msg": "O campo infected é obrigatório",
 *       "path": "infected",
 *       "location": "body"
 *     }
 *   ]
 * }
 */
app.post("/api/simulation/create", createSimulation)

const getAllSimulations = require('./controllers/getAllSimulations')
/**
 * @route   GET /api/simulation/list
 * @desc    Retorna uma lista com todas as simulações cadastradas no banco de dados.
 * @access  Público
 * @example Success Response
 * HTTP/1.1 200 OK
 * {
 *   "simulations": [
 *     {
 *       "id": 1,
 *       "createdAt": "2023-08-25T12:34:56.789Z",
 *       "name": "Simulação A",
 *       "days": 3,
 *       "infected": [10, 20, 30],
 *       "dead": [0, 1, 2],
 *       "recovered": [0, 5, 10]
 *     },
 *     {
 *       "id": 2,
 *       "createdAt": "2023-08-25T13:00:00.000Z",
 *       "name": "Simulação B",
 *       "days": 3,
 *       "infected": [5, 15, 25],
 *       "dead": [0, 0, 1],
 *       "recovered": [2, 8, 15]
 *     }
 *   ]
 * }
 */
app.get("/api/simulation/list", getAllSimulations)

const getSimulation = require('./controllers/getSimulation')
/**
 * @route   GET /api/simulation/:id
 * @desc    Retorna uma simulação específica com base no ID passado como parâmetro.
 * @param   id - ID da simulação (int)
 * @access  Público
 * @example Success Response
 * HTTP/1.1 200 OK
 * {
 *   "simulation": {
 *     "id": 1,
 *     "createdAt": "2023-08-25T12:34:56.789Z",
 *     "name": "Simulação A",
 *     "days": 3,
 *     "infected": [10, 20, 30],
 *     "dead": [0, 1, 2],
 *     "recovered": [0, 5, 10]
 *   }
 * }
 * @example Error Response
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "Simulation not found"
 * }
 */
app.get("/api/simulation/:id", getSimulation)

const deleteSimulation = require('./controllers/deleteSimulation')
/**
 * @route   DELETE /api/simulation/:id/delete
 * @desc    Deleta uma simulação específica com base no ID passado como parâmetro.
 * @param   id - ID da simulação (int)
 * @access  Público
 * @example Success Response
 * HTTP/1.1 200 OK
 * {
 *   "deleted": {
 *     "id": 1,
 *     "createdAt": "2023-08-25T12:34:56.789Z",
 *     "name": "Simulação A",
 *     "days": 3,
 *     "infected": [10, 20, 30],
 *     "dead": [0, 1, 2],
 *     "recovered": [0, 5, 10]
 *   }
 * }
 * @example Error Response (Not Found)
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "Simulation does not exist"
 * }
 * @example Error Response (Server Error)
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "error": "Internal server error"
 * }
 */
app.delete("/api/simulation/:id/delete", deleteSimulation)

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
