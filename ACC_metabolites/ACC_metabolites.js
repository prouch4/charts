function loadCSV() {
  Papa.parse("rf_importance_ACC.csv", {
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

  const colorMap = {
    Gln: "#1f77b4",
    Glu: "#ff7f0e",
    mI: "#2ca02c",
    NAA: "#d62728",
    sI: "#9467bd",
    tCho: "#8c564b",
    GSH: "#e377c2",
    NAAG: "#7f7f7f",
    Asc: "#bcbd22",
    Asp: "#17becf",
    Lac: "#ffbb78",
    GABA: "#98df8a",
  };

  function getColor(metabolite) {
    return colorMap[metabolite] || "#7f7f7f";
  }

  Highcharts.chart("container", {
    chart: {
      type: "column",
    },
    title: {
      text: "ACC metabolites importance",
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

    series: [
      {
        name: "Values",
        colorByPoint: true,
        data: sortedValues.map((value, index) => ({
          y: value,
          color: getColor(sortedMetabolites[index]),
        })),
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
