$(function(){
	var SOCKET = io.connect('http://localhost');
	var log_row	= '<div class="log-item group"><div class="username">{[]}</div><div class="project">{[]}</div><div class="from">{[]}</div><div class="to">{[]}</div><div class="date">{[]}</div></div>';

	$('select[name="username"]').dropdown({
		gutter : 5,
		delay : 100,
		random : true
	});
	$('select[name="project"]').dropdown({
		gutter : 5,
		delay : 100,
		random : true
	});

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


		var insert_log_form = $('#insert_log_form'),
			insert_log_form_message_container = insert_log_form.next('.form-submission-message');

		insert_log_form.on('submit', function(){
			return false;
		});

		insert_log_form.on('click', '.btn-primary', function(e){
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
					insert_log_form_message_container
						.removeClass('error')
                        .addClass('success')
                        .html('Done! To add more just edit the data and submit again.');
					SOCKET.emit('logged', ret.entry);
				}else{
                    insert_log_form_message_container
                        .removeClass('success')
                        .addClass('error')
                        .html('Error occured :(');
					SOCKET.emit('error', ret.error);
				}
			});

			insert.fail(function(){
				alert('OMFG! the ajax has fallen. the world is gonna end!');
			});
		});
	}


    var notifications = $('.notifications');
    notifications.on('click', '.icon-remove', function(e){
        $(this).closest('.notification-item').fadeOut('slow', function() {
            $(this).remove();
        });
    });

	SOCKET.on('user_logged_time', function(data){
		if(notifications.length > 0){
            var notification = '<div class="notification-item">'+
                    '<i class="icon-remove"></i>'+
                    '<a href="/logs/user/'+ data.username +'">'+
                    data.username +
                    '</a>'+
                    ' just logged ' +
                    data.hours +
                    ' hours' +
                    ' on project: ' +
                    '<a href="/logs/project/'+ data.project +'">'+
                    data.project+
                    '</a>';

			notifications.append(notification);

			console.log(data, notification);
		}
	});
});
