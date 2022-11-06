const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/user-model');

exports.signin = (req, res) => {

    User.findOne({
        email: req.body.email
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
        
        var password_is_valid = bcrypt.compareSync(req.body.password, user.password);

        if (!password_is_valid) {
            res.status(401).send({message: 'Invalid password.', accessToken: null});
            return;
        }
        
        //Change string to constant variable
        var token = jsonwebtoken.sign({ id: user._id }, 'Sign String', { expiresIn: 86400 });
        res.status(200).send({message: 'Singin Successful.', accessToken: token});
    });

};