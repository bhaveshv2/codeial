const express = require('express');
const router = express.Router();

const likesController = require('../controllers/likes_controller');

router.post('/toggle-like', likesController.toggleLike);
router.post('/toggle-unlike',likesController.toggleUnlike);

module.exports = router;