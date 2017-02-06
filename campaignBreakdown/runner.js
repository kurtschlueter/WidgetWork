var dataDoubleLayer = {
  data: [
        {
        description_s: "microphone",
        iconUnicode_s: '\uf130',
        percentageArc_i: 4,
        data: [
          {
            description_s: 'LR1SEC0',
            iconUnicode_s: 'none',
            percentageArc_i: 30,
          },
          {
            description_s: 'LR1SEC1',
            iconUnicode_s: 'none',
            percentageArc_i: 30,
          },
          {
            description_s: 'LR1SEC1',
            iconUnicode_s: 'none',
            percentageArc_i: 40,
          }
        ]
      },
      {
        description_s: "desktop",
        iconUnicode_s: '\uf108',
        percentageArc_i: 18, //22
        data: [
          {
            description_s: 'LR1SEC2',
            iconUnicode_s: 'none',
            percentageArc_i: 50,
          },
          {
            description_s: 'LR1SEC3',
            iconUnicode_s: 'none',
            percentageArc_i: 30,
          },
          {
            description_s: 'LR1SEC3',
            iconUnicode_s: 'none',
            percentageArc_i: 20,
          }
        ]
      },
      {
        description_s: "video",
        iconUnicode_s: '\uf16a',
        percentageArc_i: 10, //32
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
        percentageArc_i: 4, //36
        data: [
          {
            description_s: 'LR1SEC6',
            iconUnicode_s: 'none',
            percentageArc_i: 40,
          },
          {
            description_s: 'LR1SEC7',
            iconUnicode_s: 'none',
            percentageArc_i: 30,
          },
          {
            description_s: 'LR1SEC7',
            iconUnicode_s: 'none',
            percentageArc_i: 30,
          }
        ]
      },
      {
        description_s: "tv",
        iconUnicode_s: '\uf26c',
        percentageArc_i: 18, //54
        data: [
          {
            description_s: 'LR1SEC1',
            iconUnicode_s: 'none',
            percentageArc_i: 100,
          }
        ]
      },
      {
        description_s: "microphone",
        iconUnicode_s: '\uf130',
        percentageArc_i: 4, //58
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
        percentageArc_i: 18, //76
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
        percentageArc_i: 10,
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
        description_s: "video",
        iconUnicode_s: '\uf16a',
        percentageArc_i: 10,
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
        description_s: "tv",
        iconUnicode_s: '\uf26c',
        percentageArc_i: 4,
        data: [
          {
            description_s: 'LR1SEC1',
            iconUnicode_s: 'none',
            percentageArc_i: 25,
          },
          {
            description_s: 'LR1SEC1',
            iconUnicode_s: 'none',
            percentageArc_i: 25,
          },
          {
            description_s: 'LR1SEC1',
            iconUnicode_s: 'none',
            percentageArc_i: 10,
          },
          {
            description_s: 'LR1SEC1',
            iconUnicode_s: 'none',
            percentageArc_i: 40,
          }        
        ]
      }
   ]
};

var optionsAndDataObject = {
    type: 'stacked-wheel',
    innerDescriptions_s: ["none"],
    data: {
       sections: dataDoubleLayer,
    },
    options: {
        layers: [
            {
                minimumWidth_i: 70,
                maximumWidth_i: 70,
                textColor_s: "white",
                textFont_s: '28pt icomoon',
                // textFont_s: '10pt Helvetica',
                sectionShadowColor_s: "black",
                sectionShadowThickness_s: 0,
                textShadowThickness_s: 0,
                textShadowColor_s: "none", // none is prob redundant. if thickness is zero then thats good enough
                printOption_s: "icon", // description, percent, parent-percent, icon
                printLocationIfUnderPercent_s: "none",
                colorSchemeType_s: 'custom', // custom, parent-color-range
                colorScheme_a_s: [
                                    "hsla(316, 83%, 47%, 1)", 
                                    "hsla(192, 100%, 34%, 1)", 
                                    "hsla(75, 99%, 30%, 1)", 
                                    "hsla(218, 66%, 43%, 1)", 
                                    "hsla(166, 100%, 34%, 1)",
                                    "hsla(316, 83%, 47%, 1)", 
                                    "hsla(192, 100%, 34%, 1)", 
                                    "hsla(75, 99%, 30%, 1)", 
                                    "hsla(218, 66%, 43%, 1)", 
                                    "hsla(166, 100%, 34%, 1)"
                                ],
                lineAttachment_b: false,
                lineAttachmentLength_i: 0,
                attachedPrintOptions_s: ['description'],
                lineAttachmentColor_s: 'black',
                attachmentTextColor_s: 'black',
                attachmentTextFonts_s: ['12pt MetropolisRegular'],
                lineAttachmentThickness_i: 0,
            },
            {
                minimumWidth_i: 70,
                maximumWidth_i: 70,
                textColor_s: "white",
                textFont_s: '16pt MetropolisRegular',
                sectionShadowColor_s: "black",
                sectionShadowThickness_s: 0,
                textShadowThickness_s: 0,
                textShadowColor_s: "none",
                printOption_s: "parent-percent",
                printLocationIfUnderPercent_s: "attached",
                colorSchemeType_s: "parent-color-range", // if parent-color-range, then color array below is irrelevent
                colorScheme_a_s: ["hsla(317, 52%, 39%, 1)", "hsla(298, 52%, 27%, 1)"],
                lineAttachment_b: true,
                lineAttachmentLength_i: 15,
                attachedPrintOptions_s: [],
                lineAttachmentColor_s: 'black',
                attachmentTextColor_s: 'black',
                attachmentTextFonts_s: ['12pt MetropolisRegular'],
                lineAttachmentThickness_i: 1,
            }
        ],
        initialRadius_i: 100,
        innerText_b: false,
        centeredCircle_b: false,
        centeredCircleColor_s: 'white',
        centeredCircleShadowThickness_s: 10,
        centeredCircleShadowColor_s: "grey",
        innerTextColor_s: "#4F5868k",
        innerTextFonts_a_s: ['10pt MetropolisRegular'],
        innerTextShadowThickness_s: 0,
        innerTextShadowColor_s: "none",
        radiusPop_i: 0,
        animation_b: false,
        animationSpeed_i: 6,
        containerSize_a_i: [800, 800]
    }
}

var newDoubleLayerWheel = new CampaignBreakDownWheel(document.getElementById("dynamicWheelDoubleLayer"), optionsAndDataObject);
newDoubleLayerWheel.drawWheel();




