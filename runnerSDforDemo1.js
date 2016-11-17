// 2 layers
var data = {
  data: [
  {
    description_s: "microphone",
    iconUnicode_s: '\uf130',
    percentageArc_i: 20,
    data: [
      {
        description_s: 'LR1SEC0',
        iconUnicode_s: 'none',
        percentageArc_i: 30,

      },
      {
        description_s: 'LR1SEC1',
        iconUnicode_s: 'none',
        percentageArc_i: 70,

      }
    ]
  },
  {
    description_s: "desktop",
    iconUnicode_s: '\uf108',
    percentageArc_i: 20,
    data: [
      {
        description_s: 'LR1SEC2',
        iconUnicode_s: 'none',
        percentageArc_i: 40,

      },
      {
        description_s: 'LR1SEC3',
        iconUnicode_s: 'none',
        percentageArc_i: 60,

      }
    ]
  },
  {
    description_s: "video",
    iconUnicode_s: '\uf16a',
    percentageArc_i: 20,
    data: [
      {
        description_s: 'LR1SEC4',
        iconUnicode_s: 'none',
        percentageArc_i: 20,

      },
      {
        description_s: 'LR1SEC5',
        iconUnicode_s: 'none',
        percentageArc_i: 30,

      },
      {
        description_s: 'LR1SEC5',
        iconUnicode_s: 'none',
        percentageArc_i: 50,

      }
    ]
  },
  {
    description_s: "list",
    iconUnicode_s: '\uf022',
    percentageArc_i: 20,
    data: [
      {
        description_s: 'LR1SEC6',
        iconUnicode_s: 'none',
        percentageArc_i: 50,

      },
      {
        description_s: 'LR1SEC7',
        iconUnicode_s: 'none',
        percentageArc_i: 50,

      }
    ]
  },
  {
    description_s: "tv",
    iconUnicode_s: '\uf26c',
    percentageArc_i: 20,
    data: [
      {
        description_s: 'LR1SEC1',
        iconUnicode_s: 'none',
        percentageArc_i: 100,

      }
    ]
  }
]
};

var newStackedWheel = new DynamicWheel(document.getElementById("stackedWheelCanvas"),
  {
    type: 'stacked-wheel',
    innerDescription_s: "none",
    data: {
        sections: data,
    },
    options: {
      layers: [
        {
          minimumWidth_i: 75,
          maximumWidth_i: 75,
          textColor_s: "white",
          textFont_s: '22pt FontAwesome',
          // textFont_s: '10pt Helvetica',
          sectionShadowColor_s: "grey",
          sectionShadowThickness_s: .5,
          textShadowThickness_s: 0,
          textShadowColor_s: "none", // none is prob redundant. if thickness is zero then thats good enough
          printOption_s: "icon", // description, percent, parent-percent, icon
          colorSchemeType_s: 'custom', // custom, parent-color-range
          colorScheme_a_s: ["hsla(321, 70%, 56%, 1)", "hsla(192, 100%, 34%, 1)", "hsla(218, 66%, 43%, 1)", "hsla(166, 100%, 34%, 1)", "hsla(77, 63%, 43%, 1)"]
        },
        {
          minimumWidth_i: 60,
          maximumWidth_i: 60,
          textColor_s: "white",
          textFont_s: '10pt Helvetica',
          sectionShadowColor_s: "grey",
          sectionShadowThickness_s: .5,
          textShadowThickness_s: 0,
          textShadowColor_s: "none",
          printOption_s: "parent-percent",
          colorSchemeType_s: "parent-color-range", // if parent-color-range, then color array below is irrelevent
          colorScheme_a_s: ["hsla(317, 52%, 39%, 1)", "hsla(298, 52%, 27%, 1)"]
        }
      ],
      initialRadius_i: 85,
      innerText_b: false,
      centeredCircle_b: false,
      centeredCircleColor_s: 'white',
      centeredCircleShadowThickness_s: 10,
      centeredCircleShadowColor_s: "grey",
      innerTextColor_s: "black",
      innerTextFont_s: '10pt Helvetica',
      innerTextShadowThickness_s: 0,
      innerTextShadowColor_s: "none",
      radiusPop_i: -1,
      animation_b: true,
      animationSpeed_i: 6,
      containerSize_a_i: [400, 400]
    }
  }
);

newStackedWheel.drawWheel();