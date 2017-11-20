const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');

// Registrar
router.post('/register', (req, res, next) => {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});

	User.addUser(newUser, (err, user) => {
		if(err){
			res.json({success: false, msg:'Fallo al registrar ususario'});
		} else {
			res.json({success: true, msg:'Usuario Creado con Exito'});
		}
	});
});

router.get('/register', (req, res, next) => {
	res.send('Welcome to Register');
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	User.getUserByUsername(username, (err, user) => {
		if(err) throw err;
		if(!user){
			return res.json({success: false, msg: 'Usuario invalido'});
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if(err) throw err;
			if(isMatch){
				const token = jwt.sign({user: user}, config.secret); /*, {
					expiresIn: 604800 // una semana
				});*/

				res.json({
					success: true,
					token: 'JWT '+token,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				});
			} else {
				return res.json({success: false, msg: 'Contraseña incorrecta'});
			}
		});
	});
});

router.get('/authenticate', (req, res, next) => {
	res.send('Welcome to Authenticate');
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	res.json({user: req.user});
});

// Validate
router.get('/validate', (req, res, next) => {
	res.send('validate');
});

// My Address Ip
router.get('/myaddress', (req, res, next) => {
'use strict';
var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      return;
    }

    if (alias >= 1) {
      console.log(ifname + ':' + alias, iface.address);
      res.send('Su dirección ip local es: ' + iface.address);
    } else {
      console.log(ifname, iface.address);
      res.send('Su dirección ip local es: ' + iface.address);
    }
    ++alias;
  });
});
});

module.exports = router;