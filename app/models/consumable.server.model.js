'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Consumable Schema
 */
var ConsumableSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Consumable name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Consumable', ConsumableSchema);