const projectMemberController = require('../controllers/projectMemberController');
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, projectMemberController.acceptProjectInvitation);


module.exports = router;