var express = require('express');
var router = express.Router();
var User = require('../models/users.js');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

router.post('/register', function (req, res) {
	console.log(req.files);
	var newUser = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		mobileno:req.body.mobno,
		dob:req.body.dob
	}
	User.getUserByEmail(newUser.email, function (err, user) {
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
router.post('/login', function (req, res) {
	var email = req.body.email;
	var password = req.body.password;
	User.getUserByEmail(email, function (err, user) {
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
						mobileno: user.mobileno,
						dob:user.dob
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
router.get('/dashboard', passport.authenticate('jwt', {
	session: false
}), function (req, res) {
	res.send({
		user: req.user
	});
})

module.exports = router;