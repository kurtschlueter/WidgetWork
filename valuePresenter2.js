 // StackedWheel object takes in two properties; an elementID to identify the canvas container in the DOM, and a json object that contains the data that will populate value along with the settings.
function ValuePresenter3(elementDOM, settingsJSON) {
console.log(elementDOM)
  this.settingsJSON = settingsJSON;
  this.elementDOM = elementDOM;
  this.ctx = this.elementDOM.getContext("2d");

  this.elementDOM.width  = this.settingsJSON.options.containerSize_a_i[0];
  this.elementDOM.height = this.settingsJSON.options.containerSize_a_i[1];



  this.title_s = this.settingsJSON.data.title_s;
  this.currentValue_f = this.settingsJSON.data.currentValue_f;
  this.lastSixMonths_a_f = this.settingsJSON.data.lastSixMonths_a_f;

  this.valueSymbol_s = this.settingsJSON.options.valueSymbol_s;
  this.valueTextColor_s = this.settingsJSON.options.valueTextColor_s;
  this.valueTextFont_s = '30pt Helvetica';
  this.titleTextColor_s = this.settingsJSON.options.titleTextColor_s;
  this.titleTextFont_s = '11pt Helvetica';
  this.graphBarColor_s  = this.settingsJSON.options.graphBarColor_s;

  this.blurColor_s = this.settingsJSON.options.blurColor_s;
  this.backgroundColor_s = this.settingsJSON.options.backgroundColor_s;
  this.animation_b = this.settingsJSON.options.animation_b;
  this.containerSize_a_i = this.settingsJSON.options.containerSize_a_i;

  this.marginWhateverLeft = this.containerSize_a_i[0]/3;
  this.marginWhateverTop = this.containerSize_a_i[1]/2.6;

  this.marginWhateverTopGraph = 0;
  this.marginLeftSpacerWhateverGraph = 0;
}

// I really do not like this decelerator. To be honest, requestAnimationFrame is kind of a pain in the ass to use. I cannot control the number of intervals and timing.
ValuePresenter.prototype.animationCycler = function(newValue, decelerator, xxx) {

  var valuePresenter = this;
  var fullValue = this.currentValue_f;
  var barsNumber;

  var decelerator = (typeof decelerator === 'undefined') ? (.04) : decelerator;
  var newValue = (typeof newValue === 'undefined') ? 0 : newValue;
  var xxx = (typeof xxx === 'undefined') ? 0 : xxx;

  // The bars show up one at a time, since this animation process depends on the value counting up, I just picked when a new bar should show up depending on what percentage of the value is complete. Pretty simple.
  if (newValue >= 0 && newValue < fullValue * .2) { barsNumber = 1 }
  else if (newValue >= fullValue * .2 && newValue < fullValue * .4) { barsNumber = 2 }
  else if (newValue >= fullValue * .4 && newValue < fullValue * .6) { barsNumber = 3 }
  else if (newValue >= fullValue * .6 && newValue < fullValue * .8) { barsNumber = 4 }
  else if (newValue >= fullValue * .8 && newValue < fullValue * .95) { barsNumber = 5 }
  else { barsNumber = 6 }

  // Here is the decelerator for the value count. These numbers are random. I just picked what looks good. The else statement here allows for the nice effect of counting down the last 5 marks at a steady and visible rate (whatever the f .0005 is). Again. I would like control of this. But for now we will leave it.
  if (newValue < fullValue * .9){
    newValue = newValue + fullValue * decelerator;
  }
  else if (newValue >= this.currentValue_f * .75 && newValue < fullValue * .95) {
    decelerator = decelerator / 1.1
    newValue = newValue + fullValue * decelerator;
  }
  else if (newValue >= fullValue - .05) {
    decelerator = .0005/fullValue
    newValue = newValue + .01 * decelerator;
  }
  else {
    newValue = fullValue - .05;
    decelerator = 0;
    newValue = newValue + fullValue * decelerator;
  }

  this.ctx.clearRect(0, 0, this.containerSize_a_i[0], this.containerSize_a_i[1]);
  newValue = newValue + fullValue * decelerator;

  this.pasteRoundedBackground();
  this.pasteText('title');
  this.pasteText('unit');
  this.pasteGraph(barsNumber)

  // Sometimes the decelerator will add more than it should due to number divisibility issues. So I just always make sure that nothing over the max value is ever printed.
  if (newValue > fullValue) { this.pasteText('value', fullValue) }
  else { this.pasteText('value', newValue) }

  if (newValue < this.currentValue_f) {
    requestAnimationFrame(function () {
      valuePresenter.animationCycler(newValue, decelerator, xxx);
    });
  }
}

ValuePresenter.prototype.pasteRoundedBackground = function() {

  this.ctx.fillStyle = this.backgroundColor_s;
  this.ctx.shadowColor = this.blurColor_s;
  this.ctx.shadowBlur = 5;

  var xStart = this.ctx.shadowBlur / 2 + 2;
  var yStart = this.ctx.shadowBlur / 2 + 2;
  var width = this.containerSize_a_i[0] - xStart * 2;
  var height = this.containerSize_a_i[1] - yStart * 2;
  var radius = 1;

  this.ctx.save(); // save the context so we don't mess up others
  this.ctx.beginPath();

  // draw top and top right corner
  this.ctx.moveTo(xStart + radius, yStart);
  this.ctx.arcTo(xStart + width, yStart, xStart + width, yStart + radius, radius);

  // draw right side and bottom right corner
  this.ctx.arcTo(xStart + width, yStart + height, xStart + width - radius, yStart + height, radius);

  // draw bottom and bottom left corner
  this.ctx.arcTo(xStart, yStart + height, xStart, yStart + height - radius, radius);

  // draw left and top left corner
  this.ctx.arcTo(xStart, yStart, xStart + radius, yStart, radius);

  this.ctx.fill();
  this.ctx.restore();  // restore context to what it was on entry

  this.ctx.shadowBlur = 0;
};

ValuePresenter.prototype.pasteText = function(type, value) {
  this.ctx.beginPath();

  // Ok the margin on the left really depends on how large the value we are counting up to is plus whether or not a symbol like a dollar sign is wanted. The longer it is, the more I have to push it left.
  if (this.valueSymbol_s != "none") { var subtractLeftMarginForSymbol = 10 * this.valueSymbol_s.length }
  else { var subtractLeftMarginForSymbol = 0 }
  var subtractLeftMarginForSymbol = 10;
  var marginLeft = this.marginWhateverLeft - (this.currentValue_f.toFixed(2).length - 4) * 25 - subtractLeftMarginForSymbol

  if (type == "title"){
    this.ctx.fillStyle = this.titleTextColor_s;
    this.ctx.font = this.titleTextFont_s;
    this.ctx.fillText(this.title_s, marginLeft + 5, this.marginWhateverTop); //80 left
  }

  if (type == "value"){
    var fontSize = parseInt(this.valueTextFont_s.match(/\d/g).join(""));
    var marginTop = this.marginWhateverTop + fontSize + 12;

    var fillText = value.toFixed(2);
    if (this.valueSymbol_s != "none") {
      var marginLeft = marginLeft + fontSize/2 + 10;
      this.marginLeftSpacerWhateverGraph = 10;
    }
    this.ctx.fillStyle = this.valueTextColor_s;
    this.ctx.font = this.valueTextFont_s;
    this.ctx.fillText(fillText, marginLeft, marginTop );
    this.marginWhateverTopGraph = this.marginWhateverTop + fontSize + 12;
    this.marginLeftSpacerWhateverGraph
  }

  if (type == "unit") {
    var fontSize = parseInt(this.valueTextFont_s.match(/\d/g).join(""));
    var marginTop = this.marginWhateverTop + fontSize + 12;
    this.ctx.fillStyle = this.valueTextColor_s;
    this.ctx.font = this.valueTextFont_s;
    if (this.valueSymbol_s != "none") {
      this.ctx.fillText(this.valueSymbol_s, marginLeft, marginTop );
    }
  }
  this.ctx.closePath();
};

ValuePresenter.prototype.pasteGraph = function(bars) {

  if (this.valueSymbol_s != "none") { var addLeftMarginForSymbol = -this.valueSymbol_s.length * 2 }
  else { var addLeftMarginForSymbol = 0 }

  var initialDistanceFromLeft = this.marginWhateverLeft + 150 - ( this.currentValue_f.toFixed(2).length + addLeftMarginForSymbol )* 10;
  var distanceFromTop = this.marginWhateverTopGraph;
  var barWidth = 5;
  var spaceBetweenBars = 6;
  var radius = 3;

  var left, right, bottom, top, points;

  var dataHeights = this.getDataHeights(45);

  for (var i = 0; i < bars; i++) {
    this.ctx.beginPath();

    left = initialDistanceFromLeft + (barWidth + spaceBetweenBars) * i;
    right = left + barWidth;
    bottom = distanceFromTop;
    top = distanceFromTop - dataHeights[i];
    points = [[left, top], [right, top], [right, bottom], [left, bottom]]

    // If radius is zero, then the four points will be fine to draw a clean rectangle. If not we need to get adjusted points.
    if (radius > 0) { points = this.convertToRoundedPoints(points, radius) }

    for (var ii = 0; ii < points.length; ii++) {
      if (ii == 0) { this.ctx.moveTo(points[ii][0], points[ii][1]) }
      else { this.ctx.lineTo(points[ii][0], points[ii][1]) }
      if (radius > 0) { this.ctx.quadraticCurveTo(points[ii][2], points[ii][3], points[ii][4], points[ii][5]) }
    }

    this.ctx.fillStyle = this.graphBarColor_s;
    this.ctx.fill();
    this.ctx.closePath();
  }
};

ValuePresenter.prototype.getDataHeights = function(maxBarHeight) {

  var dataMinimum = Math.min.apply(null, this.lastSixMonths_a_f);
  var dataMaximum = Math.max.apply(null, this.lastSixMonths_a_f);
  var heightMinimum = 5;
  var heightMaximum = maxBarHeight;
  var slope = (heightMaximum - heightMinimum) / (dataMaximum - dataMinimum);
  var yIntercept = heightMinimum - slope * dataMinimum;

  var dataHeights = [];

  for (var i = 0; i < this.lastSixMonths_a_f.length; i++) {
    dataHeights[i] = slope * this.lastSixMonths_a_f[i] + yIntercept;
  }
  return dataHeights;
};

ValuePresenter.prototype.convertToRoundedPoints = function(points, radius) {

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

ValuePresenter.prototype.getIndividualRoundedPoint = function(point1, point2, radius, first) {
  var total = Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
  var idx = first ? radius / total : (total - radius) / total;
  return [point1[0] + (idx * (point2[0] - point1[0])), point1[1] + (idx * (point2[1] - point1[1]))];
};

ValuePresenter.prototype.drawPresenter = function() {
  this.pasteRoundedBackground();
  this.pasteText('title');
  this.pasteText('unit');
  if (this.animation_b == true) {
    this.animationCycler();
  } else {
    this.pasteText('value', this.currentValue_f);
    this.pasteGraph(6);
  }
};
