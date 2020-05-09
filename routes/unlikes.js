const express = require('express');
const router = express.Router();

const unlikesController = require('../controllers/unlike_controller');

router.post('/toggle-unlike', unlikesController.toggleUnlike);


module.exports = router;