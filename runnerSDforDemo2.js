var data = {
  data: [
    {
      description_s: "microphone",
      iconUnicode_s: '\uf130',
      percentageArc_i: 30,
    },
    {
      description_s: "desktop",
      iconUnicode_s: '\uf108',
      percentageArc_i: 53,
    },
    {
      description_s: "video",
      iconUnicode_s: '\uf16a',
      percentageArc_i: 17,
    },
  ]
};

var newStackedWheel = new DynamicWheel(document.getElementById("stackedWheelCanvas2"),
  {
    type: 'stacked-wheel',
    innerDescription_s: "Impressions",
    data: {
        sections: data,
    },
    options: {
      layers: [
        {
          minimumWidth_i: 60,
          maximumWidth_i: 80,
          textColor_s: "white",
          textFont_s: '10pt Helvetica',
          sectionShadowColor_s: "black",
          sectionShadowThickness_s: 10,
          textShadowThickness_s: 0,
          textShadowColor_s: "none", // none is prob redundant. if thickness is zero then thats good enough
          printOption_s: "percent", // description, percent, parent-percent, icon
          colorSchemeType_s: 'custom', // custom, parent-color-range
          colorScheme_a_s: ["hsla(77, 63%, 43%, 1)", "hsla(192, 100%, 34%, 1)", "hsla(317, 52%, 39%, 1)"]
        }
      ],
      initialRadius_i: 100,
      radiusPop_i: -1,
      animation_b: true,
      centeredCircle_b: true,
      centeredCircleColor_s: 'white',
      centeredCircleShadowThickness_s: 50,
      centeredCircleShadowColor_s: "black",
      innerText_b: true,
      innerTextColor_s: "grey",
      innerTextFont_s: '15pt Helvetica',
      innerTextShadowThickness_s: 0,
      innerTextShadowColor_s: "grey",
      animationSpeed_i: 2,
      containerSize_a_i: [375, 375]
    }
  }
);

newStackedWheel.drawWheel();