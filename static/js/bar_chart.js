var confirmedCases = "./static/data/covid_us_confirmed.json"
var recoveredCases = "./static/data/covid_us_recovered.json"
var deathCases = "./static/data/covid_us_deaths.json"

function sumCasesPerState(array) {
    //source: https://gist.github.com/tleen/6299431
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
        'West Virginia', 'Wisconsin', 'Wyoming'];

    // Initialize totalCasesPerState with 0

    // Copy array and set it to zero
    var totalCasesPerState = [...states]; // APPARENTLY, this is how you copy an array in Javascript!    
    totalCasesPerState.fill(0);
    // console.log(array.length);
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

    // console.log(statesWithTotalCases);

    return statesWithTotalCases;
}

function createBarChart(dateString, covidData) {
    // console.log(covidData);

    sortedCovidData = (sort_object(covidData));
    // sortedCovidData = ((covidData));

    var xValues = [];
    var yValues = [];

    // Populate x and y values
    Object.entries(sortedCovidData).forEach(function ([state, cases]) {
        xValues.push(state);
        yValues.push(cases);
    });

    // console.log(xValues);
    // console.log(yValues);

    // console.log(Math.max.apply(Math, yValues));


    var trace = {
        x: yValues.slice(0, 16),
        y: xValues.slice(0, 16),
        type: "bar",
        orientation: "h",
        name: "confirmedCases",
        // text: xValues.map(function (x) x * 0.001),
        textposition: 'auto',
        hoverinfo: 'none',
        marker: {
            color: 'rgba(50,171,96,0.6)',
            line: {
                color: 'rgba(50,171,96,1.0)',
                width: 0
            }
        },
        hovertemplate:
            "Confirmed: %{x}<br>" +
            "<extra></extra>"
    }
    var layout = {
        title: `Top 15 states with confirmed cases on ${dateString}`,
        margin: {
            l: 120,
            r: 20,
            t: 30,
            b: 40
        },
        yaxis: {
            autorange: "reversed",
            ticks: "outside",
            ticklen: 10,
            tickcolor: "white",
            linecolor: 'gray',
            linewidth: 0.01,
            mirror: true
        },
        xaxis: {
            // tickformat: ',.0%',
            range: [0, Math.max.apply(Math, yValues)],
            // side: "top",
            tickmode: "linear",
            tick0: 0,
            dtick: Math.round(Math.max.apply(Math, yValues) / 5),
            border: 1,
            linecolor: 'gray',
            linewidth: 0.5,
            mirror: true
        }
    };

    var data = [trace];

    Plotly.newPlot("stacked_bar_chart", data, layout, { displayModeBar: false });
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

    var sorted_obj = {}

    for (let idx = 0; idx < items.length; idx++) {
        sorted_obj[items[idx][0]] = items[idx][1];
    }
    return (sorted_obj)
}

function sortDictionary(obj) {
    var items = Object.keys(obj).map(function (key) {
        return [key, obj[key]];
    });
    // console.log(items);

    items.sort(function (first, second) {
        return second[1][0] - first[1][0];
    });

    var sorted_obj = {}

    for (let idx = 0; idx < items.length; idx++) {
        sorted_obj[items[idx][0]] = items[idx][1];
    }
    return (sorted_obj)
}

function createStackedBarChart(dateString, sortedCovidData) {

    var confirmed = [];
    var deaths = [];
    var stateNames = [];
    var sumOfCases = [];
    var totalNumberOfCasesInUS = 0
    var bar_colors = [];
    var labels = [];

    // Populate x and y values
    Object.entries(sortedCovidData).forEach(function ([state, cases]) {
        confirmed.push(cases[0]);
        deaths.push(cases[1]);
        stateNames.push(state);
        sumOfCases.push(cases[0] + cases[1]);
        totalNumberOfCasesInUS += (cases[0] + cases[1]);
        bar_colors.push("#FF0000");
        labels.push(`Count:${cases[0] + cases[1]}<br>Confirmed: ${cases[0]}<br>Deaths: ${cases[1]}`);

    });

    var percentCases = confirmed.map(function (item) { return item / totalNumberOfCasesInUS });
    var xValues = percentCases.slice(0, 11);
    var yValues = stateNames.slice(0, 11);

    var last_state_index = xValues.indexOf(0);

    if (last_state_index > 0) {
        xValues = percentCases.slice(0, last_state_index)
        yValues = stateNames.slice(0, last_state_index);
    }


    var trace1 = {
        x: xValues,
        y: yValues,
        type: "bar",
        orientation: "h",
        name: "Confirmed",
        // text: confirmed.map(x => Math.round(x * 0.001, 0.5)).map(String),
        textposition: 'outside',
        marker: {
            color: '#FF0000',
            opacity: 0.5,
            line: {
                color: '#FF0000',
                width: 1,
                opacity: 0.7
            }
        },
        // hoverinfo: text
        // hovertemplate:
        //     "%{x} of Total Cases<br>%{labels}" +
        //     "<extra></extra>"
    }

    var deaths = [];
    // var yValues = [];
    // var sumOfCases = [];

    // Populate x and y values
    Object.entries(sortedCovidData).forEach(function ([state, cases]) {
        deaths.push(cases[1]);// / (cases[0] + cases[1]));
        // yValues.push(state);
    });


    // console.log(xValues);
    // console.log(yValues);

    var trace2 = {
        x: deaths.slice(0, 11),
        y: stateNames.slice(0, 11),
        type: "bar",
        orientation: "h",
        name: "Deaths",
        marker: {
            color: '#636363',
            opacity: 0.5,
            line: {
                color: 'black',
                width: 1,
                opacity: 0.7
            }
        },
        // text: labels,
        // marker: {
        //     color: 'rgba(50,171,96,0.6)',
        //     line: {
        //         color: 'rgba(50,171,96,1.0)',
        //         width: 0
        //     }
        // },
        hovertemplate:
            "Deaths: %{x}<br>" +
            "<extra></extra>"
    }

    var layout = {
        title: `Date: ${dateString}, Total Cases: ${totalNumberOfCasesInUS}`,
        font: {
            size: 15,
            color: '#7f7f7f'
        },
        barmode: 'stack',
        // hoverdistance: 10,
        hovermode: 'closest',
        margin: {
            l: 120,
            r: 20,
            t: 50,
            b: 40
        },
        yaxis: {
            autorange: "reversed",
            ticks: "outside",
            ticklen: 10,
            tickcolor: "white",
            linecolor: 'gray',
            linewidth: 0.01,
            mirror: true,
            automargin: true
        },
        xaxis: {
            tickformat: ',.0%',
            range: [0, 1],
            // side: "top",
            tickmode: "linear",
            tick0: 0,
            dtick: 0.25,
            border: 1,
            linecolor: 'gray',
            linewidth: 0.5,
            mirror: true,
            automargin: true
        }
    };



    var data = [trace1];

    Plotly.newPlot("stacked_bar_chart", data, layout, { displayModeBar: false });

    var myPlot = document.getElementById('stacked_bar_chart')

    myPlot.on('plotly_hover', function (data) {
        var pn = '',
            tn = '',
            colors = [];
        for (var i = 0; i < data.points.length; i++) {
            pn = data.points[i].pointNumber;
            tn = data.points[i].curveNumber;
            // colors[i] = data.points[i].data.marker.color;
        };
        colors = bar_colors;
        colors[pn] = '#003175';

        var update = { 'marker': { color: colors, size: 16, opacity: 0.5 } };
        Plotly.restyle('stacked_bar_chart', update, [tn]);
    });

    myPlot.on('plotly_unhover', function (data) {
        var pn = '',
            tn = '',
            colors = [];
        for (var i = 0; i < data.points.length; i++) {
            pn = data.points[i].pointNumber;
            tn = data.points[i].curveNumber;
            colors = data.points[i].data.marker.color;
        };
        colors[pn] = '#FF0000';

        var update = { 'marker': { color: colors, opacity: 0.5 } };
        Plotly.restyle('stacked_bar_chart', update, [tn]);
    });


}

// initializeBarchart(idx,confirmedData, recoveredData, deathsData)


function initializeDashboard(idx) {
    d3.json(confirmedCases).then(function (confirmedData) {
        d3.json(recoveredCases).then(function (recoveredData) {
            d3.json(deathCases).then(function (deathsData) {
                console.log(confirmedData);
                console.log(recoveredData);
                console.log(deathsData);

                var totalDays = Object.keys(confirmedData).length;

                // for (let idx = 70; idx < 71; idx++) {
                var dateString = Object.keys(confirmedData)[idx];

                var records = Object.values(confirmedData)[idx];
                var sumOfConfirmed = sumCasesPerState(records);

                var records = Object.values(recoveredData)[idx];
                var sumOfRecovered = sumCasesPerState(records);

                var records = Object.values(deathsData)[idx];
                var sumOfDeaths = sumCasesPerState(records);

                // Combine all data together in a dictionary
                var allCasesPerStateDict = {}

                Object.keys(sumOfConfirmed).forEach(function (state) {
                    allCasesPerStateDict[state] = [sumOfConfirmed[state], sumOfDeaths[state]];
                })
                console.log(allCasesPerStateDict);

                // // Sort allCasesPerStateDict by number of Confirmed Cases
                var sortedAllCasesPerStateDict = sortDictionary(allCasesPerStateDict);
                console.log(sortedAllCasesPerStateDict);

                var sortedSumOfAllCasesPerStateDict = {}

                Object.keys(sortedAllCasesPerStateDict).forEach(function (state) {
                    sortedSumOfAllCasesPerStateDict[state] = (sortedAllCasesPerStateDict[state][0] +
                        sortedAllCasesPerStateDict[state][1]);
                })
                console.log(sortedSumOfAllCasesPerStateDict);

                createStackedBarChart(dateString, sortedAllCasesPerStateDict);

                // }


            });
        });
    });
    // initializeDashboard();
}

function initializeBarchart(idx, confirmedData, recoveredData, deathsData) {


    var totalDays = Object.keys(confirmedData).length;

    // for (let idx = 70; idx < 71; idx++) {
    var dateString = Object.keys(confirmedData)[idx];

    var records = Object.values(confirmedData)[idx];
    var sumOfConfirmed = sumCasesPerState(records);

    var records = Object.values(recoveredData)[idx];
    var sumOfRecovered = sumCasesPerState(records);

    var records = Object.values(deathsData)[idx];
    var sumOfDeaths = sumCasesPerState(records);

    // Combine all data together in a dictionary
    var allCasesPerStateDict = {}

    Object.keys(sumOfConfirmed).forEach(function (state) {
        allCasesPerStateDict[state] = [sumOfConfirmed[state], sumOfDeaths[state]];
    })
    // console.log(allCasesPerStateDict);

    // // Sort allCasesPerStateDict by number of Confirmed Cases
    var sortedAllCasesPerStateDict = sortDictionary(allCasesPerStateDict);
    // console.log(sortedAllCasesPerStateDict);

    var sortedSumOfAllCasesPerStateDict = {}

    Object.keys(sortedAllCasesPerStateDict).forEach(function (state) {
        sortedSumOfAllCasesPerStateDict[state] = (sortedAllCasesPerStateDict[state][0] +
            sortedAllCasesPerStateDict[state][1]);
    })
    // console.log(sortedSumOfAllCasesPerStateDict);

    createStackedBarChart(dateString, sortedAllCasesPerStateDict);

    // }
}

// initializeDashboard();
// initializeDashboard();