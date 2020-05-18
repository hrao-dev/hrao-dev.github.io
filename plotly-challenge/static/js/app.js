var data;
(async function() {
    var importedData = await d3.json("data/samples.json");
    // console.log(importedData);
    data = importedData;

    var test_id = data.names.map(id => id);
    //console.log(test_id);
    var select = d3.select("#selDataset");
    for (var s = 0; s < test_id.length; s++) {
        var seloptn = select.append("option");
        seloptn.text(test_id[s]);
    }
    var first_id = d3.select("#selDataset").property("value");
    d3.select("#selDataset").property("value", first_id);
    buildPlots(data, first_id);
})()

// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", changeSelection);

function changeSelection() {
    var selection = d3.select("#selDataset").property("value");
    d3.select("#selDataset").property("value", selection);
    //console.log(selection;
    d3.select("#sample-metadata").node().value = "";
    document.getElementById("sample-metadata").innerHTML = "";
    buildPlots(data, selection);
}

function buildPlots(data, id) {

    console.log(data);
    var testInput = id;

    var test_metadata = data.metadata.filter(row => row.id.toString() === testInput);
    console.log(test_metadata[0]);
    var sample_metadata = test_metadata[0];
    var wfreq = sample_metadata.wfreq;
    console.log(`Weekly Washing Frequency: ${wfreq}`);
    var panel = d3.select("#sample-metadata");

    var test_sample_values = data.samples.filter(function(row) {
        if (row.id === testInput) {
            //console.log(row.sample_values);
            return row.sample_values
        };
    });
    console.log(test_sample_values);
    var sample_values = [...test_sample_values[0].sample_values];
    var ten_sample_values = sample_values.sort((a, b) => b - a).slice(0, 10);
    //var top_sample_values = [...test_sample_values[0]].slice(0, 10);
    console.log(ten_sample_values);

    var test_otu_ids = data.samples.filter(function(row) {
        if (row.id === testInput) {
            //console.log(row.otu_ids);
            return row.otu_ids
        };
    });
    //console.log(test_otu_ids);
    //var top_otu_ids = [...test_otu_ids[0]].slice(0, 10);
    otu_ids = [...test_otu_ids[0].otu_ids];
    var top_otu_ids = otu_ids.map(String);
    top_otu_ids = top_otu_ids.map(el => "OTU " + el);
    var ten_otu_ids = [...top_otu_ids].sort((a, b) => b - a).slice(0, 10);
    console.log(ten_otu_ids);

    var test_otu_labels = data.samples.filter(function(row) {
        if (row.id === testInput) {
            //console.log(row.otu_labels);
            return row.otu_labels
        };
    });
    //console.log(test_otu_labels);
    var otu_labels = [...test_otu_labels[0].otu_labels];
    var ten_otu_labels = otu_labels.sort((a, b) => b - a).slice(0, 10);
    console.log(ten_otu_labels);

    displayDemo(panel, sample_metadata);
    displayBar(ten_sample_values, ten_otu_ids, ten_otu_labels);
    displayBubble(otu_ids, sample_values, otu_labels);
    displayGauge(wfreq);
}

// Demographic Info
function displayDemo(pnl, smpl_mtdt) {
    for (let [key, value] of Object.entries(smpl_mtdt)) {
        console.log(`${key}: ${value}`);
        var element = `${key}: ${value}`;
        var paneltxt = pnl.append("h6");
        paneltxt.text(element);
    }
}

// Bar Chart
function displayBar(ten_values, ten_ids, ten_labels) {
    // Trace1 for the Top 10 OTU Data
    var trace1 = {
        x: ten_values,
        y: ten_ids,
        text: ten_labels,
        type: "bar",
        orientation: "h",
        marker: {
            color: ["rgb(8,29,88)", "rgb(37,52,148)", "rgb(34,94,168)", "rgb(29,145,192)", "rgb(65,182,196)",
                "rgb(127,205,187)", "rgb(199,233,180)", "rgb(237,248,217)", "rgb(255,255,217)"

            ]
        }
    };

    // data
    var chartData1 = [trace1];

    // Apply the group bar mode to the layout
    var layout1 = {
        title: "<b>Top 10 OTU</b>",
        yaxis: {
            autorange: "reversed",
        }
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", chartData1, layout1);
}


// Bubble Chart
function displayBubble(otu_ids, sample_values, otu_labels) {
    var trace2 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            color: otu_ids,
            colorscale: 'YlGnBu',
            size: sample_values
        }
    };

    var chartData2 = [trace2];

    var layout2 = {
        title: '<b>OTU - Bubble Chart</b>',
        showlegend: false,
        xaxis: {
            title: {
                text: 'OTU ID'
            }
        }
    };

    Plotly.newPlot('bubble', chartData2, layout2);
}

// Gauge Chart
function displayGauge(freq) {
    var chartData3 = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: freq,
        title: { text: "<b>Weekly Washing Frequency</b>" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: {
                range: [0, 9],
                tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                ticktext: ["0", "0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
                ticks: "outside"
            },
            bar: { color: "gold" },
            steps: [
                { range: [0, 1], color: "rgb(255,255,217)" },
                { range: [1, 2], color: "rgb(237,248,217)" },
                { range: [2, 3], color: "rgb(199,233,180)" },
                { range: [3, 4], color: "rgb(127,205,187)" },
                { range: [4, 5], color: "rgb(65,182,196)" },
                { range: [5, 6], color: "rgb(29,145,192))" },
                { range: [6, 7], color: "rgb(34,94,168)" },
                { range: [7, 8], color: "rgb(37,52,148)" },
                { range: [8, 9], color: "rgb(8,29,88)" }
            ]
        }
    }];
    var layout3 = {
        margin: { t: 0, b: 0 }
    };
    Plotly.newPlot('gauge', chartData3, layout3);
}