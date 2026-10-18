const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const authMiddleware = require('../middleware/auth');

router.post('/import', videoController.importVideo);
router.get('/search', videoController.searchVideos);
router.get('/top', videoController.getTopVideos);
router.get('/:youtubeId', videoController.getVideoByYoutubeId);

module.exports = router;
