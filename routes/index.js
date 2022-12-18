const express = require('express');
const router = express.Router();
const article_controller = require('../controllers/article-controller');
const { route } = require('./user');

router.get('/articles', article_controller.get_articles, function(req, res, next) {
  
});

router.get('/patchnotes', article_controller.get_patchnotes, function(req, res, next) {
    
});

router.get('/videos', article_controller.get_videos, function(req, res, next) {
    
});

router.get('/articles/:id', article_controller.get_article, function(req, res, next) {

});

router.get('/patchnotes/:id', article_controller.get_patchnote, function(req, res, next) {

});

router.get('/videos/:id', article_controller.get_video, function(req, res, next) {

});

module.exports = router;
