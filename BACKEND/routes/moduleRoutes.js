const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Assuming auth middleware
const moduleController = require('../controllers/moduleController');

// Route to display a specific module
// Example: GET /module/605c724f5ae5e42b045e8e7c
router.get('/:moduleId', protect, moduleController.renderModulePage);

module.exports = router; 