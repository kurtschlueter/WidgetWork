 // DynamicWheel object takes in two properties; an elementID to identify the canvas container in the DOM, and a json object that contains the data that will populate the wheel along with the settings.
function DynamicWheel(elementDOM, settingsJSON) {

  //special object with data for special extensions
  this.specialExtensionData = [];

  this.minSecLength = 5; // min section length that triggers line attachment
  this.settingsJSON = settingsJSON;

  // Reference to element in DOM and launching canvas context. All static properties of ctx also defined here.
  this.elementDOM = elementDOM;

  // this.elementDOM.width  = this.settingsJSON.options.containerSize_a_i[0];
  // this.elementDOM.height = this.settingsJSON.options.containerSize_a_i[1];

  this.elementDOM.width  = 1200;
  this.elementDOM.height = 1200;
  this.elementDOM.style.width = "600px";
  this.elementDOM.style.height = "600px";

  // this.elementDOM.width  = 400;
  // this.elementDOM.height = 400;

  // canvas context properties will be called from this.ctx throughout the whole class. It is important to note that these properties should be monitored because every canvas fill/stroke/text/whatever uses it. That is why I reset some of them sometimes after a path has been filled and closed.
  this.ctx = this.elementDOM.getContext("2d");

  this.ctx.scale(2,2);

  this.ctx.shadowOffsetX = 0;
  this.ctx.shadowOffsetY = 0;
  this.ctx.textAlign="center";

  this.containerSize_a_i = this.settingsJSON.options.containerSize_a_i;
  this.initialRadius_i = this.settingsJSON.options.initialRadius_i;
  this.animation_b = this.settingsJSON.options.animation_b;
  this.animationSpeed_i = this.settingsJSON.options.animationSpeed_i;
  this.radiusPop_i = this.settingsJSON.options.radiusPop_i;

  // These properties control the inner circle fill and text properties.
  this.innerDescriptions_s = this.settingsJSON.innerDescriptions_s;
  this.innerText_b = this.settingsJSON.options.innerText_b;
  this.innerTextColor_s = this.settingsJSON.options.innerTextColor_s;
  this.innerTextFonts_a_s = this.settingsJSON.options.innerTextFonts_a_s;
  this.innerTextShadowThickness_s = this.settingsJSON.options.innerTextShadowThickness_s;
  this.innerTextShadowColor_s = this.settingsJSON.options.innerTextShadowColor_s;
  this.centeredCircle_b = this.settingsJSON.options.centeredCircle_b;
  this.centeredCircleColor_s = this.settingsJSON.options.centeredCircleColor_s;
  this.centeredCircleShadowThickness_s = this.settingsJSON.options.centeredCircleShadowThickness_s;
  this.centeredCircleShadowColor_s = this.settingsJSON.options.centeredCircleShadowColor_s;
  this.centeredCircleShadowColor_s = this.settingsJSON.options.centeredCircleShadowColor_s;

  // This is the initial object with the actual data.
  this.sections_a_o = this.settingsJSON.data.sections;
  // THIS IS THE MONEY OBJECT. Here we will populate each layer of the wheel with sections containing positioning, styling, reference, and content data.
  this.layersWithSectionData_a_o = [];

  this.adjustedPercentagesLevel1 = this.level1PercentageAdjuster();

  this.recursivelyLoopAndGrabDataForCalculationsAndOrdering();
}

// I did this for the first level only. This might need to get integrated somehow into all levels. But for now this is good. WHat this function does is to set a minimum for the minimum arc radial span. We do not want a piece of the pie that is 1% of the data to only be visually 1%. I think I have to minimum at 10%. This returns an array of percentages that will line up with every section in the first layer. You are on you rown for the following layers.
DynamicWheel.prototype.level1PercentageAdjuster  = function() {

  var minAllowableArcLength = this.settingsJSON.options.minAllowableArcLength_i;
  var cachedNeededPercentageCount = 0;
  var numberOfSections = this.sections_a_o.data.length;
  var currentPercentages_a_i = []

  for ( var i = 0; i < numberOfSections; i++) {
    currentPercentages_a_i[i] = this.sections_a_o.data[i].percentageArc_i;
  }

  var engaged = false;
  while (cachedNeededPercentageCount != 0 || engaged == false) {
    engaged = true;
    for ( var x = 0; x < numberOfSections; x++) {
      if (currentPercentages_a_i[x] < minAllowableArcLength) {
        cachedNeededPercentageCount = cachedNeededPercentageCount - (minAllowableArcLength - currentPercentages_a_i[x]);
        currentPercentages_a_i[x] = minAllowableArcLength;
      }
      else if (currentPercentages_a_i[x] > minAllowableArcLength) {
        if (cachedNeededPercentageCount < 0 ) {
          cachedNeededPercentageCount = cachedNeededPercentageCount + 1;
          currentPercentages_a_i[x] = currentPercentages_a_i[x] - 1;
        }
      }
    }
  }

  return currentPercentages_a_i;
}

// Ok this one is tough. This is recursive function with obj as the main input. Initially, obj is the entire data jSON passed in by the runner file. The way the jSON is set up is a data object with an array of sections. Each section can also have a data object containing an array of sections... and so on. This is how the data is divided into sections. Ok so this function goes recursivley through levels, and loops through sections at each one (the for loop). This is how I populate the very important this.layersWithSectionData_a_o array of objects. At each level and each section, I give this object the neccessary information to build the wheel. Level, currentPercentScopeView, currentPercentScopeData, and radiusScope are also inputs in this recursive function. Why? Level is quite obvious. I need to know what level I am on in order to put the sections in the correct level of the this.layersWithSectionData_a_o. currentPercentScopeView is key becuase I need to know what percent the containing section spans with respect to 2*Pi. For example, if level 1 section 1 is 50% of the circle, and level 2 section 1 (which is part of level 1 section 1) is 50% of level 1 section 1, it is 25% of the entire circle. I need to know what the containing percent scope is. Same thought processes for currentPercentScopeData. If you remember, we have a level1percentage adjuster, so the data and visual percentages will be different. The same goes for the radiusScope. I know the widths of each layer, but I need to know radius from center in order to calculate positioning. That means I need the previous radius information
DynamicWheel.prototype.recursivelyLoopAndGrabDataForCalculationsAndOrdering  = function(level, currentPercentScopeView, currentPercentScopeData, radiusScope, obj) {

  // These are all the initiallizers we will need to start the whole recursive process. We only want to set these, once, initially when this function is first called, then let the proper value be set by the recursive process.
  var level = (typeof level === 'undefined') ? 0 : level;
  var currentPercentScopeView = (typeof currentPercentScopeView === 'undefined') ? 100 : currentPercentScopeView;
  var currentPercentScopeData = (typeof currentPercentScopeData === 'undefined') ? 100 : currentPercentScopeData;
  var obj = (typeof obj === 'undefined') ? this.sections_a_o.data : obj;
  var radiusScope = (typeof radiusScope === 'undefined') ? this.settingsJSON.options.initialRadius_i : radiusScope;
  this.layersWithSectionData_a_o[level] = (typeof this.layersWithSectionData_a_o[level] === 'undefined') ? {} : this.layersWithSectionData_a_o[level];
  var currentLevel = this.layersWithSectionData_a_o[level];
  currentLevel.sections = (typeof currentLevel.sections === 'undefined') ? [] : currentLevel.sections;
  currentLevel.sectionsIndex_i = (typeof currentLevel.sectionsIndex_i === 'undefined') ? 0 : currentLevel.sectionsIndex_i;
  currentLevel.lastPercentage_i = (typeof currentLevel.lastPercentage_i === 'undefined') ? 0 : currentLevel.lastPercentage_i;

  this.setLevelProperties(level);

  // Time to go into each section and calculate and set properties.
  for (var x = 0; x < obj.length; x++) {

    currentLevel.sections[currentLevel.sectionsIndex_i] = {};
    var currentSection = currentLevel.sections[this.layersWithSectionData_a_o[level].sectionsIndex_i];

    currentSection.description_s = obj[x].description_s;
    currentSection.value_i = obj[x].value_i;
    currentSection.percentageArcData_i = obj[x].percentageArc_i;
    currentSection.iconUnicode_s = obj[x].iconUnicode_s;

    currentSection.previousContainerPercentageScopeView_i = currentPercentScopeView;
    currentSection.previousContainerPercentageScopeData_i = currentPercentScopeData;
    currentSection.previousContainerRadiusScope_i = radiusScope;
    currentSection.indexWithRespectToParentSection_i = x;

    if ( level > 0 ) {
      currentSection.percentageArcView_i = obj[x].percentageArc_i;
      if ( x == 0 ) {
        currentSection.starterStatus_b = true;
      } else {
        currentSection.starterStatus_b = false;
      }
      currentSection.previousContainerSectionScope_i = this.layersWithSectionData_a_o[level - 1].sectionsIndex_i
    } else {
      // if ( this.)
      currentSection.percentageArcView_i = this.adjustedPercentagesLevel1[x];
      currentSection.starterStatus_b = true;
      currentSection.previousContainerSectionScope_i = 'none';
    }

    this.generateSectionColor(level, currentLevel.sectionsIndex_i, x);
    this.calculateSectionArcGlobalPercentage(level, currentLevel.sectionsIndex_i);
    this.calculateRadialStarts(level, currentLevel.sectionsIndex_i);
    this.calculateRadialEnds(level, currentLevel.sectionsIndex_i);
    this.calculateGridPositioning(level, currentLevel.sectionsIndex_i, obj.length);
    this.setSectionLineAttachmentProperties(level, currentLevel.sectionsIndex_i);
    this.calculateLineCoordinates(level, currentLevel.sectionsIndex_i);

    currentLevel.sectionsIndex_i = currentLevel.sectionsIndex_i + 1;
    currentLevel.lastPercentage_i = currentLevel.lastPercentage_i + currentSection.globalPercentageArcView_i;

    if ( typeof obj[x].data == 'object' ) {
      var tempNextRadius = currentSection.adjustedInnerRadius_i + currentSection. arcWidth_i/2;
      this.recursivelyLoopAndGrabDataForCalculationsAndOrdering(level + 1, currentSection.globalPercentageArcView_i, currentSection.globalPercentageArcData_i, tempNextRadius, obj[x].data)
    }
  }
}

// Here is where I fill special extention properties object
DynamicWheel.prototype.setSpecialExtensionProperties  = function(level, section) {
  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = currentLevel.sections[section];

//   if (level == 1 && currentSection.previousContainerPercentageScopeView_i <= this.minSecLength) {

//     if current section is a starterStatus_b

//       generate line coordinates



//   }

// // this.specialExtensionData
// debugger
}

// Here I am setting the properties for each level... color schemes, display preferences, etc..
DynamicWheel.prototype.setLevelProperties  = function(level) {
  var currentLevel = this.layersWithSectionData_a_o[level];

  currentLevel.minimumArcWidth_i = this.settingsJSON.options.layers[level].minimumWidth_i;
  currentLevel.maximumArcWidth_i = this.settingsJSON.options.layers[level].maximumWidth_i;
  currentLevel.printOption_s = this.settingsJSON.options.layers[level].printOption_s;
  currentLevel.textColor_s = this.settingsJSON.options.layers[level].textColor_s;
  currentLevel.sectionShadowColor_s = this.settingsJSON.options.layers[level].sectionShadowColor_s;
  currentLevel.textShadowColor_s = this.settingsJSON.options.layers[level].textShadowColor_s;
  currentLevel.sectionShadowThickness_s = this.settingsJSON.options.layers[level].sectionShadowThickness_s;
  currentLevel.textShadowThickness_s = this.settingsJSON.options.layers[level].sectionShadowThickness_s;
  currentLevel.textFont_s = this.settingsJSON.options.layers[level].textFont_s;
  currentLevel.colorScheme_a_s = this.settingsJSON.options.layers[level].colorScheme_a_s;
  currentLevel.colorSchemeType_s = this.settingsJSON.options.layers[level].colorSchemeType_s;
  currentLevel.printLocationIfUnderPercent_s = this.settingsJSON.options.layers[level].printLocationIfUnderPercent_s;
}

// This used to be set for levels but I changed it. The reason is for small arc length sections (like under 10%). These need to be triggered at the section level.
DynamicWheel.prototype.setSectionLineAttachmentProperties  = function(level, section) {
  console.log(level)
  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = currentLevel.sections[section];

  currentSection.lineAttachment_b = this.settingsJSON.options.layers[level].lineAttachment_b;
  currentSection.lineAttachmentThickness_i = this.settingsJSON.options.layers[level].lineAttachmentThickness_i;
  currentSection.attachedPrintOptions_s = this.settingsJSON.options.layers[level].attachedPrintOptions_s;
  currentSection.attachmentTextColor_s = this.settingsJSON.options.layers[level].attachmentTextColor_s;
  currentSection.attachmentTextFonts_s = this.settingsJSON.options.layers[level].attachmentTextFonts_s;

  // This is for the line attachment incase the arc length is too small. RIght now it is set for 4% hardcoded. We can have that as an option later.
  if (currentSection.globalPercentageArcView_i <= this.minSecLength && currentLevel.printLocationIfUnderPercent_s == 'attached') {
    currentSection.attachedPrintOptions_s = [currentLevel.printOption_s].concat(currentSection.attachedPrintOptions_s);
    currentSection.attachmentTextFonts_s = [currentLevel.textFont_s].concat(currentSection.attachmentTextFonts_s);
  }

  currentSection.lineAttachmentColor_s = this.settingsJSON.options.layers[level].lineAttachmentColor_s;
  currentSection.lineAttachmentLength_i = this.settingsJSON.options.layers[level].lineAttachmentLength_i;
}

// This produces the background color for the current section. This depends on whether or not the user wants custom color for leveled sections or if the leveled section color is a darker or lighter version of the parent section. This is done with the level colorSchemeType. custom means hard coded. else which means parent-color-range, is the gradient.
DynamicWheel.prototype.generateSectionColor  = function(level, section) {
  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = currentLevel.sections[section];

  if (currentLevel.colorSchemeType_s == 'custom') {
    // debugger
    currentSection.color_s = currentLevel.colorScheme_a_s[currentSection.indexWithRespectToParentSection_i];
  } else {
    // debugger
    var parentSectionColor = this.layersWithSectionData_a_o[level - 1].sections[currentSection.previousContainerSectionScope_i - 1].color_s;
    var rgbSplitToArrayOfStrings = parentSectionColor.substring(5, parentSectionColor.length-1).replace(/ /g, '').split(',');
    var parentSectionLightness = parseInt(rgbSplitToArrayOfStrings[2]);

    // SHould probably have limits here.
    var newLightness = (parentSectionLightness + (5 * (currentSection.indexWithRespectToParentSection_i + 1))).toString();
    var newSectionArrayOfStringsTemp = rgbSplitToArrayOfStrings;
    newSectionArrayOfStringsTemp[2] = newLightness + '%';
    var newSectionColor = "hsla(" + newSectionArrayOfStringsTemp.join(', ') + ")";
    currentSection.color_s = newSectionColor;
  }
}

// This calculates the current sections total percentage with respect to the entire circle. We can do this thanks to the containerPercentScope which is the total percentage of the parent.
DynamicWheel.prototype.calculateSectionArcGlobalPercentage  = function(level, section) {
  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = currentLevel.sections[section];
  currentSection.globalPercentageArcView_i = currentSection.previousContainerPercentageScopeView_i / 100 * currentSection.percentageArcView_i;
  currentSection.globalPercentageArcData_i = currentSection.previousContainerPercentageScopeData_i / 100 * currentSection.percentageArcData_i;
}

// Calculating at which radian the section starts.
DynamicWheel.prototype.calculateRadialStarts  = function(level, section) {
  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = currentLevel.sections[section];

  if (section != 0) {

    // This is crucial becuase if sections in layers 2 or above do not amount to 100%, the next section in that level, from a different containing section, would just post up right next to it. We do not want that. For example, if a section in level 1 has two subsections (50% and 20%) and the next section in level 1 has two subsections (whatever %). The wahtever % subjections would rest up right next to the 20% subsection, making it look like it was part of the first section in level. 1. We want a space there. We want that whatever section to start and finish within its parent radial parameters.
    if (level > 0 && currentSection.starterStatus_b == true) {
      currentSection.radialStart = this.layersWithSectionData_a_o[level - 1].sections[currentSection.previousContainerSectionScope_i - 1].radialStart

    // If everything adds up to 100%, the radial start of each section lines up with the radial end on the previous section. The only other condition is section 0 which has the radial start of 0. Bingo!
    } else {
      currentSection.radialStart = currentLevel.sections[section - 1].radialEnd
    }
  }
  // If first section
  if (section == 0) {
    currentSection.radialStart = 0
  }
}

// Calculating at which radian the section ends.
DynamicWheel.prototype.calculateRadialEnds  = function(level, section) {
  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = currentLevel.sections[section];
  currentSection.radialEnd = currentSection.radialStart + currentSection.globalPercentageArcView_i * Math.PI / 50;
}

// Calculating the radius midpoint and x and y coordinates for center of each section
DynamicWheel.prototype.calculateGridPositioning = function(level, section, numberOfSections) {

  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = currentLevel.sections[section];

  if( numberOfSections > 1 ) {
    var linearWidthDistribution = (currentLevel.maximumArcWidth_i - currentLevel.minimumArcWidth_i) / (numberOfSections - 1);
  } else {
    var linearWidthDistribution = 0;
  }

  // Section Width.
  currentSection.arcWidth_i = currentLevel.minimumArcWidth_i + linearWidthDistribution * (section % numberOfSections);

  if ( level == 0 ) {
    currentSection.adjustedInnerRadius_i = currentSection.previousContainerRadiusScope_i + (currentSection.arcWidth_i - currentLevel.minimumArcWidth_i) / 2;
    currentSection.adjustedEdgeRadius_i = currentSection.adjustedInnerRadius_i + (currentSection.arcWidth_i) /2;

    // The center (I hope) of each section in x and y coordinates with respect to the entire container.
    currentSection.sweetSpotXcoord = this.containerSize_a_i[0] / 2 + currentSection.adjustedInnerRadius_i * Math.cos((currentSection.radialStart + currentSection.radialEnd) / 2);
    currentSection.sweetSpotYcoord = this.containerSize_a_i[1] / 2 + currentSection.adjustedInnerRadius_i * Math.sin((currentSection.radialStart + currentSection.radialEnd) / 2);

    // The center outer edge (I hope) of each section in x and y coordinates
    currentSection.edgeSweetSpotXcoord = this.containerSize_a_i[0] / 2 + currentSection.adjustedEdgeRadius_i * Math.cos((currentSection.radialStart + currentSection.radialEnd) / 2);
    currentSection.edgeSweetSpotYcoord = this.containerSize_a_i[1] / 2 + currentSection.adjustedEdgeRadius_i * Math.sin((currentSection.radialStart + currentSection.radialEnd) / 2);

  } else {
    currentSection.adjustedInnerRadius_i = currentSection.previousContainerRadiusScope_i + (currentSection.arcWidth_i)/2;
    currentSection.adjustedEdgeRadius_i = currentSection.adjustedInnerRadius_i + (currentSection.arcWidth_i) /2;

    // The center (I hope) of each section in x and y coordinates with respect to the entire container.
    currentSection.sweetSpotXcoord = this.containerSize_a_i[0] / 2 + (currentSection.adjustedInnerRadius_i + this.radiusPop_i * level/2) * Math.cos((currentSection.radialStart + currentSection.radialEnd) / 2);
    currentSection.sweetSpotYcoord = this.containerSize_a_i[1] / 2 + (currentSection.adjustedInnerRadius_i + this.radiusPop_i * level/2) * Math.sin((currentSection.radialStart + currentSection.radialEnd) / 2) ;

    // The center outer edge (I hope) of each section in x and y coordinates
    currentSection.edgeSweetSpotXcoord = this.containerSize_a_i[0] / 2 + (currentSection.adjustedEdgeRadius_i + this.radiusPop_i * level/2) * Math.cos((currentSection.radialStart + currentSection.radialEnd) / 2);
    currentSection.edgeSweetSpotYcoord = this.containerSize_a_i[1] / 2 + (currentSection.adjustedEdgeRadius_i + this.radiusPop_i * level/2) * Math.sin((currentSection.radialStart + currentSection.radialEnd) / 2) ;
  }
}


DynamicWheel.prototype.calculateLineCoordinates = function(level, section, numberOfSections) {

  var currentLevel = this.layersWithSectionData_a_o[level];
  var currentSection = currentLevel.sections[section];

  var lineLength =  currentSection.lineAttachmentLength_i;
  currentSection.lineCoords_a_i = [[currentSection.edgeSweetSpotXcoord, currentSection.edgeSweetSpotYcoord]]

  var endXpart1 = this.containerSize_a_i[0] / 2 + (currentSection.adjustedEdgeRadius_i + lineLength)* Math.cos((currentSection.radialStart + currentSection.radialEnd) / 2);
  var endYpart1 = this.containerSize_a_i[1] / 2 + (currentSection.adjustedEdgeRadius_i + lineLength)* Math.sin((currentSection.radialStart + currentSection.radialEnd) / 2);

  currentSection.lineCoords_a_i.push([endXpart1, endYpart1]);

  if ((currentSection.radialStart + currentSection.radialEnd) / 2 >= Math.PI) {
    var endXpart2 = endXpart1;
    var endYpart2 = endYpart1 - 20;
    currentSection.lineTextBaselineProperty_s = 'bottom';
  } else {
    var endXpart2 = endXpart1;
    var endYpart2 = endYpart1 + 20;
    currentSection.lineTextBaselineProperty_s = 'top';
  }

  currentSection.lineCoords_a_i.push([endXpart2, endYpart2]);
}

// This one is a work in progress. This is the animator which is also a recursive function. The problem I am having right now is that I am building up each section to 100% for each level and moving onto the next section. This is an issue if the first level has 6 section and the second level has 12 and the 3rd level has 24 and so on. When the first level finishes, the 3rd level will only be a quarter finshed. This does not look good. OK so why did I do it this way. In order to get the animation effect of the pie chart slowly completing radially, HTML canvas is set up in a way that you have to clear the canvas and reprint. So for example. If I am making a line that is 100 units long, I can loop through 100 time (for 100% at the end) and build the line from 0 to percent + 1 each time. Each time, the clearRect, will empty the screen and immediately prrint out the line 1% larger making it look like it's growing. Simple enough right? Wrong. What if I have 6 sections in a wheel in layer 1, and 12 sections in layer 2, and 24 and so one. In order for each level to go around the circle at the same pace, everytime a section finishes on any level, I need to stop and save the current section and paused endpoint at every other level. It sounds doable, but it will take a complete restructuring of what I have. It is important to note that each section is it's own entity.
DynamicWheel.prototype.animationCycler = function(sectionIDs, sectionPercentInterval) {

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

      // This is for the radius pop. The 3rd level sections were over lapping with the second level sections  becuase they were not taking into account the second level pop.
      if (xLevels > 0){
          this.pastePieArc(xLevels, sectionIDs[xLevels], endForArc, this.radiusPop_i*(xLevels));
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
      this.pasteCenterOptions();
    }
  }
}

DynamicWheel.prototype.pastePreviouslyPasted = function(sectionIDs) {

  // for each level
  for (var xLevels = 0; xLevels < this.layersWithSectionData_a_o.length; xLevels++) {
    // for each section in each level
    for ( var xSections = 0; xSections < sectionIDs[xLevels]; xSections++) {

      if (xLevels != 0) {
        radiusPop = this.radiusPop_i*xLevels;
        this.pastePieArc(xLevels, xSections, this.layersWithSectionData_a_o[xLevels].sections[xSections].radialEnd, radiusPop);
      }
      else {
        radiusPop = 0;
        this.pastePieArc(xLevels, xSections, this.layersWithSectionData_a_o[xLevels].sections[xSections].radialEnd, radiusPop);
      }
      this.pastePieText(xLevels, xSections);
      this.pasteLineExtensionTexts(xLevels, xSections);
    }
  }
}

DynamicWheel.prototype.pastePieArc = function(levelID, sectionID, tempRadialEnd, radiusPop) {
  var currentLevel = this.layersWithSectionData_a_o[levelID];
  var currentSection = currentLevel.sections[sectionID];

  this.ctx.beginPath();

  if (currentLevel.sectionShadowColor_s == 'none') {
    this.ctx.shadowBlur = 0;
  } else {
    this.ctx.shadowBlur = currentLevel.sectionShadowThickness_s;
    this.ctx.shadowColor = currentLevel.sectionShadowColor_s;
  }

  this.ctx.arc(this.containerSize_a_i[0] / 2, this.containerSize_a_i[1] / 2, currentSection.adjustedInnerRadius_i + radiusPop/2, currentSection.radialStart, tempRadialEnd, false);
  this.ctx.lineWidth = currentSection.arcWidth_i;
  this.ctx.strokeStyle = currentSection.color_s;
  this.ctx.stroke();
  this.ctx.closePath();
};

DynamicWheel.prototype.pastePieText = function(levelID, sectionID) {
  var currentLevel = this.layersWithSectionData_a_o[levelID];
  var currentSection = currentLevel.sections[sectionID];
  var toPaste;
  var xTouches = 0;
  var yTouches = 0;

  this.ctx.font = currentLevel.textFont_s;

  if (currentLevel.textShadowColor_s == 'none') {
    this.ctx.shadowBlur = 0;
  } else {
    this.ctx.shadowBlur = currentLevel.textShadowThickness_s;;
    this.ctx.shadowColor = currentLevel.textShadowColor_s;
  }

  if (currentSection.globalPercentageArcView_i <= this.minSecLength && currentLevel.printLocationIfUnderPercent_s != 'centered') {
    return
  }

  if (currentLevel.printOption_s == "none") {
    return;
  }

  if (currentLevel.printOption_s == "description") {
    toPaste = currentSection.description_s;
  }

  if (currentLevel.printOption_s == "value") {
    toPaste = currentSection.value_i.toString();
  }

  if (currentLevel.printOption_s == "icon") {
    toPaste = currentSection.iconUnicode_s;
    // Why you ask. Excellent question. Icons do not center in the middle of the icon vertically. Only horizontally. That means if you have a large icon, the bottom middle will center and the icon will draw only upwards. Im am just correcting for this by taking into account the icon size.
    // yTouches = parseInt(currentLevel.textFont_s.match(/\d/g).join("")) / 2;
  }

  if (currentLevel.printOption_s == "percent") {
    // If percentage is 0 and is not in level 2, I dont want to show any text. Maybe when I put the minimums like I have in first layer, Ill get rid of this. But for now, we just have no space. To be honest, I should do this for anything under 25 percent for overlapping issues. But the overlapping isssue needs to be fixed way before. THis wheel needs to be responsive dpending on the input dimensions.
    if (levelID != 0 && currentSection.percentageArcData_i == 0) {
      toPaste='';
    } else {
      toPaste = (Math.round(currentSection.percentageArcData_i * 100) / 100).toString() + "%";
    }
  }

  if (currentLevel.printOption_s == "parent-percent") {
      toPaste = (Math.round(currentSection.globalPercentageArcData_i * 100) / 100).toString() + "%";
  }

  this.ctx.beginPath();
  this.ctx.fillStyle = currentLevel.textColor_s;
  this.ctx.textBaseline = "middle";
  this.ctx.fillText(toPaste, currentSection.sweetSpotXcoord + xTouches, currentSection.sweetSpotYcoord + yTouches);
  this.ctx.closePath();
};


DynamicWheel.prototype.pasteCenterOptions = function(levelID, sectionID) {
  if (this.centeredCircle_b == true) {
    this.ctx.beginPath();
    this.ctx.shadowBlur = this.centeredCircleShadowThickness_s;
    this.ctx.shadowColor =  this.centeredCircleShadowColor_s;
    this.ctx.arc(this.containerSize_a_i[0] / 2, this.containerSize_a_i[1] / 2, this.initialRadius_i - this.layersWithSectionData_a_o[0].minimumArcWidth_i / 2, 0, 2*Math.PI, false);
    this.ctx.fillStyle = this.centeredCircleColor_s;
    this.ctx.fill();
    this.ctx.closePath();
  }

  if (this.innerText_b == true) {
    var centeredTextAdjustedX;
    var centeredTextAdjustedY;

    var fontSizes = [];
    var totalFontHeight = 0;
    var largestFontSize = 0;
    var currentFontSize;
    var buffer = 10;

    for (var i = 0; i < this.innerTextFonts_a_s.length; i++) {
      currentFontSize = parseInt(this.innerTextFonts_a_s[i].match(/\d/g).join(""));
      fontSizes.push(currentFontSize);
      if (currentFontSize > largestFontSize) { largestFontSize = currentFontSize };
      totalFontHeight = totalFontHeight + currentFontSize;
    }

    var avgFontSize = totalFontHeight / this.innerTextFonts_a_s.length;

    for (var ii = 0; ii < this.innerDescriptions_s.length; ii++) {

      this.ctx.beginPath();
      this.ctx.fillStyle = this.innerTextColor_s;
      this.ctx.font = this.innerTextFonts_a_s[ii];
      this.ctx.shadowBlur = this.innerTextShadowThickness_s;
      this.ctx.shadowColor = this.innerTextShadowColor_s;
      this.ctx.fillText(this.innerDescriptions_s[ii], this.containerSize_a_i[0] / 2, this.containerSize_a_i[1] / 2 + (largestFontSize + buffer) * ii - totalFontHeight/2 + buffer);
      this.ctx.closePath();

    }
  }
}



DynamicWheel.prototype.pasteLinesForExtention = function(levelID, sectionID) {
  var currentLevel = this.layersWithSectionData_a_o[levelID];
  var currentSection = currentLevel.sections[sectionID];
  this.ctx.beginPath();
  this.ctx.lineWidth = currentSection.lineAttachmentThickness_i;
  this.ctx.strokeStyle = currentSection.lineAttachmentColor_s;
  this.ctx.moveTo(currentSection.lineCoords_a_i[0][0], currentSection.lineCoords_a_i[0][1]);
  this.ctx.lineTo(currentSection.lineCoords_a_i[1][0], currentSection.lineCoords_a_i[1][1]);
  this.ctx.lineTo(currentSection.lineCoords_a_i[2][0], currentSection.lineCoords_a_i[2][1]);
  this.ctx.stroke();
  this.ctx.closePath();
}

DynamicWheel.prototype.pasteLineExtensionTexts = function(levelID, sectionID) {
  // debugger
  var currentLevel = this.layersWithSectionData_a_o[levelID];
  var currentSection = currentLevel.sections[sectionID];
  var toPaste;

  if (currentSection.lineAttachment_b == true && currentSection.previousContainerPercentageScopeView_i >= this.minSecLength) {

    var buffer = 5;
    var fontSize;
    var prevFontSize = 0;
    var xPositioning;
    var yPositioning;

    for (var i = 0 ; i < currentSection.attachedPrintOptions_s.length ; i++) {

      this.pasteLinesForExtention(levelID, sectionID);
      this.ctx.beginPath();
      this.ctx.fillStyle = currentSection.attachmentTextColor_s;
      this.ctx.textBaseline = currentSection.lineTextBaselineProperty_s;
      // debugger
      if ((currentSection.radialStart + currentSection.radialEnd) / 2 >= Math.PI) {

        this.ctx.font = currentSection.attachmentTextFonts_s[currentSection.attachedPrintOptions_s.length - 1 - i];
        fontSize = parseInt(currentSection.attachmentTextFonts_s[currentSection.attachedPrintOptions_s.length - 1 - i].match(/\d/g).join(""));

        if (currentSection.attachedPrintOptions_s[currentSection.attachedPrintOptions_s.length - 1 - i] == 'description') {
          toPaste = currentSection.description_s;
        }

        if (currentSection.attachedPrintOptions_s[currentSection.attachedPrintOptions_s.length - 1 - i] == 'percent') {
          toPaste = currentSection.percentageArcData_i.toString() + "%";
        }

        if (currentSection.attachedPrintOptions_s[currentSection.attachedPrintOptions_s.length - 1 - i] == 'value') {
          toPaste = currentSection.value_i.toString();
        }

        if (currentSection.attachedPrintOptions_s[currentSection.attachedPrintOptions_s.length - 1 - i] == 'parent-percent') {
          toPaste = currentSection.globalPercentageArcData_i.toString() + "%";
        }

        xPositioning = currentSection.lineCoords_a_i[2][0];
        yPositioning = currentSection.lineCoords_a_i[2][1] - (i * (prevFontSize + buffer));

      } else {

        this.ctx.font = currentSection.attachmentTextFonts_s[i];
        fontSize = parseInt(currentSection.attachmentTextFonts_s[i].match(/\d/g).join(""));

        if (currentSection.attachedPrintOptions_s[i] == 'description') {
          toPaste = currentSection.description_s;
        }

        if (currentSection.attachedPrintOptions_s[i] == 'percent') {
          toPaste = currentSection.percentageArcData_i.toString() + "%";
        }

        if (currentSection.attachedPrintOptions_s[i] == 'value') {
          toPaste = currentSection.value_i.toString();
        }

        if (currentSection.attachedPrintOptions_s[i] == 'parent-percent') {
          toPaste = currentSection.globalPercentageArcData_i.toString() + "%";
        }

        xPositioning = currentSection.lineCoords_a_i[2][0];
        yPositioning = currentSection.lineCoords_a_i[2][1] + (i * (prevFontSize + buffer));

      }

      prevFontSize = fontSize;

      this.ctx.fillText(toPaste, xPositioning, yPositioning);
      this.ctx.closePath();
    }
    this.ctx.textBaseline = "alphabetic";

  } else if ( currentSection.lineAttachment_b == true && currentSection.previousContainerPercentageScopeView_i < this.minSecLength) {

    var xPositioningIcon, xPositioningNext, yPositioningIcon, yPositioningNext, toPasteIcon, toPasteNext;

    if ( currentSection.starterStatus_b == true) {
        this.pasteLinesForExtention(levelID, sectionID);
    }

    this.ctx.beginPath();
    this.ctx.font = this.layersWithSectionData_a_o[0].textFont_s;
    this.ctx.fillStyle = 'black';

    if ((currentSection.radialStart + currentSection.radialEnd) / 2 >= Math.PI) {

      //if starter
      if ( currentSection.starterStatus_b == true) {

        this.ctx.textBaseline = "bottom";
        xPositioningIcon = currentSection.lineCoords_a_i[2][0];
        yPositioningIcon = currentSection.lineCoords_a_i[2][1];
        toPasteIcon = this.layersWithSectionData_a_o[0].sections[currentSection.previousContainerSectionScope_i - 1].iconUnicode_s;
        this.ctx.fillText(toPasteIcon, xPositioningIcon, yPositioningIcon);
        // toPaste = 'cat';
        // debugger
      } else {
        // this.ctx.textBaseline = "top";
        // xPositioningNext = currentSection.lineCoords_a_i[2][0];
        // yPositioningNext = currentSection.lineCoords_a_i[2][1] - 20;
        // toPasteNext = 'cat'
        // this.ctx.fillText(toPasteNext, xPositioningNext, yPositioningNext);

      }

    } else {

      //if starter
      if ( currentSection.starterStatus_b == true) {

        this.ctx.textBaseline = "top";
        xPositioningIcon = currentSection.lineCoords_a_i[2][0];
        yPositioningIcon = currentSection.lineCoords_a_i[2][1];
        toPasteIcon = this.layersWithSectionData_a_o[0].sections[currentSection.previousContainerSectionScope_i - 1].iconUnicode_s;
        this.ctx.fillText(toPasteIcon, xPositioningIcon, yPositioningIcon);
        // toPaste = 'cat';
        // debugger
      } else {

        // this.ctx.textBaseline = "bottom";
        // xPositioningNext = currentSection.lineCoords_a_i[2][0];
        // yPositioningNext = currentSection.lineCoords_a_i[2][1] + 20;
        // toPasteNext = 'dog';
        // this.ctx.fillText(toPasteNext, xPositioningNext, yPositioningNext);
      }

    }
    this.ctx.textBaseline = "alphabetic";
    this.ctx.closePath();
  }
}

DynamicWheel.prototype.drawWheel = function() {
  if(this.animation_b == true) {
    this.animationCycler();
  } else {
    var sectionIDs = [];
    for (var i = 0; i < this.layersWithSectionData_a_o.length; i++) {
      sectionIDs[i] = this.layersWithSectionData_a_o[i].sections.length
    }
    this.pastePreviouslyPasted(sectionIDs);
    this.pasteCenterOptions();
  }
  // debugger
};

