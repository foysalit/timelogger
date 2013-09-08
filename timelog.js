Logs = new Meteor.Collection('TimeLogs');
Projects = new Meteor.Collection('Projects');

if(Meteor.isClient){
	Meteor.subscribe('Projects');
	Meteor.subscribe('Logs');

	Session.set('username', 'Foysal');
	Session.set('show_user_log', false);
	Session.set('show_project_log', false);

	Template.TimeInput.projects = function(){
		return Projects.find({}).fetch();
	};

	Template.TimeInput.events({
		'click #log_time': function(e, t){
			var data = {
				project  : document.getElementById('select_project').value,
				hours 	 : document.getElementById('input_hours').value,
				username : Session.get('username')
			};

			Logs.insert(data, function(err, _id){
				if(err)
					console.log('OMFG! kitties!'); 
			});
		}
	});


 	//logs table template
	Template.LogTable.logs = function(){
		var query = {};

		if(!Session.equals('show_user_log', false)){
			query.username = Session.get('show_user_log');
		}

		if(!Session.equals('show_project_log', false)){
			query.project = Session.get('show_project_log');
		}

		return Logs.find(query).fetch();
	};

	Template.LogTable.user = function(){
		return Session.get('show_user_log');
	};

	Template.LogTable.projects = function(){
		return Projects.find({}).fetch();
	};

	Template.LogTable.events({
		'click .username': function(e, t){
			Session.set('show_user_log', this.username);
		},
		'click .show-all-users': function(e, t){
			Session.set('show_user_log', false);
		},
		'change .select_project': function(e, t){
			console.log(e.target.value);
			if(e.target.value)
				Session.set('show_project_log', e.target.value);
			else
				Session.set('show_project_log', false);
		}
	});
}

if(Meteor.isServer){
	Meteor.startup(function(){
		//Projects.insert({name: 'Auronia'});
		//Projects.insert({name: 'EventsItalia'});
		//Projects.insert({name: 'Gestliste'});
		//Projects.remove({});

		Meteor.publish('Projects', function(){
			return Projects.find({});
		});

		Meteor.publish('Logs', function(){
			return Logs.find({});
		});
	});
}