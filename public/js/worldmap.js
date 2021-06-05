function drawWorldMap(param) {
  $.ajax({
    url: "/map/mapdata",
    type: "POST",
    data: { param },
    dataType: "json",
    success: function (result) {
      const dtText = param === "pv" ? "People Vaccinated" : (param === "pfv" ? "People Fully Vaccinated" : "Total Vaccinations");

      Highcharts.mapChart('worldmap', {
        chart: {
          map: 'custom/world',
          borderWidth: 1,
        },

        colors: ['rgba(19,64,117,0.05)', 'rgba(19,64,117,0.2)', 'rgba(19,64,117,0.4)',
          'rgba(19,64,117,0.5)', 'rgba(19,64,117,0.6)', 'rgba(19,64,117,0.8)', 'rgba(19,64,117,1)'],

        title: {
          text: `${dtText} Per Hundred by Country`
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        mapNavigation: {
          enabled: true
        },

        legend: {
          title: {
            text: `${dtText} (%)`,
            style: {
              color: ( // theme
                Highcharts.defaultOptions &&
                Highcharts.defaultOptions.legend &&
                Highcharts.defaultOptions.legend.title &&
                Highcharts.defaultOptions.legend.title.style &&
                Highcharts.defaultOptions.legend.title.style.color
              ) || 'black'
            }
          },
          align: 'left',
          verticalAlign: 'bottom',
          floating: true,
          layout: 'vertical',
          valueDecimals: 0,
          backgroundColor: ( // theme
            Highcharts.defaultOptions &&
            Highcharts.defaultOptions.legend &&
            Highcharts.defaultOptions.legend.backgroundColor
          ) || 'rgba(255, 255, 255, 0.85)',
          symbolRadius: 0,
          symbolHeight: 14
        },

        colorAxis: {
          dataClasses: [{
            to: 1
          }, {
            from: 1,
            to: 15
          }, {
            from: 15,
            to: 30
          }, {
            from: 30,
            to: 50
          }, {
            from: 50,
            to: 70
          }, {
            from: 70,
            to: 90
          }, {
            from: 90
          }]
        },

        series: [{
          data: result,
          joinBy: ['iso-a3', 'code'],
          animation: true,
          name: `${dtText} per hundred`,
          states: {
            hover: {
              color: '#a4edba'
            }
          },
          tooltip: {
            valueSuffix: '%'
          },
          shadow: false
        }]
      });
    },
    error: function (request, status, error) {
      console.error(error);
    }
  });
}
