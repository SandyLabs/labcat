'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Consumable = mongoose.model('Consumable'),
	_ = require('lodash');

/**
 * Create a Consumable
 */
exports.create = function(req, res) {
	var consumable = new Consumable(req.body);
	consumable.user = req.user;

	consumable.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(consumable);
		}
	});
};

/**
 * Show the current Consumable
 */
exports.read = function(req, res) {
	res.jsonp(req.consumable);
};

/**
 * Update a Consumable
 */
exports.update = function(req, res) {
	var consumable = req.consumable ;

	consumable = _.extend(consumable , req.body);

	consumable.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(consumable);
		}
	});
};

/**
 * Delete an Consumable
 */
exports.delete = function(req, res) {
	var consumable = req.consumable ;

	consumable.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(consumable);
		}
	});
};

/**
 * List of Consumables
 */
exports.list = function(req, res) { 
	Consumable.find().sort('-created').populate('user', 'displayName').exec(function(err, consumables) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(consumables);
		}
	});
};

/**
 * Consumable middleware
 */
exports.consumableByID = function(req, res, next, id) { 
	Consumable.findById(id).populate('user', 'displayName').exec(function(err, consumable) {
		if (err) return next(err);
		if (! consumable) return next(new Error('Failed to load Consumable ' + id));
		req.consumable = consumable ;
		next();
	});
};

/**
 * Consumable authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.consumable.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
