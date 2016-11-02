//  beginning of work friday. October 30, 2016
// This version has some comments that might be useful.

// StackedWheel object takes in two properties; an elementID to identify the canvas container in the DOM, and a json object that contains the data that will populate the wheel along with the settings.
function StackedWheel(elementDOM, settingsJSON) {

  this.settingsJSON = settingsJSON;

  // Reference to element in DOM and launching canvas context. All static properties of ctx also defined here.
  this.elementDOM = elementDOM;
  // this.elementDOM.style.width = this.settingsJSON.options.containerSize_a_i[0].toString() + "px";
  // this.elementDOM.style.height = this.settingsJSON.options.containerSize_a_i[1].toString() + "px";
  this.ctx = this.elementDOM.getContext("2d");
  this.ctx.shadowColor = this.settingsJSON.options.blurColor_s;
  this.ctx.shadowBlur = 20;
  this.ctx.shadowOffsetX = 0;
  this.ctx.shadowOffsetY = 0;
  this.ctx.font = '10pt Helvetica';
  this.ctx.textAlign="center";
  this.ctx.fillStyle = this.settingsJSON.options.textColor_s;

  // innerRadius_i represents the radius of the hole of the donut pie chart. minimum and maximumWidth_i represent what the min and max widths of the donut part of the donut pie chart. Right now, the distribution is linear, meaning that each section will increment the same amount in width. So for example. if the minWidth is 20, and the max is 40, and I have 5 sections, the first section will be 20 units thick, the second section will be 25 units thick, then 30, 35, and finally 40.
  this.innerRadius_i = [];
  this.minimumWidth_i = [];
  this.maximumWidth_i = [];
  this.colorScheme_a_s = [];

  // This implements layers. Maybe I want a triple stacked pie chart... so we loop through and make sets for each
  for(var i = 0; i < this.settingsJSON.options.layers.length; i++) {
    this.innerRadius_i[i] = this.settingsJSON.options.layers[i].innerRadius_i;
    this.minimumWidth_i[i] = this.settingsJSON.options.layers[i].minimumWidth_i;
    this.maximumWidth_i[i] = this.settingsJSON.options.layers[i].maximumWidth_i;
    this.colorScheme_a_s[i] = this.settingsJSON.options.layers[i].colorScheme_a_s;
  }

  this.containerSize_a_i = this.settingsJSON.options.containerSize_a_i;
  this.sections_a_o = this.settingsJSON.data.sections;
  this.numberOfSections_i = this.sections_a_o.length;
  this.animationSpeed_i = this.settingsJSON.options.animationSpeed_i;

  // If it passes my tests, run it!!!
  if (this.errorChecks() == true) {
    this.calculateInitialSectionPositioningValues();
    this.drawWheel();
  }
}

// Right now this method orders the sections array by their percentages from smallest to largest. More options mught be needed in the future. If the order changes, it is crucial that calculateSectionPositioningValues gets run again becuase the positioning properties are saved in each section object and they depend on where everyone else is positioned.
StackedWheel.prototype.orderSections = function() {
  this.sections_a_o.sort(function (a, b) {
    if (a.percentageArc_i > b.percentageArc_i) {
      return 1;
    }
    if (a.percentageArc_i < b.percentageArc_i) {
      return -1;
    }
    return 0;
  });
}

// This method calculates the positioning values of each section: arcWidth radialStart radialEnd adjustedInnerRadius sweetSpotXcoord sweetSpotYcoord;
StackedWheel.prototype.calculateInitialSectionPositioningValues = function() {

  this.orderSections();

  var currentRadialStart = 0;
  var currentRadialEnd = 0;
  var linearWidthDistribution = (this.maximumWidth_i[0] - this.minimumWidth_i[0]) / (this.numberOfSections_i - 1);

  for (var i = 0; i < this.numberOfSections_i; i++) {

    // Radial Endpoints
    currentRadialEnd = currentRadialStart + (this.sections_a_o[i].percentageArc_i * 2 * Math.PI / 100);
    this.sections_a_o[i].radialStart = currentRadialStart;
    this.sections_a_o[i].radialEnd = currentRadialEnd;
    currentRadialStart = currentRadialEnd;

    // Section Width
    this.sections_a_o[i].arcWidth = this.minimumWidth_i[0] + linearWidthDistribution * i;

    // Adjusted inner radius. The innerRadius is set for the center of the the arc width. This is why is have to adjust the innerRadius depending on how thick each section is. For example, if I have a section with an innerRadius of 100 and a width of 20, and the next section has a width of 40, the sections put together will not line up on the inside. I have to change the innerRadius of the second section to 110. 110 because the section is leaking 10 units over on each side (for the 20 unit increase in width).
    this.sections_a_o[i].adjustedInnerRadius = this.innerRadius_i[0] + (this.sections_a_o[i].arcWidth - this.minimumWidth_i[0]) / 2;

    // The center (I hope) of each section in x and y coordinates with respect to the entire container.
    this.sections_a_o[i].sweetSpotXcoord = this.containerSize_a_i[0] / 2 + this.sections_a_o[i].adjustedInnerRadius * Math.cos((this.sections_a_o[i].radialStart + this.sections_a_o[i].radialEnd) / 2);
    this.sections_a_o[i].sweetSpotYcoord = this.containerSize_a_i[1] / 2 + this.sections_a_o[i].adjustedInnerRadius * Math.sin((this.sections_a_o[i].radialStart + this.sections_a_o[i].radialEnd) / 2);
  };
}

StackedWheel.prototype.calculateSecondaryLayerPositioningValues = function() {

}

StackedWheel.prototype.animationCycler = function(sectionID, sectionPercentInterval, ringPercentInterval) {

  sectionID = (typeof sectionID === 'undefined') ? 0 : sectionID;
  sectionPercentInterval = (typeof sectionPercentInterval === 'undefined') ? 0 : sectionPercentInterval;
  ringPercentInterval = (typeof ringPercentInterval === 'undefined') ? 0 : ringPercentInterval;

  var wheelChartThis = this;
  var currentSectionThis = this.sections_a_o[sectionID];

  this.ctx.clearRect(0, 0, wheelChartThis.containerSize_a_i[0], wheelChartThis.containerSize_a_i[1]);

  // this is for animation purposes. Everytime we run the animationCycler method, it erases the canvas becuase of clear rect, and just pastes out more of the arc making it look like it's 'traveling'. Normally, this would not be a problem. If I am just bulding one circle, it would be easy becuase i would just paste out a couple more radial degrees every iteration. The following condition would be redundant. But what if you have sections? I am building this section by section. If I make it to section two, section 1 will get cleared becuase the percent increase only affects the current section. I imagine there is a way better way to do this.
  if (sectionID > 0) {
    for (var i = 0; i <= (sectionID - 1); i++) {
      this.pastePieArc(wheelChartThis.sections_a_o[i], wheelChartThis.sections_a_o[i].radialEnd, i, wheelChartThis.sections_a_o[i].adjustedInnerRadius, wheelChartThis.sections_a_o[i].arcWidth);

      this.pastePieArc(wheelChartThis.sections_a_o[i], wheelChartThis.sections_a_o[i].radialEnd, i, wheelChartThis.sections_a_o[i].adjustedInnerRadius + wheelChartThis.sections_a_o[i].arcWidth/2 + 30, 40);

      this.pastePieText(wheelChartThis.sections_a_o[i]);
    }
  }

  // This is needed so that the percent incrementation animation starts right at the radialStart and ends at radialEnd which makes sense. At 100 percent, the sectionPercentInterval becomes 1 which leaves us with start + end - start which leaves us with end. Bingo!
  var endForArc = currentSectionThis.radialStart + (currentSectionThis.radialEnd - currentSectionThis.radialStart) * sectionPercentInterval / 100;

  // ***** PASTING ON THE CANVAS *****

  this.pastePieArc(currentSectionThis, endForArc, sectionID, currentSectionThis.adjustedInnerRadius, currentSectionThis.arcWidth);
  this.pastePieArc(currentSectionThis, endForArc, sectionID, currentSectionThis.adjustedInnerRadius + currentSectionThis.arcWidth / 2 + 20, 40 );

  // Here we draw the text on top of the section. It will only pop up after the section is 60% through the animation. This is important because it looks shitty if the text appears before the part of the pie it represents
  if (sectionPercentInterval >= 60) {
    this.pastePieText(currentSectionThis);
  }
  // ^^^^ PASTING ON THE CANVAS ^^^^

  sectionPercentInterval = sectionPercentInterval + this.animationSpeed_i*2;
  // Animation for individual section only.
  if (sectionPercentInterval  <= 100) {
    // Recursive repeat this function until the end is reached
    requestAnimationFrame(function () {
      wheelChartThis.animationCycler(sectionID, sectionPercentInterval, ringPercentInterval);
    });
  } else {
    sectionPercentInterval = 0;
    ringPercentInterval = ringPercentInterval + currentSectionThis.percentageArc_i;
    sectionID = sectionID + 1;
    if (sectionID < wheelChartThis.numberOfSections_i){
      requestAnimationFrame(function () {
        wheelChartThis.animationCycler(sectionID, sectionPercentInterval, ringPercentInterval);
      });
    } else if (sectionID >= wheelChartThis.numberOfSections_i) {
      //This is purely me being nitpicky. The last section of the chart with blurred edges gets drawn after the ring, so if the ring is right next to the chart, that last section blurrs over into the ring. Its silly but I just cant leave that. comment out this next if case and you'll see the difference. I have to just print the entire ring out again to make it dominant.
      this.ctx.clearRect(0, 0, wheelChartThis.containerSize_a_i[0], wheelChartThis.containerSize_a_i[1]);

      for (var i = 0; i <= (sectionID - 1); i++) {
        this.pastePieArc(wheelChartThis.sections_a_o[i], wheelChartThis.sections_a_o[i].radialEnd, i, wheelChartThis.sections_a_o[i].adjustedInnerRadius, wheelChartThis.sections_a_o[i].arcWidth);

        this.pastePieArc(wheelChartThis.sections_a_o[i], wheelChartThis.sections_a_o[i].radialEnd, i, wheelChartThis.sections_a_o[i].adjustedInnerRadius + wheelChartThis.sections_a_o[i].arcWidth/2 + 30, 40);

        this.pastePieText(wheelChartThis.sections_a_o[i]);
      }
    }
  }
};

StackedWheel.prototype.pastePieArc = function(currentSectionThis, tempRadialEnd, sectionID, centeredRadius, arcWidth) {
  this.ctx.beginPath();
  this.ctx.arc(this.containerSize_a_i[0] / 2, this.containerSize_a_i[1] / 2, centeredRadius, currentSectionThis.radialStart, tempRadialEnd, false);
  this.ctx.lineWidth = arcWidth;
  this.ctx.strokeStyle = this.colorScheme_a_s[0][sectionID]
  this.ctx.stroke();
  this.ctx.closePath();
}

StackedWheel.prototype.pastePieText = function(currentSectionThis) {
  this.ctx.beginPath();
  this.ctx.fillText(currentSectionThis.percentageArc_i.toString() + "%", currentSectionThis.sweetSpotXcoord, currentSectionThis.sweetSpotYcoord);
  this.ctx.closePath();
}

StackedWheel.prototype.drawWheel = function() {
  this.animationCycler();
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

// percentages vs visual percentages. visual percentages need to be altered if some acutal percentage is too small
  // if percentages do not reach 100, only feed the empty percentage slots to sections if they are under the min
  // else take away 1% from largest section in a loop as long as they can afford it.

// add option for ring around the top
  // error check, min and max widths need to match up to eliminate stacking if the ring is desired.



  // end of work friday



  // StackedWheel object takes in two properties; an elementID to identify the canvas container in the DOM, and a json object that contains the data that will populate the wheel along with the settings.
function StackedWheel(elementDOM, settingsJSON) {

  this.settingsJSON = settingsJSON;

  // Reference to element in DOM and launching canvas context. All static properties of ctx also defined here.
  this.elementDOM = elementDOM;
  // this.elementDOM.style.width = this.settingsJSON.options.containerSize_a_i[0].toString() + "px";
  // this.elementDOM.style.height = this.settingsJSON.options.containerSize_a_i[1].toString() + "px";
  this.ctx = this.elementDOM.getContext("2d");
  this.ctx.shadowColor = this.settingsJSON.options.blurColor_s;
  this.ctx.shadowBlur = 20;
  this.ctx.shadowOffsetX = 0;
  this.ctx.shadowOffsetY = 0;
  this.ctx.font = '10pt Helvetica';
  this.ctx.textAlign="center";
  this.ctx.fillStyle = this.settingsJSON.options.textColor_s;

  // innerRadius_i represents the radius of the hole of the donut pie chart. minimum and maximumWidth_i represent what the min and max widths of the donut part of the donut pie chart. Right now, the distribution is linear, meaning that each section will increment the same amount in width. So for example. if the minWidth is 20, and the max is 40, and I have 5 sections, the first section will be 20 units thick, the second section will be 25 units thick, then 30, 35, and finally 40.
  this.innerRadius_i = [];
  this.minimumWidth_i = [];
  this.maximumWidth_i = [];
  this.colorScheme_a_s = [];

  // This implements layers. Maybe I want a triple stacked pie chart... so we loop through and make sets for each
  for(var i = 0; i < this.settingsJSON.options.layers.length; i++) {
    this.innerRadius_i[i] = this.settingsJSON.options.layers[i].innerRadius_i;
    this.minimumWidth_i[i] = this.settingsJSON.options.layers[i].minimumWidth_i;
    this.maximumWidth_i[i] = this.settingsJSON.options.layers[i].maximumWidth_i;
    this.colorScheme_a_s[i] = this.settingsJSON.options.layers[i].colorScheme_a_s;
  }

  this.containerSize_a_i = this.settingsJSON.options.containerSize_a_i;
  this.sections_a_o = this.settingsJSON.data.sections;
  this.numberOfSections_i = this.sections_a_o.length;
  this.animationSpeed_i = this.settingsJSON.options.animationSpeed_i;


  this.layersWithSectionData_a_o = [];


  // If it passes my tests, run it!!!
  // if (this.errorChecks() == true) {
  //   this.calculateInitialSectionPositioningValues();
    this.drawWheel();
  // }
}

// Right now this method orders the sections array by their percentages from smallest to largest. More options mught be needed in the future. If the order changes, it is crucial that calculateSectionPositioningValues gets run again becuase the positioning properties are saved in each section object and they depend on where everyone else is positioned.
StackedWheel.prototype.orderSections = function() {
  this.sections_a_o.sort(function (a, b) {
    if (a.percentageArc_i > b.percentageArc_i) {
      return 1;
    }
    if (a.percentageArc_i < b.percentageArc_i) {
      return -1;
    }
    return 0;
  });
}

// OH MY F ING GOD THIS WORKS. If you ask me to explain this to you, I will just jump out of the window. This is the definition of brute force. OK to be honest I understand what's going on so feel free. This took me an entire day.
StackedWheel.prototype.recursivelyLoopAndGrabDataForCalculationsAndOrdering  = function(level, currentPercentScope, obj) {

  var level = (typeof level === 'undefined') ? 0 : level;
  currentPercentScope = (typeof currentPercentScope === 'undefined') ? 100 : currentPercentScope;
  obj = (typeof obj === 'undefined') ? this.sections_a_o.data : obj;

  this.layersWithSectionData_a_o[level] = (typeof this.layersWithSectionData_a_o[level] === 'undefined') ? {} : this.layersWithSectionData_a_o[level];
  this.layersWithSectionData_a_o[level].sections = (typeof this.layersWithSectionData_a_o[level].sections === 'undefined') ? [] : this.layersWithSectionData_a_o[level].sections;

  this.layersWithSectionData_a_o[level].sectionsIndex_i = (typeof this.layersWithSectionData_a_o[level].sectionsIndex_i === 'undefined') ? 0 : this.layersWithSectionData_a_o[level].sectionsIndex_i;
  this.layersWithSectionData_a_o[level].lastPercentage_i = (typeof this.layersWithSectionData_a_o[level].lastPercentage_i === 'undefined') ? 0 : this.layersWithSectionData_a_o[level].lastPercentage_i;



  console.log('right before for loop')
  for (var x = 0; x < obj.length; x++) {
    console.log('-------- start of for loop iteration----------')
    console.log("level = " + level)
    console.log("iteration in level = " + x)
    console.log(this.layersWithSectionData_a_o)
    console.log('-------- start of for loop iteration----------')
    // debugger
    this.layersWithSectionData_a_o[level].sections[this.layersWithSectionData_a_o[level].sectionsIndex_i] = {};
    var currentSection = this.layersWithSectionData_a_o[level].sections[this.layersWithSectionData_a_o[level].sectionsIndex_i];

    currentSection.description_s = obj[x].description_s;
    currentSection.percentageArc_i = obj[x].percentageArc_i;
    currentSection.containerScope = currentPercentScope;

    this.calculateSectionArcGlobalPercentage(level, this.layersWithSectionData_a_o[level].sectionsIndex_i)
    this.calculateRadialStarts(level, this.layersWithSectionData_a_o[level].sectionsIndex_i)



    this.calculateRadialEnds(level, this.layersWithSectionData_a_o[level].sectionsIndex_i)

    this.layersWithSectionData_a_o[level].sectionsIndex_i = this.layersWithSectionData_a_o[level].sectionsIndex_i + 1;

    this.layersWithSectionData_a_o[level].lastPercentage_i = this.layersWithSectionData_a_o[level].lastPercentage_i + currentSection.globalPercentageArc_i;

    if(typeof obj[x].data == 'object') {
      console.log('if')
      level = level + 1;
      currentPercentScope = currentSection.globalPercentageArc_i;
      console.log('-------- start of recursive call ----------')
      // console.log("level = " + level)
      // console.log("iteration in level = " + x)
      // console.log(this.layersWithSectionData_a_o[level])
      // console.log('-------- start of recursive call ----------')
      this.recursivelyLoopAndGrabDataForCalculationsAndOrdering(level, currentPercentScope, obj[x].data)
      level = level - 1;
      currentPercentScope = currentSection.containerScope;
      // this.layersWithSectionData_a_o[level] = this.layersWithSectionData_a_o[level];
      console.log('-------- end of recursive call ----------')
      // console.log("level = " + level)
      // console.log("iteration in level = " + x)
      // console.log(this.layersWithSectionData_a_o[level])
      // console.log('-------- end of recursive call ----------')
    }

    // if (x == obj.length - 1) {
    //   console.log('else')

    // }


    console.log('-------- end of for loop iteration----------')
    // console.log("level = " + level)
    // console.log("iteration in level = " + x)
    console.log(this.layersWithSectionData_a_o)
    // console.log('-------- end of for loop iteration----------')
  }

console.log('-------- END OF FOR LOOP AFTER----------')
}

//percentageStack is a two element array. the section percent arc and the level percentage weight. So for example, if i am on level one and the percentage arc of a certain section is 25%. percentageSTack for this particular section would be [25, 100]. Level one has 100 percent weight becuase each percent is out of 100. Now if I go to the second level for that first section and I see a section (on that second level) that has 50% arc, the percentageStack for that section would be [17, 25]. 17% of 25%. Makes senese. This is how I can acurately calculate the radial ends for any section, no matter what level, with respect to 2*Pi (full circle)



StackedWheel.prototype.calculateSectionArcGlobalPercentage  = function(level, section, containerPercentScope) {

  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = this.layersWithSectionData_a_o[level].sections[section];
  currentSection.globalPercentageArc_i = currentSection.containerScope / 100 * currentSection.percentageArc_i;
}


StackedWheel.prototype.calculateRadialStarts  = function(level, section) {
  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = this.layersWithSectionData_a_o[level].sections[section];

  // if not first section x!=0
  if (section != 0) {
    currentSection.radialStart = currentLevel.sections[section - 1].radialEnd
  }
  // if first section
  if (section == 0) {
    currentSection.radialStart = 0
  }
}


StackedWheel.prototype.calculateRadialEnds  = function(level, section) {

  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = this.layersWithSectionData_a_o[level].sections[section];
  currentSection.radialEnd = currentSection.radialStart + currentSection.globalPercentageArc_i * Math.PI / 50;
  // debugger
}

// This method calculates the positioning values of each section: arcWidth radialStart radialEnd adjustedInnerRadius sweetSpotXcoord sweetSpotYcoord;
StackedWheel.prototype.calculateInitialSectionPositioningValues = function() {

  this.orderSections();

  var currentRadialStart = 0;
  var currentRadialEnd = 0;
  var linearWidthDistribution = (this.maximumWidth_i[0] - this.minimumWidth_i[0]) / (this.numberOfSections_i - 1);

  for (var i = 0; i < this.numberOfSections_i; i++) {

    // Radial Endpoints
    currentRadialEnd = currentRadialStart + (this.sections_a_o[i].percentageArc_i * 2 * Math.PI / 100);
    this.sections_a_o[i].radialStart = currentRadialStart;
    this.sections_a_o[i].radialEnd = currentRadialEnd;
    currentRadialStart = currentRadialEnd;

    // Section Width
    this.sections_a_o[i].arcWidth = this.minimumWidth_i[0] + linearWidthDistribution * i;

    // Adjusted inner radius. The innerRadius is set for the center of the the arc width. This is why is have to adjust the innerRadius depending on how thick each section is. For example, if I have a section with an innerRadius of 100 and a width of 20, and the next section has a width of 40, the sections put together will not line up on the inside. I have to change the innerRadius of the second section to 110. 110 because the section is leaking 10 units over on each side (for the 20 unit increase in width).
    this.sections_a_o[i].adjustedInnerRadius = this.innerRadius_i[0] + (this.sections_a_o[i].arcWidth - this.minimumWidth_i[0]) / 2;

    // The center (I hope) of each section in x and y coordinates with respect to the entire container.
    this.sections_a_o[i].sweetSpotXcoord = this.containerSize_a_i[0] / 2 + this.sections_a_o[i].adjustedInnerRadius * Math.cos((this.sections_a_o[i].radialStart + this.sections_a_o[i].radialEnd) / 2);
    this.sections_a_o[i].sweetSpotYcoord = this.containerSize_a_i[1] / 2 + this.sections_a_o[i].adjustedInnerRadius * Math.sin((this.sections_a_o[i].radialStart + this.sections_a_o[i].radialEnd) / 2);
  };
}

StackedWheel.prototype.calculateSecondaryLayerPositioningValues = function() {

}

StackedWheel.prototype.animationCycler = function(sectionID, sectionPercentInterval, ringPercentInterval) {

  sectionID = (typeof sectionID === 'undefined') ? 0 : sectionID;
  sectionPercentInterval = (typeof sectionPercentInterval === 'undefined') ? 0 : sectionPercentInterval;
  ringPercentInterval = (typeof ringPercentInterval === 'undefined') ? 0 : ringPercentInterval;

  var wheelChartThis = this;
  var currentSectionThis = this.sections_a_o[sectionID];

  this.ctx.clearRect(0, 0, wheelChartThis.containerSize_a_i[0], wheelChartThis.containerSize_a_i[1]);

  // this is for animation purposes. Everytime we run the animationCycler method, it erases the canvas becuase of clear rect, and just pastes out more of the arc making it look like it's 'traveling'. Normally, this would not be a problem. If I am just bulding one circle, it would be easy becuase i would just paste out a couple more radial degrees every iteration. The following condition would be redundant. But what if you have sections? I am building this section by section. If I make it to section two, section 1 will get cleared becuase the percent increase only affects the current section. I imagine there is a way better way to do this.
  if (sectionID > 0) {
    for (var i = 0; i <= (sectionID - 1); i++) {
      this.pastePieArc(wheelChartThis.sections_a_o[i], wheelChartThis.sections_a_o[i].radialEnd, i, wheelChartThis.sections_a_o[i].adjustedInnerRadius, wheelChartThis.sections_a_o[i].arcWidth);

      this.pastePieArc(wheelChartThis.sections_a_o[i], wheelChartThis.sections_a_o[i].radialEnd, i, wheelChartThis.sections_a_o[i].adjustedInnerRadius + wheelChartThis.sections_a_o[i].arcWidth/2 + 30, 40);

      this.pastePieText(wheelChartThis.sections_a_o[i]);
    }
  }

  // This is needed so that the percent incrementation animation starts right at the radialStart and ends at radialEnd which makes sense. At 100 percent, the sectionPercentInterval becomes 1 which leaves us with start + end - start which leaves us with end. Bingo!
  var endForArc = currentSectionThis.radialStart + (currentSectionThis.radialEnd - currentSectionThis.radialStart) * sectionPercentInterval / 100;

  // ***** PASTING ON THE CANVAS *****

  this.pastePieArc(currentSectionThis, endForArc, sectionID, currentSectionThis.adjustedInnerRadius, currentSectionThis.arcWidth);
  this.pastePieArc(currentSectionThis, endForArc, sectionID, currentSectionThis.adjustedInnerRadius + currentSectionThis.arcWidth / 2 + 20, 40 );

  // Here we draw the text on top of the section. It will only pop up after the section is 60% through the animation. This is important because it looks shitty if the text appears before the part of the pie it represents
  if (sectionPercentInterval >= 60) {
    this.pastePieText(currentSectionThis);
  }
  // ^^^^ PASTING ON THE CANVAS ^^^^

  sectionPercentInterval = sectionPercentInterval + this.animationSpeed_i*2;
  // Animation for individual section only.
  if (sectionPercentInterval  <= 100) {
    // Recursive repeat this function until the end is reached
    requestAnimationFrame(function () {
      wheelChartThis.animationCycler(sectionID, sectionPercentInterval, ringPercentInterval);
    });
  } else {
    sectionPercentInterval = 0;
    ringPercentInterval = ringPercentInterval + currentSectionThis.percentageArc_i;
    sectionID = sectionID + 1;
    if (sectionID < wheelChartThis.numberOfSections_i){
      requestAnimationFrame(function () {
        wheelChartThis.animationCycler(sectionID, sectionPercentInterval, ringPercentInterval);
      });
    } else if (sectionID >= wheelChartThis.numberOfSections_i) {
      //This is purely me being nitpicky. The last section of the chart with blurred edges gets drawn after the ring, so if the ring is right next to the chart, that last section blurrs over into the ring. Its silly but I just cant leave that. comment out this next if case and you'll see the difference. I have to just print the entire ring out again to make it dominant.
      this.ctx.clearRect(0, 0, wheelChartThis.containerSize_a_i[0], wheelChartThis.containerSize_a_i[1]);

      for (var i = 0; i <= (sectionID - 1); i++) {
        this.pastePieArc(wheelChartThis.sections_a_o[i], wheelChartThis.sections_a_o[i].radialEnd, i, wheelChartThis.sections_a_o[i].adjustedInnerRadius, wheelChartThis.sections_a_o[i].arcWidth);

        this.pastePieArc(wheelChartThis.sections_a_o[i], wheelChartThis.sections_a_o[i].radialEnd, i, wheelChartThis.sections_a_o[i].adjustedInnerRadius + wheelChartThis.sections_a_o[i].arcWidth/2 + 30, 40);

        this.pastePieText(wheelChartThis.sections_a_o[i]);
      }
    }
  }
};

StackedWheel.prototype.pastePieArc = function(currentSectionThis, tempRadialEnd, sectionID, centeredRadius, arcWidth) {
  this.ctx.beginPath();
  this.ctx.arc(this.containerSize_a_i[0] / 2, this.containerSize_a_i[1] / 2, centeredRadius, currentSectionThis.radialStart, tempRadialEnd, false);
  this.ctx.lineWidth = arcWidth;
  this.ctx.strokeStyle = this.colorScheme_a_s[0][sectionID]
  this.ctx.stroke();
  this.ctx.closePath();
}

StackedWheel.prototype.pastePieText = function(currentSectionThis) {
  this.ctx.beginPath();
  this.ctx.fillText(currentSectionThis.percentageArc_i.toString() + "%", currentSectionThis.sweetSpotXcoord, currentSectionThis.sweetSpotYcoord);
  this.ctx.closePath();
}

StackedWheel.prototype.drawWheel = function() {
  // this.animationCycler();
  this.recursivelyLoopAndGrabDataForCalculationsAndOrdering();
  debugger
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

// percentages vs visual percentages. visual percentages need to be altered if some acutal percentage is too small
  // if percentages do not reach 100, only feed the empty percentage slots to sections if they are under the min
  // else take away 1% from largest section in a loop as long as they can afford it.

// add option for ring around the top
  // error check, min and max widths need to match up to eliminate stacking if the ring is desired.





  // 4:47 Sunday


   // StackedWheel object takes in two properties; an elementID to identify the canvas container in the DOM, and a json object that contains the data that will populate the wheel along with the settings.
function StackedWheel(elementDOM, settingsJSON) {

  this.settingsJSON = settingsJSON;

  // Reference to element in DOM and launching canvas context. All static properties of ctx also defined here.
  this.elementDOM = elementDOM;
  // this.elementDOM.style.width = this.settingsJSON.options.containerSize_a_i[0].toString() + "px";
  // this.elementDOM.style.height = this.settingsJSON.options.containerSize_a_i[1].toString() + "px";
  this.ctx = this.elementDOM.getContext("2d");
  this.ctx.shadowColor = this.settingsJSON.options.blurColor_s;
  this.ctx.shadowBlur = 20;
  this.ctx.shadowOffsetX = 0;
  this.ctx.shadowOffsetY = 0;
  this.ctx.font = '10pt Helvetica';
  this.ctx.textAlign="center";
  this.ctx.fillStyle = this.settingsJSON.options.textColor_s;

  // innerRadius_i represents the radius of the hole of the donut pie chart. minimum and maximumWidth_i represent what the min and max widths of the donut part of the donut pie chart. Right now, the distribution is linear, meaning that each section will increment the same amount in width. So for example. if the minWidth is 20, and the max is 40, and I have 5 sections, the first section will be 20 units thick, the second section will be 25 units thick, then 30, 35, and finally 40.

  this.containerSize_a_i = this.settingsJSON.options.containerSize_a_i;
  this.sections_a_o = this.settingsJSON.data.sections;
  this.numberOfSections_i = this.sections_a_o.length;
  this.animationSpeed_i = this.settingsJSON.options.animationSpeed_i;


  this.layersWithSectionData_a_o = [];


  // If it passes my tests, run it!!!
  // if (this.errorChecks() == true) {
  //   this.calculateInitialSectionPositioningValues();
    this.drawWheel();
  // }
}

// Right now this method orders the sections array by their percentages from smallest to largest. More options mught be needed in the future. If the order changes, it is crucial that calculateSectionPositioningValues gets run again becuase the positioning properties are saved in each section object and they depend on where everyone else is positioned.
StackedWheel.prototype.orderSections = function() {
  this.sections_a_o.sort(function (a, b) {
    if (a.percentageArc_i > b.percentageArc_i) {
      return 1;
    }
    if (a.percentageArc_i < b.percentageArc_i) {
      return -1;
    }
    return 0;
  });
}

// OH MY F ING GOD THIS WORKS. If you ask me to explain this to you, I will just jump out of the window. This is the definition of brute force. OK to be honest I understand what's going on so feel free. This took me an entire day.
StackedWheel.prototype.recursivelyLoopAndGrabDataForCalculationsAndOrdering  = function(level, currentPercentScope, radiusScope, obj) {

  var level = (typeof level === 'undefined') ? 0 : level;
  currentPercentScope = (typeof currentPercentScope === 'undefined') ? 100 : currentPercentScope;
  obj = (typeof obj === 'undefined') ? this.sections_a_o.data : obj;
  radiusScope = (typeof radiusScope === 'undefined') ? this.settingsJSON.options.initialRadius_i : radiusScope;
  obj = (typeof obj === 'undefined') ? this.sections_a_o.data : obj;

  this.layersWithSectionData_a_o[level] = (typeof this.layersWithSectionData_a_o[level] === 'undefined') ? {} : this.layersWithSectionData_a_o[level];
  this.layersWithSectionData_a_o[level].sections = (typeof this.layersWithSectionData_a_o[level].sections === 'undefined') ? [] : this.layersWithSectionData_a_o[level].sections;

  this.layersWithSectionData_a_o[level].sectionsIndex_i = (typeof this.layersWithSectionData_a_o[level].sectionsIndex_i === 'undefined') ? 0 : this.layersWithSectionData_a_o[level].sectionsIndex_i;
  this.layersWithSectionData_a_o[level].lastPercentage_i = (typeof this.layersWithSectionData_a_o[level].lastPercentage_i === 'undefined') ? 0 : this.layersWithSectionData_a_o[level].lastPercentage_i;

  this.layersWithSectionData_a_o[level].minimumArcWidth_i = this.settingsJSON.options.layers[level].minimumWidth_i;
  this.layersWithSectionData_a_o[level].maximumArcWidth_i = this.settingsJSON.options.layers[level].maximumWidth_i;
  this.layersWithSectionData_a_o[level].colorScheme_a_s = this.settingsJSON.options.layers[level].colorScheme_a_s;

  var tempNumberOfSections = obj.length;

  for (var x = 0; x < obj.length; x++) {

    this.layersWithSectionData_a_o[level].sections[this.layersWithSectionData_a_o[level].sectionsIndex_i] = {};
    var currentSection = this.layersWithSectionData_a_o[level].sections[this.layersWithSectionData_a_o[level].sectionsIndex_i];

    currentSection.description_s = obj[x].description_s;
    currentSection.percentageArc_i = obj[x].percentageArc_i;
    currentSection.containerScope = currentPercentScope;
    currentSection.radiusScope_i = radiusScope;
    currentSection.color_s = this.settingsJSON.options.layers[level].colorScheme_a_s[x];

    this.calculateSectionArcGlobalPercentage(level, this.layersWithSectionData_a_o[level].sectionsIndex_i)
    this.calculateRadialStarts(level, this.layersWithSectionData_a_o[level].sectionsIndex_i)
    this.calculateRadialEnds(level, this.layersWithSectionData_a_o[level].sectionsIndex_i)
    this.calculateGridPositioning(level, this.layersWithSectionData_a_o[level].sectionsIndex_i, tempNumberOfSections);

    this.layersWithSectionData_a_o[level].sectionsIndex_i = this.layersWithSectionData_a_o[level].sectionsIndex_i + 1;

    this.layersWithSectionData_a_o[level].lastPercentage_i = this.layersWithSectionData_a_o[level].lastPercentage_i + currentSection.globalPercentageArc_i;

    if(typeof obj[x].data == 'object') {
      console.log(currentSection.adjustedInnerRadius_i + currentSection. arcWidth_i/2)
      currentSection.containingSectionsNumber_i = obj[x].data.length;
      var tempNextRadius = currentSection.adjustedInnerRadius_i + currentSection. arcWidth_i/2;
      this.recursivelyLoopAndGrabDataForCalculationsAndOrdering(level + 1, currentSection.globalPercentageArc_i, tempNextRadius, obj[x].data)

    }
    else {
      currentSection.containingSectionsNumber_i = 0;
    }
  }
}

StackedWheel.prototype.calculateSectionArcGlobalPercentage  = function(level, section, containerPercentScope) {

  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = this.layersWithSectionData_a_o[level].sections[section];
  currentSection.globalPercentageArc_i = currentSection.containerScope / 100 * currentSection.percentageArc_i;
}


StackedWheel.prototype.calculateRadialStarts  = function(level, section) {
  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = this.layersWithSectionData_a_o[level].sections[section];

  // if not first section x!=0
  if (section != 0) {
    currentSection.radialStart = currentLevel.sections[section - 1].radialEnd
  }
  // if first section
  if (section == 0) {
    currentSection.radialStart = 0
  }
}

StackedWheel.prototype.calculateRadialEnds  = function(level, section) {
  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = this.layersWithSectionData_a_o[level].sections[section];
  currentSection.radialEnd = currentSection.radialStart + currentSection.globalPercentageArc_i * Math.PI / 50;
  // debugger
}

StackedWheel.prototype.calculateGridPositioning = function(level, section, numberOfSections) {

  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = this.layersWithSectionData_a_o[level].sections[section];


  var linearWidthDistribution = (currentLevel.maximumArcWidth_i - currentLevel.minimumArcWidth_i) / (numberOfSections - 1);

  // Section Width.
  currentSection.arcWidth_i = currentLevel.minimumArcWidth_i + linearWidthDistribution * (section % numberOfSections);


    if (level == 0) {
      currentSection.adjustedInnerRadius_i = currentSection.radiusScope_i + (currentSection.arcWidth_i - currentLevel.minimumArcWidth_i) / 2;
    } else {
      currentSection.adjustedInnerRadius_i = currentSection.radiusScope_i + (currentSection.arcWidth_i) / 2;
    }

    // The center (I hope) of each section in x and y coordinates with respect to the entire container.
    // this.sections_a_o[i].sweetSpotXcoord = this.containerSize_a_i[0] / 2 + this.sections_a_o[i].adjustedInnerRadius * Math.cos((this.sections_a_o[i].radialStart + this.sections_a_o[i].radialEnd) / 2);
    // this.sections_a_o[i].sweetSpotYcoord = this.containerSize_a_i[1] / 2 + this.sections_a_o[i].adjustedInnerRadius * Math.sin((this.sections_a_o[i].radialStart + this.sections_a_o[i].radialEnd) / 2);
  // };
}

StackedWheel.prototype.animationCycler2 = function(sectionIDs, sectionPercentInterval) {

  var wheelChart = this;
  var totalLayers = this.layersWithSectionData_a_o.length;

  var sectionsCurrentIndex = Array.apply(null, Array(totalLayers)).map(Number.prototype.valueOf,0);
  sectionIDs = (typeof sectionIDs === 'undefined') ? sectionsCurrentIndex : sectionIDs;
  sectionPercentInterval = (typeof sectionPercentInterval === 'undefined') ? 0 : sectionPercentInterval;

  this.ctx.clearRect(0, 0, this.containerSize_a_i[0], this.containerSize_a_i[1]);

  this.pastePreviouslyPasted(sectionIDs);

  // for each level
  for (var xLevels = 0; xLevels < totalLayers; xLevels++) {

    if (sectionIDs[xLevels] < this.layersWithSectionData_a_o[xLevels].sectionsIndex_i){
      var tempSection = this.layersWithSectionData_a_o[xLevels].sections[sectionIDs[xLevels]];
      var endForArc = tempSection.radialStart + (tempSection.radialEnd - tempSection.radialStart) * sectionPercentInterval / 100;
      this.pastePieArc2(xLevels, sectionIDs[xLevels], endForArc, 0);

    }
  }

  sectionPercentInterval = sectionPercentInterval + this.animationSpeed_i*2;

  if (sectionPercentInterval  <= 100) {
    // Recursive repeat this function until the end is reached
    requestAnimationFrame(function () {
      wheelChart.animationCycler2(sectionIDs, sectionPercentInterval);
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
        wheelChart.animationCycler2(sectionIDs, sectionPercentInterval);
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
    for ( var xSections = 0; xSections < sectionIDs[xLevels]; xSections++) {
      if (xLevels != 0) {
        radiusPop = this.settingsJSON.options.radiusPop_i*xLevels;
      } else {
        radiusPop = 0;
      }
      this.pastePieArc2(xLevels, xSections, this.layersWithSectionData_a_o[xLevels].sections[xSections].radialEnd, radiusPop);
    }
  }
}

StackedWheel.prototype.pastePieArc2 = function(levelID, sectionID, tempRadialEnd, radiusPop) {

  var currentLevel = this.layersWithSectionData_a_o[levelID];
  var currentSection = currentLevel.sections[sectionID];

  this.ctx.beginPath();
  this.ctx.arc(this.containerSize_a_i[0] / 2, this.containerSize_a_i[1] / 2, currentSection.adjustedInnerRadius_i + radiusPop/2, currentSection.radialStart, tempRadialEnd, false);
  this.ctx.lineWidth = currentSection.arcWidth_i;
  this.ctx.strokeStyle = currentSection.color_s;
  this.ctx.stroke();
  this.ctx.closePath();
}

StackedWheel.prototype.animationCycler = function(sectionID, sectionPercentInterval, ringPercentInterval) {

  sectionID = (typeof sectionID === 'undefined') ? 0 : sectionID;
  sectionPercentInterval = (typeof sectionPercentInterval === 'undefined') ? 0 : sectionPercentInterval;
  ringPercentInterval = (typeof ringPercentInterval === 'undefined') ? 0 : ringPercentInterval;

  var wheelChartThis = this;
  var currentSectionThis = this.sections_a_o[sectionID];

  this.ctx.clearRect(0, 0, wheelChartThis.containerSize_a_i[0], wheelChartThis.containerSize_a_i[1]);

  // this is for animation purposes. Everytime we run the animationCycler method, it erases the canvas becuase of clear rect, and just pastes out more of the arc making it look like it's 'traveling'. Normally, this would not be a problem. If I am just bulding one circle, it would be easy becuase i would just paste out a couple more radial degrees every iteration. The following condition would be redundant. But what if you have sections? I am building this section by section. If I make it to section two, section 1 will get cleared becuase the percent increase only affects the current section. I imagine there is a way better way to do this.
  if (sectionID > 0) {
    for (var i = 0; i <= (sectionID - 1); i++) {
      this.pastePieArc(wheelChartThis.sections_a_o[i], wheelChartThis.sections_a_o[i].radialEnd, i, wheelChartThis.sections_a_o[i].adjustedInnerRadius, wheelChartThis.sections_a_o[i].arcWidth);

      this.pastePieArc(wheelChartThis.sections_a_o[i], wheelChartThis.sections_a_o[i].radialEnd, i, wheelChartThis.sections_a_o[i].adjustedInnerRadius + wheelChartThis.sections_a_o[i].arcWidth/2 + 30, 40);

      this.pastePieText(wheelChartThis.sections_a_o[i]);
    }
  }

  // This is needed so that the percent incrementation animation starts right at the radialStart and ends at radialEnd which makes sense. At 100 percent, the sectionPercentInterval becomes 1 which leaves us with start + end - start which leaves us with end. Bingo!
  var endForArc = currentSectionThis.radialStart + (currentSectionThis.radialEnd - currentSectionThis.radialStart) * sectionPercentInterval / 100;

  // ***** PASTING ON THE CANVAS *****

  this.pastePieArc(currentSectionThis, endForArc, sectionID, currentSectionThis.adjustedInnerRadius, currentSectionThis.arcWidth);
  this.pastePieArc(currentSectionThis, endForArc, sectionID, currentSectionThis.adjustedInnerRadius + currentSectionThis.arcWidth / 2 + 20, 40 );

  // Here we draw the text on top of the section. It will only pop up after the section is 60% through the animation. This is important because it looks shitty if the text appears before the part of the pie it represents
  if (sectionPercentInterval >= 60) {
    this.pastePieText(currentSectionThis);
  }
  // ^^^^ PASTING ON THE CANVAS ^^^^

  sectionPercentInterval = sectionPercentInterval + this.animationSpeed_i*2;
  // Animation for individual section only.
  if (sectionPercentInterval  <= 100) {
    // Recursive repeat this function until the end is reached
    requestAnimationFrame(function () {
      wheelChartThis.animationCycler(sectionID, sectionPercentInterval, ringPercentInterval);
    });
  } else {
    sectionPercentInterval = 0;
    ringPercentInterval = ringPercentInterval + currentSectionThis.percentageArc_i;
    sectionID = sectionID + 1;
    if (sectionID < wheelChartThis.numberOfSections_i){
      requestAnimationFrame(function () {
        wheelChartThis.animationCycler(sectionID, sectionPercentInterval, ringPercentInterval);
      });
    } else if (sectionID >= wheelChartThis.numberOfSections_i) {
      //This is purely me being nitpicky. The last section of the chart with blurred edges gets drawn after the ring, so if the ring is right next to the chart, that last section blurrs over into the ring. Its silly but I just cant leave that. comment out this next if case and you'll see the difference. I have to just print the entire ring out again to make it dominant.
      this.ctx.clearRect(0, 0, wheelChartThis.containerSize_a_i[0], wheelChartThis.containerSize_a_i[1]);

      for (var i = 0; i <= (sectionID - 1); i++) {
        this.pastePieArc(wheelChartThis.sections_a_o[i], wheelChartThis.sections_a_o[i].radialEnd, i, wheelChartThis.sections_a_o[i].adjustedInnerRadius, wheelChartThis.sections_a_o[i].arcWidth);

        this.pastePieArc(wheelChartThis.sections_a_o[i], wheelChartThis.sections_a_o[i].radialEnd, i, wheelChartThis.sections_a_o[i].adjustedInnerRadius + wheelChartThis.sections_a_o[i].arcWidth/2 + 30, 40);

        this.pastePieText(wheelChartThis.sections_a_o[i]);
      }
    }
  }
};

StackedWheel.prototype.pastePieArc = function(currentSectionThis, tempRadialEnd, sectionID, centeredRadius, arcWidth) {
  this.ctx.beginPath();
  this.ctx.arc(this.containerSize_a_i[0] / 2, this.containerSize_a_i[1] / 2, centeredRadius, currentSectionThis.radialStart, tempRadialEnd, false);
  this.ctx.lineWidth = arcWidth;
  this.ctx.strokeStyle = this.colorScheme_a_s[0][sectionID]
  this.ctx.stroke();
  this.ctx.closePath();
}

StackedWheel.prototype.pastePieText = function(currentSectionThis) {
  this.ctx.beginPath();
  this.ctx.fillText(currentSectionThis.percentageArc_i.toString() + "%", currentSectionThis.sweetSpotXcoord, currentSectionThis.sweetSpotYcoord);
  this.ctx.closePath();
}

StackedWheel.prototype.drawWheel = function() {
  // this.animationCycler();
  this.recursivelyLoopAndGrabDataForCalculationsAndOrdering();
  // debugger
  // for(var i = 0; i < this.layersWithSectionData_a_o.length; i++) {
    this.animationCycler2();
  // }
  // debugger
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

// percentages vs visual percentages. visual percentages need to be altered if some acutal percentage is too small
  // if percentages do not reach 100, only feed the empty percentage slots to sections if they are under the min
  // else take away 1% from largest section in a loop as long as they can afford it.

// add option for ring around the top
  // error check, min and max widths need to match up to eliminate stacking if the ring is desired.




  // END OF DAY November 1

   // StackedWheel object takes in two properties; an elementID to identify the canvas container in the DOM, and a json object that contains the data that will populate value along with the settings.
function ValuePresenter(elementDOM, settingsJSON) {

  this.settingsJSON = settingsJSON;
  this.elementDOM = elementDOM;
  this.ctx = this.elementDOM.getContext("2d");

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
  this.containerSize_a_i = this.settingsJSON.options.containerSize_a_i;
}

// I really do not like this decelerator. To be honest, requestAnimationFrame is kind of a pain in the ass to use. I cannot control the number of intervals and timing.
ValuePresenter.prototype.animationCycler = function(newValue, decelerator, xxx) {

  var valuePresenter = this;
  var fullValue = this.currentValue_f;
  var barsNumber;

  var decelerator = (typeof decelerator === 'undefined') ? (.01) : decelerator;
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
  if (newValue >= this.currentValue_f * .9 && newValue < fullValue * .95) {
    decelerator = decelerator / 1.1
    if (xxx == 0) {
      xxx= 1;
            console.log('-----first------')
      console.log(newValue)
      console.log(newValue/fullValue)

    }
    newValue = newValue + fullValue * decelerator;
  }
  else if (newValue >= fullValue - .05) {
    decelerator = .0005/fullValue
    if (xxx == 2) {

      xxx= 3;
      console.log('------last---------')
      console.log(newValue)
      console.log(newValue/fullValue)
    }
    newValue = newValue + .01 * decelerator;
  } else if (newValue < fullValue * .9){
    newValue = newValue + fullValue * decelerator;
  } else {
        if (xxx == 1) {

      xxx= 2;
      console.log('--------else---------')
      console.log(newValue)
      console.log(newValue/fullValue)
    }
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
  var marginLeft = 70 - (this.currentValue_f.toFixed(2).length - 4) * 10 - subtractLeftMarginForSymbol

  if (type == "title"){
    this.ctx.fillStyle = this.titleTextColor_s;
    this.ctx.font = this.titleTextFont_s;
    this.ctx.fillText(this.title_s, marginLeft + 5, 35); //80 left
  }

  if (type == "value"){
    var fontSize = parseInt(this.valueTextFont_s.match(/\d/g).join(""));
    var marginTop = fontSize + 35 + 12;

    var fillText = value.toFixed(2);
    if (this.valueSymbol_s != "none") {
      var marginLeft = marginLeft + fontSize/2 + 10;
    }
    this.ctx.fillStyle = this.valueTextColor_s;
    this.ctx.font = this.valueTextFont_s;
    this.ctx.fillText(fillText, marginLeft, marginTop );
  }

  if (type == "unit") {
    var fontSize = parseInt(this.valueTextFont_s.match(/\d/g).join(""));
    var marginTop = fontSize + 35 + 12;
    this.ctx.fillStyle = this.valueTextColor_s;
    this.ctx.font = this.valueTextFont_s;
    if (this.valueSymbol_s != "none") {
      this.ctx.fillText(this.valueSymbol_s, marginLeft, marginTop );
    }
  }
  this.ctx.closePath();
};

ValuePresenter.prototype.pasteGraph = function(bars) {

  if (this.valueSymbol_s != "none") { var addLeftMarginForSymbol = this.valueSymbol_s.length }
  else { var addLeftMarginForSymbol = 0 }

  var initialDistanceFromLeft = 130 + ( this.currentValue_f.toFixed(2).length + addLeftMarginForSymbol) * 12;
  var distanceFromTop = 77;
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
  this.animationCycler();
};
