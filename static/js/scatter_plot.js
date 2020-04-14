var confirmedCases = "./static/data/covid_us_confirmed.json";
var unemploymentCases = "./static/data/unemployment_claims.json";

// // Set an empty array
var unemployment = [];
var covidCases = [];
var datesList = [];
var states = [];
// Get confirmed cases data
d3.json(unemploymentCases).then(function (claimsData) {
  d3.json(confirmedCases).then(function (casesData) {
    // console.log("Original claims data", claimsData);
    // console.log(Object.keys(claimsData));
    console.log(states);
    for (var i = 0; i < Object.keys(casesData).length; i++) {
      for (var j = 0; j < Object.keys(claimsData).length; j++) {
        // states.push(Object.keys(Object.values(claimsData)[1][j]));
        // states = states.flat();

        // Retrive data for matching dates from both datasets
        if (Object.keys(casesData)[i] === Object.keys(claimsData)[j]) {
          // Put dates as a list to reference index later
          datesList.push(Object.keys(casesData)[i]);

          // For covid-cases data
          // var statesWithTotalCasesDict = {};
          var records = Object.values(casesData)[i];
          var statesWithTotalCases = sumCasesPerState(states, records);

          // statesWithTotalCasesDict[
          //   Object.keys(claimsData)[j]
          // ] = statesWithTotalCases;

          // Push data to a list
          covidCases.push(statesWithTotalCases);
          unemployment.push(Object.values(claimsData)[j]);

          // console.log(statesWithTotalCases);
          // console.log(statesWithTotalCasesDict);

          // unemployment.push(Object.entries(claimsData)[j]);
          // covidCases.push(statesWithTotalCasesDict);
        }
      }
    }
    // returnxaxisdata(datesList, unemployment);
    createScatter(datesList, covidCases, unemployment);
    console.log(states);
    console.log(datesList);
    console.log("Final claims data", unemployment);
    console.log("Final cases data", covidCases);
  });
});

// Create scatter plot
function createScatter(datesList, confirmedCases, unemploymentData) {
  // Get value only from covid data
  function returnXaxisdata(datesList, covidCases) {
    xaxisData = [];
    var index = datesList.indexOf("2020-03-28");
    Object.entries(covidCases[index]).forEach(function ([state, cases]) {
      xaxisData.push(cases);
    });

    console.log("Confirmed Cases Data for Plot", xaxisData);
    return xaxisData;
  }

  // Get value only from unemployment data
  function returnYaxisdata(datesList, unemploymentClaims) {
    yaxisData = [];
    states = [];
    var index = datesList.indexOf("2020-03-28");
    for (var i = 0; i < unemploymentClaims[index].length; i++) {
      yaxisData.push(Object.values(unemploymentClaims[index][i]));
      yaxisData = yaxisData.flat();
      states.push(Object.keys(unemploymentClaims[index][i]));
      states = states.flat();
    }
    // console.log("Unemployment Data for Plot", yaxisData);
    // console.log("Unemployment Data for Plot", states);
    return states, yaxisData;
  }

  returnYaxisdata(datesList, unemploymentData);
  returnXaxisdata(datesList, confirmedCases);

  var data = [
    {
      // x: covidCases,
      x: xaxisData, // unemployment claims data for each state
      y: yaxisData, //create yaxis return data // covid-19 confirmed cases for each state
      mode: "markers",
      type: "scatter",
      text: states,
      marker: {
        size: 15,
        color: "LightSkyBlue",
        line: { width: 2, color: "DarkSlateGrey" },
      },
    },
  ];

  var format = {
    title: "COVID-19 Confirmed Cases vs Unemployment Claims",
    xaxis: { title: "COVID-19 Confirmed Cases" },
    yaxis: { title: "Unemployment Claims(per week)" },
  };
  Plotly.newPlot("scatter", data, format);
}

function sumCasesPerState(states, array) {
  // source: https://gist.github.com/tleen/6299431
  var states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District of Columbia",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
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
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Puerto Rico",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virgin Islands",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  // console.log(states);
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
