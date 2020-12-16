const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

exports.userSignup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      isAdmin: false
    });
    user.save().then((result) => {
      res.status(201).json({
        message: 'User Created!',
        result: result
      });
    }).catch(err => {
      res.status(500).json({
        message: "Could not create user."
      });
    });
  });
}

exports.userLogin = (req,res,next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result) {
      return res.status(401).json({
        message: "Invalid Password "
      });
    }
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser.id}, 'hG2]vX2<7@/47K5~JBH!wn', { expiresIn: "1h" });
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser.id
    });
  }).catch(err => {
    return res.status(401).json({
      message: "Error generating Token"
    });
  });
}
