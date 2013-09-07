var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

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
				callback({status: false});
			}else{
				collection.insert(data, { safe: true }, function(err, entry){
					console.log(entry);
					callback({status: true});
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

				logs.each(function(err, doc){
					if(!err){
						var from = new Date(doc.date+ ' ' +doc.from).getHours();
						var to = new Date(doc.date+ ' ' +doc.to).getHours();
						console.log([from, to, doc.from, doc.to]);
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
			log_data: ret
		};
		res.render('logs', data);
	});
};


exports.read_by_project = function (req, res) {
	Model.getLog({project: req.params.project}, function(ret){
		var data = {
			title: 'Logs of Project - '+ req.params.project,
			log_data: ret
		};
		res.render('logs', data);
	});
};
