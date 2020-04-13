var confirmedPath = "./static/data/covid_us_confirmed.json";
var unemploymentPath = "./static/data/unemployment_claims.json";

var casesData;
var claimsData;

d3.json(confirmedPath).then((confirmedCasesData) => {
  d3.json(unemploymentPath).then((unemploymentClaimsData) => {
    console.log("Original Unemployment Data", unemploymentClaimsData);
    for (var i = 0; i < Object.keys(unemploymentClaimsData).length; i++) {
      var unemploymentClaimsDict = {};
      var confirmedCasesDict = {};

      for (var c in unemploymentClaimsData) {
        unemploymentClaimsDict[c] = formatArrayToObject(
          unemploymentClaimsData[c]
        );
      }
      console.log("Formatted Unemployment Data", unemploymentClaimsDict);
      // claimsData = unemploymentClaimsDict;
      // console.log("unemploymentClaimsDict: ", unemploymentClaimsDict);

      // if (Object.keys(Object.entries(unemploymentClaimsDict)[0]).includes(Object.keys(confirmedCasesData)[j])) {}
      // for (var x in unemploymentClaimsDict) {
      //   console.log(Object.keys(unemploymentClaimsDict[x]).length);
      // }

      for (var j = 0; j < Object.keys(confirmedCasesData).length; j++) {
        var firstClaimObj = Object.entries(unemploymentClaimsDict)[0][1];
        // console.log("firstClaimObj: ", firstClaimObj);
        // Retrive data for matching dates from both datasets
        if (
          Object.keys(unemploymentClaimsData)[i] ===
          Object.keys(confirmedCasesData)[j]
        ) {
          // For covid-cases data
          var statesWithTotalCasesDict = {};
          var records = Object.values(confirmedCasesData)[j];
          var statesWithTotalCases = sumCasesPerState(records);
          statesWithTotalCasesDict[
            Object.keys(unemploymentClaimsData)[i]
          ] = statesWithTotalCases;
          var dictToArray = Object.entries(
            Object.entries(statesWithTotalCasesDict)[0][1]
          );
          // console.log("dictToArray", dictToArray);
          // for (let x = 0; x < dictToArray.length; x++) {
          //   console.log("x0: ", dictToArray[x][0]);
          //   if (!Object.keys(firstClaimObj).includes(dictToArray[x][0])) {
          //     delete statesWithTotalCasesDict[x][0];
          //     console.log("deleted");
          //   }
          // }
          // console.log(
          //   "Final Confirmed Cases Data:",
          //   Object.entries(Object.entries(statesWithTotalCasesDict)[0][1])
          // );
          casesData = statesWithTotalCasesDict;
        }
      }
    }
  });
});

// Change the data format to {date: {state : number, state: number}} to match covid-19 data
function formatArrayToObject(array) {
  var obj = {};
  // for (var i = 0; i < array.length; i++) {
  for (let [key, val] of Object.entries(array)) {
    obj[key] = val;
  }
  return obj;
  // }
}
// console.log("Formatted Unemployment Data", obj);

// }

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
