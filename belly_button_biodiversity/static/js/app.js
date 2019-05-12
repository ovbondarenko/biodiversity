function buildMetadata(sample) {

  var url = `http://127.0.0.1:5000/metadata/${sample}`;
  
  var sample = d3.select("#sample-metadata").html(""); //clear any existing metadata
  
  d3.json(url).then(function(data){

    var data = [data];

    var pairs = Object.entries(data[0]);
    console.log(pairs)

    pairs.forEach(pair=> d3.select("#sample-metadata")
                        .append('div')
                        .text(`${pair[0]}: ${pair[1]}`)); 

    // Build Gauge chart
    // Enter a speed between 0 and 180
var level = pairs[5][1]*180/10;
console.log(level);

// Trig to calc meter point
var degrees = 180 - level,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3', '1-2', '0-1', ''],
  textinfo: 'text',
  textposition:'inside',
  marker: {
    colors: ['rgba(153, 255, 183, 0.8)', 'rgba(165, 235, 160, 0.8)',
    'rgba(178, 216, 137, 0.8)','rgba(191, 197, 114, 0.8)','rgba(204, 178, 91, 0.8)', 
    'rgba(216, 159, 68, 0.8)', 'rgba(229, 140, 45, 0.8)', 'rgba(242, 121, 22, 0.8)', 
    'rgba(255, 102, 0, .8)','rgba(255, 255, 255, 0)'],
  },

  labels: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3', '1-2', '0-1', ''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: '<b>Belly button washing frequency</b> <br> Scrubs per week',
  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);
   

  });

}

function buildCharts(sample) {

  var sampleUrl = `http://127.0.0.1:5000/samples/${sample}`;

  // Fetch the sample data from sampleUrl

  d3.json(sampleUrl).then(d => {
    console.log(d.otu_ids)

    var color = '';


    // Build a bubble chart for all samples
    var trace1 = {
      x: d.otu_ids,
      y: d.sample_values,
      text: d.otu_labels,
      mode: 'markers',
      marker: {
        colors: d.otu_ids,
        size: d.sample_values
      }
    };
    
    var data1 = [trace1];
    
    var layout1 = {
      title: {
        text: "<b>Sample Values vs OTU IDs</b>"
      },
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "Sample Values"
      },
      height: 500,
      width: 1000
    };

    
    Plotly.newPlot('bubble', data1, layout1);
    
    
    // Create a pie chart for top ten samples

    var trace2 = {
      values: d.sample_values.slice(0,10),
      labels: d.otu_ids.slice(0,10),
      type: 'pie',
      hovertext: d.otu_labels.slice(0,10)
    }

    var data2 = [trace2];

    var layout2 = {
      title: {
        text: "<b>Values for top 10 samples</b>"
      },
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
