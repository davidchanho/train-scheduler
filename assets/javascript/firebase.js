$(document).ready(function() {
	const firebaseConfig = {
		apiKey: 'AIzaSyAGNY3qOarnA3AYsi6n7PeK0OcuIBUm_CM',
		authDomain: 'sublime-sunspot-240701.firebaseapp.com',
		databaseURL: 'https://sublime-sunspot-240701.firebaseio.com',
		projectId: 'sublime-sunspot-240701',
		storageBucket: 'sublime-sunspot-240701.appspot.com',
		messagingSenderId: '598985448061',
		appId: '1:598985448061:web:58975e4bb32efdf4d72f14'
	};

	firebase.initializeApp(firebaseConfig);

	var database = firebase.database();

	var name = '';
	var dest = '';
	var freq = '';
	var first = '';

	$('#submit-btn').on('click', function(event) {
		event.preventDefault();

		var name = $('#train-name')
			.val()
			.trim();

		var dest = $('#train-dest')
			.val()
			.trim();

		var freq = $('#train-freq')
			.val()
			.trim();

		var first = $('#train-first')
			.val()
			.trim();

		var trainObj = {
			name: name,
			dest: dest,
			freq: freq,
			first: first
		};

		database.ref().push(trainObj);

		$('#train-form')[0].reset();
	});

	database.ref().on(
		'child_added',
		function(childSnapshot) {
			var first = childSnapshot.val().first;

			var freq = childSnapshot.val().freq;

			var firstConverted = moment(first, 'HH:mm').subtract(1, 'years');

			var currentTime = moment();
			console.log('CURRENT TIME: ' + moment(currentTime).format('hh:mm'));

			var diffTime = moment().diff(moment(firstConverted), 'minutes');

			var tRemainder = diffTime % freq;

			var tMinutesTillTrain = freq - tRemainder;

			var nextTrain = moment().add(tMinutesTillTrain, 'minutes');
			nextTrain = moment(nextTrain).format('hh:mm');
			$('#train-submit').append(
				`<tr>
					<td class="name-disp">${childSnapshot.val().name}</td>
					<td class="dest-disp">${childSnapshot.val().dest}</td>
					<td class="freq-disp">${childSnapshot.val().freq}</td>
					<td class="next-disp">${nextTrain}</td>
					<td class="mins-disp">${tMinutesTillTrain}</td>
					<td><a class="waves-effect waves-light btn-small blue update-btn">Update</a></td>
					<td><a class="waves-effect waves-light btn-small red delete-btn">Delete</a></td>
				</tr>`
			);
			var timed = setInterval(function () {
				$('.mins-disp').text(`${tMinutesTillTrain}`);
			}, 60000);
		},
		function(errorObject) {
			console.log('The read failed: ' + errorObject.code);
		}
	);

	database
		.ref()
		.orderByChild('dateAdded')
		.limitToLast(1)
		.on('child_added', function(snapshot) {
			$('#train-name').text(snapshot.val().name);
			$('#train-dest').text(snapshot.val().dest);
			$('#train-freq').text(snapshot.val().freq);
		});


});
