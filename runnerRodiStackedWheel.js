var dataStacked = {
  data: [
    {
      description_s: "Google",
      iconUnicode_s: '\uf130',
      percentageArc_i: 83,
    },
    {
      description_s: "Bing",
      iconUnicode_s: '\uf108',
      percentageArc_i: 12,
    },
    {
      description_s: "Others",
      iconUnicode_s: '\uf16a',
      percentageArc_i: 5,
    },
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
                                   maximumWidth_i: 80,
                                   textColor_s: "white",
                                   textFont_s: '10pt MetropolisRegular',
                                   sectionShadowColor_s: "black",
                                   sectionShadowThickness_s: 10,
                                   textShadowThickness_s: 0,
                                   textShadowColor_s: "none", // none is prob redundant. if thickness is zero then thats good enough
                                   printOption_s: "percent", // description, percent, parent-percent, icon
                                   colorSchemeType_s: 'custom', // custom, parent-color-range
                                   colorScheme_a_s: ["hsla(75, 99%, 30%, 1)", "hsla(218, 66%, 43%, 1)", "hsla(316, 83%, 47%, 1)"],
                                   lineAttachment_b: true,
                                   lineAttachmentLength_i: 25,
                                   attachedPrintOptions_s: ['description', 'percentage'],
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
                               animationSpeed_i: 2,
                               containerSize_a_i: [400, 400]
                             }
                           }
);

newStackedWheel.drawWheel();
