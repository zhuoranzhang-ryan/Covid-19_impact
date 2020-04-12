var confirmedCases = "./static/data/covid_us_confirmed.json";
var unemploymentCases = "./static/data/unemployment_claims.json";

// // Set an empty array
var unemployment = [];
var covidCases = [];

// Get confirmed cases data
d3.json(unemploymentCases).then(function (claimsData) {
  d3.json(confirmedCases).then(function (casesData) {
    // console.log("Original claims data", claimsData);
    // console.log(Object.keys(claimsData));
    for (var i = 0; i < Object.keys(casesData).length; i++) {
      for (var j = 0; j < Object.keys(claimsData).length; j++) {
        // Retrive data for matching dates from both datasets
        if (Object.keys(casesData)[i] === Object.keys(claimsData)[j]) {
          // For covid-cases data
          var statesWithTotalCasesDict = {};
          var records = Object.values(casesData)[i];
          var statesWithTotalCases = sumCasesPerState(records);
          statesWithTotalCasesDict[
            Object.keys(claimsData)[j]
          ] = statesWithTotalCases;

          unemployment.push(Object.entries(claimsData)[j]);
          covidCases.push(statesWithTotalCasesDict);
        }
      }
    }

    console.log("Final claims data", unemployment);
    console.log("Final cases data", covidCases);
    // createScatter(covidCases, unenmployment);
  });
});

// Return data for scatter plot axis
function returndata(data, date) {
  return data[0];
}

console.log(returndata(unemployment));

// Create scatter plot
function createScatter(confirmedCases, unemploymentData) {
  var trace1 = {
    // x: covidCases,
    x: confirmedCases, // unemployment claims data for each state
    y: unemploymentData, // covid-19 confirmed cases for each state
    mode: "markers",
    type: "scatter",
  };

  var data = [trace1];

  Plotly.newPlot("scatter", data);
}

function sumCasesPerState(array) {
  //source: https://gist.github.com/tleen/6299431
  var states = [
    "Alabama",
    "Alaska",
    // "American Samoa",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District of Columbia",
    // "Federated States of Micronesia",
    "Florida",
    "Georgia",
    // "Guam",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    // "Marshall Islands",
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
    // "Northern Mariana Islands",
    "Ohio",
    "Oklahoma",
    "Oregon",
    // "Palau",
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
