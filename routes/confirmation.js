var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Token = require('../models/token');

/* GET home page. */
router.get('/:token', (req, res, next) => {
  res.render('confirmation', { title: 'E-Commerce || Confirm', token: req.params.token});
  console.log(req.params.token);
});

router.post('/confirmation', (req, res, next) =>{
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('token', 'Token cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var email = req.body.email;
  var token = req.params.token;

  console.log(token);

  if(!email || !token)
  {
    res. send({message:'Confirmation Error'})
  }
  else
  {
    // Find a matching token
  Token.findOne({ token: req.params.token }, function (err, token) {
    if (!token) return res.status(400).send({ msg: 'We were unable to find a valid token. Your token may have expired.' });

    // If we found a token, find a matching user
    User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This user has already been verified.' });

        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send("The account has been verified. Please log in.");
        });
    });
});
  }

})

module.exports = router;