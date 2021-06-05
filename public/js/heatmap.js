function drawHeatMap() {
  $.ajax({
    url: "heatmap",
    type: "POST",
    dataType: "json",
    success: function (result) {
      const { vaccinated, manufacturer, location } = result;
      const refinedData = [];
      for (const vData of vaccinated) {
        refinedData.push([
          location.indexOf(vData[0]),
          manufacturer.indexOf(vData[1]),
          vData[2]
        ]);
      }
      Highcharts.chart('heatmap', {
        chart: {
          type: 'heatmap',
          marginTop: 70,
          marginBottom: 40,
          plotBorderWidth: 1,
        },
        title: {
          text: 'Number of Vaccinations by Country/Manufacturer'
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        xAxis: {
          categories: location
        },

        yAxis: {
          categories: manufacturer,
          title: null,
          reversed: true
        },

        accessibility: {
          point: {
            descriptionFormatter: function (point) {
              var ix = point.index + 1,
                xName = getPointCategoryName(point, 'x'),
                yName = getPointCategoryName(point, 'y'),
                val = point.value;
              return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
            }
          }
        },

        colorAxis: {
          min: 0,
          minColor: '#FFFFFF',
          maxColor: Highcharts.getOptions().colors[0]
        },

        legend: {
          align: 'right',
          layout: 'vertical',
          margin: 10,
          verticalAlign: 'middle',
          y: 25,
          symbolHeight: 200
        },

        tooltip: {
          formatter: function () {
            return '<b>' + getPointCategoryName(this.point, 'x') + '</b><br><b>' +
              addComma(this.point.value) + '</b><br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
          }
        },

        series: [{
          name: 'Number of Vaccinations',
          borderWidth: 1,
          data: refinedData,
          dataLabels: {
            enabled: true,
            color: '#000000'
          }
        }],

        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              yAxis: {
                labels: {
                  formatter: function () {
                    return this.value.charAt(0);
                  }
                }
              }
            }
          }]
        }

      });
    },
    error: function (request, status, error) {
      console.error(error);
    }
  });
}


function getPointCategoryName(point, dimension) {
  var series = point.series,
    isY = dimension === 'y',
    axis = series[isY ? 'yAxis' : 'xAxis'];
  return axis.categories[point[isY ? 'y' : 'x']];
}
