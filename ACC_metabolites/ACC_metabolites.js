function loadCSV() {
    Papa.parse('rf_importance_ACC.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            console.log(results.data);
            createChart(results.data);
        }
    });
}


function createChart(data) {
    var metabolites = [];
    var values = [];

    data.forEach(function(row) {
        metabolites.push(row.metabolites);
        values.push(parseFloat(row.values));
    });

    console.log("Metabolites: ", metabolites);
    console.log("Values: ", values);

    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'ACC metabolites'
        },
        xAxis: {
            categories: metabolites,
            title: {
                text: 'Metabolites'
            },
            labels: {
                autoRotation: [-45, -90],
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Values'
            },
            labels: {
                format: '{value:.2f}'
            },
            min: Math.min(0, Math.min(...values)),
        },
    
        legend: {
            enabled: false
        },
        series: [{
            name: 'Values',
            data: values,
            colorByPoint: true,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                inside: true,
                verticalAlign: 'top',
                format: '{point.y:.2f}',
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
}

document.addEventListener('DOMContentLoaded', loadCSV);
