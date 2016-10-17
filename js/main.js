var assetsUrl = 'https://api.nasa.gov/planetary/earth/assets'
var imageUrl = 'https://api.nasa.gov/planetary/earth/imagery'
var nasaKey = 'IIbcHBMlLJD6P8iqkyVoxNB4LDT9yt7h9rz5OPUy'
var assetResults = [];
var page = 1;
var lat = 0;
var long = 0;
var markers = [];
var images = [];

$(document).ready(function(){
	$('#pageForward').on('click', function(){
		page += 1;
		fetchResults();
	})
	$('#pageBack').on('click', function(){
		page -= 1;
		fetchResults();
	})
})
var fetchResults = function(){
	var end = (page * 10) - 1;
	var start = end - 9;
	$('.pageButton').show();
	if (end > assetResults.length - 1) {
		end = assetResults.length - 1;
		$('#pageForward').prop('disabled', true)
	} else {
		$('#pageForward').prop('disabled', false)
	}
	if(page == 1){
		$('#pageBack').prop('disabled', true)
	} else {
		$('#pageBack').prop('disabled', false)
	}
	$('#nasa_images').empty();
}

function initMap() {
			 // Create a map object and specify the DOM element for display.
			 var map = new google.maps.Map(document.getElementById('map'), {
				 center: {lat: 41.882, lng: -87.623},
				 scrollwheel: true,
				 zoom: 8
			 });


			 map.addListener('click', function(e){
				 if(markers.length != 0){
					deleteMarkers();
				 }
				 addMarker(e.latLng);
				 lat = e.latLng.lat;
				 long = e.latLng.lng;
			 })

			 $('#submit_button').on('click', function() {
				 console.log($('#startYear').val());
				 //for each: push promise
				 //promise.all
				 $.ajax({
					method: "GET",
  			 		url: assetsUrl,
  					data: {
						lat: lat,
						lon: long,
						begin: $('#startYear').val(),
						end: $('#endYear').val(),
						api_key: nasaKey
					},
					success: function(results){
						assetResults = results.results;
						console.log(results.results);
						var imgPromises = assetResults.forEach(new Promise(function(resolve, reject) {
							for(i=start;i<=end;i++){
								var formatDate = moment(new Date(assetResults[i].date))
								$.ajax({
									method: "GET",
									url: imageUrl,
									data: {
										lat: lat,
										lon: long,
										date: formatDate.format('YYYY-MM-DD'),
										cloud_score: true,
										api_key: nasaKey
									},
									success: function(results){
										console.log(results);
										if(results.cloud_score < .7){
											images.push(results);
										}
									}
								})
							}
						}));
						imgPromises.then(console.log(results));
					}
				}).done(function() {
						console.log("complete")
				});
			 })

			 function addMarker(location) {
	   	 		var marker = new google.maps.Marker({
	 				position: location,
	 				map: map
	   			});
	   			markers.push(marker);
	 		}

	 		function clearMarkers() {
	   			marker.setMap(null);
	 		};

	 		function deleteMarkers() {
	   			clearMarkers();
	   			markers = [];
	 		};


		 }
