var map = L.map('mapid').setView([37.768611, -122.490113], 16);

var firebase = new Firebase("https://rangerdavesradar.firebaseio.com/");

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 18,
	id: 'kdieu.0o991llo',
	accessToken: 'pk.eyJ1Ijoia2RpZXUiLCJhIjoiY2lxenJld3FjMDJtdmZ4a3F3Mnh4cjd5eCJ9.mjmM-iBez9Zt2tuRoa40bg'
}).addTo(map);

map.locate({setView:true});

var daveIcon = L.icon({
    iconUrl: 'daveicon.png',

    iconSize:     [38, 45], // size of the icon
    iconAnchor:   [19, 40], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

function onLocationFound(e) {
	console.log(e);
	var radius = e.accuracy / 2;
	console.log("Location");
	console.log(e);

	// L.marker(e.latlng, {icon: daveIcon}).addTo(map)
 //    		.bindPopup("You are within " + radius + " meters from this point").openPopup();
 	firebase.push({latLng: e.latlng}); //pushes to the firesbase
	// L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
	alert(e.message);
}

map.on('locationerror', onLocationError);

// function onMapClick(e) {
// 	L.marker(e.latlng, {icon: daveIcon}).addTo(map);
// }

// map.on('click', onMapClick);
var imageURL = './OSLMAP_burned.png',
	imageBounds = [[37.766152, -122.496683],[37.771037, -122.481465]];

L.imageOverlay(imageURL,imageBounds).addTo(map);

firebase.on("child_added", function(snapshot, prevChildKey) {
  // Get latitude and longitude from the cloud.
  var newPosition = snapshot.val();

  // Create a google.maps.LatLng object for the position of the marker.
  // A LatLng object literal (as above) could be used, but the heatmap
  // in the next step requires a google.maps.LatLng object.
  // var latLng = new google.maps.LatLng(newPosition.lat, newPosition.lng);

  // var newMarker = L.latLng(newPosition.lat, newPosition.lng);
  L.marker(newPosition.latLng, {icon: daveIcon}).addTo(map);
  L.circle(newPosition.latLng, radius).addTo(map);
});
