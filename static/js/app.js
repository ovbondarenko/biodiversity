function buildMetadata(sample) {

  var url = `http://127.0.0.1:5000/metadata/${sample}`;
  
  var sample = d3.select("#sample-metadata").html(""); //clear any existing metadata
  
  d3.json(url).then(function(data){

    // console.log(data);

    var data = [data];

    var pairs = Object.entries(data[0]);

    // console.log(pairs)

    pairs.forEach(p => d3.select("#sample-metadata")
                        .append('p')
                        .text(d => `${p[0]}:    ${p[1]}`));

    // console.log(pairs)
    

  });

  d3.json(url, function(data) {
  // console.log(data)
})

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  var sampleUrl = `http://127.0.0.1:5000/samples/${sample}`;

  // Fetch the sample data from sampleUrl

  d3.json(sampleUrl).then(d => {

    // Build a bubble chart for all samples
    var trace1 = {
      x: d.otu_ids,
      y: d.sample_values,
      text: d.otu_labels,
      mode: 'markers',
      marker: {
        color: d.otu_ids,
        opacity: 0.5,
        size: d.sample_values
      }
    };
    
    var data = [trace1];
    
    var layout = {
      
      height: 500,
      width: 1000
    };
    
    Plotly.newPlot('bubble', data, layout);
    
    
    // Create a pie chart for top ten samples

    var trace2 = {
      values: d.sample_values.slice(0,10),
      labels: d.otu_ids.slice(0,10),
      type: 'pie',
      hovertext: d.otu_labels.slice(0,10)
    }

    var data2 = [trace2]

    var layout2 = {
      width: 500,
      height: 500
    }

    Plotly.newPlot('pie', data2, layout2);

  });

};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
