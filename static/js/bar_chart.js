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
    var total_cases_per_state = [];
    var sum = 0;

    records.forEach(function (record) {
        if (~(states.includes(record.Province))) {
            // total_cases.push(sum);
            states.push(record.Province);
            total_cases_per_state = []
            total_cases_per_state.push(record.Cases);
            // sum = record.Cases;
        }
        else {
            total_cases_per_state.push(record.Cases);
        }
        // else if (~(record.Province in states)) {
        //     print(record.Province in states);
        // }
    })
    if (total_cases_per_state.length > 0) {
        var sum = total_cases_per_state.reduce(function (a, b) {
            return a + b;
        }, 0);
        console.log(sum);
    }

}

function createBarChart(covidData) {
    // console.log(covidData);

}
initializeDashboard();