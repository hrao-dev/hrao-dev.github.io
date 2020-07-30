function colorMarkers(magnitude) {
    // Conditionals for countries points
    //['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdca26', '#f0f921']
    let color = "";
    if (magnitude <= 1) {
        color = "#9ACD32";
    } else if (magnitude <= 2) {
        color = "#FFFF00";
    } else if (magnitude <= 3) {
        color = "#DAA520";
    } else if (magnitude <= 4) {
        color = "#FFA500";
    } else if (magnitude <= 5) {
        color = "#FF8C00";
    } else if (magnitude <= 6) {
        color = "#FF6347";
    } else {
        color = "#FF0000";
    }
    return color
}

function createFeatures(earthquakeData, tecplateData) {

    function createMarker(feature) {

        var markers = {
            color: "#FFFFFF",
            fillColor: colorMarkers(feature.properties.mag),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
            radius: feature.properties.mag * 5
        }
        return markers
    }

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3> Location: " + "<i>" + feature.properties.place + "</i></h3>" +
            "<h3>Magnitude: " + "<i>" + feature.properties.mag + "</i></h3>" +
            "<h3><hr><p>Time: " + "<i>" + new Date(feature.properties.time) + "</i>" + "</p></h3>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    const earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, createMarker(feature));
        },
        onEachFeature: onEachFeature
    });

    const tec_plates = L.geoJSON(tecplateData, {
        color: "#FF4500",
        weight: 2
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes, tec_plates);
}

function createLegend() {

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var color_grades = [0, 1, 2, 3, 4, 5, 6];
        var labels = [];
        div.innerHTML += "<h4><strong>Magnitude<strong></h4>";
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < color_grades.length; i++) {
            div.innerHTML += '<i style="background:' + colorMarkers(color_grades[i] + 1) + '"></i> ' + color_grades[i] + (color_grades[i + 1] ? '&ndash;' + color_grades[i + 1] + '<br>' : '+');
        }

        return div;
    };
    return legend;
}

function createMap(earthquakes, tec_plates) {

    // Define streetmap and darkmap layers

    const satmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{tileSize}/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors," +
            "<a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>," +
            " Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/satellite-streets-v11", // https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11
        accessToken: API_KEY
    });

    const graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{tileSize}/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors," +
            "<a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>," +
            " Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/light-v10", // https://docs.mapbox.com/api/maps/#static-tiles
        accessToken: API_KEY
    });

    const outmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{tileSize}/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors," +
            "<a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>," +
            " Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/outdoors-v11", // https://api.mapbox.com/styles/v1/mapbox/outdoors-v11
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
        "Satellite View": satmap,
        "Grayscale View": graymap,
        "Outdoors View": outmap
    };

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
        Earthquakes: earthquakes,
        Tectonic_Plates: tec_plates
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    const myMap = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 4,
        layers: [satmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    const legend = createLegend();
    legend.addTo(myMap);
}

(async function() {
    const quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    const quake_data = await d3.json(quakeUrl);

    const tecplateURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
    const tecplate_data = await d3.json(tecplateURL);

    // Once we get a response, send the data objects to the createFeatures function
    createFeatures(quake_data.features, tecplate_data.features);

})()