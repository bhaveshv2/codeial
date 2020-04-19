const express = require('express');
const router = express.Router();
const passport = require('passport');


const commentsController = require('../controllers/comments_controller');

router.post('/create',passport.checkAuthentication, commentsController.create);              //passport.checkAuthentication use for check that whether the user is signed in or not if not then not allowed to post the posts.
                                                                                          //(even when someone trying to edit the html and url).
router.get('/destroy/:id',passport.checkAuthentication, commentsController.destroy);


module.exports = router;