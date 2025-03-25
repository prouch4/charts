function loadCSV() {
  Papa.parse("rf_importance_PFC.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      console.log(results.data);
      createChart(results.data);
    },
  });
}

function createChart(data) {
  var metabolites = [];
  var values = [];

  data.forEach(function (row) {
    metabolites.push(row.metabolites);
    values.push(parseFloat(row.values));
  });

  let sortedData = values
    .map((val, index) => [metabolites[index], val])
    .sort((a, b) => b[1] - a[1]);

  let sortedMetabolites = sortedData.map((item) => item[0]);
  let sortedValues = sortedData.map((item) => item[1]);

  console.log("Metabolites: ", sortedMetabolites);
  console.log("Values: ", sortedValues);

  Highcharts.chart("container", {
    chart: {
      type: "column",
    },
    title: {
      text: "PFC metabolites importance",
    },
    xAxis: {
      categories: sortedMetabolites,
      title: {
        text: "Metabolites",
      },
      labels: {
        autoRotation: [-45, -90],
        style: {
          fontSize: "13px",
          fontFamily: "Verdana, sans-serif",
        },
      },
    },
    yAxis: {
      title: {
        text: "Decreased Accuracy",
      },
      labels: {
        format: "{value:.2f}",
      },
      min: Math.min(0, Math.min(...values)),
    },

    legend: {
      enabled: false,
    },

    plotOptions: {
      column: {
        colors: [
          "#1f77b4",
          "#ff7f0e",
          "#2ca02c",
          "#d62728",
          "#9467bd",
          "#8c564b",
          "#e377c2",
          "#7f7f7f",
          "#bcbd22",
          "#17becf",
          "#ffbb78",
          "#98df8a",
        ],
        colorByPoint: true,
      },
    },

    series: [
      {
        name: "Values",
        colorByPoint: true,
        data: sortedValues,
        dataLabels: {
          enabled: true,
          inside: false,
          rotation: 0,
          color: "#000000",
          style: {
            fontSize: "12px",
            fontWeight: "verdana",
            textOutline: "none",
          },
          format: "{y:.2f}",
        },
      },
    ],

    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: [
            "printChart",
            "separator",
            "downloadPNG",
            "downloadJPEG",
            "downloadPDF",
            {
              text: "Download TIFF",
              onclick: function () {
                this.exportChartLocal({
                  type: "image/tiff",
                });
              },
            },
          ],
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", loadCSV);
