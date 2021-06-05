function getCountryList() {
  $.ajax({
    url: "/table/countries",
    type: "POST",
    dataType: "json",
    success: function (result) {
      $("#countryFilter").autocomplete({
        source: result,
        minLength: 2,
        select: function (e, data) {
          drawDataTable(data.item.value);
        },
      })
    },
    error: function (request, status, error) {
      console.error(error);
    }
  })
}

function drawDataTable(param) {
  $.ajax({
    url: "/table/records",
    type: "POST",
    data: { param },
    dataType: "json",
    success: function (result) {
      const { columns, rows } = result;
      let colHtml = "";
      const cols = columns.map(col => {
        const colStr = col.name;
        const colName = colStr.split("_").map(s => s.replace(s[0], s[0].toUpperCase())).join(" ");
        colHtml += `<th>${colName}</th>`;
        return { data: colName };
      });
      document.getElementById("tableTr").innerHTML = colHtml;

      const data = rows.map(row => {
        const obj = {};
        for (let i = 0; i < row.length; i++) {
          obj[cols[i].data] = i === 0 ? row[i].replace("T00:00:00.000Z", "") : row[i];
        }
        return obj;
      });
      $(document).ready(function () {
        $("#table").dataTable({
          data,
          columns: cols,
          destroy: true,
          columnDefs: [
            { width: "15%", "targets": 0, className: "text-center" },
            { width: "17%", "targets": 1, className: "text-center" },
            {
              width: "15%", "targets": 2, className: "text-center", render: function (data) {
                return data ? addComma(data) : data;
              }
            },
            {
              width: "18%", "targets": 3, className: "text-center", render: function (data) {
                return data ? addComma(data) : data;
              }
            },
            { width: "45%", "targets": 4 },
          ],
          order: [[0, "desc"]]
        });
      });
    },
    error: function (request, status, error) {
      console.error(error);
    }
  })
}

function clearInput(element) {
  element.value = "";
}