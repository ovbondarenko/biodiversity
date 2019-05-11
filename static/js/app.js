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

  var url = `http://127.0.0.1:5000/samples/${sample}`;

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var data_sorted = d3.json(url).then(function(data) {
    data = [data];
    // console.log(data);
    var ids = data[0].otu_ids;
    var labels = data[0].otu_labels;
    var values = data[0].sample_values;
    var sample_data = ids.map(function(x, i) {
      return d = {"sample_id": x, 
              "sample_label": labels[i], 
              "sample_value": values[i]};
    });

    // console.log(d);

    var data_sorted = sample_data.sort((a,b) => parseFloat(a.sample_value)-parseFloat(b.sample_value));
    var top_ten = data_sorted.slice(-10);
    // console.log(data_sorted, top_ten);
    return data_sorted;
  });

  // console.log(data_sorted);

  var bubbleChart=function(data_sorted) {
    console.log(data_sorted["sample_id"]);

    var trace1 = {
      x: [1, 2, 3, 4],
      y: [10, 11, 12, 13],
      mode: 'markers',
      marker: {
        color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
        opacity: [1, 0.8, 0.6, 0.4],
        size: [40, 60, 80, 100]
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: 'Marker Size and Color',
      showlegend: false,
      height: 600,
      width: 600
    };
    
    Plotly.newPlot('bubble', data, layout);
  }
  bubbleChart(data_sorted)
};
    // @TODO: Build a Bubble Chart using the sample data

    // var data = [{
    //   x: x,
    //   y: y,
    //   text: text,
    //   mode: 'markers',
    //   marker: {
    //     color: color,
    //     colorscale: 'Bluered',
    //     size: y
    //   }
    // }];
 
    // var layout = {
    //   width: 600,
    //   height: 600
    // };
    // Plotly.newPlot('bubble', data, layout);

    // // @TODO: Build a Pie Chart

    // d3.json("/").then(function(data){
    //   var layout = {
    //     "title": "Top ten bacteria strains"
    //   }
      
    // Plotly.plot("pie", data, layout);
    // })
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).


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
