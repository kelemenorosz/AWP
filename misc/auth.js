const User = require('../models/user-model');
const jsonwebtoken = require('jsonwebtoken');

exports.verify_token = (req, res, next) => {
    if (req.headers && req.headers.token && req.headers.token.split(' ')[0] == 'JWT') {
        jsonwebtoken.verify(req.headers.token.split(' ')[1], 'Sign String', (err, decode) => {
            if (err) {
                req.user = undefined;
                next();
            }
            
            User.findOne({
                _id: decode.id
            })
            .exec((err, user) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                } 
                if (!user) {
                    res.status(404).send({message: 'User not found.'});
                    return;
                }
                req.user = user;
                next();
            });

        });
    }
    else {
        res.status(505).send({message: "Curl incorrect."});
    }
};