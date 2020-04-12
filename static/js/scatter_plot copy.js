var confirmedCases = "./static/data/covid_us_confirmed.json";
var unemploymentCases = "./static/data/unemployment_claims.json";

// // Set an empty array
var unemployment = [];
var covidCases = [];

// Get confirmed cases data
d3.json(unemploymentCases).then(function (claimsData) {
  d3.json(confirmedCases).then(function (casesData) {
    console.log("Original claims data", claimsData);

    for (var i = 0; i < Object.keys(claimsData).length; i++) {
      for (var j = 0; j < Object.keys(casesData).length; j++) {
        // Retrive data for matching dates from both datasets
        if (Object.keys(claimsData)[i] === Object.keys(casesData)[j]) {
          // For covid-cases data
          var statesWithTotalCasesDict = {};
          var records = Object.values(casesData)[j];
          var statesWithTotalCases = sumCasesPerState(records);
          statesWithTotalCasesDict[
            Object.keys(claimsData)[i]
          ] = statesWithTotalCases;
          // console.log("Original COVID-19 Data", statesWithTotalCasesDict);

          unemployment.push(claimsData);
          covidCases.push(statesWithTotalCasesDict);
          // console.log("Claims Dict", claimsTotalDict);
          // For unemployment claims data
          // console.log("Unemployment Claims", claimsTotalDict);

          // Retrive data for matching states from both datasets
          // Unemployment claims
          // var claimsDateSet = claimsData[Object.keys(claimsData)[i]];
          // var claimsFinalData = claimsDateSet.map((i) => Object.keys(i).flat());
          // var claimsDateSet = claimsTotalDict[Object.keys(claimsData)[i]];
          // var claimsStatesName = claimsDateSet
          //   .map((i) => Object.keys(i))
          //   .flat();
          // console.log(claimsTotalDict);

          // // COVID-19 cases
          // // Create a new dictionary and put only matching states
          // var casesFinalDict = {};
          // casesFinalDict[Object.keys(casesData)[j]] = {};
          // // if (
          // //   claimsStatesName.includes(
          // //     Object.keys(Object.entries(Object.values(claimsData)[i])[i][1])
          // //   )
          // // ) {
          // console.log(
          //   Object.keys(Object.entries(Object.values(claimsData)[i])[i][1])
          // );
          // console.log(
          //   claimsStatesName.includes(
          //     Object.keys(Object.entries(Object.values(claimsData)[i])[i][1])
          //   )
          // );
          // // }
          // console.log("Cases Data(filtered states", casesFinalDict);
          // console
          //   .log
          //   // Object.keys(Object.entries(Object.values(claimsData)[i])[i][1])
          //   ();

          // var casesDataSet =
          //   statesWithTotalCasesDict[Object.keys(statesWithTotalCasesDict)];
          // var casesFinalData = Object.entries(casesDataSet).filter((j) =>
          //   claimsFinalData.includes(j)
          // );
          //   var casesFinalData = Object.entries(casesDataSet)
          //     .filter((i, j) => claimsFinalData.includes(i))
          //     .map((i) => ({ [i[0]]: i[1] }));
          //   var casesFinalData = casesDataSet.map((i) => Ob
          //   console.log(claimsDateSet);
          // console.log("Check claim state name", claimsStatesName);
          // console.log("Check cases state name", casesFinalDict);
        }

        //   console.log("state names of confirmed cases: ", casesStateNames);
      }
    }
    console.log("Final claims data", unemployment);
    console.log("Final cases data", covidCases);
    // createScatter(covidCases, unenmployment);
  });
});

function returndata(data, date) {
  return data[date];
}

console.log(returndata(unemployment, "2020-03-21"));

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
