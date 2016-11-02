// Three layers.
var data = {
  data: [
  {
    description_s: "LR0SEC0",
    percentageArc_i: 25,
    data: [
      {
        description_s: 'LR1SEC0',
        percentageArc_i: 50,
        data: [
          {
            description_s: 'LR2SEC0',
            percentageArc_i: 100
          }
        ]
      },
      {
        description_s: 'LR1SEC1',
        percentageArc_i: 50,
        data: [
          {
            description_s: 'LR2SEC1',
            percentageArc_i: 50
          },
          {
            description_s: 'LR2SEC2',
            percentageArc_i: 50
          }
        ]
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
        data: [
          {
            description_s: 'LR2SEC3',
            percentageArc_i: 50
          },
          {
            description_s: 'LR2SEC4',
            percentageArc_i: 50
          }
        ]
      },
      {
        description_s: 'LR1SEC3',
        percentageArc_i: 50,
        data: [
          {
            description_s: 'LR2SEC5',
            percentageArc_i: 50
          },
          {
            description_s: 'LR2SEC6',
            percentageArc_i: 50
          }
        ]
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
        data: [
          {
            description_s: 'LR2SEC7',
            percentageArc_i: 100
          }
        ]
      },
      {
        description_s: 'LR1SEC5',
        percentageArc_i: 50,
        data: [
          {
            description_s: 'LR2SEC8',
            percentageArc_i: 50
          },
          {
            description_s: 'LR2SEC9',
            percentageArc_i: 50
          }
        ]
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
        data: [
          {
            description_s: 'LR2SEC10',
            percentageArc_i: 50
          },
          {
            description_s: 'LR2SEC11',
            percentageArc_i: 50
          }
        ]
      },
      {
        description_s: 'LR1SEC7',
        percentageArc_i: 50,
        data: [
          {
            description_s: 'LR2SEC12',
            percentageArc_i: 50
          },
          {
            description_s: 'LR2SEC13',
            percentageArc_i: 50
          }
        ]
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
        data: [
          {
            description_s: 'LR2SEC14',
            percentageArc_i: 50
          },
          {
            description_s: 'LR2SEC15',
            percentageArc_i: 50
          }
        ]
      },
      {
        description_s: 'LR1SEC9',
        percentageArc_i: 50,
        data: [
          {
            description_s: 'LR2SEC16',
            percentageArc_i: 50
          },
          {
            description_s: 'LR2SEC17',
            percentageArc_i: 50
          }
        ]
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
        data: [
          {
            description_s: 'LR2SEC18',
            percentageArc_i: 50
          },
          {
            description_s: 'LR2SEC19',
            percentageArc_i: 50
          }
        ]
      },
      {
        description_s: 'LR1SEC11',
        percentageArc_i: 50,
        data: [
          {
            description_s: 'LR2SEC20',
            percentageArc_i: 50
          },
          {
            description_s: 'LR2SEC21',
            percentageArc_i: 50
          }
        ]
      }
    ]
  },
]
};

var newStackedWheel = new StackedWheel(document.getElementById("stackedWheelCanvas"),
  {
    type: 'stacked-wheel',
    data: {
        sections: data,
    },
    options: {
      layers: [
        {
          minimumWidth_i: 90,
          maximumWidth_i: 90,
          textColor_s: "white",
          textFont_s: '10pt Helvetica',
          blurColor_s: "black",
          printOption_s: "description",
          colorScheme_a_s: ["#ff5b8e", "#98307b", "#662169", "#008baf", "#00ae85", "#8bb229"]
        },
        {
          minimumWidth_i: 50,
          maximumWidth_i: 50,
          textColor_s: "white",
          textFont_s: '10pt Helvetica',
          blurColor_s: "black",
          printOption_s: "percent",
          colorScheme_a_s: ["#ff5b8e", "#98307b"]
        },
        {
          minimumWidth_i: 50,
          maximumWidth_i: 50,
          textColor_s: "white",
          textFont_s: '10pt Helvetica',
          blurColor_s: "black",
          printOption_s: "percent",
          colorScheme_a_s: ["#662169", "#008baf"]
        }
      ],
      initialRadius_i: 70,
      radiusPop_i: 0,
      animation_b: true,
      animationSpeed_i: 6,
      containerSize_a_i: [500, 500]
    }
  }
);

newStackedWheel.drawWheel();