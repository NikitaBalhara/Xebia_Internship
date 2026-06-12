const express = require('express');
const router = express.Router();
// Hamare controller se functions ko sahi tarike se call karne ke liye destructured syntax
const { applyJob, getApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getApplications)
  .post(protect, applyJob);

router.route('/:id/status').put(protect, updateApplicationStatus);

module.exports = router;