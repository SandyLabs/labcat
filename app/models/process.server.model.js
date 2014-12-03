'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	mongooseTypes = require('sarhugo-mongoose-types'),
	Schema = mongoose.Schema;

mongooseTypes.loadTypes(mongoose);
var Url = mongoose.SchemaTypes.Url;

/**
 * Process Schema
 */
var ProcessSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Process name',
		trim: true
	},
    description: {
        type: String
    },
    lab: {
        type: Schema.ObjectId,
        ref: 'Lab'
    },
    specification: {
        type: Url
    },
    manager: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    trainers: {
        type: [Schema.ObjectId],
        ref: 'User'
    },
    users: {
        type: [Schema.ObjectId],
        ref: 'User'
    },
    equipment: {
        type: [Schema.ObjectId],
        ref: 'Equipment'
    },
    consumables: {
        type: [Schema.ObjectId],
        ref: 'Consumables'
    },
    status: {
        type: String,
        default: 'Ready',
        required: true
    },
	created: {
		type: Date,
		default: Date.now
	},
    lastUsed: {
        type: Date
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Process', ProcessSchema);