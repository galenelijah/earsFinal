const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const progressController = require('../controllers/progressController');

// Base route is /progress

// Render progress page
router.get('/', protect, progressController.renderProgressPage);

// API routes
router.get('/api/my-progress', protect, progressController.getUserProgress);
router.get('/api/module/:moduleId', protect, progressController.getModuleProgress);
router.post('/api/module/:moduleId/progress', protect, progressController.updateModuleProgress);
router.post('/api/module/:moduleId/complete', protect, progressController.completeModule);

module.exports = router; 