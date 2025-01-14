const subTaskController = require('../controllers/subTaskController');
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, subTaskController.getSubTasks);
router.get('/:id', authenticateToken, subTaskController.getSubTask);
router.post('/task/:taskId', authenticateToken, subTaskController.createSubTask);
router.put('/:id', authenticateToken, subTaskController.updateSubTask);
router.delete('/:id', authenticateToken, subTaskController.deleteSubTask);

module.exports = router;