var map = L.map('map').locate({ setView: true, maxZoom: 16 }),
    geocoder = L.Control.Geocoder.nominatim(),
    control = L.Control.geocoder({
        geocoder: geocoder
    }).addTo(map),
    marker;
L.tileLayer('https://maps.tilehosting.com/styles/positron/{z}/{x}/{y}.png?key=9rAT960ktqr7deCTc1f0', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
map.on('click', function(e) {
    let lat = e.latlng.lat;
    let lng = e.latlng.lng;

    geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), function(results) {
        let street = results[0].properties.address.road;
        let city = results[0].properties.address.city;
        let r = results[0];
        if (r) {
            marker = L.marker(r.center)
                .bindPopup(r.name)
                .addTo(map)
                .setPopupContent(
                    `<form action="/protected/create-story" method="POST" id="form-container">
                    <textarea id="story" type="text" name="story" placeholder="Add your happy story..." style="height: 200px;"></textarea>
                    <input type="hidden" id="lat" name="lat" value=${lat}>
                    <input type="hidden" id="lng" name="lng" value=${lng}>
                    <input type="hidden" id="street" name="street" value="${street}">
                    <input type="hidden" id="city" name="city" value="${city}">
                    <button type="submit">ADD</button></form>${r.html || r.name}`
                )
                .openPopup();
        }
    });
});
