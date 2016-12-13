// 2 layers
var data = {
  data: [
    {
      description_s: "Yassss",
      iconUnicode_s: '\uf130',
      percentageArc_i: 20,
    },
    {
      description_s: "Hello",
      iconUnicode_s: '\uf108',
      percentageArc_i: 80,
    }
  ]
};

var conversionsWheel = new DynamicWheel(document.getElementById("conversionsWheelCanvas"),
  {
    type: 'stacked-wheel',
    innerDescriptions_s: ["Yes", "how", 'who', 'jes'],
    data: {
        sections: data,
    },
    options: {
      layers: [
        {
          minimumWidth_i: 21,
          maximumWidth_i: 21,
          textColor_s: "white",
          textFont_s: '22pt Helvetica',
          sectionShadowColor_s: "blue",
          sectionShadowThickness_s: 0,
          textShadowThickness_s: 0,
          textShadowColor_s: "none", // none is prob redundant. if thickness is zero then thats good enough
          printOption_s: "none", // description, percent, parent-percent, icon, none
          colorSchemeType_s: 'custom', // custom, parent-color-range
          colorScheme_a_s: ["hsla(77, 63%, 43%, 1)", "hsla(218, 66%, 43%, 1)"],
          lineAttachment_b: true,
          lineAttachmentLength_i: 20,
          attachedPrintOptions_s: ['description', 'percentage'],
          lineAttachmentColor_s: 'black',
          attachmentTextColor_s: 'black',
          attachmentTextFonts_s: ['14pt Helvetica', '12pt Helvetica'],
          lineAttachmentThickness_i: 1,
        }
      ],
      initialRadius_i: 150,
      innerText_b: true,
      centeredCircle_b: false,
      centeredCircleColor_s: 'white',
      centeredCircleShadowThickness_s: 10,
      centeredCircleShadowColor_s: "grey",
      innerTextColor_s: "black",
      innerTextFonts_a_s: ['24pt Helvetica', '10pt Helvetica', '10pt Helvetica', '10pt Helvetica'],
      innerTextShadowThickness_s: 0,
      innerTextShadowColor_s: "none",
      radiusPop_i: 0,
      animation_b: true,
      animationSpeed_i: 6,
      containerSize_a_i: [450, 450]
    }
  }
);

conversionsWheel.drawWheel();