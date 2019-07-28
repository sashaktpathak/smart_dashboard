var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var color = Chart.helpers.color;
var barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
        label: 'Dataset 1',
        backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
        borderColor: window.chartColors.red,
        borderWidth: 1,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 2',
        backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
        borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 3',
        backgroundColor: color(window.chartColors.orange).alpha(0.5).rgbString(),
        borderColor: window.chartColors.orange,
        borderWidth: 1,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 4',
        backgroundColor: color(window.chartColors.yellow).alpha(0.9).rgbString(),
        borderColor: window.chartColors.yellow,
        borderWidth: 1,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 5',
        backgroundColor: color(window.chartColors.black).alpha(0.5).rgbString(),
        borderColor: window.chartColors.black,
        borderWidth: 1,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 6',
        backgroundColor: color(window.chartColors.purple).alpha(0.5).rgbString(),
        borderColor: window.chartColors.purple,
        borderWidth: 1,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 7',
        backgroundColor: color(window.chartColors.grey).alpha(0.5).rgbString(),
        borderColor: window.chartColors.grey,
        borderWidth: 1,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 8',
        backgroundColor: color(window.chartColors.green).alpha(1).rgbString(),
        borderColor: window.chartColors.green,
        borderWidth: 1,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 9',
        backgroundColor: 'rgba(12, 255, 0, 0.9)',
        borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 10',
        backgroundColor: 'rgb(238,10,250)',
        borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 11',
        backgroundColor: 'rgb(250,255,0)',
        borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }, {
        label: 'Dataset 12',
        backgroundColor: 'rgb(0,29,255)',
        borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ]
    }]

};
function resetZoom() {
    window.mybar.resetZoom();
}
var bar_config = {
    type: 'bar',
    data: barChartData,
    options: {
        responsive: false,
        legend: {
            position: 'top',
            labels: {
                fontSize: 15
            }
        },
        title: {
            display: true,
            text: 'Aggregated Bar Chart',
            fontSize: 18,
        },
        scales: {
            xAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: "Time",
                        fontSize: 22
                    },
                    ticks: {
                        maxRotation: 0,
                        fontSize: 17
                    }
                }
            ],
            yAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: "Energy (in Kwh.)",
                        fontSize: 22
                    },
                    ticks: {
                        fontSize: 17
                    }
                }
            ]
        },
        pan: {
            enabled: true,
            mode: "x",
            speed: 10,
            threshold: 10
        },
        zoom: {
            enabled: true,
            drag: false,
            mode: "x",
            limits: {
                max: 10,
                min: 0.5
            }
        },
        tooltips: {
            bodyFontSize: 17,
            titleFontSize: 15
        }
    }
}
var barChartData2 = {
    labels: [],
    datasets: [{
        label: 'Locations',
        backgroundColor: color(window.chartColors.blue).alpha(0.9).rgbString(),
        borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: [
        ]
    }]

};
var bar_config2 = {
    type: 'bar',
    data: barChartData2,
    options: {
        responsive: false,
        legend: {
            position: 'top',
            labels:
            {
                fontSize: 12
            }
        },
        title: {
            display: false,
            text: ['Relative Energy Consumption Index', 'Average Energy Consumption Index per Room for Selected Premise vis a vis', ' other premises for Monitored time'],
        }
    }
}