var map = L.map('map').setView([51.505, -0.09], 18),
    geocoder = L.Control.Geocoder.nominatim(),
    control = L.Control.geocoder({
        geocoder: geocoder
    }).addTo(map),
    marker;
L.tileLayer('https://maps.tilehosting.com/styles/positron/{z}/{x}/{y}.png?key=9rAT960ktqr7deCTc1f0', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
map.on('click', function(e) {
    console.log(e.latlng.lat); //getting lat only
    console.log(e.latlng.lng); //getting lng only
    geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), function(results) {
        var r = results[0];
        if (r) {
            if (marker) {
                marker
                    .setLatLng(r.center)
                    .setPopupContent(
                        '<form action="/" method="POST" id="form-container"><textarea id="story" type="text" name="story" placeholder="Add your happy story..." style="height: 200px;"></textarea><button type="submit">ADD</button></form>' +
                            r.html || r.name
                    ) //add story here
                    .openPopup();
            } else {
                marker = L.marker(r.center)
                    .bindPopup(r.name)
                    .addTo(map)
                    .openPopup();
            }
        }
    });
});
