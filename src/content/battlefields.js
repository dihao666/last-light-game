(function () {
  "use strict";

  const battlefields = [
    {
      id: "lantern-court",
      sigil: "城",
      chapter: "第一远征",
      name: "城灯庭",
      tag: "废墟自由猎行",
      description: "携带最后的火种穿行废墟，在不断涌来的黑潮中主动追猎。",
      accent: "#f2c84b",
      accentValue: 0xf2c84b,
      baseColor: 0x071012,
      groundColor: 0x0c181a,
      lineColor: 0x183034,
      lamp: { x: 0.5, y: 0.5 },
      player: { x: 0.38, y: 0.72 },
      bossName: "吞灯者",
      bossSubtitle: "终夜噬光",
      bossTexture: "boss",
      bossHealthScale: 1.3,
      finishMessage: "吞灯者倒下，黎明提前穿过了城墙。",
      firstActObjective: "自由猎行并蓄满火种",
      lampTexture: "lastLightBeacon",
    },
    {
      id: "mirror-harbor",
      sigil: "潮",
      chapter: "第二远征",
      name: "镜潮港",
      tag: "潮线危区",
      description: "携带潮光穿过上下港线，借退潮与弹缝主动清扫深水敌群。",
      accent: "#43d9d0",
      accentValue: 0x43d9d0,
      baseColor: 0x061419,
      groundColor: 0x092127,
      lineColor: 0x1b5960,
      lamp: { x: 0.68, y: 0.52 },
      player: { x: 0.3, y: 0.68 },
      bossName: "潮镜圣母",
      bossSubtitle: "深港回声",
      bossTexture: "mirrorBossArt",
      bossHealthScale: 1.5,
      finishMessage: "潮镜碎裂，第一束晨光落在退潮的港湾。",
      firstActObjective: "穿梭上下港并蓄满潮光",
      backgroundTexture: "mirrorHarborBackground",
      lampTexture: "lastLightBeacon",
      enemyTexture: "tideweaverArt",
      signatureEnemy: "tideweaver",
      spawnRate: 0.94,
    },
  ];

  window.LastLightContent = window.LastLightContent || {};
  window.LastLightContent.battlefields = battlefields;
})();
