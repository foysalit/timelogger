$(function(){
	var SOCKET = io.connect('http://localhost');

	if($('.logger-page').length > 0){
		var date_input = $('.datepicker').pickadate(),
			date_picker = date_input.pickadate('picker');

		var from_input = $('.timepicker.from').pickatime(),
	    	from_picker = from_input.pickatime('picker')

		var to_input = $('.timepicker.to').pickatime({
		        formatLabel: function( timeObject ) {
		            var minObject = this.get( 'min' ),
		                hours = timeObject.hour - minObject.hour,
		                mins = ( timeObject.mins - minObject.mins ) / 60,
		                pluralize = function( number, word ) {
		                    return number + ' ' + ( number === 1 ? word : word + 's' )
		                },
		                diff = hours + mins;

		            return '<b>H</b>:i <!i>a</!i> <sm!all>(' + pluralize( diff, '!hour' ) + ')</sm!all>'
		        }
		    }),
		    to_picker = to_input.pickatime('picker');


		// Check if there’s a “from” or “to” time to start with.
		if ( from_picker.get('value') ) {
			to_picker.set('min', from_picker.get('select'));
		}
		if ( to_picker.get('value') ) {
			from_picker.set('max', to_picker.get('select'));
		}

		// When something is selected, update the “from” and “to” limits.
		from_picker.on('set', function(event) {
			if ( event.select ) {
				to_picker.set('min', from_picker.get('select'));
			}
		});

		to_picker.on('set', function(event) {
			if ( event.select ) {
				from_picker.set('max', to_picker.get('select'));
			}
		});


		var insert_log_form = $('#insert_log_form');

		insert_log_form.on('click', 'input[type="submit"]', function(e){
			e.preventDefault();

			var day = date_picker.get('value'),
				from = moment(day+ ' ' +from_picker.get('value')),
				to = moment(day+ ' ' +to_picker.get('value')),
				half = (to.diff(from, 'minutes')%60 === 30) ? 0.5 : 0,
				hours = to.diff(from, 'hours') + half,
				input_hours = {name: 'hours', value: hours},
				form_data = insert_log_form.serializeArray();

			form_data.push(input_hours);
			var insert = $.ajax({
					'url'		: '/api/log/insert/',
					'type'		: 'POST',
					'data'		: form_data,
					'dataType' 	: 'json'
				});

			insert.done(function(ret){
				if(ret.status === true){
					SOCKET.emit('logged', ret.entry);
				}else{
					SOCKET.emit('error', ret.error);
				}
			});

			insert.fail(function(){
				alert('OMFG! the ajax has fallen. the world is gonna end!');
			});
		});
	}

	SOCKET.on('user_logged_time', function(data){
		if($('.dashboard').length > 0){
			$('.dashboard')
				.append(data.username+ 'just logged '+ data.hours +' hours');
			console.log(data);
		}
	});
});
