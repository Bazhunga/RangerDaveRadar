var map = L.map('mapid').setView([37.768611, -122.490113], 16);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 18,
	id: 'kdieu.0o991llo',
	accessToken: 'pk.eyJ1Ijoia2RpZXUiLCJhIjoiY2lxenJld3FjMDJtdmZ4a3F3Mnh4cjd5eCJ9.mjmM-iBez9Zt2tuRoa40bg'
}).addTo(map);

map.locate({setView:true});

var daveIcon = L.icon({
    iconUrl: 'DanIcon.png',

    iconSize:     [38, 45], // size of the icon
    iconAnchor:   [19, 40], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

function onLocationFound(e) {
	var radius = e.accuracy / 2;

	L.marker(e.latlng, {icon: daveIcon}).addTo(map)
    		.bindPopup("You are within " + radius + " meters from this point").openPopup();

	L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
	alert(e.message);
}

map.on('locationerror', onLocationError);

function onMapClick(e) {
	L.marker(e.latlng, {icon: daveIcon}).addTo(map);
}

map.on('click', onMapClick);
var imageURL = './OSLMAP_burned.png',
	imageBounds = [[37.766152, -122.496683],[37.771037, -122.481465]];

L.imageOverlay(imageURL,imageBounds).addTo(map);
