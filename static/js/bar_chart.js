var confirmedCases = "./static/data/covid_us_confirmed.json"

function initializeDashboard() {
    d3.json(confirmedCases).then(function (dataSet) {
        console.log(dataSet);

        Object.entries(dataSet).forEach(function ([date, records]) {
            console.log(`${date}:${records.length}`)
            sumStateCases(records);
        });
    })
}

function sumStateCases(records) {
    var states = [];
    var total_cases = [];

    records.forEach(function (record) {
        if (states.includes(record.Province)) {
            // console.log("SEEN");
        }
        else {
            states.push(record.Province);
        }
        // else if (~(record.Province in states)) {
        //     print(record.Province in states);
        // }
    })
    console.log(states);

}

function createBarChart(covidData) {
    // console.log(covidData);

}
initializeDashboard();