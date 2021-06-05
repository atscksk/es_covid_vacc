function drawLineChart() {
  $.ajax({
    url: "line",
    type: "POST",
    dataType: "json",
    success: function (result) {
      const { dateValue, vaccinationData } = result;
      Highcharts.chart('basicline', {

        title: {
          text: 'Monthly Vaccinations Per Million, 2020.12-2021.05<br>(Fully Vaccinated Per Hundred TOP5 Countries)'
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        subtitle: {
          text: ''
        },

        yAxis: {
          title: {
            text: ''
          }
        },

        xAxis: {
          categories: dateValue
        },

        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },

        tooltip: {
          formatter: function () {
            return this.point.category + '<br><b>' + this.series.name + ': </b><b>' + addComma(this.point.y) + '</b>';
          }
        },

        series: vaccinationData,

        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
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

