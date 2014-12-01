'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Process = mongoose.model('Process'),
	_ = require('lodash');

/**
 * Create a Process
 */
exports.create = function(req, res) {
	var process = new Process(req.body);
	process.user = req.user;

	process.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(process);
		}
	});
};

/**
 * Show the current Process
 */
exports.read = function(req, res) {
	res.jsonp(req.process);
};

/**
 * Update a Process
 */
exports.update = function(req, res) {
	var process = req.process ;

	process = _.extend(process , req.body);

	process.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(process);
		}
	});
};

/**
 * Delete an Process
 */
exports.delete = function(req, res) {
	var process = req.process ;

	process.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(process);
		}
	});
};

/**
 * List of Processes
 */
exports.list = function(req, res) { 
	Process.find().sort('-created').populate('user', 'displayName').exec(function(err, processes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(processes);
		}
	});
};

/**
 * Process middleware
 */
exports.processByID = function(req, res, next, id) { 
	Process.findById(id).populate('user', 'displayName').exec(function(err, process) {
		if (err) return next(err);
		if (! process) return next(new Error('Failed to load Process ' + id));
		req.process = process ;
		next();
	});
};

/**
 * Process authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.process.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
