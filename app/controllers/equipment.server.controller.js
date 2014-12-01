'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Equipment = mongoose.model('Equipment'),
	_ = require('lodash');

/**
 * Create a Equipment
 */
exports.create = function(req, res) {
	var equipment = new Equipment(req.body);
	equipment.user = req.user;

	equipment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(equipment);
		}
	});
};

/**
 * Show the current Equipment
 */
exports.read = function(req, res) {
	res.jsonp(req.equipment);
};

/**
 * Update a Equipment
 */
exports.update = function(req, res) {
	var equipment = req.equipment ;

	equipment = _.extend(equipment , req.body);

	equipment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(equipment);
		}
	});
};

/**
 * Delete an Equipment
 */
exports.delete = function(req, res) {
	var equipment = req.equipment ;

	equipment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(equipment);
		}
	});
};

/**
 * List of Equipment
 */
exports.list = function(req, res) { 
	Equipment.find().sort('-created').populate('user', 'displayName').exec(function(err, equipment) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(equipment);
		}
	});
};

/**
 * Equipment middleware
 */
exports.equipmentByID = function(req, res, next, id) { 
	Equipment.findById(id).populate('user', 'displayName').exec(function(err, equipment) {
		if (err) return next(err);
		if (! equipment) return next(new Error('Failed to load Equipment ' + id));
		req.equipment = equipment ;
		next();
	});
};

/**
 * Equipment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.equipment.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
