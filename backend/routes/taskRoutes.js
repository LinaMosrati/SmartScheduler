const taskController = require('../controllers/taskController');
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, taskController.getTasks);
router.get('/:id', authenticateToken, taskController.getTask);
router.post('/', authenticateToken, taskController.createTask);
router.put('/:id', authenticateToken, taskController.updateTask);
router.delete('/:id', authenticateToken, taskController.deleteTask);

module.exports = router;