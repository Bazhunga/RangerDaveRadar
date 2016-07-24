var map = L.map('mapid').setView([37.768611, -122.490113], 16);
var currLocation;
var ggPark = L.latLng(37.769358, -122.48816);

var firebase = new Firebase("https://rangerdavesradar.firebaseio.com/");
firebase.remove();

var mapBox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
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

var medicalIcon = L.icon({
    iconUrl: 'firstaidicon.png',
    iconSize:	  [38, 45]
});

var waterIcon = L.icon({
	iconUrl: 'water_drop.png',
	iconSize:     [38, 45]
});
var imageURL = './OSLMAP_burned.png',
	imageBounds = [[37.766152, -122.496683],[37.771037, -122.481465]];
L.imageOverlay(imageURL,imageBounds).addTo(map);

// medical tent markers added to the map
var med_tent = L.marker([37.76964190906794, -122.48454988002779], {icon: medicalIcon}).bindPopup("Medical Tent"),
	med_tent1 = L.marker([37.768429126623694, -122.48832643032074], {icon: medicalIcon}).bindPopup("Medical Tent"),
	med_tent2 = L.marker([37.76843336715642, -122.49416828155519], {icon: medicalIcon}).bindPopup("Medical Tent"),
	med_tent3 = L.marker([37.766665043925734, -122.49277353286745], {icon:medicalIcon}).bindPopup("Medical Tent");

var medical_tents = L.layerGroup([med_tent, med_tent1, med_tent2, med_tent3]);
medical_tents.addTo(map);


// water station markers added to the map
var water_st = L.marker([37.7677336759695, -122.49194204807283], {icon: waterIcon}).bindPopup("Water Station"),
	water_st1 = L.marker([37.76897191283392, -122.49256432056428], {icon: waterIcon}).bindPopup("Water Station"),
	water_st2 = L.marker([37.7696546304567, -122.48497366905214], {icon: waterIcon}).bindPopup("Water Station");

var water_stations = L.layerGroup([water_st, water_st1, water_st2]);
water_stations.addTo(map);

var overlayMaps = {
	"Medical Tents": medical_tents,
	"Water Stations": water_stations
};

L.control.layers(null, overlayMaps,{position:'topleft'}).addTo(map);

function generateLocation(){ //generates random point within the radius of golden gate park (for testing purposes)
	var r = 200/111300; // = 100 meters
	var y0 = 37.769358; //lat and long of center of golden gate
  	var x0 = -122.48816;
	var u = Math.random();
  	var v = Math.random();
  	var w = r * Math.sqrt(u);
  	var t = 2 * Math.PI * v;
  	var x = w * Math.cos(t);
  	var y1 = w * Math.sin(t);
  	var x1 = x / Math.cos(y0);

	var newY = y0 + y1;
	var newX = x0 + x1;
	var newLocation = {lng: newX, lat: newY};
	return newLocation;
} //end of generateLocation

function onLocationFound(e) {
	var radius = e.accuracy / 2;
	L.circle(e.latlng, radius).addTo(map); //add an initial circle to the current location of the user
	currLocation = e;
}

map.on('locationfound', onLocationFound); //locates the user's location on start up

function onLocationError(e) { //any errors that occur with getting the user's location
	alert(e.message);
}

map.on('locationerror', onLocationError);

//Once they click alert ranger dave, a form will pop up
$("#alert-btn").click(function(){
	$("#med-form-container").css("display","");
});

//If they want to close the form by clicking the right "x" button
$("#close-form").click(function(){
	$("#med-form-container").css("display","none");
});

//After filling out the form, submit button will drop the pin!
$("#submit-btn").click(function(){//event for when they click the button to drop a pin to their location
	// map.locate({setView:true}); 
 //    map.on('locationfound', onLocationFound); //locates the user's location again when clicked
 //====UNCOMMENT THE ABOVE LINES TO DROP A PIN AT OUR CURRENT LOCATION=====//
 	$("#med-form-container").css("display","none");
 	var newLocation = generateLocation(); //generates a new location near golden gate park
 	map.setView(ggPark, 16);
	firebase.push({latLng: newLocation, objId: 0}); //pushes to the firebase
});

firebase.on("child_added", function(snapshot, prevChildKey) { //listener when something is pushed to firebase
	var newPosition = snapshot.val();
	var key = snapshot.key(); //grabs the key so we can update the id
	var marker = L.marker(newPosition.latLng, {icon: daveIcon}); //adds that icon to the map
	var addLayer = map.addLayer(marker); //adds the marker to leaflet map, so now the marker has a leaflet id
	firebase.child(key).update({objId: marker._leaflet_id}); //updates the object's ID
});

firebase.on("child_removed", function(oldChildSnapshot){ //listener when something is removed from our database
	var deleteMarkerId = oldChildSnapshot.val().objId; //saves the deleted object's ID
	map.eachLayer(function (layer) { //loops through each layer
	   if(layer._leaflet_id == deleteMarkerId){
	   		map.removeLayer(layer); //removes that layer (marker) when 
	   }
	});
});
