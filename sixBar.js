function AnonymousBars(elementDOM, settingsJSON) {

  this.settingsJSON = settingsJSON;
  this.elementDOM = elementDOM;
  this.ctx = this.elementDOM.getContext("2d");

  this.elementDOM.width  = this.settingsJSON.options.containerSize_a_i[0];
  this.elementDOM.height = this.settingsJSON.options.containerSize_a_i[1];

  this.dataArray = this.settingsJSON.data;
  this.graphBarColor_s  = this.settingsJSON.options.graphBarColor_s;
  this.backgroundColor_s = this.settingsJSON.options.backgroundColor_s;
  this.barWidth_i = this.settingsJSON.options.barWidth_i;
  this.spaceBetweenBars_i = this.settingsJSON.options.spaceBetweenBars_i;
  this.maxBarHeight_i = this.settingsJSON.options.maxBarHeight_i;
  this.minBarHeight_i = this.settingsJSON.options.minBarHeight_i;
  this.barRadius_i = this.settingsJSON.options.barRadius_i;
  this.animation_b = this.settingsJSON.options.animation_b;
  this.containerSize_a_i = this.settingsJSON.options.containerSize_a_i;

}

AnonymousBars.prototype.calculateMargins = function() {
  var numberOfBars = this.dataArray.length;
  var widthOfEntireGraph = numberOfBars * this.barWidth_i + (numberOfBars - 1) * this.spaceBetweenBars_i;
  var leftoverHorizontalSpace = this.containerSize_a_i[0] - widthOfEntireGraph;
  var leftoverVerticalSpace = this.containerSize_a_i[1] - this.maxBarHeight_i;
  this.horizontalMargin = leftoverHorizontalSpace / 2;
  this.verticalMargin = leftoverVerticalSpace / 2;
}

AnonymousBars.prototype.getDataHeights = function() {

  var dataMinimum = Math.min.apply(null, this.dataArray);
  var dataMaximum = Math.max.apply(null, this.dataArray);
  if (dataMaximum == dataMinimum) {
    var slope = 0;
  } else {
    var slope = (this.maxBarHeight_i - this.minBarHeight_i) / (dataMaximum - dataMinimum);
  }

  var yIntercept = this.minBarHeight_i - slope * dataMinimum;
  this.dataHeights = [];

  for (var i = 0; i < this.dataArray.length; i++) {
    this.dataHeights[i] = slope * this.dataArray[i] + yIntercept;
  }

  console.log(this.dataHeights)
  return this.dataHeights;
};

AnonymousBars.prototype.getIndividualRoundedPoint = function(point1, point2, radius, first) {
  var total = Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
  var idx = first ? radius / total : (total - radius) / total;
  return [point1[0] + (idx * (point2[0] - point1[0])), point1[1] + (idx * (point2[1] - point1[1]))];
};

AnonymousBars.prototype.convertToRoundedPoints = function(points, radius) {

  var outputRoundedPoints = new Array(points.length);
  var nextPointIndex, previousPointIndex, previousPoint, currentPoint, nextPoint;

  for (var i = 0; i < points.length; i++) {

    // If index is zero, then previous point is last point in array to close loop
    if (i == 0) {
      previousPointIndex = points.length - 1;
      nextPointIndex = i + 1;
    }
    // If index is the last one, then next point is first point in array to close loop
    else if (i == points.length - 1) {
      nextPointIndex = 0;
      previousPointIndex = i - 1;
    }
    else {
      previousPointIndex = i - 1;
      nextPointIndex = i + 1;
    }

    previousPoint = points[previousPointIndex];
    currentPoint = points[i];
    nextPoint = points[nextPointIndex];

    prevPt = this.getIndividualRoundedPoint(previousPoint, currentPoint, radius, false);
    nextPt = this.getIndividualRoundedPoint(currentPoint, nextPoint, radius, true);
    outputRoundedPoints[i] = [prevPt[0], prevPt[1], currentPoint[0], currentPoint[1], nextPt[0], nextPt[1]];
  }
  return outputRoundedPoints
};

AnonymousBars.prototype.pasteGraph = function(numberOfBars) {

  var distanceFromTop = this.verticalMargin + this.maxBarHeight_i;
  var left, right, bottom, top, points;

  for (var i = 0; i < numberOfBars; i++) {
    this.ctx.beginPath();

    left = this.horizontalMargin + (this.barWidth_i + this.spaceBetweenBars_i) * i;
    right = left + this.barWidth_i;
    bottom = distanceFromTop;
    top = distanceFromTop - this.dataHeights[i];
    points = [[left, top], [right, top], [right, bottom], [left, bottom]]

    // If radius is zero, then the four points will be fine to draw a clean rectangle. If not we need to get adjusted points.
    if (this.barRadius_i > 0) { points = this.convertToRoundedPoints(points, this.barRadius_i) }

    for (var ii = 0; ii < points.length; ii++) {
      if (ii == 0) { this.ctx.moveTo(points[ii][0], points[ii][1]) }
      else { this.ctx.lineTo(points[ii][0], points[ii][1]) }
      if (this.barRadius_i > 0) { this.ctx.quadraticCurveTo(points[ii][2], points[ii][3], points[ii][4], points[ii][5]) }
    }

    this.ctx.fillStyle = this.graphBarColor_s;
    this.ctx.fill();
    this.ctx.closePath();
  }
};

AnonymousBars.prototype.animationCycler = function(incrementer, numberOfBars) {
  var sixBarsThis = this;
  var maxIncrementValue = 1000;
  var numberOfDivisions = this.dataArray.length + 2;
  var evenIncrementDivide = maxIncrementValue / numberOfDivisions;

  var incrementer = (typeof incrementer === 'undefined') ? 0 : incrementer;
  var numberOfBars = (typeof numberOfBars === 'undefined') ? 0 : numberOfBars;



  this.ctx.clearRect(0, 0, this.containerSize_a_i[0], this.containerSize_a_i[1]);



  // if (incrementer > evenIncrementDivide * 0 && incrementer <= evenIncrementDivide * 1) { this.pasteGraph(0); }

  // if (incrementer > evenIncrementDivide * 1 && incrementer <= evenIncrementDivide * 2) { this.pasteGraph(1); }

  // if (incrementer > evenIncrementDivide * 2 && incrementer <= evenIncrementDivide * 3) { this.pasteGraph(2); }

  // if (incrementer > evenIncrementDivide * 3 && incrementer <= evenIncrementDivide * 4) { this.pasteGraph(3); }

  // if (incrementer > evenIncrementDivide * 4 && incrementer <= evenIncrementDivide * 5) { this.pasteGraph(4); }

  // if (incrementer > evenIncrementDivide * 5 && incrementer <= evenIncrementDivide * 6) { this.pasteGraph(5); }

  // if (incrementer > evenIncrementDivide * 6) { this.pasteGraph(6); }

  for (var x = 0 ; x < (numberOfDivisions) ; x++) {

    if (incrementer > evenIncrementDivide * x && incrementer <= evenIncrementDivide * (x + 1)) { this.pasteGraph(x); }

  }

  // this.pasteGraph();


  incrementer = incrementer + 5;
  if (incrementer  <= maxIncrementValue) {
    requestAnimationFrame(function () {
      sixBarsThis.animationCycler(incrementer);
    });
  }
}

AnonymousBars.prototype.drawBars = function() {
  this.calculateMargins();
  this.getDataHeights();
  if (this.animation_b == false) {
    this.pasteGraph(this.dataArray.length);
  } else {
    this.animationCycler();
  }

  // I took out the animation cycler for now. I need to work on the decelerator.
};
