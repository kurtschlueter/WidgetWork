// 2 layers
var data = {
  data: [
  {
    description_s: "LR0SEC0",
    percentageArc_i: 20,
    data: [
      {
        description_s: 'LR1SEC0',
        percentageArc_i: 50,

      },
      {
        description_s: 'LR1SEC1',
        percentageArc_i: 20,

      }
    ]
  },
  {
    description_s: "LR0SEC1",
    percentageArc_i: 13,
    data: [
      {
        description_s: 'LR1SEC2',
        percentageArc_i: 50,

      },
      {
        description_s: 'LR1SEC3',
        percentageArc_i: 20,

      }
    ]
  },
  {
    description_s: "LR0SEC2",
    percentageArc_i: 15,
    data: [
      {
        description_s: 'LR1SEC4',
        percentageArc_i: 50,

      },
      {
        description_s: 'LR1SEC5',
        percentageArc_i: 50,

      }
    ]
  },
  {
    description_s: "LR0SEC3",
    percentageArc_i: 16,
    data: [
      {
        description_s: 'LR1SEC6',
        percentageArc_i: 50,

      },
      {
        description_s: 'LR1SEC7',
        percentageArc_i: 50,

      }
    ]
  },
  {
    description_s: "LR0SEC4",
    percentageArc_i: 14,
    data: [
      {
        description_s: 'LR1SEC8',
        percentageArc_i: 50,

      },
      {
        description_s: 'LR1SEC9',
        percentageArc_i: 50,

      }
    ]
  },
  {
    description_s: "LR0SEC5",
    percentageArc_i: 17,
    data: [
      {
        description_s: 'LR1SEC10',
        percentageArc_i: 50,

      },
      {
        description_s: 'LR1SEC11',
        percentageArc_i: 50,

      }
    ]
  },
]
};

var newStackedWheel = new StackedWheel(document.getElementById("stackedWheelCanvas2"),
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
          blurColor_s: "white",
          printOption_s: "description",
          colorScheme_a_s: ["#ff5b8e", "#98307b", "#662169", "#008baf", "#00ae85", "#8bb229"]
        },
        {
          minimumWidth_i: 70,
          maximumWidth_i: 70,
          textColor_s: "white",
          textFont_s: '10pt Helvetica',
          blurColor_s: "white",
          printOption_s: "percent",
          colorScheme_a_s: ["#662169", "#8bb229"]
        }
      ],
      initialRadius_i: 80,
      radiusPop_i: 0,
      animation_b: true,
      animationSpeed_i: 6,
      containerSize_a_i: [500, 500]
    }
  }
);

newStackedWheel.drawWheel();