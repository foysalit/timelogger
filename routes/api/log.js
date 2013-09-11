var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var Projects = [
		{id: 1, name: 'eventsitalia'},
		{id: 2, name: 'gestliste'},
		{id: 3, name: 'auronia'},
		{id: 4, name: 'viasat'},
		{id: 5, name: 'console'}
	],
	Users = [
		{username: 'alessandro', name: 'Alessandro Rovito'},
		{username: 'alessio', name: 'Alessio Ribero'},
		{username: 'diego', name: 'Diego Allegra'},
		{username: 'foysal', name: 'Foysal Ahamed'},
		{username: 'luigi', name: 'Luigi Leuce'},
		{username: 'paolo', name: 'Paolo Errico'},
		{username: 'riccardo', name: 'Riccardo D\'uggento'},
		{username: 'ugo', name: 'Ugo Reynaldi'}
	];

Model = {
	db : new Db('timelogger', new Server('localhost', 27017, {auto_reconnect: true}, {})),
	init : function(){
		this.db.open(function(){});
		return this;
	},
	getCollection : function(callback) {
		this.db.collection('logs', function(err, collection) {
			if( err ) 
				callback(err);
			else 
				callback(null, collection);
		});
	},
	insertLog: function(data, callback){
		this.getCollection(function(err, collection){
			if (err) {
				callback({status: false, error: err});
			}else{
				collection.insert(data, { safe: true }, function(err, entry){
					callback({status: true, entry: entry});
				});
			}
		});
	},
	getLog: function(param, callback){
		this.getCollection(function(err, collection){
			if(err){
				callback({status: false});
			}else{
				if(param){
					var logs = collection.find(param);
				}else{
					var logs = collection.find();
				}

				logs.toArray(function(err, docs){
					if(err){
						callback({status: false});
					}else{
						callback({status: true, logs: docs});
					}
				});
			}
		});
	}
};

Model.init();

exports.insert = function (req, callback) {
	Model.insertLog(req.body, callback);
};

exports.read_by_username = function (req, res) {
	Model.getLog({username: req.params.username}, function(ret){
		var data = {
			title: 'Logs of User - '+ req.params.username,
			logs: ret
		};
		res.render('logs/index', data);
	});
};


exports.read_by_project = function (req, res) {
	Model.getLog({project: req.params.project}, function(ret){
		var data = {
			title: 'Logs of Project - '+ req.params.project,
			logs: ret
		};
		res.render('logs/index', data);
	});
};

exports.read_all = function (req, res) {
	Model.getLog({project: req.params.project}, function(ret){
		var data = {
			title: 'Logs of Project - '+ req.params.project,
			logs: ret
		};
		console.log(ret);
		res.render('logs/index', data);
	});
};

exports.logger = function (req, res){
	res.render('logs/logger', { title: 'Loggity Log!', projects: Projects, users: Users });
};

exports.index = function (req, res){
	Model.getLog(null, function(ret){
		res.render('logs/index', { title: 'Loggity Log!', logs: ret });
	});
};

exports.Model = Model;
exports.Projects = Projects;
exports.Users = Users;
