var express = require('express');
var router = express.Router();
var User = require('../models/users.js');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

router.post('/register', function (req, res) {
	console.log(req.files);
	var newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		avatar: req.files
	})
	User.getUserByUsername(newUser.username, function (err, user) {
		if (err) throw err;
		if (user) {
			res.json({
				success: false,
				msg: "Username Taken"
			});
		} else {
			User.addUser(newUser, function (err, user) {
				if (err) {
					console.log(err)
					res.json({
						success: false
					});
				} else {
					res.json({
						success: true
					});
				}
			})
		}
	})
})
router.post('/authentication', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	User.getUserByUsername(username, function (err, user) {
		if (err) {
			throw err;
		}
		if (!user) {
			return res.json({
				success: false,
				msg: "User Not Found"
			});
		}
		User.comparePassword(password, user.password, function (err, isMatch) {
			if (err) throw err;
			if (isMatch) {
				const token = jwt.sign(user, config.secret, {
					expiresIn: 640800
				})
				res.json({
					success: true,
					token: "JWT " + token,
					user: {
						id: user._id,
						name: user.name,
						email: user.email,
						username: user.username
					}
				})
			} else {

				return res.json({
					success: false,
					msg: "Wrong Credentials"
				});
			}
		});
	});
})
router.get('/profile', passport.authenticate('jwt', {
	session: false
}), function (req, res) {
	res.send({
		user: req.user
	});
})

module.exports = router;