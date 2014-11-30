'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Lab = mongoose.model('Lab'),
	_ = require('lodash');

/**
 * Create a Lab
 */
exports.create = function(req, res) {
	var lab = new Lab(req.body);
	lab.user = req.user;

	lab.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(lab);
		}
	});
};

/**
 * Show the current Lab
 */
exports.read = function(req, res) {
	res.jsonp(req.lab);
};

/**
 * Update a Lab
 */
exports.update = function(req, res) {
	var lab = req.lab ;

	lab = _.extend(lab , req.body);

	lab.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(lab);
		}
	});
};

/**
 * Delete an Lab
 */
exports.delete = function(req, res) {
	var lab = req.lab ;

	lab.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(lab);
		}
	});
};

/**
 * List of Labs
 */
exports.list = function(req, res) { 
	Lab.find().sort('-created').populate('user', 'displayName').exec(function(err, labs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(labs);
		}
	});
};

/**
 * Lab middleware
 */
exports.labByID = function(req, res, next, id) { 
	Lab.findById(id).populate('user', 'displayName').exec(function(err, lab) {
		if (err) return next(err);
		if (! lab) return next(new Error('Failed to load Lab ' + id));
		req.lab = lab ;
		next();
	});
};

/**
 * Lab authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.lab.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
