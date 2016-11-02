 // StackedWheel object takes in two properties; an elementID to identify the canvas container in the DOM, and a json object that contains the data that will populate the wheel along with the settings.
function StackedWheel(elementDOM, settingsJSON) {

  this.settingsJSON = settingsJSON;

  // Reference to element in DOM and launching canvas context. All static properties of ctx also defined here.
  this.elementDOM = elementDOM;
  // this.elementDOM.style.width = this.settingsJSON.options.containerSize_a_i[0].toString() + "px";
  // this.elementDOM.style.height = this.settingsJSON.options.containerSize_a_i[1].toString() + "px";
  this.ctx = this.elementDOM.getContext("2d");
  this.ctx.shadowBlur = 20;
  this.ctx.shadowOffsetX = 0;
  this.ctx.shadowOffsetY = 0;
  this.ctx.textAlign="center";

  this.containerSize_a_i = this.settingsJSON.options.containerSize_a_i;
  this.sections_a_o = this.settingsJSON.data.sections;
  this.animation_b = this.settingsJSON.options.animation_b;
  this.animationSpeed_i = this.settingsJSON.options.animationSpeed_i;
  this.radiusPop_i = this.settingsJSON.options.radiusPop_i;

  // This is the money object. Here we will population each layer of the wheel with sections containing positioning, styling, reference, and content data.
  this.layersWithSectionData_a_o = [];
}

// Ok this one is tough. This is recursive function with obj as the main input. Initially, obj is the entire data jSON passed in by the runner file. The way the jSON is set up is a data object with an array of sections. Each section can also have a data object containing an array of sections... and so on. This is how the data is divided into sections. Ok so this function goes recursivley through levels, and loops through sections at each one (the for loop). This is how I populate the very important this.layersWithSectionData_a_o array of objects. At each level and each section, I give this object the neccessary information to build the wheel. Level, currentPercentScope, and radiusScope are alos inputs in this recursive function. Why? Level is quite obvious. I need to know what level I am on in order to put the sections in the correct level of the this.layersWithSectionData_a_o. currentPercentScope is key becuase I need to know what percent the containing section spans with respect to 2*Pi. For example, If level 1 section 1 is 50% of the circle, and level 2 section 1 (which is part of level 1 section 1) is 50% of level 1 section 1, it is 25% of the entire circle. I need to know what the containing percent scope is. the same goes for the radiusScope. I know the widths of each layer, but I need to know radius from center in order to calculate positioning. That means I need the previous radius information
StackedWheel.prototype.recursivelyLoopAndGrabDataForCalculationsAndOrdering  = function(level, currentPercentScope, radiusScope, obj) {

  var level = (typeof level === 'undefined') ? 0 : level;
  var currentPercentScope = (typeof currentPercentScope === 'undefined') ? 100 : currentPercentScope;
  var obj = (typeof obj === 'undefined') ? this.sections_a_o.data : obj;
  var radiusScope = (typeof radiusScope === 'undefined') ? this.settingsJSON.options.initialRadius_i : radiusScope;

  this.layersWithSectionData_a_o[level] = (typeof this.layersWithSectionData_a_o[level] === 'undefined') ? {} : this.layersWithSectionData_a_o[level];

  var currentLevel = this.layersWithSectionData_a_o[level];

  currentLevel.sections = (typeof currentLevel.sections === 'undefined') ? [] : currentLevel.sections;

  currentLevel.sectionsIndex_i = (typeof currentLevel.sectionsIndex_i === 'undefined') ? 0 : currentLevel.sectionsIndex_i;
  currentLevel.lastPercentage_i = (typeof currentLevel.lastPercentage_i === 'undefined') ? 0 : currentLevel.lastPercentage_i;

  currentLevel.minimumArcWidth_i = this.settingsJSON.options.layers[level].minimumWidth_i;
  currentLevel.maximumArcWidth_i = this.settingsJSON.options.layers[level].maximumWidth_i;
  currentLevel.printOption_s = this.settingsJSON.options.layers[level].printOption_s;
  currentLevel.textColor_s = this.settingsJSON.options.layers[level].textColor_s;
  currentLevel.blurColor_s = this.settingsJSON.options.layers[level].blurColor_s;
  currentLevel.textFont_s = this.settingsJSON.options.layers[level].textFont_s;

  var tempNumberOfSections = obj.length;

  for (var x = 0; x < obj.length; x++) {

    currentLevel.sections[currentLevel.sectionsIndex_i] = {};
    var currentSection = currentLevel.sections[this.layersWithSectionData_a_o[level].sectionsIndex_i];

    currentSection.description_s = obj[x].description_s;
    currentSection.percentageArc_i = obj[x].percentageArc_i;
    currentSection.containerScope = currentPercentScope;
    currentSection.radiusScope_i = radiusScope;
    currentSection.color_s = this.settingsJSON.options.layers[level].colorScheme_a_s[x];

    this.calculateSectionArcGlobalPercentage(level, currentLevel.sectionsIndex_i)
    this.calculateRadialStarts(level, currentLevel.sectionsIndex_i)
    this.calculateRadialEnds(level, currentLevel.sectionsIndex_i)
    this.calculateGridPositioning(level, currentLevel.sectionsIndex_i, tempNumberOfSections);

    currentLevel.sectionsIndex_i = currentLevel.sectionsIndex_i + 1;
    currentLevel.lastPercentage_i = currentLevel.lastPercentage_i + currentSection.globalPercentageArc_i;

    if(typeof obj[x].data == 'object') {
      var tempNextRadius = currentSection.adjustedInnerRadius_i + currentSection. arcWidth_i/2;
      this.recursivelyLoopAndGrabDataForCalculationsAndOrdering(level + 1, currentSection.globalPercentageArc_i, tempNextRadius, obj[x].data)
    }
  }
}

// This calculates the current sections total percentage with respect to the entire circle. We can do this thanks to the containerPercentScope which is the total percentage of the parent.
StackedWheel.prototype.calculateSectionArcGlobalPercentage  = function(level, section, containerPercentScope) {
  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = currentLevel.sections[section];
  currentSection.globalPercentageArc_i = currentSection.containerScope / 100 * currentSection.percentageArc_i;
}

// Calculating at which radian the section starts.
StackedWheel.prototype.calculateRadialStarts  = function(level, section) {
  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = currentLevel.sections[section];

  // if not first section x!=0
  if (section != 0) {
    currentSection.radialStart = currentLevel.sections[section - 1].radialEnd
  }
  // if first section
  if (section == 0) {
    currentSection.radialStart = 0
  }
}

// Calculating at which radian the section ends.
StackedWheel.prototype.calculateRadialEnds  = function(level, section) {
  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = currentLevel.sections[section];
  currentSection.radialEnd = currentSection.radialStart + currentSection.globalPercentageArc_i * Math.PI / 50;
}

// Calculating the radius midpoint and x and y coordinates for center of each section
StackedWheel.prototype.calculateGridPositioning = function(level, section, numberOfSections) {

  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = currentLevel.sections[section];

  if(numberOfSections > 1) {
    var linearWidthDistribution = (currentLevel.maximumArcWidth_i - currentLevel.minimumArcWidth_i) / (numberOfSections - 1);
  } else {
    var linearWidthDistribution = 0;
  }
  // Section Width.
  currentSection.arcWidth_i = currentLevel.minimumArcWidth_i + linearWidthDistribution * (section % numberOfSections);

  if (level == 0) {
    currentSection.adjustedInnerRadius_i = currentSection.radiusScope_i + (currentSection.arcWidth_i - currentLevel.minimumArcWidth_i) / 2;
    // The center (I hope) of each section in x and y coordinates with respect to the entire container.
    currentSection.sweetSpotXcoord = this.containerSize_a_i[0] / 2 + currentSection.adjustedInnerRadius_i * Math.cos((currentSection.radialStart + currentSection.radialEnd) / 2);
    currentSection.sweetSpotYcoord = this.containerSize_a_i[1] / 2 + currentSection.adjustedInnerRadius_i * Math.sin((currentSection.radialStart + currentSection.radialEnd) / 2);
  } else {
    currentSection.adjustedInnerRadius_i = currentSection.radiusScope_i + (currentSection.arcWidth_i) / 2;
    // The center (I hope) of each section in x and y coordinates with respect to the entire container.
    currentSection.sweetSpotXcoord = this.containerSize_a_i[0] / 2 + (currentSection.adjustedInnerRadius_i + this.radiusPop_i * level/2) * Math.cos((currentSection.radialStart + currentSection.radialEnd) / 2);
    currentSection.sweetSpotYcoord = this.containerSize_a_i[1] / 2 + (currentSection.adjustedInnerRadius_i + this.radiusPop_i * level/2) * Math.sin((currentSection.radialStart + currentSection.radialEnd) / 2);
  }
}

// This one is a work in progress. This is the animator which is also a recursive function. The problem I am having right now is that I am building up each section to 100% for each level and moving onto the next section. This is an issue if the first level has 6 section and the second level has 12 and the 3rd level has 24 and so on. When the first level finishes, the 3rd level will only be a quarter finshed. This does not look good. OK so why did I do it this way. In order to get the animation effect of the pie chart slowly completing radially, HTML canvas is set up in a way that you have to clear the canvas and reprint. So for example. If I am making a line that is 100 units long, I can loop through 100 time (for 100% at the end) and build the line from 0 to percent + 1 each time. Each time, the clearRect, will empty the screen and immediately prrint out the line 1% larger making it look like it's growing. Simple enough right? Wrong. What if I have 6 sections in a wheel in layer 1, and 12 sections in layer 2, and 24 and so one. In order for each level to go around the circle at the same pace, everytime a section finishes on any level, I need to stop and save the current section and paused endpoint at every other level. It sounds doable, but it will take a complete restructuring of what I have. It is important to note that each section is it's own entity.
StackedWheel.prototype.animationCycler = function(sectionIDs, sectionPercentInterval) {

  var wheelChart = this;
  var totalLayers = this.layersWithSectionData_a_o.length;

  var sectionsCurrentIndex = Array.apply(null, Array(totalLayers)).map(Number.prototype.valueOf,0);
  sectionIDs = (typeof sectionIDs === 'undefined') ? sectionsCurrentIndex : sectionIDs;
  sectionPercentInterval = (typeof sectionPercentInterval === 'undefined') ? 0 : sectionPercentInterval;

  this.ctx.clearRect(0, 0, this.containerSize_a_i[0], this.containerSize_a_i[1]);

  this.pastePreviouslyPasted(sectionIDs);

  // for each level
  for (var xLevels = 0; xLevels < totalLayers; xLevels++) {
    // If the current sectionID for the current level is less than the total number of sections in that level
    if (sectionIDs[xLevels] < this.layersWithSectionData_a_o[xLevels].sectionsIndex_i){
      var tempSection = this.layersWithSectionData_a_o[xLevels].sections[sectionIDs[xLevels]];
      var endForArc = tempSection.radialStart + (tempSection.radialEnd - tempSection.radialStart) * sectionPercentInterval / (100);

      // This is for the radius pop. The 3rd level sections were over lapping with the second level sections before the pop becuase they were not taking into account the second level pop. They would eventually pop into the right place it just looked off.
      if (sectionIDs[0] >0 && xLevels > 0){
          this.pastePieArc(xLevels, sectionIDs[xLevels], endForArc, this.radiusPop_i*(xLevels - 1));
      } else {
        this.pastePieArc(xLevels, sectionIDs[xLevels], endForArc, 0);
      }
    }
  }

  sectionPercentInterval = sectionPercentInterval + this.animationSpeed_i*2;

  if (sectionPercentInterval  <= 100) {
    // Recursive repeat this function until the end is reached
    requestAnimationFrame(function () {
      wheelChart.animationCycler(sectionIDs, sectionPercentInterval);
    });
  } else {

    sectionPercentInterval = 0;

    // for each level
    for (var xLevels = 0; xLevels < totalLayers; xLevels++) {
      if (sectionIDs[xLevels] < this.layersWithSectionData_a_o[xLevels].sectionsIndex_i){
        sectionIDs[xLevels] = sectionIDs[xLevels] + 1;
      }
    }

    if (sectionIDs[totalLayers - 1] < this.layersWithSectionData_a_o[totalLayers - 1].sectionsIndex_i){
      requestAnimationFrame(function () {
        wheelChart.animationCycler(sectionIDs, sectionPercentInterval);
      });
    } else if (sectionIDs[totalLayers - 1] >= this.layersWithSectionData_a_o[totalLayers - 1].sectionsIndex_i) {
      //This is just to print everything one last time
      this.ctx.clearRect(0, 0, wheelChart.containerSize_a_i[0], wheelChart.containerSize_a_i[1]);
      this.pastePreviouslyPasted(sectionIDs);
    }
  }
}

StackedWheel.prototype.pastePreviouslyPasted = function(sectionIDs) {
  // for each level
  for (var xLevels = 0; xLevels < this.layersWithSectionData_a_o.length; xLevels++) {
    // for each section in each level
    for ( var xSections = 0; xSections < sectionIDs[xLevels]; xSections++) {

      if (xLevels != 0) { radiusPop = this.radiusPop_i*xLevels; }
      else { radiusPop = 0; }

      this.pastePieArc(xLevels, xSections, this.layersWithSectionData_a_o[xLevels].sections[xSections].radialEnd, radiusPop);
      this.pastePieText(xLevels, xSections);
    }
  }
}

StackedWheel.prototype.pastePieArc = function(levelID, sectionID, tempRadialEnd, radiusPop) {
  var currentLevel = this.layersWithSectionData_a_o[levelID];
  var currentSection = currentLevel.sections[sectionID];

  this.ctx.beginPath();
  this.ctx.shadowColor = currentLevel.blurColor_s;
  this.ctx.arc(this.containerSize_a_i[0] / 2, this.containerSize_a_i[1] / 2, currentSection.adjustedInnerRadius_i + radiusPop/2, currentSection.radialStart, tempRadialEnd, false);
  this.ctx.lineWidth = currentSection.arcWidth_i;
  this.ctx.strokeStyle = currentSection.color_s;
  this.ctx.stroke();
  this.ctx.closePath();
};

StackedWheel.prototype.pastePieText = function(levelID, sectionID) {
  var currentLevel = this.layersWithSectionData_a_o[levelID];
  var currentSection = currentLevel.sections[sectionID];
  var toPaste;

  if (currentLevel.printOption_s == "description") {
    toPaste = currentSection.description_s;
  }

  if (currentLevel.printOption_s == "percent") {
    toPaste = currentSection.percentageArc_i.toString() + "%";
  }

  this.ctx.beginPath();
  this.ctx.fillStyle = currentLevel.textColor_s;
  this.ctx.font = currentLevel.textFont_s;
  this.ctx.fillText(toPaste, currentSection.sweetSpotXcoord, currentSection.sweetSpotYcoord);
  this.ctx.closePath();
};

StackedWheel.prototype.drawWheel = function() {
  this.recursivelyLoopAndGrabDataForCalculationsAndOrdering();
  if(this.animation_b == true) {
    this.animationCycler();
  } else {
    var sectionIDs = [];
    for (var i = 0; i < this.layersWithSectionData_a_o.length; i++) {
      sectionIDs[i] = this.layersWithSectionData_a_o[i].sections.length
    }

    this.pastePreviouslyPasted(sectionIDs);
  }
};

// Some of these erros are aesthetics only. If you want you can override them by just commenting out the condition. For example, I have an error pop up if the chart is less than 40px, obviosuly you can have it smaller if you like.
StackedWheel.prototype.errorChecks = function() {

  var errorMessages = [];

  if (this.colorScheme_a_s[0].length < this.numberOfSections_i) {
    errorMessages.push("Not enough colors to match sections of data")
  };

  if (this.innerRadius_i[0] < this.maximumWidth_i[0] / 2) {
    errorMessages.push("innerRadius_i cannot be less than half of the maximumWidth_i")
  };

  if (this.maximumWidth_i[0] < this.minimumWidth_i[0]) {
    errorMessages.push("maximumWidth_i cannot be less than the minimumWidth_i")
  };

  if (this.innerRadius_i[0] < 40) {
    errorMessages.push("innerRadius_i cannot be less than 40")
  };

  if (this.maximumWidth_i[0] < 40) {
    errorMessages.push("maximumWidth_i cannot be less than 40")
  };

  if (this.minimumWidth_i[0] < 40) {
    errorMessages.push("minimumWidth_i cannot be less than 40")
  };

  if (this.containerSize_a_i[0] !== this.containerSize_a_i[0]) {
    errorMessages.push("container size has to be a square (equal x and y)")
  };

  // Not super sure about this one
  if (this.containerSize_a_i[0] < this.innerRadius_i[0] * 2 + (this.maximumWidth_i[0] / 2) * 2 + this.ctx.shadowBlur * 2) {
    errorMessages.push("container might not fit your stacked wheel")
  };

  //if under a certain minWidth and innerRadius descriptions are not allowed. Only percentages.

  // total percentage must be <= 100

  // jSON needs to have proper values for all sections.

  // animation speed should be limited to 1 to 10.

  if (errorMessages.length > 0) {
    this.elementDOM.style.width="500px";
    this.elementDOM.style.height="500px";
    this.ctx.font = '20pt Helvetica';
    this.ctx.textAlign="center";
    this.ctx.fillStyle = "red";
    this.ctx.shadowBlur = 0;
    this.ctx.beginPath();
    this.ctx.fillText("ERRORS", this.containerSize_a_i[0] / 2, this.containerSize_a_i[1] / 9);
    this.ctx.font = '10pt Helvetica';
    for (var i = 0; i < errorMessages.length; i++) {
      this.ctx.fillText(errorMessages[i], this.containerSize_a_i[0] / 2, this.containerSize_a_i[1] / 7 + i*15);
    }
    this.ctx.closePath();
    return false
  } else {
    return true
  }
};

// TODO ********************************

// Figure out how to incorporate canvas div size manually here. Something is off when I try to get by id and change css.

// ANIMATION RESTRUCTURING. Get all levels to complete at the same time. This would be really nice.

// Maybe make the text or data representation responsivly size depending on section size.

// Maybe make first layer text a bit furthur out depending on how big the donut hole is. If you think about it, if there is no donut hole, the middle of the section will be very thin becuase it closes in on a point at the center of the circle. This is something to think about.