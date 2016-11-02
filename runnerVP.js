var data1 = {
  title_s: "TOTAL SPEND",
  currentValue_f: 1.50,
  lastSixMonths_a_f: [2.80, 2.50, 1.00, 2.30, 1.50, 2.00]
};

var newValuePresenter1 = new ValuePresenter(document.getElementById("totalSpendContainer"),
  {
    type: 'value-presenter',
    data: data1,
    options: {
      valueSymbol_s: "$",
      valueTextColor_s: "white",
      titleTextColor_s: "#475904",
      graphBarColor_s: "#475904",
      blurColor_s: "black",
      backgroundColor_s: "#7a9a01",
      animation_b: true,
      containerSize_a_i: [316, 100]
    }
  }
);

newValuePresenter1.drawPresenter();

var data2 = {
  title_s: "TOTAL LEADS",
  currentValue_f: 1.49,
  lastSixMonths_a_f: [12.80, 23.50, 11.00, 42.30, 12.50, 2.00]
};

var newValuePresenter2 = new ValuePresenter(document.getElementById("totalLeadsContainer"),
  {
    type: 'value-presenter',
    data: data2,
    options: {
      valueSymbol_s: "none",
      valueTextColor_s: "white",
      titleTextColor_s: "#475904",
      graphBarColor_s: "#475904",
      blurColor_s: "black",
      backgroundColor_s: "#7a9a01",
      animation_b: true,
      containerSize_a_i: [316, 100]
    }
  }
);


newValuePresenter2.drawPresenter();

var data3 = {
  title_s: "TOTAL CPL",
  currentValue_f: 133.30,
  lastSixMonths_a_f: [12.80, 23.50, 31.00, 28.30, 11.50, 21.00]
};


var newValuePresenter3 = new ValuePresenter(document.getElementById("totalCPLContainer"),
  {
    type: 'value-presenter',
    data: data3,
    options: {
      valueSymbol_s: "$",
      valueTextColor_s: "white",
      titleTextColor_s: "#475904",
      graphBarColor_s: "#475904",
      blurColor_s: "black",
      backgroundColor_s: "#7a9a01",
      animation_b: true,
      containerSize_a_i: [316, 100]
    }
  }
);

newValuePresenter3.drawPresenter();