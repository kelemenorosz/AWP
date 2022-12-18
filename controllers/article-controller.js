const { nextTick } = require('process');
const Article = require('../models/article-model');
const Patchnote = require('../models/patchnote-model');
const Video = require('../models/video-model');
const { readFile } = require('fs/promises');

exports.upload_file =  async (req, res, next) => {

    if (!req.user) {
        res.status(401).send('Invalid JWT token.');
        return;
    }
    else {
        
        let article_file;
        let upload_path;
        let article_data;
        let article;

        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send('No files uploaded.');
            return;
        }

        article_file = req.files.article;
        upload_path = process.cwd() + '/public/articles/' + article_file.name;
        article_data = JSON.parse(req.body.data);


        article = new Article({
            title: article_data.title,
            description: article_data.description,
            filename: article_file.name,
            content: '',
            media_count: article_data.media_count
        });

        for (let i = 0; i < article_data.media_count; i++)
        {
            let media_file = req.files['media_file' + i];
            article.media[i] = {filename: media_file.name};
        }

        req.article = article;

        await article_file.mv(upload_path, (err) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
        });

        for (let i = 0; i < article_data.media_count; i++) {
            
            let media_file = req.files['media_file' + i];
            let media_upload_path = process.cwd() + '/public/images/' + media_file.name;

            await media_file.mv(media_upload_path, (err) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }
            });

        }

        next();

    }

};

exports.upload_data = (req, res) => {

    req.article.save((err, article) => {
         if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.status(200).send({message: 'File Uploaded.'});
    });

};

exports.upload_patchnote = async (req, res, next) => {

    if (!req.user) {
        res.status(401).send('Invalid JWT token.');
        return;
    }
    else {

        let patchnote_data;
        let patchnote;
        let media_file;
        let media_upload_path;

        patchnote_data = JSON.parse(req.body.data);

        patchnote = new Patchnote({
            title: patchnote_data.title,
            link: patchnote_data.link
        });

        media_file = req.files.media_file;
        media_upload_path = process.cwd() + '/public/images/patchnotes/' + media_file.name;

        patchnote.media[0] = {filename: media_file.name};

        await media_file.mv(media_upload_path, (err) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
        });

        patchnote.save((err, patchnote) => {
            if (err) {
               res.status(500).send({message: err});
               return;
           }
           res.status(200).send({message: 'Patchnote link uploaded.'});
       });

    }

};

exports.upload_video = async (req, res, next) => {

    if (!req.user) {
        res.status(401).send('Invalid JWT token.');
        return;
    }
    else {

        let video_data;
        let video;
        let media_file;
        let media_upload_path;

        video_data = JSON.parse(req.body.data);

        video = new Video({
            title: video_data.title,
            link: video_data.link
        });

        media_file = req.files.media_file;
        media_upload_path = process.cwd() + '/public/images/videos/' + media_file.name;

        video.media[0] = {filename: media_file.name};

        await media_file.mv(media_upload_path, (err) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
        });

        video.save((err, video) => {
            if (err) {
               res.status(500).send({message: err});
               return;
           }
           res.status(200).send({message: 'Video link uploaded.'});
       });

    }

};

exports.get_articles = (req, res, next) => {

    var query = Article.find({}).select('title description content filename media _id');
    query.exec((err, articles) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        
        res.status(200).send({articles: articles});
    });

};

exports.get_article = (req, res, next) => {
    var query = Article.findOne({_id: req.params.id}).select('title description content filename media _id');
    query.exec(async (err, articles) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        
        let file_content = await readFile(process.cwd() + '/public/articles/' + articles.filename, 'utf8');
        file_content = file_content.toString();
        file_content = file_content.replace(/(\r\n|\n|\r)/gm, "");

        let file_content_length = file_content.length;

        file_content_to_get = [];

        if (file_content.split('.').length - 1 > 2) {
            file_content_to_get[0] = file_content.slice(0, file_content.indexOf('.', file_content_length / 3) + 1);
            file_content_to_get[1] = file_content.slice(file_content.indexOf('.', file_content_length / 3) + 1, file_content.indexOf('.', 2 * (file_content_length / 3)) + 1);
            file_content_to_get[2] = file_content.slice(file_content.indexOf('.', 2 * (file_content_length / 3)) + 1, file_content_length);
        }
        else {
            file_content_to_get[0] = file_content;
            file_content_to_get[1] = '';
            file_content_to_get[2] = '';

            console.log(file_content_to_get);
        }
        
        res.status(200).send({articles: articles, file_content: file_content_to_get});

    });
};

exports.get_patchnotes = (req, res, next) => {

    var query = Patchnote.find({}).select('title link media _id');
    query.exec((err, patchnotes) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        
        res.status(200).send({patchnotes: patchnotes});
    });

};

exports.get_patchnote = (req, res, next) => {

    var query = Patchnote.findOne({_id: req.params.id}).select('title link media _id');

    query.exec((err, patchnote) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        res.status(200).send({patchnote: patchnote});
    });

};

exports.get_videos = (req, res, next) => {

    var query = Video.find({}).select('title link media _id');
    query.exec((err, videos) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        
        res.status(200).send({videos: videos});
    });

};

exports.get_video = (req, res, next) => {

    var query = Video.findOne({_id: req.params.id}).select('title link media _id');

    query.exec((err, video) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        res.status(200).send({video: video});
    });

};