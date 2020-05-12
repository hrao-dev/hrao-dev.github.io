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

    // Select the button
    var fltrbutton = d3.select(".filter-btn");
    var clrbutton = d3.select(".clear-btn");

    const srchInput = document.querySelector("input");

    // Create event handlers 
    fltrbutton.on("click", filterTable);
    srchInput.addEventListener("change", filterTable);
    clrbutton.on("click", clearSearch);

    // Create a handler function for filtering
    function filterTable() {
        // Prevent the page from refreshing
        //d3.event.preventDefault()

        var dateInput, table, tr, i, date;
        var dateInput = d3.select("#datetime").property("value")
        d3.select("#datetime").property("value", dateInput);
        console.log(dateInput);

        var filterDate = tableData.filter(d => d.datetime === dateInput)
        console.log(filterDate);

        //Select the table element to add the data to 
        var tbody = d3.select("tbody");

        // Remove any children from the table
        tbody.html("");
        //Call the funtion to display the filtered data results for the specified date
        displayTable(filterDate);
    }

    function clearSearch() {
        // Clear the input element
        document.getElementById("datetime").value = "";
        //Select the table element to add the data to 
        var tbody = d3.select("tbody");

        // Remove any children from the table
        tbody.html("");
        // Revert to displaying all the UFO Sightings in a table format
        displayTable(tableData);
    }
})