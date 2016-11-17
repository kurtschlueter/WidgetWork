
var ctx = document.getElementById("singleValueBarCanvas").getContext("2d");



var data = {
    labels: [1, 2, 3, 4, 5, 6],
    datasets: [
        {
            backgroundColor: "#8bb229",
            borderWidth: 1,
            data: [65, 59, 80, 81, 56, 55],
        }
    ]
};

Chart.elements.Rectangle.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillText('sex', 50, 50);
};

var barChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
       legend: {
            display: false
         },
         tooltips: {
            enabled: false
         },
        scales: {
            yAxes: [{
              display: false,
                stacked: true,
                gridLines: {
                  drawOnChartArea: false
                }
            }],
            xAxes: [{
              display: false,
              gridLines: {
                drawOnChartArea: false
              }
            }]
        }
    }
});