var elementDOM = document.getElementById('costpermediasectionconatiner');

var vpData1 = {
  title_s: "Print",
  iconClass_s: "fa-list-alt",
  currentValue_s: 1.50,
  prefix_s: '$',
  sufix_s: '',
};

var vpData2 = {
  title_s: "Radio",
  iconClass_s: "fa-microphone",
  currentValue_s: 11.50,
  prefix_s: '',
  sufix_s: '%',
};

var vpData3 = {
  title_s: "TV",
  iconClass_s: "fa-television",
  currentValue_s: 12.50,
  prefix_s: '',
  sufix_s: '%',
};

var vpData4 = {
  title_s: "Bilboard",
  iconClass_s: "fa-list-alt",
  currentValue_s: 16.50,
  prefix_s: '$',
  sufix_s: '',
};

var vpData5 = {
  title_s: "Video",
  iconClass_s: "fa-youtube-play",
  currentValue_s: 1.50,
  prefix_s: '',
  sufix_s: '%',
};

function ValuePresenter2(elementDOM, uniqueID, settingsJSON) {
  this.elementDOM = elementDOM;
  this.uniqueID = uniqueID;
  this. title_s = settingsJSON.data.title_s;
  this.iconClass_s = settingsJSON.data.iconClass_s;
  this.currentValue_s = settingsJSON.data.currentValue_s;
  this.prefix_s = settingsJSON.data.prefix_s;
  this.sufix_s = settingsJSON.data.sufix_s;
}

ValuePresenter2.prototype.containerSetup = function() {

  var sectionContainer = document.createElement('div');
  sectionContainer.setAttribute("class", "sectionContainer");
  elementDOM.appendChild(sectionContainer);

  var sectionTitleContainer = document.createElement('div');
  sectionTitleContainer.setAttribute("class", "sectionTitleContainer");
  sectionTitleContainer.innerHTML = this.title_s;
  sectionContainer.appendChild(sectionTitleContainer);

  var sectionInformationContainer = document.createElement('div');
  sectionInformationContainer.setAttribute("class", "sectionInformationContainer");
  sectionContainer.appendChild(sectionInformationContainer);

  var icon = document.createElement('i');
  icon.setAttribute("class", "fa " + this.iconClass_s);
  icon.setAttribute("aria-hidden", "true");
  sectionInformationContainer.appendChild(icon);

  var sectionTotalContainer = document.createElement('div');
  sectionTotalContainer.setAttribute("class", "sectionTotalContainer");
  // sectionTotalContainer.setAttribute("id", this.uniqueID);
  sectionInformationContainer.appendChild(sectionTotalContainer);

  var spanPrefix = document.createElement('span');
  sectionTotalContainer.appendChild(spanPrefix);
  sectionTotalContainer.innerHTML = this.prefix_s;

  var spanValue = document.createElement('span');
  spanValue.setAttribute("id", this.uniqueID);
  sectionTotalContainer.appendChild(spanValue);

  var spanSufix = document.createElement('span');
  sectionTotalContainer.appendChild(spanSufix);
  spanSufix.innerHTML = this.sufix_s;
}


ValuePresenter2.prototype.drawWidget = function() {
  this.containerSetup();
  var numAnim = new CountUp(this.uniqueID, 0, this.currentValue_s, 2, 4);
  numAnim.start();
}

var newValuePresenter1 = new ValuePresenter2(elementDOM, 'numberSpan1',
  {
    type: 'value-presenter',
    data: vpData1,
    options: {
      animation_b: true,
      // containerSize_a_i: [316, 100]
    }
  }
);

newValuePresenter1.drawWidget()

var newValuePresenter2 = new ValuePresenter2(elementDOM, 'numberSpan2',
  {
    type: 'value-presenter',
    data: vpData2,
    options: {
      animation_b: true,
      // containerSize_a_i: [316, 100]
    }
  }
);

newValuePresenter2.drawWidget()

var newValuePresenter3 = new ValuePresenter2(elementDOM, 'numberSpan3',
  {
    type: 'value-presenter',
    data: vpData3,
    options: {
      animation_b: true,
      // containerSize_a_i: [316, 100]
    }
  }
);

newValuePresenter3.drawWidget()

var newValuePresenter4 = new ValuePresenter2(elementDOM, 'numberSpan4',
  {
    type: 'value-presenter',
    data: vpData4,
    options: {
      animation_b: true,
      // containerSize_a_i: [316, 100]
    }
  }
);

newValuePresenter4.drawWidget()

var newValuePresenter5 = new ValuePresenter2(elementDOM, 'numberSpan5',
  {
    type: 'value-presenter',
    data: vpData5,
    options: {
      animation_b: true,
      // containerSize_a_i: [316, 100]
    }
  }
);

newValuePresenter5.drawWidget()


