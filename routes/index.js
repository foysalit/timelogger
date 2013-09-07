
/*
 * GET home page.
 */

exports.index = function(req, res){
	var projects = [
		{id: 1, name: 'eventsitalia'},
		{id: 2, name: 'gestliste'},
		{id: 3, name: 'auronia'},
		{id: 4, name: 'viasat'},
		{id: 5, name: 'console'}
	];
	res.render('index', { title: 'Loggity Log!', projects: projects });
};