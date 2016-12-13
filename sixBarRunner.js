var data1 = {
  lastSixMonths_a_f: [2.80, 2.50, 1.00, 2.30, 1.50, 2.00]
};

var sixBars = new AnonymousBars(document.getElementById("totalSpendContainer"),
  {
    type: 'anonymous-bars',
    data: data1.lastSixMonths_a_f,
    options: {
      backgroundColor_s: "white",
      graphBarColor_s: "#7a9a01",
      animation_b: true,
      barWidth_i: 15,
      barRadius_i: 8,
      spaceBetweenBars_i: 16,
      maxBarHeight_i: 45,
      minBarHeight_i: 15,
      containerSize_a_i: [316, 100]
    }
  }
);

sixBars.drawBars();