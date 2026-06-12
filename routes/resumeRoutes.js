const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.get('/latest', resumeController.getLatestResume);
router.post('/upload', upload.single('resume'), resumeController.uploadResume);
router.post('/analyze', upload.single('resume'), resumeController.uploadResume);
router.get('/', resumeController.getResumes);

module.exports = router;