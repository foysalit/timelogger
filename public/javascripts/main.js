$(function(){
	var SOCKET = io.connect('http://localhost');

	$('.datepicker').pickadate();

	var from_$input = $('.timepicker.from').pickatime(),
    	from_picker = from_$input.pickatime('picker')

	var to_$input = $('.timepicker.to').pickatime({
	        formatLabel: function( timeObject ) {
	            var minObject = this.get( 'min' ),
	                hours = timeObject.hour - minObject.hour,
	                mins = ( timeObject.mins - minObject.mins ) / 60,
	                pluralize = function( number, word ) {
	                    return number + ' ' + ( number === 1 ? word : word + 's' )
	                },
	                diff = hours + mins;

	            return '<b>H</b>:i <!i>a</!i> <sm!all d!at!a!-!hour!s="' +diff+ '">(' + pluralize( diff, '!hour' ) + ')</sm!all>'
	        }
	    }),
	    to_picker = to_$input.pickatime('picker')


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

		var form_data = insert_log_form.serializeArray(),
			insert = $.ajax({
				'url'		: '/api/log/insert/',
				'type'		: 'POST',
				'data'		: form_data,
				'dataType' 	: 'json'
			});

		insert.done(function(ret){
			console.log(ret);
			SOCKET.emit('logged', form_data);
		});

		insert.fail(function(){
			alert('OMFG! the ajax has fallen. the world is gonna end!');
		});
	});

	SOCKET.on('logged', function(data){
		console.log([data, 'yay logged!']);
	});
});
