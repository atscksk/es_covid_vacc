function drawColumnChart() {
  $.ajax({
    url: "column",
    type: "POST",
    dataType: "json",
    success: function (result) {      
      Highcharts.chart('column', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Fully Vaccinated Per Hundred TOP10<br>(Countries over 100,000 Fully Vaccinated)'
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
        accessibility: {
          announceNewData: {
            enabled: true
          }
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          title: {
            text: ''
          }

        },
        legend: {
          enabled: false
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y:.1f}%'
            }
          }
        },

        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'
        },

        series: [
          {
            name: "Fully Vaccinated",
            colorByPoint: true,
            data: result
          }
        ],
      });
    },
    error: function (request, status, error) {
      console.error(error);
    }
  });
}


