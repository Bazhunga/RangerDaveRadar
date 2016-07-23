var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'kdieu.0o991llo',
    accessToken: 'pk.eyJ1Ijoia2RpZXUiLCJhIjoiY2lxenJld3FjMDJtdmZ4a3F3Mnh4cjd5eCJ9.mjmM-iBez9Zt2tuRoa40bg'
}).addTo(mymap);
