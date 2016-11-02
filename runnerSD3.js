// One layer
var data = {
  data: [
  {
    description_s: "LR0SEC0",
    percentageArc_i: 25,
  },
  {
    description_s: "LR0SEC1",
    percentageArc_i: 13,
  },
  {
    description_s: "LR0SEC2",
    percentageArc_i: 15,
  },
  {
    description_s: "LR0SEC3",
    percentageArc_i: 16,
  },
  {
    description_s: "LR0SEC4",
    percentageArc_i: 14,
  },
  {
    description_s: "LR0SEC5",
    percentageArc_i: 17,
  },
]
};

var newStackedWheel2 = new StackedWheel(document.getElementById("stackedWheelCanvas2"),
  {
    type: 'stacked-wheel',
    data: {
        sections: data,
    },
    options: {
      layers: [
        {
          minimumWidth_i: 80,
          maximumWidth_i: 120,
          textColor_s: "white",
          textFont_s: '10pt Helvetica',
          blurColor_s: "black",
          printOption_s: "description",
          colorScheme_a_s: ["#ff5b8e", "#98307b", "#662169", "#008baf", "#00ae85", "#8bb229"]
        }
      ],
      initialRadius_i: 80,
      radiusPop_i: 20,
      animation_b: true,
      animationSpeed_i: 6,
      containerSize_a_i: [500, 500]
    }
  }
);

newStackedWheel2.drawWheel();