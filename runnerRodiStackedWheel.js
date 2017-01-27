var dataStacked = {
  data: [
    {
      description_s: "Google",
      value_i: 435,
      percentageArc_i: 5,
    },
    {
      description_s: "Bing",
      value_i: 60,
      percentageArc_i: 5,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 5,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 5,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 5,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 5,
    },
    {
      description_s: "Google",
      value_i: 435,
      percentageArc_i: 5,
    },
    {
      description_s: "Bing",
      value_i: 60,
      percentageArc_i: 5,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 5,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 4,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 1,
    },
    {
      description_s: "Google",
      value_i: 435,
      percentageArc_i: 5,
    },
    {
      description_s: "Bing",
      value_i: 60,
      percentageArc_i: 5,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 5,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 5,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 5,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 5,
    },
    {
      description_s: "Google",
      value_i: 435,
      percentageArc_i: 5,
    },
    {
      description_s: "Bing",
      value_i: 60,
      percentageArc_i: 5,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 5,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 4,
    },
    {
      description_s: "Others",
      value_i: 5,
      percentageArc_i: 1,
    }
  ]
};



var newStackedWheel = new DynamicWheel(document.getElementById("dynamicWheelSingleLayerStacked"),
{
                             type: 'stacked-wheel',
                             innerDescriptions_s: ["Impressions"],
                             data: {
                                 sections: dataStacked,
                             },
                             options: {
                               layers: [
                                 {
                                   minimumWidth_i: 60,
                                   maximumWidth_i: 100,
                                   textColor_s: "white",
                                   textFont_s: '10pt MetropolisRegular',
                                   sectionShadowColor_s: "black",
                                   sectionShadowThickness_s: 10,
                                   textShadowThickness_s: 0,
                                   textShadowColor_s: "none", // none is prob redundant. if thickness is zero then thats good enough
                                   printOption_s: "percent", // description, percent, parent-percent, icon, none
                                   printLocationIfUnderPercent_s: "attached", // attached, centered, none. Right now the percentage is 5% hardcoded.
                                   colorSchemeType_s: 'custom', // custom, parent-color-range
                                   colorScheme_a_s: ["hsla(75, 99%, 30%, 1)", 
                                                      "hsla(218, 66%, 43%, 1)", 
                                                      "hsla(316, 83%, 47%, 1)",
                                                      "hsla(75, 99%, 30%, 1)", 
                                                      "hsla(218, 66%, 43%, 1)", 
                                                      "hsla(316, 83%, 47%, 1)",
                                                      "hsla(75, 99%, 30%, 1)", 
                                                      "hsla(218, 66%, 43%, 1)", 
                                                      "hsla(316, 83%, 47%, 1)",
                                                      "hsla(75, 99%, 30%, 1)", 
                                                      "hsla(218, 66%, 43%, 1)", 
                                                      "hsla(316, 83%, 47%, 1)",
                                                      "hsla(75, 99%, 30%, 1)", 
                                                      "hsla(218, 66%, 43%, 1)", 
                                                      "hsla(316, 83%, 47%, 1)",
                                                      "hsla(75, 99%, 30%, 1)", 
                                                      "hsla(218, 66%, 43%, 1)", 
                                                      "hsla(316, 83%, 47%, 1)",
                                                      "hsla(75, 99%, 30%, 1)", 
                                                      "hsla(218, 66%, 43%, 1)", 
                                                      "hsla(316, 83%, 47%, 1)",
                                                      "hsla(75, 99%, 30%, 1)", 
                                                      "hsla(218, 66%, 43%, 1)", 
                                                      "hsla(316, 83%, 47%, 1)"
                                                    ],
                                   lineAttachment_b: true, // needs to be true if we want to use printLocationIfUnderPercent_s
                                   lineAttachmentLength_i: 15,
                                   attachedPrintOptions_s: ['description', 'value'], // has to be at least empty array if we want to use printLocationIfUnderPercent_s
                                   lineAttachmentColor_s: 'black',
                                   attachmentTextColor_s: '#4F5868',
                                   attachmentTextFonts_s: ['12pt MetropolisRegular', '12pt MetropolisRegular'],
                                   lineAttachmentThickness_i: 1,
                                 }
                               ],
                               initialRadius_i: 100,
                               radiusPop_i: -1,
                               animation_b: true,
                               centeredCircle_b: true,
                               centeredCircleColor_s: 'white',
                               centeredCircleShadowThickness_s: 22,
                               centeredCircleShadowColor_s: '#000000',
                               innerText_b: true,
                               innerTextColor_s: "#4F5868",
                               innerTextFonts_a_s: ['15pt MetropolisRegular'],
                               innerTextShadowThickness_s: 0,
                               innerTextShadowColor_s: "grey",
                               animationSpeed_i: 10,
                               minAllowableArcLength_i: 0, // this only works for level 1 for now. We would have to move this into the level layer and add extra qualifications if we wanted to add this functionality for other layers.
                               containerSize_a_i: [800, 400]
                             }
                           }
);

newStackedWheel.drawWheel();
