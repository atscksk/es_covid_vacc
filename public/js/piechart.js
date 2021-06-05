function drawPieChart() {
  $.ajax({
    url: "pie",
    type: "POST",
    dataType: "json",
    success: function (result) {
      const total = result[result.length - 1][1];

      const fulldata = result.map(arr => {
        return {
          name: arr[0],
          y: Number(((arr[1] / total) * 100).toFixed(2)),
          count: arr[1]
        }
      });

      const data = fulldata.slice(0, fulldata.length - 1);

      const colorData = [...Highcharts.getOptions().colors];
      colorData[5] = "#bfbfbf";

      Highcharts.chart('piechart', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
        },
        title: {
          text: `People Fully Vaccinated TOP5 Countries<br>(total: ${addComma(total)})`
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        tooltip: {
          formatter: function () {
            return this.series.name + ':<b>' + addComma(this.point.count) + '</b>';
          }
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            colors: colorData,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          name: 'People Fully Vaccinated',
          colorByPoint: true,
          data: data
        }]
      });

    },
    error: function (request, status, error) {
      console.error(error);
    }
  });
}
