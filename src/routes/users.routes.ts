import {
  fetchAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#controllers/users.controller.js';
import { authenticateToken, requireRole } from '#middleware/auth.middleware.js';
import { Router } from 'express';

const router = Router();

// GET /users - Get all users (admin only)
router.get('/', authenticateToken, requireRole(['admin']), fetchAllUsers);

// GET /users/:id - Get user by ID (authenticated users only)
router.get('/:id', authenticateToken, getUserById);

// PUT /users/:id - Update user by ID (authenticated users only;
// controller enforces self-update vs admin behavior)
router.put('/:id', authenticateToken, updateUser);

// DELETE /users/:id - Delete user by ID (admin only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  deleteUser
);

export default router;
