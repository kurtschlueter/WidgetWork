// Three layers.
var dataTripleLayer = {
  data: [
  {
    description_s: "LR0SEC1",
    percentageArc_i: 30,
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
    percentageArc_i: 15,
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
    percentageArc_i: 15,
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
    percentageArc_i: 25,
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

var newTripleLayerWheel = new DynamicWheel(document.getElementById("dynamicWheelTripleLayer"),
  {
    type: 'this property does not matter',
    innerDescription_s: "none",
    data: {
        sections: dataTripleLayer,
    },
    options: {

      layers: [
        {
          minimumWidth_i: 60,
          maximumWidth_i: 60,
          textColor_s: "white",
          textFont_s: '8pt FontAwesome',
          // textFont_s: '10pt Helvetica',
          sectionShadowColor_s: "grey",
          sectionShadowThickness_s: 1,
          textShadowThickness_s: 0,
          textShadowColor_s: "none", // none is prob redundant. if thickness is zero then thats good enough
          printOption_s: "description", // description, percent, parent-percent, icon
          colorSchemeType_s: 'custom', // custom, parent-color-range
          colorScheme_a_s: ["hsla(321, 70%, 56%, 1)", "hsla(192, 100%, 34%, 1)", "hsla(218, 66%, 43%, 1)", "hsla(166, 100%, 34%, 1)", "hsla(77, 63%, 43%, 1)"],
          lineAttachment_b: false,
          lineAttachmentLength_i: 0,
          atttachedPrintOption_s: 'description',
          lineAttachmentColor_s: 'black',
          attachmentTextColor_s: '#4F5868',
          attachmentTextFont_s: '12pt MetropolisRegular',
          lineAttachmentThickness_i: 0,
        },
        {
          minimumWidth_i: 50,
          maximumWidth_i: 50,
          textColor_s: "white",
          textFont_s: '10pt FontAwesome',
          // textFont_s: '10pt Helvetica',
          sectionShadowColor_s: "grey",
          sectionShadowThickness_s: 1,
          textShadowThickness_s: 0,
          textShadowColor_s: "none", // none is prob redundant. if thickness is zero then thats good enough
          printOption_s: "percent", // description, percent, parent-percent, icon
          colorSchemeType_s: 'parent-color-range', // custom, parent-color-range
          colorScheme_a_s: ["hsla(321, 70%, 56%, 1)", "hsla(192, 100%, 34%, 1)", "hsla(218, 66%, 43%, 1)", "hsla(166, 100%, 34%, 1)", "hsla(77, 63%, 43%, 1)"],
          lineAttachment_b: false,
          lineAttachmentLength_i: 0,
          atttachedPrintOption_s: 'description',
          lineAttachmentColor_s: 'black',
          attachmentTextColor_s: '#4F5868',
          attachmentTextFont_s: '12pt MetropolisRegular',
          lineAttachmentThickness_i: 0,
        },
        {
          minimumWidth_i: 50,
          maximumWidth_i: 50,
          textColor_s: "white",
          textFont_s: '10pt FontAwesome',
          // textFont_s: '10pt Helvetica',
          sectionShadowColor_s: "grey",
          sectionShadowThickness_s: 1,
          textShadowThickness_s: 0,
          textShadowColor_s: "none", // none is prob redundant. if thickness is zero then thats good enough
          printOption_s: "percent", // description, percent, parent-percent, icon
          colorSchemeType_s: 'parent-color-range', // custom, parent-color-range
          colorScheme_a_s: ["hsla(321, 70%, 56%, 1)", "hsla(192, 100%, 34%, 1)", "hsla(218, 66%, 43%, 1)", "hsla(166, 100%, 34%, 1)", "hsla(77, 63%, 43%, 1)"],
          lineAttachment_b: false,
          lineAttachmentLength_i: 0,
          atttachedPrintOption_s: 'description',
          lineAttachmentColor_s: 'black',
          attachmentTextColor_s: '#4F5868',
          attachmentTextFont_s: '12pt MetropolisRegular',
          lineAttachmentThickness_i: 0,
        }
      ],
      initialRadius_i: 50,
      innerText_b: false,
      centeredCircle_b: false,
      centeredCircleColor_s: 'white',
      centeredCircleShadowThickness_s: 10,
      centeredCircleShadowColor_s: "red",
      innerTextColor_s: "black",
      innerTextFont_s: '10pt Helvetica',
      innerTextShadowThickness_s: 0,
      innerTextShadowColor_s: "none",
      radiusPop_i: 0,
      animation_b: true,
      animationSpeed_i: 6,
      containerSize_a_i: [390, 390]
    }
  }
);

newTripleLayerWheel.drawWheel();