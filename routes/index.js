const express = require('express');
const router = express.Router();
const article_controller = require('../controllers/article-controller');
const { route } = require('./user');

router.get('/', article_controller.get_articles, function(req, res, next) {
  
});

router.get('/:id', article_controller.get_article, function(req, res, next) {

});

module.exports = router;
