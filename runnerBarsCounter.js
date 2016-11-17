var value = 5;
var prefix = '';
var sufix = '%';

var prefixElement = document.getElementById("singleValueBarPrefix");
prefixElement.innerHTML = prefix;

var sufixElement = document.getElementById("singleValueBarSufix");
sufixElement.innerHTML = sufix;

numberAnimation = new CountUp("singleValueBarValue", 0, 5, 2, 2);
numberAnimation.start();

var ctx = document.getElementById("singleValueBarCanvas").getContext("2d");

var barChartData = {
  labels: ["", "", "", "", "", ""],
  datasets: [{
    fillColor: "#8bb229",
    strokeColor: "#8bb229",
    data: [111.5, 121.6, 51.2, 101.2, 121, 131.5]
  }]
}

// var myBar = new Chart(ctx).MyBar(barChartData, {animation: true, showScale: false});
// var myBar = new Chart(ctx)

var myLine = new Chart(ctx).BarAlt(barChartData, {
    animation: true,
    showScale: false,
    curvature: 1
});