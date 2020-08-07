
var queryURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

d3.json(queryURL).then(function(data) {
    console.log(data)

    var lat = data.features.map(d => d.geometry.coordinates[1])
    var lng = data.features.map(d => d.geometry.coordinates[0])
    console.log(lat, lng)

    var magnitude = data.features.map(d => d.properties.mag)
    console.log(magnitude)

    var place = data.features.map(d => d.properties.place)
    console.log(place)

    var myMap = L.map("map", {
        center: [36.778, -119.417],
        zoom: 5
    })

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: 'YOUR_KEY'
}).addTo(myMap);

for (var i = 0; i< place.length; i++) {

    var color = ""

    if (magnitude[i] > 4.0) {
        color = '#800026'
    }

    else if (magnitude[i] >3.0) {
        color = '#E31A1C'
    }

    else if(magnitude[i] > 2.0) {
        color = '#FD8D3C'
    }

    else if (magnitude[i] > 1.0) {
        color =  '#FED976'
    }

    else {
        color = '#FFEDA0'
    }

    L.circle([lat[i], lng[i]], {
        color: color,
        fillColor: color,
        fillOpacity: 0.8,
        radius: magnitude[i]*10000
    }).bindPopup("<h2>" + place[i] + "</h2><hr><ul><li>Magnitude: " + magnitude[i] + "</li>" ).addTo(myMap)
}

var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4],
        colors = ['#FFEDA0', '#FED976', '#FD8D3C', '#E31A1C','#800026']
        
        
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<div class='legend-entry' style='background: " + colors[i] + "'> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+" + "</div>");
        }
        return div;
    }
    
    legend.addTo(myMap);
})

