const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  userValidationRules
} = require('../controllers/userController');

const router = express.Router();

// Public routes (for user registration)
router.post('/', userValidationRules, createUser);

// Protected routes
router.use(authenticateToken);

// Get current user profile
router.get('/me', getCurrentUser);

// Admin only routes
router.get('/', requireRole(['ADMIN']), getAllUsers);
router.get('/:id', requireRole(['ADMIN']), getUserById);
router.put('/:id', requireRole(['ADMIN']), userValidationRules, updateUser);
router.delete('/:id', requireRole(['ADMIN']), deleteUser);

module.exports = router; 