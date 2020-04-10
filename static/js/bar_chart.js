var confirmedCases = "./static/data/covid_us_confirmed.json"

function initializeDashboard() {
    d3.json(confirmedCases).then(function (dataSet) {
        console.log(dataSet);

        var totalDays = Object.keys(dataSet).length;

        // for (let idx = 0; idx < totalDays; idx++) {
        //     var dateString = Object.keys(dataSet)[idx];
        //     var records = Object.values(dataSet)[idx]
        //     var statesWithTotalCasesDict = {}

        //     var statesWithTotalCases = sumCasesPerState(records);

        //     statesWithTotalCasesDict[dateString] = statesWithTotalCases;

        //     console.log(statesWithTotalCasesDict);

        //     console.log("\n");
        // }

        Object.entries(dataSet).forEach(function ([date, records]) {
            var statesWithTotalCasesDict = {}

            var statesWithTotalCases = sumCasesPerState(records);

            statesWithTotalCasesDict[date] = statesWithTotalCases;

            console.log(statesWithTotalCasesDict);

        });
    })
}

function sumCasesPerState(array) {
    var states = ['Alabama', 'Alaska', 'American Samoa',
        'Arizona', 'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'District of Columbia',
        'Federated States of Micronesia', 'Florida', 'Georgia',
        'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands',
        'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
        'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
        'New Mexico', 'New York', 'North Carolina', 'North Dakota',
        'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau',
        'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington',
        'West Virginia', 'Wisconsin', 'Wyoming']; //source: https://gist.github.com/tleen/6299431

    // Initialize totalCasesPerState with 0

    // Copy array and set it to zero
    var totalCasesPerState = [...states];
    totalCasesPerState.fill(0);

    for (let idx = 0; idx < array.length; idx++) {
        // console.log(`${array[idx].Province}: ${array[idx].Cases}`);

        var stateIndex = states.indexOf(array[idx].Province);

        if (stateIndex > -1) {
            totalCasesPerState[stateIndex] = totalCasesPerState[stateIndex] + array[idx].Cases;
        }
    }

    // Create dictionary of states and cases for a date
    var statesWithTotalCases = {}

    for (let i = 0; i < totalCasesPerState.length; i++) {
        statesWithTotalCases[states[i]] = totalCasesPerState[i];
    }

    return statesWithTotalCases;

}

function createBarChart(covidData) {
    // console.log(covidData);
    var xValues = covidData;
    var yValues = OTUdata.otu_ids.slice(0, 11);
    var OTULabels = OTUdata.otu_labels.slice(0, 11);


}
initializeDashboard();