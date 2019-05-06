function buildMetadata(sample) {

  var url = `http://127.0.0.1:5000/metadata/${sample}`
  
  var sample = d3.select("#sample-metadata").html(""); //clear any existing metadata
  
  d3.json(url).then(function(data){

    var data = [data];

    var pairs = Object.entries(data[0]);

    pairs.forEach(p => d3.select("#sample-metadata")
                        .append('p')
                        .text(d => `${p[0]}:    ${p[1]}`));

  })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  var url = `http://127.0.0.1:5000/samples/${sample}`

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var data_sorted = d3.json(url).then(function(data) {
    data = [data];
    console.log(data);
    var ids = data[0].otu_ids;
    var labels = data[0].otu_labels;
    var values = data[0].sample_values;
    var sample_data = ids.map(function(x, i) {
      return d = {"sample_id": x, 
              "sample_label": labels[i], 
              "sample_value": values[i]};
      // console.log(d);
    });
    // console.log(sample_data);
    var data_sorted = sample_data.sort((a,b) => parseFloat(a.sample_value)-parseFloat(b.sample_value));
    // var top_ten = data_sorted.slice(-10);
    return data_sorted;
  })
  console.log(data_sorted)

  var bubbleChart = function() {
    var
  }

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart

    // d3.json("/").then(function(data){
    //   var layout = {
    //     "title": "Top ten bacteria strains"
    //   }
      
    //   Plotly.plot("pie", data, layout);
    // })
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

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
