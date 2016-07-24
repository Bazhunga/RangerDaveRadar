var map = L.map('mapid').setView([37.768611, -122.490113], 16);
var currLocation;

var firebase = new Firebase("https://rangerdavesradar.firebaseio.com/");
firebase.remove();

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
	console.log("Location on start up: ");
	console.log(e); //prints out the locaition
	L.circle(e.latlng, radius).addTo(map); //add an initial circle to the current location of the user
	currLocation = e;
}

map.on('locationfound', onLocationFound); //locates the user's location on start up

function onLocationError(e) { //any errors that occur with getting the user's location
	alert(e.message);
}

map.on('locationerror', onLocationError);

var imageURL = './OSLMAP_burned.png', //adds the Outside Lands map overlay
	imageBounds = [[37.766152, -122.496683],[37.771037, -122.481465]];
L.imageOverlay(imageURL,imageBounds).addTo(map);

$('#alert-btn').click(function(){ //event for when they click the button to drop a pin to their location
	map.locate({setView:true}); 
    map.on('locationfound', onLocationFound); //locates the user's location on start up
    console.log(currLocation);
	firebase.push({latLng: currLocation.latlng}); //pushes to the firebase
});

firebase.on("child_added", function(snapshot, prevChildKey) { //listener when soemthing is pushed to firebase
  var newPosition = snapshot.val();
  console.log(snapshot);
  var marker = L.marker(newPosition.latLng, {icon: daveIcon}); //adds that icon to the map
  map.addLayer(marker)
});

firebase.on("child_removed", function(oldChildSnapshot){
	console.log(oldChildSnapshot.val());
	var deleteMarker = snapshot.val().latLng;

	map.eachLayer(function (layer) {
		var layerLng = layer._latlng;
	   if(layerLng.lat == deleteMarker.lat && layerLng.lng == deleteMarker.lng){
	   		map.removeLayer(layer);
	   }
	});
});
