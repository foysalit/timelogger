/*
 * GET home page.
 */
var log = require('./api/log');

exports.index = function(req, res){
	var user_logs = [];

	log.Model.getLog(null, function(ret){

		for(user in log.Users){
			var this_user = log.Users[user];
			user_logs.push(new User(this_user.username, ret.logs));
		}

		var data = {
				title: 'Dashboard',
				user_data: user_logs,
				projects: log.Projects
			};

		res.render('index', data);

	});
};

var User = function(username, logs){
	this.username = username;
	this.logs = logs;
	var self = this;

	this.getHoursByProject = function(project){
		var total = 0;

		this.logs.map(function(log){
			if((self.username === log.username) && (project === log.project)){
				total += parseFloat(parseFloat(log.hours).toFixed(1));
			}
		});
		return total;
	};

};