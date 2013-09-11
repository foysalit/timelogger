/*
 * GET home page.
 */
var log = require('./api/log');

exports.index = function(req, res){
	var user_logs = [];

	log.Model.getLog(null, function(ret){

		for(user in log.Users){
			var this_user = log.Users[user];
			user_logs[user.username] = new User(this_user.username, ret.logs);
		}
		res.render('index', { title: 'Dashboard', data: {user_data: user_logs}});

	});
};

var User = function(username, logs){
	this.username = username;
	this.logs = logs;
	var self = this;

	this.getHoursByProject = function(project){
		var matches = [];

		this.logs.map(function(log){
			if((self.username === log.username) && (project === log.project)){
				matches.push(log);
			}
		});

		return matches;
	};

};