var lat = 0;
var long = 0;
var assetsUrl = 'https://infinite-caverns-45871.herokuapp.com/assets/'
var imageUrl = 'https://infinite-caverns-45871.herokuapp.com/images/'
var assetResults = [];
var page = 1;
var markers = [];
var start = 0;
var end = 0;

$(document).ready(function(){
	$('#pageForward').on('click', function(){
		$('#nasa_images img').remove();
		page += 1;
		fetchResults();
	})
	$('#pageBack').on('click', function(){
		$('#nasa_images img').remove();
		page -= 1;
		fetchResults();
	})
})
var fetchResults = function(){
 	end = (page * 10) - 1;
	start = end - 9;
	$('.pageButton').show();
	if (end > assetResults.length - 1) {
		end = assetResults.length - 1;
	}
	for(i=start;i<=end;i++){
		var formatDate = moment(new Date(assetResults[i].date))
		$.ajax({
			method: "GET",
			url: imageUrl + lat + "/" + long + "/" + formatDate.format('YYYY-MM-DD'),
			success: function(results){
				$('#nasa_images').append($("<img>", {"src":results.url, "class":"satellite_img"}));
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

			 function removeMarkers() {
				 for(i=0; i<markers.length; i++) {
					 markers[i].setMap(null);
				 }
			 }


			 map.addListener('click', function(e){
				 removeMarkers();
				 markers = [];
				 var marker = new google.maps.Marker({
					 position: e.latLng,
					 map: map
				 })
				 markers.push(marker);
			 })

			 map.addListener('click', function(e) {
				 lat = e.latLng.lat();
				 long = e.latLng.lng();
			 })

		 }

$("#submit_button").on('click', function(e) {
	e.preventDefault()
	$.ajax({
	   method: "GET",
	   url: assetsUrl + lat + "/" + long,
	   success: function(results){
		   assetResults = results;
		   fetchResults();
	   }
   }).done(function() {
		   console.log("complete")
   });
})
