const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// Middleware para parsing de JSON
router.use(express.json());

// Rotas CRUD para usuários
router.get('/', getAllUsers);           // GET /users - Listar todos
router.get('/:id', getUserById);        // GET /users/:id - Buscar por ID
router.post('/', createUser);           // POST /users - Criar novo
router.put('/:id', updateUser);         // PUT /users/:id - Atualizar
router.delete('/:id', deleteUser);      // DELETE /users/:id - Deletar

module.exports = router; 