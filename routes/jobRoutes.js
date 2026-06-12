const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  moderateJob
} = require('../controllers/jobController');
const { protect, protectOptional, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protectOptional, getJobs)
  .post(protect, authorize('recruiter', 'admin'), createJob);

router.route('/:id')
  .get(protectOptional, getJob)
  .put(protect, authorize('recruiter', 'admin'), updateJob)
  .delete(protect, authorize('recruiter', 'admin'), deleteJob);

router.patch('/:id/moderate', protect, authorize('admin'), moderateJob);

module.exports = router;
