function initializeScatter(claimsData, casesData, date) {

  var datesList = [];
  var unemployment = [];
  var covidCases = [];

  for (var i = 0; i < Object.keys(casesData).length; i++) {
    for (var j = 0; j < Object.keys(claimsData).length; j++) {

      // Retrive data for matching dates from both datasets
      if (Object.keys(casesData)[i] === Object.keys(claimsData)[j]) {
        // Put dates as a list to reference index later
        datesList.push(Object.keys(casesData)[i]);

        // For covid-cases data
        var records = Object.values(casesData)[i];
        var statesWithTotalCases = sumScatter(records);
        // Push data to a list
        covidCases.push(statesWithTotalCases);
        unemployment.push(Object.values(claimsData)[j]);
      }
    }
  }
  createScatter(datesList, covidCases, unemployment, date);

}
var dayAndWeekX;
var dayAndWeekY;
function returnXaxisdata(datesList, covidCases, dateX) {
  xaxisData = [];
  var index;
  if (datesList.includes(dateX)) {
    index = datesList.indexOf(dateX);
    dayAndWeekX = index;
  } else {
    index = dayAndWeekX;
  };

  Object.entries(covidCases[index]).forEach(function ([state, cases]) {
    xaxisData.push(Math.log10(cases));
  });

  return xaxisData;
}

function returnYaxisdata(datesList, unemploymentClaims, dateY) {
  yaxisData = [];
  states = [];
  var index;
  if (datesList.includes(dateY)) {
    index = datesList.indexOf(dateY);
    dayAndWeekY = index;
  } else {
    index = dayAndWeekY;
  };

  for (var i = 0; i < unemploymentClaims[index].length; i++) {

    yaxisData.push(Object.values(unemploymentClaims[index][i]));
    yaxisData = yaxisData.flat();
    states.push(Object.keys(unemploymentClaims[index][i]));
    states = states.flat();
  }
  return states, yaxisData;
}

// Create scatter plot
function createScatter(datesList, confirmedCases, unemploymentData, date) {
  // Get value only from covid data
  let dateXY = date;
  // Get value only from unemployment data
  returnYaxisdata(datesList, unemploymentData, dateXY);
  returnXaxisdata(datesList, confirmedCases, dateXY);

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
    yaxis: {
      title: "Unemployment Claims(per week)",
      range: [0, 500000],
    },
  };
  Plotly.newPlot("scatter", data, format, { displayModeBar: false });
}

function sumScatter(array) {
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