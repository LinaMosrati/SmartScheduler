const ResourceController = require('../controllers/resourceController');
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, ResourceController.getResources);
router.get('/:id', authenticateToken, ResourceController.getResource);
router.post('/', authenticateToken, ResourceController.createResource);
router.put('/:id', authenticateToken, ResourceController.updateResource);
router.delete('/:id', authenticateToken, ResourceController.deleteResource);

module.exports = router;