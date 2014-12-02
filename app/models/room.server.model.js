'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	mongooseTypes = require('sarhugo-mongoose-types');
var Schema = mongoose.Schema;

mongooseTypes.loadTypes(mongoose);
var Url = mongoose.SchemaTypes.Url;

/**
 * Room Schema
 */
var RoomSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Room name',
		trim: true
	},
	building: {
		type: Schema.ObjectId,
		ref: 'Building'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	manager: {
		type: Schema.ObjectId,
		ref: 'User'
	}
},{ collection : 'rooms', discriminatorKey : '_type' });

var StoreSchema = RoomSchema.extend({
});

var LabSchema = RoomSchema.extend({
	riskAssessment: {
		type: Url
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
		trim: true
	}
});

mongoose.model('Room', RoomSchema);
mongoose.model('Store', StoreSchema);
mongoose.model('Lab', LabSchema);
