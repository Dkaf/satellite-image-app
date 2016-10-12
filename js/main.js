var assetsUrl = 'https://api.nasa.gov/planetary/earth/assets'
var imageUrl = 'https://api.nasa.gov/planetary/earth/imagery'
var nasaKey = 'API_KEY'
var assetResults = [];
var page = 1;
var lat = 0;
var long = 0;

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
	}
	for(i=start;i<=end;i++){
		var formatDate = moment(new Date(assetResults[i].date))
		$.ajax({
			method: "GET",
			url: imageUrl,
			data: {
				lat: lat,
				lon: long,
				date: formatDate.format('YYYY-MM-DD'),
				api_key: nasaKey
			},
			success: function(results){
				console.log(results);
				$('#nasa_images').append($("<img>", {"src":results.url}));
			}
		})
	}
}

function initMap() {
			 // Create a map object and specify the DOM element for display.
			 var map = new google.maps.Map(document.getElementById('map'), {
				 center: {lat: 41.882, lng: -87.623},
				 scrollwheel: true,
				 zoom: 8
			 });

			 var marker = new google.maps.Marker({
				 position: map.latLng,
				 map: map
			 })

			 map.addListener('click', function(e){

			 })

			 map.addListener('click', function(e) {
				 lat = e.latLng.lat;
				 long = e.latLng.lng;
				 console.log(e.latLng.toJSON());
				 $.ajax({
					method: "GET",
  			 		url: assetsUrl,
  					data: {
						lat: e.latLng.lat,
						lon: e.latLng.lng,
						// begin: startYear-01-01,
						// end: endYear-01-01,
						api_key: nasaKey
					},
					success: function(results){
						assetResults = results.results;
						console.log(results);
						fetchResults();
					}
				}).done(function() {
						console.log("complete")
				});
			 })

		 }
