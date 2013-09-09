/*
 * GET home page.
 */
var log = require('./api/log');

exports.index = function(req, res){
	log.Model.getLog(null, function(ret){
		console.log(ret.logs);
	});
	res.render('index', { title: 'Dashboard'});
};