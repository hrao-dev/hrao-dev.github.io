// from data.js
var tableData = data;
// Console.log the ufo sightings data from data.js
//console.log(data);

window.addEventListener("load", function() {

    // Display all the UFO Sightings in a table format
    displayTable(tableData);

    function displayTable(tdata) {
        var tbody = d3.select("tbody");
        if (!tdata.length) {
            var trow = tbody.append("tr");
            trow.text("No sightings found");
        } else {
            tdata.forEach(function(ufoReport) {
                //console.log(ufoReport);
                var trow = tbody.append("tr");
                trow.append("td").text(ufoReport.datetime)
                trow.append("td").text(ufoReport.city)
                trow.append("td").text(ufoReport.state)
                trow.append("td").text(ufoReport.country)
                trow.append("td").text(ufoReport.shape)
                trow.append("td").text(ufoReport.durationMinutes)
                trow.append("td").text(ufoReport.comments)
            })
        }
    }

    var states = [];
    states = tableData.map(u => u.state);
    var uniqueStates = Array.from(new Set(states))
        //uniqueStates = uniqueStates.map(function(x) { return x.toUpperCase() })
    uniqueStates = uniqueStates.sort();
    //console.log(uniqueStates);

    var slct = d3.select("#stateselector");
    for (var s = 0; s < uniqueStates.length; s++) {
        var seloption = slct.append("option");
        seloption.text(uniqueStates[s])
    }

    var countries = [];
    countries = tableData.map(u => u.country);
    var uniqueCountries = Array.from(new Set(countries))
        //uniqueCountries = uniqueCountries.map(function(x) { return x.toUpperCase() })
    uniqueCountries = uniqueCountries.sort();
    //console.log(uniqueCountries);

    var slt = d3.select("#countryselector");
    for (var c = 0; c < uniqueCountries.length; c++) {
        var seloptn = slt.append("option");
        seloptn.text(uniqueCountries[c])
    }

    // Select the button
    var fltrbutton = d3.select(".filter-btn");
    var clrbutton = d3.select(".clear-btn");
    const srchDate = document.querySelector("#datetime");
    const srchCity = document.querySelector("#city");
    const srchState = document.querySelector("#stateselector");
    const srchCountry = document.querySelector("#countryselector");
    const srchShape = document.querySelector("#shape");


    // Create event handlers 
    fltrbutton.on("click", filterTable);
    //srchDate.addEventListener("change", filterTable);
    //srchCity.addEventListener("change", filterTable);
    srchState.addEventListener("change", changeCountry);
    //srchCountry.addEventListener("change", changeState);
    //srchShape.addEventListener("change", filterTable);
    clrbutton.on("click", clearFilter);

    function changeCountry() {
        var stateInput = d3.select("#stateselector").property("value");
        console.log(stateInput);
        var cnSelect = document.getElementById("countryselector");
        var cnoptions = document.querySelectorAll('#countryselector option');
        for (var i = 1; i < cnoptions.length; i++) {
            var option = cnoptions[i];
            option.style.display = 'block';
            if (stateInput === 'on') {
                if (option.text === 'ca') {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            } else {
                if (option.text === 'ca') {
                    option.style.display = 'none';
                } else {
                    option.style.display = 'block';
                }
            }
        }
    }

    function filterTable() {
        // Prevent the page from refreshing
        //d3.event.preventDefault()

        var filterDate, filterShape, filterState, filterDuo, filterTrio;
        var dateInput = d3.select("#datetime").property("value")
        d3.select("#datetime").property("value", dateInput);
        //console.log(dateInput);

        var shapeInput = d3.select("#shape").property("value");
        var shapeFilter = shapeInput.toUpperCase();
        d3.select("#shape").property("value", shapeInput);
        //console.log(shapeInput);

        var cityInput = d3.select("#city").property("value");
        var cityFilter = cityInput.toUpperCase();
        d3.select("#city").property("value", cityInput);
        //console.log(cityInput);

        var stateInput = d3.select("#stateselector").property("value");
        d3.select("#stateselector").property("value", stateInput);
        //var stateFilter = stateInput.toUpperCase();
        //console.log(stateInput);

        var countryInput = d3.select("#countryselector").property("value");
        d3.select("#countryselector").property("value", countryInput);
        //var countryFilter = countryInput.toUpperCase();
        //console.log(countryInput);

        //Select the table element to add the data to 
        var tbody = d3.select("tbody");
        // Remove any children from the table
        tbody.html("");


        const keys = Object.keys(tableData[0]);
        //console.log(keys);

        var query = {};
        if (dateInput !== "") {
            Object.defineProperty(query, keys[0], { value: dateInput, enumerable: 'true' });
        }
        if (cityInput !== "") {
            Object.defineProperty(query, keys[1], { value: cityInput, enumerable: 'true' });
        }
        if (stateInput !== "") {
            Object.defineProperty(query, keys[2], { value: stateInput, enumerable: 'true' });
        }
        if (countryInput !== "") {
            Object.defineProperty(query, keys[3], { value: countryInput, enumerable: 'true' });
        }
        if (shapeInput !== "") {
            Object.defineProperty(query, keys[4], { value: shapeInput, enumerable: 'true' });
        }

        console.log(query);

        Object.entries(query).forEach(([key, value]) => {
            console.log(key, value);

        });

        function search(reports, criteria) {
            return reports.filter(function(obj) {
                return Object.keys(criteria).every(function(c) {
                    return obj[c] == criteria[c];
                });
            });
        }
        var results = search(tableData, query);
        console.log(results);
        displayTable(results);
    }

    function clearFilter() {
        document.getElementById("datetime").value = "";
        document.getElementById("city").value = "";
        document.getElementById("stateselector").value = "";
        document.getElementById("countryselector").value = "";
        var cnoptions = document.querySelectorAll('#countryselector option');
        for (var i = 1; i < cnoptions.length; i++) {
            var option = cnoptions[i];
            option.style.display = 'block';
        }
        document.getElementById("shape").value = "";

        //Select the table element to add the data to 
        var tbody = d3.select("tbody");

        // Remove any children from the table
        tbody.html("");
        // Revert to displaying all the UFO Sightings in a table format
        displayTable(tableData);
    }
})