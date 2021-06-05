function drawMetricChart() {
  $.ajax({
    url: "metric",
    type: "POST",
    dataType: "json",
    success: function (result) {
      const [pv, pfv] = result;

      document.getElementById("pvValue").innerText = addComma(pv);
      document.getElementById("pfvValue").innerText = addComma(pfv);

    },
    error: function (request, status, error) {
      console.error(error);
    }
  });
}
