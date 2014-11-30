'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Building = mongoose.model('Building'),
	_ = require('lodash');

/**
 * Create a Building
 */
exports.create = function(req, res) {
	var building = new Building(req.body);
	building.user = req.user;

	building.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(building);
		}
	});
};

/**
 * Show the current Building
 */
exports.read = function(req, res) {
	res.jsonp(req.building);
};

/**
 * Update a Building
 */
exports.update = function(req, res) {
	var building = req.building ;

	building = _.extend(building , req.body);

	building.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(building);
		}
	});
};

/**
 * Delete an Building
 */
exports.delete = function(req, res) {
	var building = req.building ;

	building.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(building);
		}
	});
};

/**
 * List of Buildings
 */
exports.list = function(req, res) { 
	Building.find().sort('-created').populate('user', 'displayName').exec(function(err, buildings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(buildings);
		}
	});
};

/**
 * Building middleware
 */
exports.buildingByID = function(req, res, next, id) { 
	Building.findById(id).populate('user', 'displayName').exec(function(err, building) {
		if (err) return next(err);
		if (! building) return next(new Error('Failed to load Building ' + id));
		req.building = building ;
		next();
	});
};

/**
 * Building authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.building.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
