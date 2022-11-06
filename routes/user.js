const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user-controller');
const article_controller = require('../controllers/article-controller');
const auth = require('../misc/auth');

router.post('/signin', user_controller.signin, (req, res) => {

});

router.post('/upload', auth.verify_token, article_controller.upload_file, article_controller.upload_data, (req, res) => {

});

module.exports = router;