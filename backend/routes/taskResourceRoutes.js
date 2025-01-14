const taskResourceController = require('../controllers/taskResourceController');
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, taskResourceController.getTaskResources);
router.get('/:id', authenticateToken, taskResourceController.getTaskResource);
router.post('/', authenticateToken, taskResourceController.createTaskResource);
router.delete('/:id', authenticateToken, taskResourceController.deleteTaskResource);

module.exports = router;