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
 * Equipment Schema
 */
var EquipmentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Equipment name',
		trim: true
	},
    description: {
        type: String
    },
    location: {
        type: Schema.ObjectId,
        ref: 'Room'
    },
    documentation: {
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

mongoose.model('Equipment', EquipmentSchema);