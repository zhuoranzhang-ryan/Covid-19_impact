var confirmedCases = "./static/data/covid_us_confirmed.json";

function initializeDashboard() {
  d3.json(confirmedCases).then(function (dataSet) {
    console.log(dataSet);

    var totalDays = Object.keys(dataSet).length;

    for (let idx = 70; idx < 71; idx++) {
      var dateString = Object.keys(dataSet)[idx];
      var records = Object.values(dataSet)[idx];
      var statesWithTotalCasesDict = {};

      var statesWithTotalCases = sumCasesPerState(records);

      statesWithTotalCasesDict[dateString] = statesWithTotalCases;

      console.log(statesWithTotalCasesDict);

      console.log("\n");

      createBarChart(dateString, statesWithTotalCases);
    }

    // Object.entries(dataSet).forEach(function ([date, records]) {
    //     var statesWithTotalCasesDict = {}

    //     var statesWithTotalCases = sumCasesPerState(records);

    //     statesWithTotalCasesDict[date] = statesWithTotalCases;

    //     console.log(statesWithTotalCasesDict);

    //     // createBarChart(date, statesWithTotalCases);
    //     createBarChart(date, statesWithTotalCases);

    // });
  });
}

function sumCasesPerState(array) {
  //source: https://gist.github.com/tleen/6299431
  var states = [
    "Alabama",
    "Alaska",
    "American Samoa",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District of Columbia",
    "Federated States of Micronesia",
    "Florida",
    "Georgia",
    "Guam",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Marshall Islands",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Northern Mariana Islands",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Palau",
    "Pennsylvania",
    "Puerto Rico",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virgin Island",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  // Initialize totalCasesPerState with 0

  // Copy array and set it to zero
  var totalCasesPerState = [...states]; // APPARENTLY, this is how you copy an array in Javascript!
  totalCasesPerState.fill(0);

  for (let idx = 0; idx < array.length; idx++) {
    // console.log(`${array[idx].Province}: ${array[idx].Cases}`);

    var stateIndex = states.indexOf(array[idx].Province);

    if (stateIndex > -1) {
      totalCasesPerState[stateIndex] =
        totalCasesPerState[stateIndex] + array[idx].Cases;
    }
  }

  // Create dictionary of states and cases for a date
  var statesWithTotalCases = {};

  for (let i = 0; i < totalCasesPerState.length; i++) {
    statesWithTotalCases[states[i]] = totalCasesPerState[i];
  }

  return statesWithTotalCases;
}

function createBarChart(dateString, covidData) {
  // console.log(covidData);

  sortedCovidData = sort_object(covidData);

  var xValues = [];
  var yValues = [];

  // Populate x and y values
  Object.entries(sortedCovidData).forEach(function ([state, cases]) {
    xValues.push(state);
    yValues.push(cases);
  });

  console.log(xValues);
  console.log(yValues);

  // console.log(Math.max.apply(Math, yValues));

  var trace = {
    x: yValues.slice(0, 16),
    y: xValues.slice(0, 16),
    type: "scatter",
    orientation: "h",
    name: "confirmedCases",
    // text: labels,
    marker: {
      color: "rgba(50,171,96,0.6)",
      line: {
        color: "rgba(50,171,96,1.0)",
        width: 0,
      },
    },
    hovertemplate: "Confirmed: %{x}<br>" + "<extra></extra>",
  };
  var layout = {
    title: `Top 15 states with confirmed cases on ${dateString}`,
    margin: {
      l: 120,
      r: 20,
      t: 30,
      b: 40,
    },
    yaxis: {
      autorange: "reversed",
      ticks: "outside",
      ticklen: 10,
      tickcolor: "white",
      linecolor: "gray",
      linewidth: 0.01,
      mirror: true,
    },
    xaxis: {
      // tickformat: ',.0%',
      range: [0, Math.max.apply(Math, yValues)],
      // side: "top",
      tickmode: "linear",
      tick0: 0,
      dtick: Math.round(Math.max.apply(Math, yValues) / 5),
      border: 1,
      linecolor: "gray",
      linewidth: 0.5,
      mirror: true,
    },
  };

  var data = [trace];

  Plotly.newPlot("scatter", data, layout, { displayModeBar: false });
}
// source: https://bit.ly/3bYZ2NY
function sort_object(obj) {
  var items = Object.keys(obj).map(function (key) {
    return [key, obj[key]];
  });
  items.sort(function (first, second) {
    return second[1] - first[1];
  });
  // console.log(items[0]);

  var sorted_obj = {};

  for (let idx = 0; idx < items.length; idx++) {
    sorted_obj[items[idx][0]] = items[idx][1];
  }
  return sorted_obj;
}

initializeDashboard();
