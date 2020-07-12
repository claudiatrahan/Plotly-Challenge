

// Use the D3 library to read in samples.json.
function showMetadata(sample) {
    //Read samples.json
    d3.json("samples.json").then((data) =>{
        console.log(data);
        var demo = d3.select("#sample-metadata")
        demo.html("") 
        // 4. Display the sample metadata, i.e., an individual's demographic information.
        var entries = data.metadata
        var entry = entries.filter(row => row.id == sample)
        console.log(entry)
        Object.entries(entry[0]).forEach(([key, value]) => {
            demo.append("h5").text(`${key}: ${value}`)
        })
        gaugeChart(entry[0].wfreq)

    });  
}
function optionChanged(changedSample) {
    showMetadata(changedSample);
    barChart(changedSample);
    bubbleChart(changedSample);
    //gaugeChart(changedSample)
}

//Create 2 more functions

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function barChart(sample){
    d3.json("samples.json").then((data) =>{
        console.log(data);
        // Use sample_values as the values for the bar chart.
        var grossGerms = data.samples
        var grossGerm = grossGerms.filter(row => row.id == sample)
        console.log(grossGerm)
        var otu_ids = grossGerm[0].otu_ids
        var sample_values = grossGerm[0].sample_values
        var otu_labels = grossGerm[0].otu_labels
        console.log(otu_labels)
        var yTop10 = otu_ids.slice(0,10).reverse();
        console.log("yTop10", yTop10);
        var xTop10 = sample_values.slice(0,10).reverse();
        
        console.log("xTop10", xTop10);
        var barData = [{
            type: 'bar',
            // Use sample_values as the value for the bar chart.
            x: xTop10,
            // Use otu_ids as the labels for the bar chart.
            y: yTop10.map(yTop10 => `OTU ${yTop10}`),
            // Use otu_labels as the hovertext for the chart.
            text: otu_labels,
            orientation: 'h'
          }];
          
          Plotly.newPlot('bar', barData);
    })
}

// Create a bubble chart that displays each sample.
// Use sample_values for the y values.
// Use sample_values for the marker size.
// Use otu_ids for the marker colors.
// Use otu_labels for the text values.
// Display each key-value pair from the metadata JSON object somewhere on the page.
// Update all of the plots any time that a new sample is selected.

function bubbleChart(sample) {
    //import data
    d3.json("samples.json").then((data) =>{
        console.log(data);
        //grab samples datat
        var grossGerms = data.samples
        console.log(grossGerms)
        var grossGerm = grossGerms.filter(row => row.id == sample)
        console.log(grossGerm)
        var otu_ids = grossGerm[0].otu_ids
        var sample_values = grossGerm[0].sample_values
        var otu_labels = grossGerm[0].otu_labels

        var trace1 = {
            // Use otu_ids for the x values.
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
              size: sample_values,
              color: otu_ids
            }
          };
          
          var data = [trace1];
          
          var layout = {
            title: 'Bacteria Cultures in Samples',
            showlegend: false,
            height: 600,
            width: 900,
            xaxis: {title: "OTU ID"}
          };
          
          Plotly.newPlot('bubble', data, layout);
    })
}

function gaugeChart(washes){
        var data = [{ 
        type: 'scatter',
        x: [0], y:[0],
        marker: {size: 14, color:'850000'},
        showlegend: false,
        name: 'Belly Button Washing Frequency',
        text: washes,
        hoverinfo: 'text+name'},
        { values: [1,1,1,1,1,1,1,1,1,9],
            rotation: 90,
            text: ['8-9','7-8','6-7','5-6', '4-5','3-4','2-3','1-2','0-1'],
            textinfo: 'text',
            textposition:'inside',
            marker: {colors:[
                'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                'rgba(249, 168, 37, .5)', 'rgba(183,28,28, .5)',
                'rgba(0, 0, 0, 0.5)', 'rgba(255,72,196,.5)', 
                'rgba(43,209,252,.5)', 'rgba(243,234,95, .5)', 
                'rgba(192,77,249,.5)']},
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false}];
            
          
        var layout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            
            font: { color: "darkblue", family: "Arial" }
          };
          
    Plotly.newPlot('gauge', data, layout);


}



//init
function init() {
    //selecting dataset from samples.json d3select (id/class of dropdown)
    var samples_select = d3.select("#selDataset");
    //collect options to populate 
    d3.json("samples.json").then((data)=>{
        //pull shit from file
        var ids = data.names;
        ids.forEach((x)=> {
            samples_select
            .append("option")
            .text(x)
            .property('value', x)
        });
         //select first thing in the list 
         var firstId = ids[0]
         //autopopulate with that thing   
         showMetadata(firstId)
         barChart(firstId)
         bubbleChart(firstId)
         gaugeChart(firstId)

         //show charts once function is created.
    });

}

init();
// Optional
// The following task is advanced and therefore optional.


// Adapt the Gauge Chart from https://plot.ly/javascript/gauge-charts/ to plot the weekly washing frequency of the individual.


// You will need to modify the example gauge code to account for values ranging from 0 through 9.


// Update the chart whenever a new sample is selected.

