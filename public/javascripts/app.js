var app = angular.module('app', ['app.filters', 'app.services', 'app.directives']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'partials/logs/index',
			controller: IndexCtrl
		})
		.when('/log/user/:username', {
			templateUrl: 'partials/logs/logs',
			controller: UserLogCtrl
		})
		.when('/log/project/:project', {
			templateUrl: 'partials/logs/logs',
			controller: ProjectLogCtrl
		})
		.otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);
});
