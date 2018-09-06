document.addEventListener("DOMContentLoaded", start, false);
let poly;
let map = L.map("map").locate({ setView: true, maxZoom: 17 }),
    geocoder = L.Control.Geocoder.nominatim(),
    control = L.Control.geocoder({
        geocoder: geocoder,
        // showResultIcons: true,
        defaultMarkGeocode: false
    })
        .on("markgeocode", function(e) {
            if (poly) {
                poly.remove();
            }
            const bbox = e.geocode.bbox;
            poly = L.polygon([
                bbox.getSouthEast(),
                bbox.getNorthEast(),
                bbox.getNorthWest(),
                bbox.getSouthWest()
            ]).addTo(map);
            map.fitBounds(poly.getBounds());
        })
        .addTo(map),
    marker;

L.tileLayer("https://maps.tilehosting.com/styles/positron/{z}/{x}/{y}.png?key=9rAT960ktqr7deCTc1f0", {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on("click", function(e) {
    let lat = e.latlng.lat;
    let lng = e.latlng.lng;

    if (marker) marker.remove();

    geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), function(results) {
        let street = results[0].properties.address.road;
        let city = results[0].properties.address.city;
        let town = results[0].properties.address.town;
        let country = results[0].properties.address.country;
        let county = results[0].properties.address.county;
        let city_district = results[0].properties.address.city_district;

        let r = results[0];
        console.log(results[0]);
        if (r) {
            marker = L.marker(r.center)
                .bindPopup(r.name)
                .addTo(map)
                .setPopupContent(
                    `<form action="/protected/create-story" method="POST" id="form-container">
                    <textarea id="story" type="text" name="story" placeholder="Add your happy story..." style="width: 200px; height:50px;"></textarea>
                    <input type="hidden" id="lat" name="lat" value=${lat}>
                    <input type="hidden" id="lng" name="lng" value=${lng}>
                    <input type="hidden" id="street" name="street" value="${street}">
                    <input type="hidden" id="city_district" name="city_district" value="${city_district}">
                    <input type="hidden" id="city" name="city" value="${city}">
                    <input type="hidden" id="country" name="country" value="${country}">
                    <input type="hidden" id="town" name="town" value="${town}">
                    <input type="hidden" id="county" name="county" value="${county}">
                    <button type="submit">ADD</button>
                    </form>${r.html || r.name}`
                )
                .openPopup();
        }
    });
});

function onLocationFound(e) {
    let radius = e.accuracy / 2;
    L.circle(e.latlng, radius).addTo(map);
}
map.on("locationfound", onLocationFound);

function start() {
    axios.get("/protected/stories").then(result => {
        result.data.forEach(story => {
            let date = moment(story.created_at).format("lll");

            new L.marker([story.location.lat, story.location.lng])
                .bindPopup(
                    `<a href="/protected/user/${story.username}"><p>${story.username}</p></a>
                    <div class="display-story-container"><p>${story.story}</p>
                    <p>${story.address.street ? story.address.street : ""}</p>
                    <p>${story.address.city_district ? story.address.city_district : ""}</p>
                    <p>${story.address.town ? story.address.town : ""}</p>
                    <p>${story.address.city ? story.address.city : ""}</p>
                    <p>${story.address.county ? story.address.county : ""}</p>
                    <p>${story.address.country ? story.address.country : ""}</p
                    <p>${date}</p>
                    </div>`
                )
                .addTo(map);
        });
    });
}