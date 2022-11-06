const { nextTick } = require('process');
const Article = require('../models/article-model');

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

}

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
    query.exec((err, articles) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        
        res.status(200).send({articles: articles});
    });
};
