(function () {
  "use strict";

  const URL_PARAMS = new URLSearchParams(window.location.search);
  const QA_MODE = URL_PARAMS.get("qa") === "1";
  const QUICK_TIMING = QA_MODE && URL_PARAMS.get("qaTiming") === "quick";
  const PRECISION_PROTOTYPE_ID = "mirror-harbor-precision-90s";
  const PRECISION_PROTOTYPE_MODE = URL_PARAMS.get("prototype") === PRECISION_PROTOTYPE_ID;
  const PRECISION_PROTOTYPE_RETRY_HASH = "#precision-prototype-retry";
  const PRECISION_PROTOTYPE_AUTO_RESTART = PRECISION_PROTOTYPE_MODE
    && window.location.hash === PRECISION_PROTOTYPE_RETRY_HASH;
  const PRECISION_TRACKER_AUTO_GRANTS = Object.freeze([
    Object.freeze({ id: "lanternMark", at: 800 }),
    Object.freeze({ id: "volley", at: 2400 }),
    Object.freeze({ id: "focus", at: 6200 }),
  ]);
  const PRECISION_HORDE_BATCHES = Object.freeze([
    Object.freeze({ at: 11600, edge: "left", count: 12 }),
    Object.freeze({ at: 12800, edge: "right", count: 12 }),
    Object.freeze({ at: 14000, edge: "top", count: 12 }),
    Object.freeze({ at: 15200, edge: "bottom", count: 12 }),
    Object.freeze({ at: 16400, edge: "left", count: 12 }),
    Object.freeze({ at: 17600, edge: "right", count: 12 }),
  ]);
  if (PRECISION_PROTOTYPE_AUTO_RESTART) {
    const cleanRetryUrl = new URL(window.location.href);
    cleanRetryUrl.hash = "";
    window.history.replaceState(null, "", cleanRetryUrl.href);
  }
  function buildPrecisionPrototypeRestartUrl(href) {
    const restartUrl = new URL(href);
    Array.from(restartUrl.searchParams.keys()).forEach((key) => {
      if (key.toLowerCase().startsWith("qa")) restartUrl.searchParams.delete(key);
    });
    restartUrl.hash = PRECISION_PROTOTYPE_RETRY_HASH;
    return restartUrl.href;
  }
  const QA_STARTING_CURRENCY = QA_MODE
    ? Math.max(0, Math.min(5000, Number.parseInt(URL_PARAMS.get("qaCurrency") || "0", 10) || 0))
    : 0;
  const QA_RELIC_OFFER = QA_MODE ? URL_PARAMS.get("qaRelicOffer") || "" : "";
  const QUICK_RUN_PROFILE = Object.freeze({
    id: "quick",
    durationLabel: "一局约 100 秒",
    runDuration: 100,
    bossTime: 82,
    bossPreludeDuration: 6,
    routeStageTwoTime: 24,
    routeStageThreeTime: 50,
    finalShopTime: 70,
    cleanupWindows: [
      { start: 21, end: 24, act: 1 },
      { start: 47, end: 50, act: 2 },
      { start: 67, end: 70, act: 3 },
    ],
    patrolSchedule: [
      { time: 32, type: "beacon" },
      { time: 58, type: "rift" },
    ],
    scriptedThreats: {
      opening: 18,
      blink: 28,
      route: 36,
      frost: 42,
      bomber: 54,
      echo: 34,
      void: 61,
      prism: 65,
      signature: 68,
    },
    spawnPhases: [
      { until: 6, interval: 1080, cap: 5 },
      { until: 12, interval: 1180, cap: 7 },
      { until: 18, interval: 1080, cap: 8 },
      { until: 24, interval: 990, cap: 10 },
      { until: 40, interval: 950, cap: 12 },
      { until: 50, interval: 810, cap: 15 },
      { until: 66, interval: 850, cap: 17 },
      { until: 78, interval: 760, cap: 22 },
    ],
    doubleSpawnAt: 40,
    tideweaverAt: 18,
    enemyTimings: {},
    bossHealthMultiplier: 1,
    cityBossHealthMultiplier: 1.12,
    mirrorBossHealthMultiplier: 1,
    mirrorSweepDelays: [6600, 6600, 6600],
  });
  const STANDARD_RUN_PROFILE = Object.freeze({
    id: "standard",
    durationLabel: "一局约 8 分钟",
    runDuration: 480,
    bossTime: 420,
    bossPreludeDuration: 6,
    routeStageTwoTime: 120,
    routeStageThreeTime: 240,
    finalShopTime: 390,
    cleanupWindows: [
      { start: 110, end: 120, act: 1 },
      { start: 230, end: 240, act: 2 },
      { start: 380, end: 390, act: 3 },
    ],
    patrolSchedule: [
      { time: 170, type: "beacon" },
      { time: 315, type: "rift" },
    ],
    scriptedThreats: {
      opening: 25,
      blink: 70,
      echo: 105,
      route: 150,
      frost: 185,
      bomber: 225,
      void: 285,
      prism: 330,
      signature: 365,
    },
    spawnPhases: [
      { until: 30, interval: 1180, cap: 6 },
      { until: 60, interval: 1080, cap: 8 },
      { until: 90, interval: 1000, cap: 9 },
      { until: 120, interval: 940, cap: 11 },
      { until: 180, interval: 850, cap: 14 },
      { until: 240, interval: 800, cap: 16 },
      { until: 315, interval: 760, cap: 18 },
      { until: 390, interval: 700, cap: 20 },
      { until: 420, interval: 620, cap: 23 },
    ],
    doubleSpawnAt: 240,
    tideweaverAt: 75,
    enemyTimings: {
      blinkHunter: { unlockAt: 60, randomAt: 75 },
      echoDuelist: { unlockAt: 95, randomAt: 110 },
      frostOracle: { unlockAt: 170, randomAt: 195 },
      emberBomber: { unlockAt: 215, randomAt: 240 },
      voidScribe: { unlockAt: 280, randomAt: 300 },
      prismSentry: { unlockAt: 325, randomAt: 345 },
    },
    bossHealthMultiplier: 4.5,
    cityBossHealthMultiplier: 5.8,
    mirrorBossHealthMultiplier: 4.5,
    mirrorSweepDelays: [12000, 9500, 7000],
  });
  const PRECISION_PROTOTYPE_RUN_PROFILE = Object.freeze({
    id: PRECISION_PROTOTYPE_ID,
    precisionPrototype: true,
    durationLabel: "90 秒精准读弹原型",
    runDuration: 90,
    bossTime: 58,
    bossPreludeDuration: 4,
    routeStageTwoTime: Number.POSITIVE_INFINITY,
    routeStageThreeTime: Number.POSITIVE_INFINITY,
    finalShopTime: Number.POSITIVE_INFINITY,
    cleanupWindows: [],
    patrolSchedule: [],
    scriptedThreats: {
      opening: 18,
      blink: 30,
      route: Number.POSITIVE_INFINITY,
      frost: Number.POSITIVE_INFINITY,
      bomber: Number.POSITIVE_INFINITY,
      echo: Number.POSITIVE_INFINITY,
      void: Number.POSITIVE_INFINITY,
      prism: Number.POSITIVE_INFINITY,
      signature: Number.POSITIVE_INFINITY,
    },
    spawnPhases: [
      { until: 18, interval: 1180, cap: 6 },
      { until: 35, interval: 1040, cap: 8 },
      { until: 58, interval: 920, cap: 10 },
    ],
    doubleSpawnAt: 35,
    tideweaverAt: 18,
    enemyTimings: {},
    bossHealthMultiplier: 3.2,
    cityBossHealthMultiplier: 3.2,
    mirrorBossHealthMultiplier: 3.2,
    mirrorSweepDelays: [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
    prototypeTideWarningAt: 9000,
    prototypeTideWarningDuration: 1600,
    prototypeBossGapWarningDuration: 1600,
    prototypeBossPostGapDelay: 60000,
  });
  const RUN_PROFILE = PRECISION_PROTOTYPE_MODE
    ? PRECISION_PROTOTYPE_RUN_PROFILE
    : QUICK_TIMING ? QUICK_RUN_PROFILE : STANDARD_RUN_PROFILE;
  const RUN_DURATION = RUN_PROFILE.runDuration;
  const BOSS_TIME = RUN_PROFILE.bossTime;
  const BOSS_PRELUDE_DURATION = RUN_PROFILE.bossPreludeDuration;
  const ROUTE_STAGE_TWO_TIME = RUN_PROFILE.routeStageTwoTime;
  const ROUTE_STAGE_THREE_TIME = RUN_PROFILE.routeStageThreeTime;
  const FINAL_SHOP_TIME = RUN_PROFILE.finalShopTime;
  const PATROL_EVENT_SCHEDULE = RUN_PROFILE.patrolSchedule;
  const RUN_END_LABEL = `${String(Math.floor(RUN_DURATION / 60)).padStart(2, "0")}:${String(RUN_DURATION % 60).padStart(2, "0")}`;
  const DASH_COOLDOWN = 3400;
  const DASH_DURATION = 180;
  const DASH_INVULNERABILITY = 280;
  const MELEE_PROJECTILE_CUT_CHANCE = 0.6;
  const SWORD_WAVE_PROJECTILE_CUT_CHANCE = 0.6;
  const SECONDARY_DAMAGE_BONUS_INHERITANCE = 0.35;
  const SECONDARY_INHERITED_DAMAGE_CAP_RATIO = 0.5;
  const SECONDARY_FIRE_RATE_BONUS_INHERITANCE = 0.4;
  const SECONDARY_CRITICAL_MULTIPLIER = 1.8;
  const SECONDARY_SURGE_MULTIPLIER = 1.25;
  const SECONDARY_MIN_INTERVAL = 900;
  const REACH_RANGE_PER_LEVEL = 70;
  const REACH_PROJECTILE_SIZE_PER_LEVEL = 0.4;
  const REACH_DAMAGE_PER_LEVEL = 3;
  const EMBER_SURGE_COOLDOWN = 20000;
  const EMBER_SURGE_DURATION = 4000;
  const STANDARD_MIRROR_PRESSURE_START = 18;
  const STANDARD_MIRROR_PRESSURE_CADENCE = 2200;
  const STANDARD_MIRROR_PRESSURE_CAP = 20;
  const STANDARD_MIRROR_PRESSURE_PACK = 8;
  const STANDARD_MIRROR_PRESSURE_SPEED_SCALE = 0.68;
  const STANDARD_MIRROR_FODDER_SPEED_SCALE = 0.85;
  const STANDARD_MIRROR_FODDER_HEALTH_CAP = 24;
  const STANDARD_MIRROR_FODDER_DAMAGE_CAP = 2;
  const STANDARD_MIRROR_FODDER_REWARD_KILLS = 3;
  const STANDARD_MIRROR_PRESSURE_MID_START = 120;
  const STANDARD_MIRROR_PRESSURE_MID_CAP = 32;
  const STANDARD_MIRROR_PRESSURE_MID_PACK = 8;
  const STANDARD_MIRROR_PRESSURE_MID_CADENCE = 1200;
  const STANDARD_MIRROR_PRESSURE_LATE_START = 240;
  const STANDARD_MIRROR_PRESSURE_LATE_CAP = 30;
  const STANDARD_MIRROR_PRESSURE_LATE_PACK = 9;
  const STANDARD_MIRROR_PRESSURE_LATE_CADENCE = 900;
  const STANDARD_MIRROR_BOSS_PRESSURE_CAP = 48;
  const STANDARD_MIRROR_BOSS_PRESSURE_PACK = 10;
  const STANDARD_MIRROR_BOSS_PRESSURE_CADENCE = 900;
  const STANDARD_MIRROR_BOSS_PRESSURE_PHASE2_CAP = 52;
  const STANDARD_MIRROR_BOSS_PRESSURE_PHASE2_PACK = 11;
  const STANDARD_MIRROR_BOSS_PRESSURE_PHASE2_CADENCE = 850;
  const STANDARD_MIRROR_BOSS_PRESSURE_PHASE3_CAP = 55;
  const STANDARD_MIRROR_BOSS_PRESSURE_PHASE3_PACK = 11;
  const STANDARD_MIRROR_BOSS_PRESSURE_PHASE3_CADENCE = 800;
  const STANDARD_MIRROR_BRUISER_START = 180;
  const STANDARD_MIRROR_BRUISER_MID_CAP = 14;
  const STANDARD_MIRROR_BRUISER_MID_PACK = 7;
  const STANDARD_MIRROR_BRUISER_MID_CADENCE = 2400;
  const STANDARD_MIRROR_BRUISER_CAP = 44;
  const STANDARD_MIRROR_BRUISER_PACK = 16;
  const STANDARD_MIRROR_BRUISER_CADENCE = 1550;
  const STANDARD_MIRROR_BRUISER_HEALTH_SCALE = 1.1;
  const STANDARD_MIRROR_BRUISER_DAMAGE_SCALE = 0.7;
  const STANDARD_MIRROR_BRUISER_REWARD_KILLS = 3;
  const STANDARD_MIRROR_BRUISER_COMPOSITION = Object.freeze(["brute", "splitter", "brute"]);
  const STANDARD_MIRROR_BOSS_BRUISER_COUNTS = Object.freeze([4, 5, 6]);
  const STANDARD_MIRROR_BOSS_BRUISER_CAPS = Object.freeze([18, 23, 28]);
  const STANDARD_CITY_SIEGE_START = 30;
  const STANDARD_CITY_SIEGE_CAPS = Object.freeze([12, 24, 36]);
  const STANDARD_CITY_SIEGE_PACKS = Object.freeze([6, 8, 10]);
  const STANDARD_CITY_SIEGE_CADENCES = Object.freeze([2600, 1900, 1400]);
  const STANDARD_CITY_SIEGE_COMPOSITIONS = Object.freeze([
    Object.freeze(["gloamling", "shade", "brute", "gloamling", "wraith", "charger"]),
    Object.freeze(["brute", "splitter", "bulwark", "gloamling", "wraith", "brute", "charger", "hexer"]),
    Object.freeze(["brute", "splitter", "bulwark", "brute", "wraith", "splitter", "charger", "brute", "brute", "bulwark"]),
  ]);
  const STANDARD_CITY_LATE_RANGED_WEIGHT_SCALE = 0.55;
  const STANDARD_CITY_LATE_RANGED_KINDS = Object.freeze([
    "hexer", "cantor", "frostOracle", "emberBomber", "echoDuelist", "voidScribe", "prismSentry",
  ]);
  const STANDARD_CITY_BOSS_SIEGE_CAPS = Object.freeze([18, 24, 30]);
  const STANDARD_CITY_BOSS_SIEGE_PACKS = Object.freeze([6, 8, 10]);
  const STANDARD_CITY_BOSS_SIEGE_CADENCES = Object.freeze([3000, 2400, 1900]);
  const STANDARD_CITY_SIEGE_REWARD_KILLS = 3;
  const UPGRADE_MIN_INTERVAL = 9000;
  const START_HOUR = 3;
  const END_HOUR = 6;

  function formatRunTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  const COLORS = {
    night: 0x071012,
    ground: 0x0c181a,
    groundLine: 0x183034,
    paper: 0xf3f0e6,
    gold: 0xf2c84b,
    goldHot: 0xff9f43,
    cyan: 0x5ad3c8,
    red: 0xef5a4f,
    violet: 0xa984d6,
    green: 0x64c27b,
    ice: 0x82dff2,
    armor: 0x69d5c8,
  };
  const ENEMY_PROJECTILE_ALERT_COLOR = 0xff3355;

  const battlefieldCatalog = window.LastLightContent?.battlefields || [];

  const ui = {
    gameShell: document.getElementById("game-shell"),
    hud: document.getElementById("hud"),
    startScreen: document.getElementById("start-screen"),
    startButton: document.getElementById("start-button"),
    startEyebrow: document.getElementById("start-eyebrow"),
    startDescription: document.getElementById("start-description"),
    battlefieldOptions: document.getElementById("battlefield-options"),
    selectedBattlefieldName: document.getElementById("selected-battlefield-name"),
    weaponOptions: document.getElementById("weapon-options"),
    selectedWeaponName: document.getElementById("selected-weapon-name"),
    archiveTotal: document.getElementById("archive-total"),
    weaponState: document.getElementById("weapon-state"),
    soundButton: document.getElementById("sound-button"),
    pauseButton: document.getElementById("pause-button"),
    pauseScreen: document.getElementById("pause-screen"),
    resumeButton: document.getElementById("resume-button"),
    restartFromPause: document.getElementById("restart-from-pause"),
    pauseLoadoutButton: document.getElementById("pause-loadout-button"),
    upgradeScreen: document.getElementById("upgrade-screen"),
    upgradeOptions: document.getElementById("upgrade-options"),
    upgradeRefreshButton: document.getElementById("upgrade-refresh-button"),
    routeScreen: document.getElementById("route-screen"),
    routeKicker: document.getElementById("route-kicker"),
    routeTitle: document.getElementById("route-title"),
    routePrompt: document.getElementById("route-prompt"),
    routeOrigin: document.getElementById("route-origin"),
    routeStageName: document.getElementById("route-stage-name"),
    routeOptions: document.getElementById("route-options"),
    secondaryScreen: document.getElementById("secondary-screen"),
    secondaryOptions: document.getElementById("secondary-options"),
    shopScreen: document.getElementById("shop-screen"),
    shopKicker: document.getElementById("shop-kicker"),
    shopTitle: document.getElementById("shop-title"),
    shopPrompt: document.getElementById("shop-prompt"),
    shopCurrency: document.getElementById("shop-currency"),
    shopSlots: document.getElementById("shop-slots"),
    shopRelicSummary: document.getElementById("shop-relic-summary"),
    shopRelicSlots: document.getElementById("shop-relic-slots"),
    shopOptions: document.getElementById("shop-options"),
    shopNotice: document.getElementById("shop-notice"),
    shopRefreshButton: document.getElementById("shop-refresh-button"),
    shopContinueButton: document.getElementById("shop-continue-button"),
    endScreen: document.getElementById("end-screen"),
    endPanel: document.querySelector(".end-panel"),
    endEyebrow: document.getElementById("end-eyebrow"),
    endTitle: document.getElementById("end-title"),
    endMessage: document.getElementById("end-message"),
    endKills: document.getElementById("end-kills"),
    endLevel: document.getElementById("end-level"),
    endLamp: document.getElementById("end-lamp"),
    endPatrol: document.getElementById("end-patrol"),
    endSeals: document.getElementById("end-seals"),
    endArchiveSummary: document.getElementById("end-archive-summary"),
    endRoute: document.getElementById("end-route"),
    restartButton: document.getElementById("restart-button"),
    loadoutButton: document.getElementById("loadout-button"),
    waveLabel: document.getElementById("wave-label"),
    clockValue: document.getElementById("clock-value"),
    dawnFill: document.getElementById("dawn-fill"),
    killCount: document.getElementById("kill-count"),
    currencyCount: document.getElementById("currency-count"),
    lampStatus: document.querySelector(".lamp-status"),
    lampHealthText: document.getElementById("lamp-health-text"),
    lampHealthFill: document.getElementById("lamp-health-fill"),
    playerHealthText: document.getElementById("player-health-text"),
    playerHealthFill: document.getElementById("player-health-fill"),
    playerLevel: document.getElementById("player-level"),
    xpText: document.getElementById("xp-text"),
    xpFill: document.getElementById("xp-fill"),
    buildList: document.getElementById("build-list"),
    synergyList: document.getElementById("synergy-list"),
    bossStatus: document.getElementById("boss-status"),
    bossName: document.getElementById("boss-name"),
    bossPhase: document.getElementById("boss-phase"),
    bossHealthText: document.getElementById("boss-health-text"),
    bossHealthFill: document.getElementById("boss-health-fill"),
    objectiveText: document.getElementById("objective-text"),
    threatAlert: document.getElementById("threat-alert"),
    threatText: document.getElementById("threat-text"),
    patrolStatus: document.getElementById("patrol-status"),
    patrolKind: document.getElementById("patrol-kind"),
    patrolTitle: document.getElementById("patrol-title"),
    patrolTimer: document.getElementById("patrol-timer"),
    patrolDetail: document.getElementById("patrol-detail"),
    patrolMark: document.querySelector(".patrol-status__mark"),
    patrolTrack: document.getElementById("patrol-track"),
    patrolFill: document.getElementById("patrol-fill"),
    damageVignette: document.getElementById("damage-vignette"),
    dashButton: document.getElementById("dash-button"),
    dashCooldown: document.getElementById("dash-cooldown"),
    joystick: document.getElementById("joystick"),
    joystickKnob: document.getElementById("joystick-knob"),
  };

  const END_STAT_VALUES = [ui.endKills, ui.endLevel, ui.endLamp, ui.endPatrol];
  const END_STAT_LABELS = END_STAT_VALUES.map((value) => (
    value?.closest(".end-stat")?.querySelector("span") || value?.previousElementSibling || null
  ));
  const endArchiveContainerCandidate = ui.endSeals?.parentElement;
  const END_ARCHIVE_CONTAINER = endArchiveContainerCandidate
    && endArchiveContainerCandidate !== ui.endPanel
    && endArchiveContainerCandidate.contains(ui.endArchiveSummary)
    ? endArchiveContainerCandidate
    : null;
  const END_DOM_DEFAULTS = {
    eyebrow: ui.endEyebrow.textContent,
    title: ui.endTitle.textContent,
    message: ui.endMessage.textContent,
    values: END_STAT_VALUES.map((value) => value?.textContent || ""),
    labels: END_STAT_LABELS.map((label) => label?.textContent || ""),
    route: ui.endRoute.textContent,
    restartText: ui.restartButton.textContent,
    loadoutText: ui.loadoutButton.textContent,
    restartHidden: ui.restartButton.hidden,
    loadoutHidden: ui.loadoutButton.hidden,
    sealsHidden: ui.endSeals.hidden,
    archiveSummaryHidden: ui.endArchiveSummary.hidden,
    archiveContainerHidden: END_ARCHIVE_CONTAINER?.hidden ?? false,
    resultMode: ui.endPanel.dataset.resultMode || null,
  };

  function buildPrecisionPrototypeResult(tidePerfect, bossGapPerfect) {
    const tide = Boolean(tidePerfect);
    const bossGap = Boolean(bossGapPerfect);
    const count = Number(tide) + Number(bossGap);
    const grade = count === 2 ? "S" : count === 1 ? "B" : "C";
    const message = count === 2
      ? "潮线与安全缺口都已读对。"
      : tide
        ? "潮线换道已掌握；Boss 青色缺口再看一轮。"
        : bossGap
          ? "Boss 缺口已看懂；潮线换道再练一次。"
          : "先离开珊瑚警戒带，再沿青色缺口移动。";
    return {
      count,
      grade,
      message,
      tide: tide ? "成功" : "受击",
      bossGap: bossGap ? "成功" : "受击",
    };
  }

  const touchVector = { x: 0, y: 0 };
  const qaMoveVector = { x: 0, y: 0 };
  let activeScene = null;
  let autoStartOnCreate = PRECISION_PROTOTYPE_AUTO_RESTART;
  let selectedBattlefieldId = PRECISION_PROTOTYPE_MODE
    ? "mirror-harbor"
    : battlefieldCatalog[0]?.id || "lantern-court";
  let selectedWeaponId = "tracker";

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  const MASTER_VOLUME = 1.0;
  const AUDIO_OUTPUT_DRIVE = 2.0;
  const AUDIO_OUTPUT_COMPRESSOR = Object.freeze({
    threshold: -10,
    knee: 8,
    ratio: 8,
    attack: 0.003,
    release: 0.18,
  });
  const AUDIO_PICKUP_SOURCE_GAIN = 3.0;
  const AUDIO_KILL_SOURCE_GAIN = 1.75;
  const AUDIO_LOW_PRIORITY_VOICE_LIMIT = 16;
  const AUDIO_MAX_ACTIVE_VOICES = 24;
  const AUDIO_PICKUP_SCALE = Object.freeze([587, 698, 784, 880, 1047]);
  const AUDIO_CUE_PRIORITIES = Object.freeze({
    pickup: 1,
    hit: 2,
    trackerHit: 2,
    kill: 3,
    trackerKill: 3,
    critical: 4,
    killCluster: 4,
    boss: 5,
    bossPhase: 5,
    warning: 5,
    damage: 5,
  });
  const AUDIO_CUE_RATE_LIMITS = Object.freeze({
    pickup: Object.freeze({ minGap: 90, maxPerSecond: 12 }),
    hit: Object.freeze({ minGap: 90, maxPerSecond: 12 }),
    trackerHit: Object.freeze({ minGap: 90, maxPerSecond: 12 }),
    critical: Object.freeze({ minGap: 130, maxPerSecond: 8 }),
    kill: Object.freeze({ minGap: 130, maxPerSecond: 8 }),
    trackerKill: Object.freeze({ minGap: 130, maxPerSecond: 8 }),
    killCluster: Object.freeze({ minGap: 260, maxPerSecond: 4 }),
  });
  const soundscape = {
    context: null,
    master: null,
    outputDrive: null,
    outputCompressor: null,
    muted: false,
    lastPlayed: Object.create(null),
    recentPlayed: Object.create(null),
    cueSequences: Object.create(null),
    cuePlayCounts: Object.create(null),
    activeVoices: new Set(),
    peakVoices: 0,
    lowPriorityVoiceRejects: 0,
    hardVoiceRejects: 0,
    currentCuePriority: 0,
    hitSuppressedUntil: Number.NEGATIVE_INFINITY,
    pickupFeedback: {
      windowStartAt: Number.NEGATIVE_INFINITY,
      lastEventAt: Number.NEGATIVE_INFINITY,
      streak: 0,
    },
    killFeedback: {
      windowStartAt: Number.NEGATIVE_INFINITY,
      count: 0,
    },
    musicTimer: null,
    musicStep: 0,
    musicTheme: null,
    musicAct: null,
    musicPaused: false,
    resumeAttempts: 0,
    resumeSuccesses: 0,
    handledPointerEvents: new WeakSet(),
    musicPatterns: Object.freeze({
      "lantern-court:1": Object.freeze({
        bass: [98, null, 98, null, 116.54, null, 87.31, null, 98, null, 130.81, null, 116.54, null, 87.31, null],
        lead: [392, null, 466.16, null, 523.25, null, 466.16, null, 392, null, 349.23, null, 293.66, null, 349.23, null],
        bassDuration: 0.52, leadDuration: 0.26, bassGain: 0.05, leadGain: 0.032,
        bassWave: "sine", leadWave: "triangle", accentRoot: 261.63, accentEvery: 8, accentGain: 0.018, accentWave: "sine",
      }),
      "lantern-court:2": Object.freeze({
        bass: [98, 98, null, 116.54, 130.81, null, 116.54, 98, 87.31, 87.31, null, 98, 116.54, null, 130.81, 116.54],
        lead: [392, 466.16, null, 523.25, 587.33, 523.25, null, 466.16, 392, 349.23, null, 392, 466.16, 523.25, null, 349.23],
        bassDuration: 0.4, leadDuration: 0.22, bassGain: 0.048, leadGain: 0.029,
        bassWave: "triangle", leadWave: "triangle", accentRoot: 293.66, accentEvery: 4, accentGain: 0.015, accentWave: "sine",
      }),
      "lantern-court:3": Object.freeze({
        bass: [98, null, 116.54, 130.81, 98, 87.31, 98, 116.54, 130.81, null, 116.54, 98, 87.31, 98, 130.81, 116.54],
        lead: [523.25, 466.16, 392, 466.16, 587.33, null, 523.25, 466.16, 392, 349.23, 392, 466.16, 523.25, 587.33, null, 698.46],
        bassDuration: 0.3, leadDuration: 0.09, bassGain: 0.046, leadGain: 0.014,
        bassWave: "triangle", leadWave: "square", accentRoot: 349.23, accentEvery: 4, accentGain: 0.012, accentWave: "triangle",
      }),
      "mirror-harbor:1": Object.freeze({
        bass: [82.41, null, 110, null, 98, null, 73.42, null, 82.41, null, 123.47, null, 110, null, 73.42, null],
        lead: [329.63, null, 392, 440, 392, null, 293.66, null, 329.63, null, 466.16, 440, 392, null, 293.66, null],
        bassDuration: 0.52, leadDuration: 0.26, bassGain: 0.05, leadGain: 0.032,
        bassWave: "sine", leadWave: "triangle", accentRoot: 220, accentEvery: 8, accentGain: 0.018, accentWave: "sine",
      }),
      "mirror-harbor:2": Object.freeze({
        bass: [82.41, 82.41, null, 98, 110, null, 123.47, 98, 73.42, 82.41, null, 110, 123.47, 110, null, 73.42],
        lead: [329.63, 392, null, 440, 493.88, 440, 392, null, 293.66, 329.63, null, 392, 466.16, 440, 392, null],
        bassDuration: 0.4, leadDuration: 0.22, bassGain: 0.048, leadGain: 0.029,
        bassWave: "sine", leadWave: "triangle", accentRoot: 246.94, accentEvery: 4, accentGain: 0.015, accentWave: "sine",
      }),
      "mirror-harbor:3": Object.freeze({
        bass: [82.41, null, 98, 110, 123.47, 110, 98, 82.41, 73.42, 82.41, 98, 110, 123.47, null, 110, 73.42],
        lead: [440, 392, 329.63, 392, 493.88, null, 466.16, 440, 392, 329.63, 293.66, 329.63, 392, 466.16, null, 587.33],
        bassDuration: 0.3, leadDuration: 0.16, bassGain: 0.046, leadGain: 0.026,
        bassWave: "sine", leadWave: "triangle", accentRoot: 293.66, accentEvery: 4, accentGain: 0.012, accentWave: "sine",
      }),
    }),

    ensure() {
      if (!AudioContextConstructor) {
        this.syncButton();
        return null;
      }
      if (!this.context) {
        this.context = new AudioContextConstructor();
        this.master = this.context.createGain();
        this.outputDrive = this.context.createGain();
        this.outputCompressor = this.context.createDynamicsCompressor();
        this.master.gain.value = this.muted ? 0 : MASTER_VOLUME;
        this.outputDrive.gain.value = AUDIO_OUTPUT_DRIVE;
        this.outputCompressor.threshold.value = AUDIO_OUTPUT_COMPRESSOR.threshold;
        this.outputCompressor.knee.value = AUDIO_OUTPUT_COMPRESSOR.knee;
        this.outputCompressor.ratio.value = AUDIO_OUTPUT_COMPRESSOR.ratio;
        this.outputCompressor.attack.value = AUDIO_OUTPUT_COMPRESSOR.attack;
        this.outputCompressor.release.value = AUDIO_OUTPUT_COMPRESSOR.release;
        this.master.connect(this.outputDrive);
        this.outputDrive.connect(this.outputCompressor);
        this.outputCompressor.connect(this.context.destination);
      }
      this.syncButton();
      return this.context;
    },

    resumeFromPointerdown(event) {
      const scene = activeScene;
      if (scene?.precisionPrototypeTelemetry?.enabled && scene.ended) return false;
      if (scene?.isPrototypeAudioConfirmed()) return false;
      if (event && (typeof event === "object" || typeof event === "function")) {
        if (this.handledPointerEvents.has(event)) return false;
        this.handledPointerEvents.add(event);
      }
      const context = this.ensure();
      scene?.recordPrototypeAudioClickObserved(event, context?.state || "unavailable");
      if (!context) return false;
      if (context.state === "running") {
        scene?.confirmPrototypeAudio("already-running");
        return true;
      }
      if (context.state !== "suspended") return false;
      this.resumeAttempts += 1;
      scene?.recordPrecisionPrototypeAudioResume("attempt", event);
      context.resume().then(
        () => {
          this.resumeSuccesses += 1;
          this.syncButton();
          if (scene?.ended) return;
          scene?.recordPrecisionPrototypeAudioResume("success", event);
          scene?.confirmPrototypeAudio("resumed");
        },
        () => {
          ui.soundButton.dataset.audioState = "blocked";
          if (scene?.ended) return;
          scene?.recordPrecisionPrototypeAudioResume("blocked", event);
          scene?.showPrototypeAudioBlocked();
        },
      );
      this.syncButton();
      return true;
    },

    syncButton() {
      const unavailable = !AudioContextConstructor;
      ui.soundButton.disabled = unavailable;
      ui.soundButton.classList.toggle("is-muted", this.muted);
      ui.soundButton.setAttribute("aria-pressed", String(this.muted));
      ui.soundButton.setAttribute("aria-label", this.muted ? "打开声音" : "关闭声音");
      ui.soundButton.dataset.audioState = unavailable ? "unavailable" : this.context?.state || "idle";
    },

    isReady() {
      if (this.muted) return false;
      const context = this.context || this.ensure();
      return Boolean(context && context.state === "running" && this.master && !this.muted);
    },

    resetCombatFeedback() {
      this.lastPlayed = Object.create(null);
      this.recentPlayed = Object.create(null);
      this.cueSequences = Object.create(null);
      this.cuePlayCounts = Object.create(null);
      this.peakVoices = this.activeVoices.size;
      this.lowPriorityVoiceRejects = 0;
      this.hardVoiceRejects = 0;
      this.hitSuppressedUntil = Number.NEGATIVE_INFINITY;
      this.pickupFeedback = {
        windowStartAt: Number.NEGATIVE_INFINITY,
        lastEventAt: Number.NEGATIVE_INFINITY,
        streak: 0,
      };
      this.killFeedback = {
        windowStartAt: Number.NEGATIVE_INFINITY,
        count: 0,
      };
    },

    recordPickup(value = 1, now = Date.now()) {
      if (!this.isReady()) return false;
      const feedback = this.pickupFeedback;
      if (now - feedback.lastEventAt > 450) feedback.streak = 0;
      feedback.lastEventAt = now;
      feedback.streak += Math.max(1, Math.round(Number(value) || 1));
      if (now - feedback.windowStartAt < 90) return false;
      feedback.windowStartAt = now;
      return this.play("pickup", false, {
        now,
        step: Math.min(AUDIO_PICKUP_SCALE.length - 1, feedback.streak - 1),
      });
    },

    recordCritical(now = Date.now()) {
      if (!this.isReady()) return false;
      this.hitSuppressedUntil = Math.max(this.hitSuppressedUntil, now + 24);
      return this.play("critical", false, { now });
    },

    recordKill(options = {}, now = Date.now()) {
      if (!this.isReady()) return false;
      const suppressBase = options.suppressBase === true;
      let played = suppressBase ? false : this.play("kill", false, { now });
      const feedback = this.killFeedback;
      if (now - feedback.windowStartAt > 220) {
        feedback.windowStartAt = now;
        feedback.count = 0;
      }
      feedback.count += 1;
      if (feedback.count >= 4) {
        feedback.windowStartAt = now;
        feedback.count = 0;
        played = this.play("killCluster", false, { now }) || played;
      }
      return played;
    },

    toggle() {
      this.muted = !this.muted;
      const context = this.ensure();
      if (context && this.master) {
        this.master.gain.setTargetAtTime(this.muted ? 0 : MASTER_VOLUME, context.currentTime, 0.012);
      }
      this.syncButton();
      if (!this.muted) this.play("toggle", true);
    },

    startMusic(theme) {
      const context = this.ensure();
      this.stopMusic();
      this.resetCombatFeedback();
      if (!context) return false;
      this.musicTheme = this.musicPatterns[`${theme}:1`] ? theme : "lantern-court";
      this.musicAct = 1;
      this.musicStep = 0;
      this.musicPaused = false;
      this.musicTimer = window.setInterval(() => this.musicTick(), 380);
      this.musicTick();
      return true;
    },

    stopMusic() {
      if (this.musicTimer !== null) window.clearInterval(this.musicTimer);
      this.musicTimer = null;
      this.musicTheme = null;
      this.musicAct = null;
      this.musicStep = 0;
      this.musicPaused = false;
    },

    setMusicPaused(paused) {
      const wasPaused = this.musicPaused;
      this.musicPaused = Boolean(paused);
      if (wasPaused && !this.musicPaused) this.musicTick();
    },

    musicTick() {
      if (
        !this.musicTheme
        || this.musicPaused
        || this.muted
        || !this.context
        || this.context.state !== "running"
      ) return;
      const requestedAct = activeScene?.bossAlive
        ? 3
        : Math.min(3, Math.max(1, activeScene?.wavePhase || 1));
      if (this.musicAct !== requestedAct) {
        this.musicAct = requestedAct;
        this.musicStep = 0;
      }
      const pattern = this.musicPatterns[`${this.musicTheme}:${this.musicAct}`];
      const index = this.musicStep % pattern.bass.length;
      const cycle = Math.floor(this.musicStep / pattern.bass.length);
      const bossPressure = Boolean(activeScene?.bossAlive);
      const variation = bossPressure ? 1.05946 : cycle % 4 === 3 ? 0.94387 : 1;
      const bass = pattern.bass[index];
      const lead = pattern.lead[index];
      if (bass) this.tone(
        bass * variation,
        bass * variation * 0.997,
        pattern.bassDuration,
        pattern.bassGain,
        pattern.bassWave,
      );
      if (lead) {
        this.tone(
          lead * variation,
          lead * variation * 1.006,
          pattern.leadDuration,
          pattern.leadGain,
          pattern.leadWave,
          0.035,
        );
      }
      if (index % pattern.accentEvery === pattern.accentEvery - 1) {
        this.tone(
          pattern.accentRoot * variation,
          pattern.accentRoot * variation * 1.004,
          0.48,
          pattern.accentGain,
          pattern.accentWave,
          0.08,
        );
      }
      this.musicStep += 1;
    },

    getState() {
      return {
        available: Boolean(AudioContextConstructor),
        contextState: this.context?.state || "idle",
        muted: this.muted,
        musicActive: this.musicTimer !== null,
        musicPaused: this.musicPaused,
        musicTheme: this.musicTheme,
        musicAct: this.musicAct,
        musicStep: this.musicStep,
        masterGain: this.master?.gain.value || 0,
        outputDriveGain: this.outputDrive?.gain.value || 0,
        compressorReduction: Number(this.outputCompressor?.reduction) || 0,
        lastHitAt: this.lastPlayed.hit || 0,
        activeVoices: this.activeVoices.size,
        peakVoices: this.peakVoices,
        lowPriorityVoiceRejects: this.lowPriorityVoiceRejects,
        hardVoiceRejects: this.hardVoiceRejects,
        cuePlayCounts: { ...this.cuePlayCounts },
        pickupStreak: this.pickupFeedback.streak,
        killClusterCount: this.killFeedback.count,
        resumeAttempts: this.resumeAttempts,
        resumeSuccesses: this.resumeSuccesses,
      };
    },

    tone(startFrequency, endFrequency, duration, volume, type = "sine", delay = 0) {
      const context = this.context || this.ensure();
      if (!context || context.state !== "running" || !this.master || this.muted) return false;
      const priority = Math.max(0, Number(this.currentCuePriority) || 0);
      const voiceLimit = priority >= 4 ? AUDIO_MAX_ACTIVE_VOICES : AUDIO_LOW_PRIORITY_VOICE_LIMIT;
      if (this.activeVoices.size >= voiceLimit) {
        if (priority >= 4) this.hardVoiceRejects += 1;
        else this.lowPriorityVoiceRejects += 1;
        return false;
      }
      const startAt = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const voice = { oscillator, gain, priority, released: false };
      const releaseVoice = () => {
        if (voice.released) return;
        voice.released = true;
        this.activeVoices.delete(voice);
        oscillator.disconnect();
        gain.disconnect();
      };
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(Math.max(1, startFrequency), startAt);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), startAt + duration);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.linearRampToValueAtTime(volume, startAt + Math.min(0.012, duration * 0.3));
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.onended = releaseVoice;
      this.activeVoices.add(voice);
      this.peakVoices = Math.max(this.peakVoices, this.activeVoices.size);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + 0.02);
      return true;
    },

    play(name, bypassLimit = false, options = {}) {
      if (this.muted) return name === "audioConfirm" ? false : undefined;
      const context = this.context || this.ensure();
      if (!context || context.state !== "running" || !this.master) {
        return name === "audioConfirm" ? false : undefined;
      }
      const now = Number.isFinite(options.now) ? options.now : Date.now();
      if (["hit", "trackerHit"].includes(name) && now <= this.hitSuppressedUntil) return false;
      const legacyMinGap = {
        shot: 120,
        scatterSlash: 105,
        projectileCut: 90,
        trackerMark: 180,
        trackerHeavy: 180,
        hordeCombo: 220,
        audioConfirm: 240,
        damage: 150,
        ember: 90,
        enemyShot: 180,
        secondaryBottle: 180,
        secondaryDart: 140,
        secondaryCore: 240,
      }[name] || 0;
      const cueRate = AUDIO_CUE_RATE_LIMITS[name];
      const minGap = cueRate?.minGap ?? legacyMinGap;
      if (!bypassLimit) {
        const lastPlayedAt = this.lastPlayed[name];
        if (Number.isFinite(lastPlayedAt) && now - lastPlayedAt < minGap) {
          return name === "audioConfirm" ? false : undefined;
        }
        if (cueRate?.maxPerSecond) {
          const recent = (this.recentPlayed[name] || []).filter((playedAt) => now - playedAt <= 1000);
          if (recent.length >= cueRate.maxPerSecond) return false;
          recent.push(now);
          this.recentPlayed[name] = recent;
        }
      }
      this.lastPlayed[name] = now;
      this.cueSequences[name] = (this.cueSequences[name] || 0) + 1;
      this.cuePlayCounts[name] = (this.cuePlayCounts[name] || 0) + 1;
      const previousPriority = this.currentCuePriority;
      this.currentCuePriority = AUDIO_CUE_PRIORITIES[name] ?? 1;

      try {
      if (name === "toggle") {
        this.tone(520, 760, 0.08, 0.028, "sine");
      } else if (name === "start") {
        this.tone(196, 294, 0.18, 0.03, "sine");
        this.tone(392, 588, 0.16, 0.018, "triangle", 0.07);
      } else if (name === "shot") {
        this.tone(720, 410, 0.045, 0.009, "square");
      } else if (name === "lanceThrust") {
        this.tone(280, 92, 0.12, 0.032, "sawtooth");
        this.tone(1180, 360, 0.1, 0.022, "triangle", 0.012);
      } else if (name === "lanceHeavy") {
        this.tone(118, 42, 0.2, 0.048, "sawtooth");
        this.tone(820, 180, 0.17, 0.032, "triangle", 0.018);
      } else if (name === "scatterSlash") {
        this.tone(1560, 430, 0.085, 0.024, "sawtooth");
        this.tone(760, 230, 0.11, 0.018, "triangle", 0.012);
      } else if (name === "projectileCut") {
        this.tone(1480, 520, 0.07, 0.022, "triangle");
        this.tone(260, 118, 0.06, 0.024, "square", 0.008);
      } else if (name === "hit") {
        const variation = [1, 0.96, 1.03, 0.93][(this.cueSequences.hit - 1) % 4];
        this.tone(165 * variation, 73 * variation, 0.065, 0.035, "triangle");
        this.tone(880 * variation, 330 * variation, 0.035, 0.012, "triangle", 0.004);
      } else if (name === "kill") {
        const variation = [1, 0.94, 1.06, 0.97][(this.cueSequences.kill - 1) % 4];
        this.tone(1320 * variation, 440 * variation, 0.038, 0.012 * AUDIO_KILL_SOURCE_GAIN, "sawtooth");
        this.tone(392 * variation, 147 * variation, 0.07, 0.024 * AUDIO_KILL_SOURCE_GAIN, "triangle", 0.004);
      } else if (name === "critical") {
        this.tone(220, 73, 0.095, 0.04, "sawtooth");
        this.tone(1397, 587, 0.075, 0.024, "triangle");
        this.tone(1175, 1568, 0.055, 0.012, "sine", 0.018);
      } else if (name === "killCluster") {
        this.tone(98, 49, 0.18, 0.042, "sine");
        this.tone(294, 147, 0.2, 0.025, "triangle", 0.012);
        this.tone(587, 880, 0.09, 0.014, "sine", 0.036);
      } else if (name === "trackerHit") {
        const gain = activeScene?.isPrecisionTrackerPrototype() ? 1.35 : 1;
        this.tone(820, 460, 0.055, 0.018 * gain, "triangle");
        this.tone(1320, 760, 0.04, 0.012 * gain, "sine", 0.006);
      } else if (name === "trackerKill") {
        const gain = activeScene?.isPrecisionTrackerPrototype() ? 1.45 : 1;
        this.tone(660, 1320, 0.06, 0.024 * gain * AUDIO_KILL_SOURCE_GAIN, "triangle");
        this.tone(1560, 520, 0.04, 0.014 * gain * AUDIO_KILL_SOURCE_GAIN, "sawtooth", 0.006);
      } else if (name === "trackerMark") {
        this.tone(392, 784, 0.12, 0.026, "sine");
        this.tone(1046, 523, 0.1, 0.018, "triangle", 0.035);
      } else if (name === "trackerHeavy") {
        const gain = activeScene?.isPrecisionTrackerPrototype() ? 1.5 : 1;
        this.tone(260, 118, 0.11, 0.026 * gain, "triangle");
        this.tone(920, 1380, 0.09, 0.018 * gain, "sine", 0.012);
      } else if (name === "hordeCombo") {
        this.tone(196, 392, 0.09, 0.036, "triangle");
        this.tone(784, 1175, 0.08, 0.024, "sine", 0.018);
      } else if (name === "audioConfirm") {
        const firstTone = this.tone(440, 660, 0.09, 0.026, "sine");
        const secondTone = this.tone(880, 990, 0.12, 0.018, "triangle", 0.035);
        return firstTone || secondTone;
      } else if (name === "pickup") {
        const frequency = AUDIO_PICKUP_SCALE[Math.max(0, Math.min(AUDIO_PICKUP_SCALE.length - 1, options.step || 0))];
        this.tone(frequency * 1.5, frequency * 2.05, 0.042, 0.014 * AUDIO_PICKUP_SOURCE_GAIN, "triangle");
        this.tone(frequency * 3, frequency * 2.35, 0.02, 0.004 * AUDIO_PICKUP_SOURCE_GAIN, "square");
      } else if (name === "level") {
        [440, 660, 880].forEach((frequency, index) => this.tone(frequency, frequency * 1.08, 0.16, 0.022, "sine", index * 0.055));
      } else if (name === "upgrade") {
        this.tone(330, 495, 0.12, 0.026, "triangle");
        this.tone(660, 825, 0.15, 0.016, "sine", 0.045);
      } else if (name === "volley") {
        [392, 523.25, 659.25].forEach((frequency, index) => this.tone(frequency, frequency * 1.08, 0.2, 0.023, "triangle", index * 0.055));
      } else if (name === "summon") {
        this.tone(174.61, 261.63, 0.5, 0.032, "sine");
        this.tone(349.23, 523.25, 0.42, 0.018, "triangle", 0.08);
        this.tone(466.16, 233.08, 0.36, 0.014, "sine", 0.18);
      } else if (name === "bossPhase") {
        [110, 164.81, 220].forEach((frequency, index) => this.tone(frequency, frequency * 1.5, 0.38, 0.024, index === 0 ? "sawtooth" : "triangle", index * 0.07));
      } else if (name === "damage") {
        this.tone(118, 48, 0.17, 0.035, "sawtooth");
      } else if (name === "wave") {
        this.tone(130, 97, 0.32, 0.035, "triangle");
        this.tone(260, 195, 0.28, 0.018, "sine", 0.06);
      } else if (name === "boss") {
        this.tone(72, 36, 0.5, 0.055, "sawtooth");
        this.tone(146, 58, 0.42, 0.025, "triangle", 0.05);
      } else if (name === "warning") {
        this.tone(260, 150, 0.18, 0.035, "square");
        this.tone(210, 120, 0.18, 0.028, "square", 0.22);
      } else if (name === "charge") {
        this.tone(98, 42, 0.26, 0.045, "sawtooth");
      } else if (name === "pulse") {
        this.tone(240, 720, 0.24, 0.026, "sine");
      } else if (name === "ember") {
        this.tone(280, 110, 0.075, 0.014, "triangle");
      } else if (name === "enemyShot") {
        this.tone(250, 92, 0.15, 0.022, "sawtooth");
      } else if (name === "secondaryBottle") {
        this.tone(460, 190, 0.12, 0.021, "triangle");
        this.tone(1280, 520, 0.08, 0.012, "sine", 0.035);
      } else if (name === "secondaryDart") {
        this.tone(1120, 680, 0.07, 0.014, "triangle");
        this.tone(720, 1060, 0.09, 0.009, "sine", 0.018);
      } else if (name === "secondaryCore") {
        this.tone(155, 48, 0.32, 0.028, "sine");
        this.tone(390, 130, 0.22, 0.012, "triangle", 0.08);
      } else if (name === "chain") {
        this.tone(980, 360, 0.1, 0.02, "square");
        this.tone(620, 920, 0.12, 0.014, "sine", 0.035);
      } else if (name === "shield") {
        this.tone(430, 860, 0.18, 0.026, "sine");
      } else if (name === "dash") {
        this.tone(780, 260, 0.11, 0.022, "sawtooth");
        this.tone(420, 920, 0.09, 0.014, "sine", 0.025);
      } else if (name === "synergy") {
        [392, 523, 784].forEach((frequency, index) => this.tone(frequency, frequency * 1.12, 0.28, 0.03, "sine", index * 0.07));
      } else if (name === "victory") {
        [392, 523, 659, 784].forEach((frequency, index) => this.tone(frequency, frequency * 1.04, 0.32, 0.028, "sine", index * 0.085));
      } else if (name === "defeat") {
        [220, 165, 110].forEach((frequency, index) => this.tone(frequency, frequency * 0.7, 0.28, 0.034, "triangle", index * 0.11));
      }
      return true;
      } finally {
        this.currentCuePriority = previousPriority;
      }
    },
  };

  const enemyCatalog = {
    shade: { name: "暗影", role: "游猎", hp: 32, speed: 77, damage: 5, xp: 1, color: COLORS.red },
    gloamling: { name: "扑灯幼影", role: "成群扑灯 · 不会远射", hp: 16, speed: 142, damage: 3, xp: 1, color: 0xe56b58, introduce: true, unlockAt: 7, randomAt: 7, maxActive: 14, meleeFodder: true },
    wraith: { name: "哀影", role: "追猎守夜人", hp: 24, speed: 123, damage: 4, xp: 1, color: COLORS.violet },
    brute: { name: "重影", role: "直扑守夜人", hp: 98, speed: 46, damage: 9, xp: 3, color: COLORS.red, elite: true },
    splitter: { name: "裂影", role: "死亡后分裂", hp: 58, speed: 68, damage: 6, xp: 2, color: COLORS.goldHot, introduce: true },
    shard: { name: "碎影", role: "迅捷", hp: 12, speed: 160, damage: 3, xp: 0, color: COLORS.goldHot },
    hexer: { name: "咒灯者", role: "蓄力远射", hp: 48, speed: 58, damage: 7, xp: 2, color: COLORS.violet, elite: true, introduce: true },
    bulwark: { name: "甲魇", role: "先破甲再伤身", hp: 82, armor: 52, speed: 40, damage: 8, xp: 3, color: COLORS.armor, elite: true, introduce: true },
    charger: { name: "奔魇", role: "锁定后直线突袭", hp: 66, speed: 78, damage: 14, xp: 2, color: COLORS.goldHot, introduce: true },
    herald: { name: "鸣潮者", role: "为附近黑潮加速", hp: 70, speed: 44, damage: 6, xp: 3, color: COLORS.green, elite: true, support: true, introduce: true },
    cantor: { name: "钟咏者", role: "预警后三向扇射", hp: 82, speed: 46, damage: 6, xp: 3, color: COLORS.violet, elite: true, introduce: true },
    rammer: { name: "震槌者", role: "蓄力释放环形震波", hp: 118, armor: 28, speed: 38, damage: 8, xp: 4, color: COLORS.goldHot, elite: true, introduce: true },
    tideweaver: { name: "织潮祭士", role: "弧形五连潮弹", hp: 72, speed: 52, damage: 6, xp: 3, color: COLORS.cyan, elite: true, introduce: true },
    mirrorAcolyte: { name: "镜潮侍像", role: "青红双相追射", hp: 76, speed: 54, damage: 6, xp: 2, color: 0xff6d79, elite: true, introduce: true, maxActive: 2, mirrorSummon: true },
    blinkHunter: { name: "跃影猎手", role: "预警后瞬移突袭", hp: 62, speed: 88, damage: 12, xp: 3, color: COLORS.cyan, elite: true, introduce: true, unlockAt: 28, randomAt: 32, maxActive: 2 },
    frostOracle: { name: "霜蚀祭司", role: "寒霜扇射与减速", hp: 76, speed: 48, damage: 7, xp: 3, color: COLORS.ice, elite: true, introduce: true, unlockAt: 42, randomAt: 46, maxActive: 2 },
    emberBomber: { name: "烬星投手", role: "锁定地面范围轰击", hp: 94, speed: 43, damage: 12, xp: 4, color: COLORS.goldHot, elite: true, introduce: true, unlockAt: 54, randomAt: 58, maxActive: 1 },
    echoDuelist: { name: "回潮刃客", role: "双刃飞出后折返追击", hp: 78, speed: 66, damage: 9, xp: 3, color: COLORS.cyan, elite: true, introduce: true, unlockAt: 34, randomAt: 39, maxActive: 2 },
    voidScribe: { name: "裂光书吏", role: "预警后裁切整条光廊", hp: 96, speed: 42, damage: 12, xp: 4, color: 0xff6d79, elite: true, introduce: true, unlockAt: 60, randomAt: 64, maxActive: 1 },
    prismSentry: { name: "棱镜卫士", role: "狙击与七向折射", hp: 108, armor: 22, speed: 42, damage: 9, xp: 4, color: COLORS.violet, elite: true, introduce: true, unlockAt: 65, randomAt: 69, maxActive: 2 },
    devourerRanged: { name: "噬光侍从·引弦", role: "为吞灯者护灯并远射", hp: 138, speed: 46, damage: 7, xp: 0, color: COLORS.violet, elite: true, bossMinion: true, attendantRole: "ranged" },
    devourerChaser: { name: "噬光侍从·逐烬", role: "为吞灯者护灯并追猎", hp: 164, speed: 102, damage: 9, xp: 0, color: COLORS.red, elite: true, bossMinion: true, attendantRole: "chaser" },
    rift: { name: "暗潮裂隙", role: "持续召来增援", hp: 170, speed: 0, damage: 6, xp: 0, color: COLORS.violet, elite: true },
  };

  const weaponCatalog = [
    {
      id: "tracker",
      sigil: "矢",
      name: "引灯矢",
      description: "稳定追踪，射速均衡。",
      color: "#f2c84b",
      colorValue: COLORS.gold,
      texture: "bolt",
      fxStyle: "tracker",
      hitWidth: 21,
      hitHeight: 8,
      damage: 24,
      fireRate: 430,
      projectileCount: 1,
      projectileSpeed: 540,
      spread: 0.13,
      pierce: 0,
      homing: 0.095,
      life: 1250,
      range: 560,
      trailRadius: 3,
      signatureUpgrade: "lanternMark",
      signatureCycle: 3,
      signatureSummary: "命中三次爆印",
    },
    {
      id: "scatter",
      sigil: "散",
      name: "碎星扇",
      description: "华丽宽扇横扫，成片斩敌；范围内敌弹有 60% 概率被斩碎。",
      color: "#ef7563",
      colorValue: 0xef7563,
      texture: "scatterBolt",
      fxStyle: "scatter",
      attackStyle: "melee-fan",
      hitWidth: 15,
      hitHeight: 9,
      damage: 15,
      fireRate: 590,
      projectileCount: 3,
      projectileSpeed: 485,
      spread: 0.24,
      pierce: 0,
      homing: 0.028,
      life: 920,
      range: 210,
      trailRadius: 2,
      signatureUpgrade: "starburst",
      signatureCycle: 4,
      signatureSummary: "第四击旋刃",
    },
    {
      id: "lance",
      sigil: "贯",
      name: "破夜枪",
      description: "长线贯刺，枪路内敌弹有 60% 概率被击碎。",
      color: "#69d5c8",
      colorValue: COLORS.armor,
      texture: "lanceBolt",
      fxStyle: "lance",
      attackStyle: "melee-thrust",
      hitWidth: 34,
      hitHeight: 8,
      damage: 46,
      fireRate: 680,
      projectileCount: 1,
      projectileSpeed: 690,
      spread: 0.08,
      pierce: 2,
      homing: 0.018,
      life: 1500,
      range: 330,
      trailRadius: 4,
      signatureUpgrade: "nightbreaker",
      signatureCycle: 3,
      signatureSummary: "第三击重枪",
    },
    {
      id: "returner",
      sigil: "轮",
      name: "回光轮",
      description: "穿群飞出、改道折返，往返皆可命中。",
      color: "#c19cff",
      colorValue: 0xc19cff,
      texture: "returnBolt",
      fxStyle: "returner",
      hitWidth: 27,
      hitHeight: 27,
      damage: 24,
      fireRate: 700,
      projectileCount: 1,
      projectileSpeed: 500,
      spread: 0.18,
      pierce: 99,
      homing: 0.028,
      life: 1450,
      range: 500,
      returnAfter: 430,
      trailRadius: 3,
      signatureUpgrade: "eclipseEcho",
      signatureCycle: 3,
      signatureSummary: "第三击月蚀轮舞",
    },
    {
      id: "arc",
      sigil: "雷",
      name: "星链符",
      description: "双符分锁不同敌人，命中留下星链节点并拉出清潮电网。",
      color: "#8fe7ff",
      colorValue: 0x8fe7ff,
      texture: "arcBolt",
      fxStyle: "arc",
      hitWidth: 21,
      hitHeight: 21,
      damage: 20,
      fireRate: 540,
      projectileCount: 2,
      projectileSpeed: 470,
      spread: 0.16,
      pierce: 0,
      homing: 0.12,
      life: 1350,
      range: 575,
      trailRadius: 3,
      signatureUpgrade: "stormGlyph",
      signatureCycle: 4,
      signatureSummary: "第四击引爆星网",
    },
    {
      id: "nova",
      sigil: "曜",
      name: "曜日核",
      description: "重弹命中引爆成长星环，第三击凝成连续脉冲的超新星核。",
      color: "#ffcf62",
      colorValue: 0xffcf62,
      texture: "novaBolt",
      fxStyle: "nova",
      hitWidth: 29,
      hitHeight: 29,
      damage: 34,
      fireRate: 780,
      projectileCount: 1,
      projectileSpeed: 500,
      spread: 0.11,
      pierce: 0,
      homing: 0.052,
      life: 1500,
      range: 600,
      trailRadius: 5,
      signatureUpgrade: "sunwell",
      signatureCycle: 3,
      signatureSummary: "第三击超新星脉冲",
    },
  ];

  const secondaryWeaponCatalog = [
    {
      id: "fire-bottle",
      sigil: "瓶",
      name: "巡火瓶",
      tag: "范围压制",
      description: "每 3.4 秒投向敌群最密处，爆开后留下持续灼烧的巡火圈。",
      detail: "旋转釉瓶 · 橙金尾焰 · 玻璃爆燃",
      color: "#ffb24d",
      colorValue: 0xffb24d,
      weaponOnly: "tracker",
      interval: 3400,
      upgrades: [
        { id: "fire-bottle-wick", sigil: "芯", name: "长燃灯芯", description: "巡火圈持续时间延长 0.8 秒，灼烧伤害提高。", color: "#ffbd65" },
        { id: "fire-bottle-glaze", sigil: "釉", name: "爆燃釉层", description: "投掷间隔缩短 0.45 秒，爆炸范围扩大。", color: "#ff8b4d" },
      ],
    },
    {
      id: "shadow-darts",
      sigil: "梭",
      name: "逐影梭",
      tag: "分流追踪",
      description: "每 1.8 秒放出两枚弧形追踪梭，优先锁定主武器之外的敌人。",
      detail: "白金长梭 · 弧形光迹 · 星芒命中",
      color: "#fff1ad",
      colorValue: 0xfff1ad,
      weaponOnly: "tracker",
      interval: 1800,
      upgrades: [
        { id: "shadow-darts-fletching", sigil: "翎", name: "折光尾翎", description: "追踪转向更快，单梭伤害提高 3 点。", color: "#fff5c9" },
        { id: "shadow-darts-resonance", sigil: "双", name: "双梭共振", description: "发射间隔缩短 0.25 秒，命中星芒范围扩大。", color: "#d8f6ff" },
      ],
    },
    {
      id: "eclipse-core",
      sigil: "核",
      name: "蚀灯核",
      tag: "聚怪坍缩",
      description: "每 6.5 秒射出暗核，强力牵引附近敌人 1.8 秒后坍缩爆发。",
      detail: "幽暗核心 · 青金刻环 · 向内旋带",
      color: "#83e9df",
      colorValue: 0x83e9df,
      weaponOnly: "tracker",
      interval: 6500,
      upgrades: [
        { id: "eclipse-core-tide", sigil: "潮", name: "潮汐刻环", description: "牵引范围与力度提高，暗核维持更久。", color: "#8ff4e8" },
        { id: "eclipse-core-collapse", sigil: "蚀", name: "余烬坍缩", description: "坍缩伤害提高 24 点，并留下短促余波。", color: "#c7adff" },
      ],
    },
    {
      id: "star-mine",
      sigil: "阵",
      name: "碎星剑阵",
      tag: "持续剑气",
      description: "每 1.8 秒列阵，朝敌群持续放出两道宽月牙剑气，贯穿沿途敌人。",
      detail: "双剑轮转 · 宽月牙剑气 · 60% 斩弹",
      color: "#ff806f",
      colorValue: 0xff806f,
      weaponOnly: "scatter",
      interval: 1800,
      upgrades: [
        { id: "star-mine-cluster", sigil: "万", name: "万刃齐发", description: "每轮剑阵由 2 道增加至 4 道宽月牙剑气。", color: "#ff9a82" },
        { id: "star-mine-fuse", sigil: "轮", name: "剑阵轮转", description: "剑阵间隔缩短 0.5 秒，持续穿群更加紧密。", color: "#ffd0a1", intervalReduction: 500 },
      ],
    },
    {
      id: "ember-bellows",
      sigil: "扇",
      name: "逆焰开扇",
      tag: "开扇三斩",
      description: "每 2.4 秒朝最近敌群连续展开三道逆焰月牙，一轮只斩每名敌人一次。",
      detail: "珊瑚月牙 · 三段开扇 · 贴身群斩",
      color: "#ff9b72",
      colorValue: 0xff9b72,
      weaponOnly: "scatter",
      interval: 2400,
      upgrades: [
        { id: "ember-bellows-wide", sigil: "阔", name: "阔面扇骨", description: "三道月牙展开得更宽，斩击距离略微提高。", color: "#ffc09d" },
        { id: "ember-bellows-pressure", sigil: "压", name: "炽压刃脊", description: "月牙斩伤害提高，开扇间隔缩短 0.3 秒。", color: "#ff744f", intervalReduction: 300 },
      ],
    },
    {
      id: "dash-blades",
      sigil: "痕",
      name: "星痕瞬斩",
      tag: "自动群落瞬斩",
      description: "每 2.8 秒令两道剑影瞬移至密集敌群，各自斩击附近最多两名敌人。",
      detail: "自动索敌 · 双影瞬斩 · 不移动角色",
      color: "#ffd2c8",
      colorValue: 0xffd2c8,
      weaponOnly: "scatter",
      interval: 2800,
      upgrades: [
        { id: "dash-blades-edge", sigil: "锋", name: "灼星刃锋", description: "瞬斩伤害由 42 提高至 58，斩击半径由 76 提高至 96。", color: "#fff0e9" },
        { id: "dash-blades-echo", sigil: "返", name: "折返星痕", description: "0.24 秒后在原坐标追加一次 30 伤害的回响斩。", color: "#ffb3a3" },
      ],
    },
    {
      id: "array-lances",
      sigil: "阵",
      name: "列阵浮枪",
      tag: "三向齐射",
      description: "每 2.9 秒，主枪突刺时左右浮枪同步展开相同的长线突刺，三枪优先攻击不同方向并有 60% 概率斩碎敌弹。",
      detail: "主枪居中 · 同形长枪 · 三向贯穿 · 60% 断弹",
      color: "#79e8dc",
      colorValue: 0x79e8dc,
      weaponOnly: "lance",
      interval: 2900,
      upgrades: [
        { id: "array-lances-third", sigil: "轮", name: "三才轮转", description: "三枪齐射间隔缩短 0.6 秒，更快分袭不同方向。", color: "#a7fff4", intervalReduction: 600 },
        { id: "array-lances-needle", sigil: "锐", name: "破甲枪尖", description: "浮枪伤害提高，并额外穿透 2 名敌人。", color: "#d2fffa" },
      ],
    },
    {
      id: "shadow-stake",
      sigil: "龙",
      name: "游龙回枪",
      tag: "绕身清潮",
      description: "每 4.4 秒唤出巨型光枪绕身旋扫一周；每柄枪可各自命中并有 60% 概率斩碎敌弹。",
      detail: "巨枪环扫 · 逐枪命中 · 数量生效 · 60% 断弹",
      color: "#9ae6d8",
      colorValue: 0x9ae6d8,
      weaponOnly: "lance",
      interval: 4400,
      upgrades: [
        { id: "shadow-stake-anchor", sigil: "双", name: "双龙绞阵", description: "增加一柄反向光枪；两柄枪可分别命中同一名敌人。", color: "#b6fff3" },
        { id: "shadow-stake-sunder", sigil: "裂", name: "裂潮龙锋", description: "旋扫半径扩大，伤害提高 28 点。", color: "#e0fff9" },
      ],
    },
    {
      id: "sky-laser",
      sigil: "穹",
      name: "天穹贯灯",
      tag: "推进光炮",
      description: "每 7.2 秒在守夜人身前压缩光环、聚拢能量，再向目标方向轰出贯穿战场的激光炮。",
      detail: "双环聚能 · 炮口爆发 · 分层推进光束",
      color: "#b7fff6",
      colorValue: 0xb7fff6,
      weaponOnly: "lance",
      interval: 7200,
      upgrades: [
        { id: "sky-laser-focus", sigil: "聚", name: "穹顶聚焦", description: "贯灯光束更宽，伤害提高。", color: "#e1fffb" },
        { id: "sky-laser-capacitor", sigil: "蓄", name: "速燃灯容", description: "发射间隔缩短 0.8 秒，蓄能时间缩短，光束推进更快。", color: "#82f1e4", intervalReduction: 800 },
      ],
    },
    {
      id: "moon-orbit",
      sigil: "月",
      name: "守望月刃",
      tag: "贴身截潮",
      description: "每 5.6 秒唤出绕身月刃，持续切割近敌并尝试斩落来袭弹幕，结束时收回身前。",
      detail: "大圈环卫 · 近敌连切 · 六成断弹",
      color: "#c8a9ff",
      colorValue: 0xc8a9ff,
      weaponOnly: "returner",
      interval: 5600,
      upgrades: [
        { id: "moon-orbit-twin", sigil: "双", name: "双月守望", description: "每轮额外生成 1 枚真实月刃。", color: "#e3d4ff" },
        { id: "moon-orbit-edge", sigil: "蚀", name: "蚀月刃口", description: "月刃伤害提高至 32，护场时间延长至 5.2 秒。", color: "#ae80ff" },
      ],
    },
    {
      id: "echo-wheel",
      sigil: "影",
      name: "留影轮",
      tag: "散射归月",
      description: "每 3.7 秒在刚才的位置留下月影，六向绽开的月片命中也不停留，随后强制收回身前才消失。",
      detail: "旧位留影 · 六向往返 · 强制回收",
      color: "#d7c4ff",
      colorValue: 0xd7c4ff,
      weaponOnly: "returner",
      interval: 3700,
      upgrades: [
        { id: "echo-wheel-eight", sigil: "八", name: "八相月轮", description: "绽放月片由 6 枚增加为 8 枚。", color: "#eee7ff" },
        { id: "echo-wheel-memory", sigil: "忆", name: "归月残忆", description: "月片伤害提高，回程伤害再提高 50%。", color: "#b995ff" },
      ],
    },
    {
      id: "soul-tether",
      sigil: "索",
      name: "追魂月索",
      tag: "远端处决",
      description: "每 4.8 秒锁定最远的高威胁敌人，放出贯穿长路的月轮，抵达后折返收回。",
      detail: "远敌锁定 · 往返贯线 · 不再拉怪",
      color: "#b58cff",
      colorValue: 0xb58cff,
      weaponOnly: "returner",
      interval: 4800,
      upgrades: [
        { id: "soul-tether-chain", sigil: "连", name: "双魂月索", description: "每轮额外生成 1 枚月轮，独立锁定另一名远敌。", color: "#d9c5ff" },
        { id: "soul-tether-grip", sigil: "蚀", name: "远蚀归轮", description: "月轮抵达远端时爆发蚀月，回程伤害提高至 155%。", color: "#9c6cf3" },
      ],
    },
    {
      id: "lightning-rod",
      sigil: "针",
      name: "引雷针",
      tag: "临时炮台",
      description: "每 6 秒在敌群中立起引雷针，连续轰击附近目标。",
      detail: "青蓝雷塔 · 自动索敌 · 连续落雷",
      color: "#82eaff",
      colorValue: 0x82eaff,
      weaponOnly: "arc",
      interval: 6000,
      upgrades: [
        { id: "lightning-rod-twin", sigil: "叉", name: "分岔针冠", description: "每次落雷会同时命中第二名目标。", color: "#b5f5ff" },
        { id: "lightning-rod-overcharge", sigil: "涌", name: "过载线圈", description: "落雷伤害提高，引雷针存在更久。", color: "#5bdfff" },
      ],
    },
    {
      id: "static-canopy",
      sigil: "幕",
      name: "静电天幕",
      tag: "弹幕净化",
      description: "每 6.4 秒撑开静电天幕，电击近敌并消除少量普通弹丸。",
      detail: "环形电幕 · 近身净化 · 反弹幕窗口",
      color: "#a7f3ff",
      colorValue: 0xa7f3ff,
      weaponOnly: "arc",
      interval: 6400,
      upgrades: [
        { id: "static-canopy-bulwark", sigil: "壁", name: "扩容电幕", description: "天幕范围扩大，可消除更多普通弹丸。", color: "#d7fbff" },
        { id: "static-canopy-discharge", sigil: "放", name: "回流放电", description: "天幕电击伤害提高，持续时间延长。", color: "#6fe7fa" },
      ],
    },
    {
      id: "storm-orb",
      sigil: "珠",
      name: "折雷游珠",
      tag: "弹跳追敌",
      description: "每 2.8 秒放出会在敌群间跳跃的电珠，连续追击多个目标。",
      detail: "游动雷珠 · 多段弹跳 · 青蓝电弧",
      color: "#72dcff",
      colorValue: 0x72dcff,
      weaponOnly: "arc",
      interval: 2800,
      upgrades: [
        { id: "storm-orb-jumps", sigil: "跃", name: "多极折跃", description: "电珠额外弹跳 2 次。", color: "#a9edff" },
        { id: "storm-orb-charge", sigil: "荷", name: "高荷游珠", description: "每次弹跳伤害提高，发射间隔缩短 0.3 秒。", color: "#4bcfff", intervalReduction: 300 },
      ],
    },
    {
      id: "solar-rocket",
      sigil: "箭",
      name: "坠日火箭",
      tag: "密集轰炸",
      description: "每 3.6 秒向最密集的敌群发射一枚坠日火箭。",
      detail: "密集区锁定 · 地面预警 · 日爆冲击",
      color: "#ffc75f",
      colorValue: 0xffc75f,
      weaponOnly: "nova",
      interval: 3600,
      upgrades: [
        { id: "solar-rocket-warhead", sigil: "核", name: "日核战部", description: "爆炸伤害与范围提高。", color: "#ffe198" },
        { id: "solar-rocket-thrusters", sigil: "推", name: "耀斑推进", description: "火箭飞行更快，发射间隔缩短 0.6 秒。", color: "#ffac47", intervalReduction: 600 },
      ],
    },
    {
      id: "flare-wall",
      sigil: "壁",
      name: "日珥幕墙",
      tag: "区域切割",
      description: "每 5.8 秒在敌群处升起一道日珥幕墙，持续灼穿来敌。",
      detail: "金红火幕 · 交错日珥 · 战场分割",
      color: "#ffda78",
      colorValue: 0xffda78,
      weaponOnly: "nova",
      interval: 5800,
      upgrades: [
        { id: "flare-wall-length", sigil: "延", name: "长昼镜片", description: "幕墙长度与持续时间提高。", color: "#fff0bd" },
        { id: "flare-wall-furnace", sigil: "炉", name: "日炉增压", description: "幕墙每次灼烧伤害提高。", color: "#ffb54d" },
      ],
    },
    {
      id: "corona-sail",
      sigil: "镜",
      name: "日冕镜盾",
      tag: "折镜反击",
      description: "每 6.2 秒朝来弹最密集方向展开镜盾，吸收普通弹丸后聚光回击。",
      detail: "定向护卫 · 独立蓄能 · 聚光反击",
      color: "#ffe59a",
      colorValue: 0xffe59a,
      weaponOnly: "nova",
      interval: 6200,
      upgrades: [
        { id: "corona-sail-twin", sigil: "双", name: "双镜分光", description: "额外展开 1 面镜盾，扩大正面覆盖。", color: "#fff4c9" },
        { id: "corona-sail-flare", sigil: "耀", name: "聚光回照", description: "每面镜盾吸收上限提高，灼击与聚光反击增强。", color: "#ffc857" },
      ],
    },
  ];

  const upgradeCatalog = [
    {
      id: "focus",
      sigil: "炽",
      name: "炽光",
      description: "主武器基础伤害提高 8 点；副武器继承其中 35%。",
      color: "#f2c84b",
      maxLevel: 5,
      apply(scene) {
        scene.stats.damage += 8;
      },
    },
    {
      id: "volley",
      sigil: "+1",
      name: "攻势 +1",
      description: "主武器攻击额外增加一道弹体、扇刃或枪影；每种副武器也精确增加 1 个实际攻击单位，可逐层叠加。",
      color: "#ef5a4f",
      maxLevel: 3,
      apply(scene) {
        scene.stats.projectileCount += 1;
      },
    },
    {
      id: "rhythm",
      sigil: "疾",
      name: "急燃",
      description: "主武器自动攻击间隔缩短 18%；副武器继承 40% 加速收益，并提高环火转速。",
      color: "#ff9f43",
      maxLevel: 5,
      apply(scene) {
        scene.stats.fireRate = Math.max(150, scene.stats.fireRate * 0.82);
      },
    },
    {
      id: "lanternMark",
      sigil: "印",
      name: "引灯印",
      description: "引灯矢每累计命中 3 次，爆开一圈范围伤害。",
      color: "#f2c84b",
      maxLevel: 3,
      weaponOnly: "tracker",
      apply(scene) {
        scene.stats.signatureLevel += 1;
        scene.signatureCounter = 0;
      },
    },
    {
      id: "starburst",
      sigil: "雨",
      name: "碎星雨",
      description: "碎星扇每第 4 次攻击，回身斩出一圈碎星旋刃。",
      color: "#ef7563",
      maxLevel: 3,
      weaponOnly: "scatter",
      apply(scene) {
        scene.stats.signatureLevel += 1;
        scene.signatureCounter = 0;
      },
    },
    {
      id: "nightbreaker",
      sigil: "破",
      name: "破阵式",
      description: "破夜枪每第 3 次突刺化为重枪，扩大枪路并强化穿透。",
      color: "#69d5c8",
      maxLevel: 3,
      weaponOnly: "lance",
      apply(scene) {
        scene.stats.signatureLevel += 1;
        scene.signatureCounter = 0;
      },
    },
    {
      id: "eclipseEcho",
      sigil: "蚀",
      name: "月蚀回响",
      description: "每第 3 次攻击折返时爆开月环并改道穿群；2/3级再分出1/2枚影轮，形成月蚀轮舞。",
      color: "#c19cff",
      maxLevel: 3,
      weaponOnly: "returner",
      apply(scene) {
        scene.stats.signatureLevel += 1;
        scene.signatureCounter = 0;
      },
    },
    {
      id: "stormGlyph",
      sigil: "链",
      name: "星网连锁",
      description: "星链符每第 4 次攻击引爆3/4/5个节点；3级闭环后追加一次60%回流。",
      color: "#8fe7ff",
      maxLevel: 3,
      weaponOnly: "arc",
      apply(scene) {
        scene.stats.signatureLevel += 1;
        scene.signatureCounter = 0;
      },
    },
    {
      id: "sunwell",
      sigil: "珥",
      name: "超新星脉冲",
      description: "曜日核每第 3 次攻击留下恒星核，连续脉冲聚拢并焚尽成片敌潮。",
      color: "#ffcf62",
      maxLevel: 3,
      weaponOnly: "nova",
      apply(scene) {
        scene.stats.signatureLevel += 1;
        scene.signatureCounter = 0;
      },
    },
    {
      id: "stride",
      sigil: "行",
      name: "行灯",
      description: "移动速度提高 25。",
      color: "#5ad3c8",
      maxLevel: 4,
      apply(scene) {
        scene.stats.speed += 25;
      },
    },
    {
      id: "afterglow",
      sigil: "迹",
      name: "余辉步",
      description: "闪步残影短暂后爆开，造成范围伤害。",
      color: "#5ad3c8",
      maxLevel: 3,
      apply(scene) {
        scene.stats.afterglowLevel += 1;
      },
    },
    {
      id: "ward",
      sigil: "护",
      name: "守夜誓",
      description: "生命上限提高 25，并恢复等量生命。",
      color: "#64c27b",
      maxLevel: 4,
      apply(scene) {
        scene.playerMaxHealth += 25;
        scene.playerHealth = Math.min(scene.playerMaxHealth, scene.playerHealth + 25);
      },
    },
    {
      id: "mend",
      sigil: "芯",
      name: "蓄光芯",
      description: "火种充能效率提高 15%，并立即获得 18 点充能。",
      color: "#f2c84b",
      maxLevel: 4,
      apply(scene) {
        scene.emberGainMultiplier += 0.15;
        scene.gainEmberCharge(18, "蓄光芯");
      },
    },
    {
      id: "orbit",
      sigil: "环",
      name: "环火",
      description: "召出绕身火种；环火等级越高，火种越大、转速越快。",
      color: "#a984d6",
      maxLevel: 3,
      apply(scene) {
        scene.stats.orbitLevel += 1;
        scene.syncOrbitals();
      },
    },
    {
      id: "dawn",
      sigil: "曜",
      name: "天光",
      description: "周期性释放净化冲击，并在 0.32 秒后回响一次。",
      color: "#e9ebe2",
      maxLevel: 3,
      apply(scene) {
        scene.stats.dawnLevel += 1;
        scene.dawnCooldown = 1200;
      },
    },
    {
      id: "frost",
      sigil: "霜",
      name: "霜火",
      description: "主武器命中附着寒焰，使敌人减速。",
      color: "#82dff2",
      maxLevel: 3,
      apply(scene) {
        scene.stats.frostLevel += 1;
      },
    },
    {
      id: "chain",
      sigil: "霆",
      name: "引雷",
      description: "主武器连续命中会向附近敌人释放电弧。",
      color: "#bca4ff",
      maxLevel: 3,
      apply(scene) {
        scene.stats.chainLevel += 1;
        scene.chainHitCounter = 0;
      },
    },
    {
      id: "aegis",
      sigil: "盾",
      name: "微光盾",
      description: "周期性充能，抵挡一次对守夜人的伤害。",
      color: "#69d5c8",
      maxLevel: 3,
      apply(scene) {
        scene.stats.aegisLevel += 1;
        scene.aegisReadyAt = 0;
        scene.aegisWasReady = false;
      },
    },
    {
      id: "precision",
      sigil: "镜",
      name: "破晓镜",
      description: "主武器与副武器暴击率提高 8%，暴击造成 1.8 倍伤害。",
      color: "#fff0a3",
      maxLevel: 3,
      apply(scene) {
        scene.stats.criticalChance += 0.08;
      },
    },
    {
      id: "blaze",
      sigil: "烬",
      name: "灼痕",
      description: "主武器命中附着灼烧，持续蚕食敌人生命。",
      color: "#ff765c",
      maxLevel: 3,
      apply(scene) {
        scene.stats.blazeLevel += 1;
      },
    },
    {
      id: "reach",
      sigil: "巨",
      name: "巨化弹体",
      description: "所有主副武器弹体与命中体积增大 40%，攻击距离提高 70，主武器伤害提高 3；近战武器体现为攻击范围扩大。",
      color: "#8fe7ff",
      maxLevel: 3,
      apply(scene) {
        scene.stats.rangeBonus += REACH_RANGE_PER_LEVEL;
        scene.stats.damage += REACH_DAMAGE_PER_LEVEL;
      },
    },
    {
      id: "thorns",
      sigil: "返",
      name: "逆火甲",
      description: "接触受伤时，以火刺反击碰撞的敌人。",
      color: "#ef7563",
      maxLevel: 3,
      apply(scene) {
        scene.stats.thornsLevel += 1;
      },
    },
  ];

  const synergyCatalog = [
    {
      id: "emberVolley",
      sigil: "燎",
      name: "烈焰齐射",
      description: "命中后爆开余焰；引灯矢在引灯印成立后每第3次攻击打出重型宽扇。",
      color: "#ff704f",
      requirements: { focus: 1, volley: 1 },
    },
    {
      id: "solarCrown",
      sigil: "冕",
      name: "巡天日冕",
      description: "环火命中会催快下一次天光。",
      color: "#d8c4ff",
      requirements: { orbit: 1, dawn: 1 },
    },
    {
      id: "sharedVow",
      sigil: "契",
      name: "灯命相契",
      description: "生命首次危急时恢复 25，并立刻获得 50 点火种充能。",
      color: "#7ad99a",
      requirements: { ward: 1, mend: 1 },
    },
    {
      id: "lightTrail",
      sigil: "烁",
      name: "流火行迹",
      description: "余辉步爆开后，原地再回响一次。",
      color: "#7ce5d8",
      requirements: { stride: 1, afterglow: 1 },
    },
    {
      id: "frostfire",
      sigil: "熵",
      name: "霜烬裂变",
      description: "寒霜与灼痕相遇时爆开元素冲击。",
      color: "#ff9c82",
      requirements: { frost: 1, blaze: 1 },
    },
    {
      id: "stormMirror",
      sigil: "鉴",
      name: "雷镜折射",
      description: "暴击会加速引雷，引雷可继续折向第二个目标。",
      color: "#a7dcff",
      requirements: { chain: 1, precision: 1 },
    },
    {
      id: "reprisalAegis",
      sigil: "反",
      name: "反照圣盾",
      description: "微光盾格挡时释放一圈反击火刺。",
      color: "#8cebe0",
      requirements: { aegis: 1, thorns: 1 },
    },
    {
      id: "gravityHalo",
      sigil: "轨",
      name: "引力日环",
      description: "环火轨道扩大，并对远处敌人造成更高伤害。",
      color: "#c8b7ff",
      requirements: { orbit: 1, reach: 1 },
    },
  ];

  const patrolRelicCatalog = [
    {
      id: "wayfinderEmber",
      sigil: "巡",
      name: "巡夜余火",
      description: "拾取范围提高 55，获得 28 点充能，守夜人恢复 8。",
      color: "#f2c84b",
      apply(scene) {
        scene.stats.pickupRadius += 55;
        scene.gainEmberCharge(28, "巡夜余火");
        scene.playerHealth = Math.min(scene.playerMaxHealth, scene.playerHealth + 8);
      },
    },
    {
      id: "riftGlass",
      sigil: "隙",
      name: "裂隙晶",
      description: "主武器伤害提高 6、间隔缩短 8%、弹速提高 25；副武器按统一比例继承。",
      color: "#a984d6",
      apply(scene) {
        scene.stats.damage += 6;
        scene.stats.fireRate = Math.max(150, scene.stats.fireRate * 0.92);
        scene.stats.projectileSpeed += 25;
      },
    },
  ];

  const shopSupplyCatalog = [
    {
      id: "field-repair",
      sigil: "补",
      name: "灯芯补给",
      description: "生命上限提高 10，并恢复 45 点生命。",
      color: "#64c27b",
      apply(scene) {
        scene.playerMaxHealth += 10;
        scene.playerHealth = Math.min(scene.playerMaxHealth, scene.playerHealth + 45);
      },
    },
    {
      id: "lamp-oil",
      sigil: "油",
      name: "浓缩灯油",
      description: "火种充能效率提高 10%，并立即获得 55 点充能。",
      color: "#f2c84b",
      apply(scene) {
        scene.emberGainMultiplier += 0.1;
        scene.gainEmberCharge(55, "浓缩灯油");
      },
    },
    {
      id: "quickstep-kit",
      sigil: "履",
      name: "轻行扣具",
      description: "移动速度提高 18，闪步冷却缩短 0.25 秒。",
      color: "#5ad3c8",
      apply(scene) {
        scene.stats.speed += 18;
        scene.dashCooldown = Math.max(2200, scene.dashCooldown - 250);
      },
    },
  ];

  const shopRelicCatalog = [
    {
      id: "prism-magazine",
      sigil: "棱",
      name: "棱光分流器",
      category: "多重攻势",
      description: "主武器额外增加一道攻势；每种副武器也增加 1 个实际攻击单位；投射弹速提高 30。",
      color: "#8fe7ff",
      apply(scene) {
        scene.stats.projectileCount += 1;
        scene.stats.projectileSpeed += 30;
      },
      remove(scene) {
        scene.stats.projectileCount = Math.max(scene.weaponProfile.projectileCount, scene.stats.projectileCount - 1);
        scene.stats.projectileSpeed -= 30;
      },
    },
    {
      id: "frostfire-fuse",
      sigil: "熵",
      name: "霜烬引信",
      category: "元素构筑",
      description: "同时获得一层霜火与灼痕，并直接点燃霜烬裂变。",
      color: "#ff9c82",
      apply(scene) {
        scene.stats.frostLevel += 1;
        scene.stats.blazeLevel += 1;
        scene.activeSynergies.add("frostfire");
      },
      remove(scene) {
        scene.stats.frostLevel = Math.max(0, scene.stats.frostLevel - 1);
        scene.stats.blazeLevel = Math.max(0, scene.stats.blazeLevel - 1);
        if ((scene.upgradeLevels.frost || 0) < 1 || (scene.upgradeLevels.blaze || 0) < 1) {
          scene.activeSynergies.delete("frostfire");
        }
      },
    },
    {
      id: "close-guard-ring",
      sigil: "近",
      name: "近灯铁环",
      category: "近身构筑",
      description: "环火与逆火甲各提高 1 级，移动速度提高 15。",
      color: "#c19cff",
      apply(scene) {
        scene.stats.orbitLevel += 1;
        scene.stats.thornsLevel += 1;
        scene.stats.speed += 15;
        scene.syncOrbitals();
      },
      remove(scene) {
        scene.stats.orbitLevel = Math.max(0, scene.stats.orbitLevel - 1);
        scene.stats.thornsLevel = Math.max(0, scene.stats.thornsLevel - 1);
        scene.stats.speed -= 15;
        scene.syncOrbitals();
      },
    },
    {
      id: "watch-scale",
      sigil: "守",
      name: "守夜刻度",
      category: "续航构筑",
      description: "每击退 30 个有余火的敌人，恢复 5 点生命。",
      color: "#7ad99a",
      apply(scene) {
        scene.watchScaleKills = 0;
      },
      remove(scene) {
        scene.watchScaleKills = 0;
      },
    },
    {
      id: "surge-regulator",
      sigil: "燃",
      name: "余火稳压瓶",
      category: "爆发构筑",
      description: "蓄光爆发的余辉持续时间延长 1.2 秒。",
      color: "#ffcf62",
      apply(scene) {
        scene.surgeDurationBonus += 1200;
      },
      remove(scene) {
        scene.surgeDurationBonus = Math.max(0, scene.surgeDurationBonus - 1200);
      },
    },
    {
      id: "fractured-lens",
      sigil: "裂",
      name: "裂心透镜",
      category: "险境构筑",
      description: "主武器伤害提高 18、间隔缩短 12%；副武器按统一比例继承，但生命上限降低 25。",
      color: "#ff6d79",
      apply(scene) {
        scene.stats.damage += 18;
        scene.relicFireRateMultiplier = 0.88;
        scene.playerMaxHealth = Math.max(60, scene.playerMaxHealth - 25);
        scene.playerHealth = Math.min(scene.playerHealth, scene.playerMaxHealth);
      },
      remove(scene) {
        scene.stats.damage -= 18;
        scene.relicFireRateMultiplier = 1;
        scene.playerMaxHealth += 25;
        scene.playerHealth = Math.min(scene.playerHealth, scene.playerMaxHealth);
      },
    },
  ];

  const routeCatalog = [
    {
      id: "wind-lanes",
      stage: 2,
      sigil: "疾",
      tag: "高机动敌群",
      name: "风巷追猎",
      description: "奔魇与咒灯者占据窄巷，敌潮更快、更偏向远射与突进。",
      reward: "移速 +28 · 拾取 +35 · 闪步冷却 -0.4秒",
      color: "#5ad3c8",
      colorValue: COLORS.cyan,
      themeColor: 0x286c73,
      spawnRate: 0.9,
      scriptedThreat: "hexer",
      enemyWeights: [
        ["gloamling", 0.11], ["shade", 0.04], ["wraith", 0.1], ["splitter", 0.12], ["hexer", 0.12],
        ["charger", 0.15], ["brute", 0.05], ["herald", 0.04], ["blinkHunter", 0.12],
        ["frostOracle", 0.07], ["echoDuelist", 0.08], ["voidScribe", 0.04], ["prismSentry", 0.07],
      ],
      apply(scene) {
        scene.stats.speed += 28;
        scene.stats.pickupRadius += 35;
        scene.dashCooldown = Math.max(2200, scene.dashCooldown - 400);
      },
    },
    {
      id: "wall-siege",
      stage: 2,
      sigil: "垒",
      tag: "重甲与范围压制",
      name: "城墙破阵",
      description: "重影、甲魇与烬星投手结成推进阵列，敌群更慢但范围火力更强。",
      reward: "伤害 +6 · 生命上限 +15 · 火种充能 +28",
      color: "#ef7563",
      colorValue: 0xef7563,
      themeColor: 0x71362f,
      spawnRate: 1.05,
      scriptedThreat: "bulwark",
      enemyWeights: [
        ["gloamling", 0.12], ["shade", 0.08], ["wraith", 0.05], ["splitter", 0.09], ["hexer", 0.06],
        ["charger", 0.07], ["brute", 0.13], ["bulwark", 0.12], ["herald", 0.08],
        ["frostOracle", 0.07], ["emberBomber", 0.09], ["echoDuelist", 0.04], ["voidScribe", 0.07], ["prismSentry", 0.05],
      ],
      apply(scene) {
        scene.stats.damage += 6;
        scene.playerMaxHealth += 15;
        scene.playerHealth = Math.min(scene.playerMaxHealth, scene.playerHealth + 15);
        scene.gainEmberCharge(28, "城墙破阵");
      },
    },
    {
      id: "rift-belfry",
      stage: 3,
      sigil: "隙",
      tag: "弹幕终局",
      name: "裂隙钟楼",
      description: "钟咏者与咒灯者控制高地；终夜首领会更频繁释放旋转暗潮。",
      reward: "攻速 +12% · 弹速 +40 · 弹幕缺口清晰可循",
      color: "#bca4ff",
      colorValue: COLORS.violet,
      themeColor: 0x59427c,
      spawnRate: 0.9,
      bossBias: "pulse",
      signatureEnemy: "cantor",
      enemyWeights: [
        ["gloamling", 0.09], ["shade", 0.02], ["wraith", 0.04], ["splitter", 0.05], ["hexer", 0.09],
        ["charger", 0.03], ["brute", 0.02], ["bulwark", 0.03], ["herald", 0.09],
        ["cantor", 0.12], ["frostOracle", 0.08], ["emberBomber", 0.08], ["echoDuelist", 0.11], ["voidScribe", 0.14], ["prismSentry", 0.1],
      ],
      apply(scene) {
        scene.stats.fireRate = Math.max(150, scene.stats.fireRate * 0.88);
        scene.stats.projectileSpeed += 40;
      },
    },
    {
      id: "broken-watch",
      stage: 3,
      sigil: "守",
      tag: "冲锋终局",
      name: "断墙守望",
      description: "震槌者与甲魇从断墙压境；终夜首领会更频繁锁定冲锋。",
      reward: "生命上限 +24 · 恢复 24 · 火种充能 +30",
      color: "#f2c84b",
      colorValue: COLORS.gold,
      themeColor: 0x6f6428,
      spawnRate: 0.98,
      bossBias: "charge",
      signatureEnemy: "rammer",
      enemyWeights: [
        ["gloamling", 0.1], ["shade", 0.04], ["wraith", 0.04], ["splitter", 0.06], ["hexer", 0.04],
        ["charger", 0.15], ["brute", 0.09], ["bulwark", 0.1], ["herald", 0.04],
        ["rammer", 0.12], ["blinkHunter", 0.07], ["emberBomber", 0.06], ["echoDuelist", 0.08], ["voidScribe", 0.06], ["prismSentry", 0.05],
      ],
      apply(scene) {
        scene.playerMaxHealth += 24;
        scene.playerHealth = Math.min(scene.playerMaxHealth, scene.playerHealth + 24);
        scene.gainEmberCharge(30, "断墙守望");
      },
    },
  ];

  const ARCHIVE_STORAGE_KEY = "last-light.meta.v1";
  const archiveSealCatalog = [
    { id: "dawn", sigil: "晓", name: "黎明印", description: "击败终夜首领" },
    { id: "patrol", sigil: "巡", name: "巡夜印", description: "完成两次巡夜并获胜" },
    { id: "lamp", sigil: "炽", name: "烈光印", description: "触发至少两次蓄光爆发并获胜" },
  ];
  const archiveStageTwoRoutes = routeCatalog.filter((route) => route.stage === 2);
  const archiveStageThreeRoutes = routeCatalog.filter((route) => route.stage === 3);
  const archiveBattlefieldIds = battlefieldCatalog.map((battlefield) => battlefield.id);
  const archiveRoutePairs = archiveStageTwoRoutes.flatMap((firstRoute) => (
    archiveStageThreeRoutes.map((secondRoute) => [firstRoute.id, secondRoute.id])
  ));
  const ARCHIVE_WEAPON_MAX = archiveBattlefieldIds.length * archiveRoutePairs.length * archiveSealCatalog.length;
  const ARCHIVE_TOTAL_MAX = weaponCatalog.length * ARCHIVE_WEAPON_MAX;
  let archiveStorageAvailable = true;

  function getArchiveRecordKey(weaponId, routePath, battlefieldId) {
    return [battlefieldId, weaponId, ...routePath].join("/");
  }

  function getLegacyArchiveRecordKey(weaponId, routePath) {
    return [weaponId, ...routePath].join("/");
  }

  function createEmptyArchive() {
    return { version: 2, records: {} };
  }

  function normalizeArchive(value) {
    const normalized = createEmptyArchive();
    const source = value && typeof value === "object" && value.records && typeof value.records === "object"
      ? value.records
      : {};
    archiveBattlefieldIds.forEach((battlefieldId) => {
      weaponCatalog.forEach((weapon) => {
        archiveRoutePairs.forEach((routePath) => {
          const key = getArchiveRecordKey(weapon.id, routePath, battlefieldId);
          const legacyKey = getLegacyArchiveRecordKey(weapon.id, routePath);
          const record = source[key] || (battlefieldId === "lantern-court" ? source[legacyKey] : null);
          if (!record || typeof record !== "object") return;
          const cleanRecord = Object.fromEntries(
            archiveSealCatalog.map((seal) => [seal.id, record[seal.id] === true]),
          );
          if (archiveSealCatalog.some((seal) => cleanRecord[seal.id])) {
            normalized.records[key] = cleanRecord;
          }
        });
      });
    });
    return normalized;
  }

  function loadExpeditionArchive() {
    try {
      const stored = window.localStorage.getItem(ARCHIVE_STORAGE_KEY);
      return stored ? normalizeArchive(JSON.parse(stored)) : createEmptyArchive();
    } catch (_error) {
      archiveStorageAvailable = false;
      return createEmptyArchive();
    }
  }

  let expeditionArchive = loadExpeditionArchive();

  function saveExpeditionArchive() {
    try {
      window.localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(expeditionArchive));
      archiveStorageAvailable = true;
    } catch (_error) {
      archiveStorageAvailable = false;
    }
  }

  function countArchiveSeals(record) {
    if (!record) return 0;
    return archiveSealCatalog.reduce((total, seal) => total + (record[seal.id] ? 1 : 0), 0);
  }

  function getArchiveRecord(weaponId, routePath, battlefieldId) {
    return expeditionArchive.records[getArchiveRecordKey(weaponId, routePath, battlefieldId)] || null;
  }

  function getWeaponArchiveScore(weaponId) {
    return archiveBattlefieldIds.reduce((battlefieldTotal, battlefieldId) => (
      battlefieldTotal + archiveRoutePairs.reduce((routeTotal, routePath) => (
        routeTotal + countArchiveSeals(getArchiveRecord(weaponId, routePath, battlefieldId))
      ), 0)
    ), 0);
  }

  function getTotalArchiveScore() {
    return weaponCatalog.reduce((total, weapon) => total + getWeaponArchiveScore(weapon.id), 0);
  }

  function renderArchiveProgress() {
    ui.archiveTotal.textContent = `${getTotalArchiveScore()}/${ARCHIVE_TOTAL_MAX}`;
    weaponCatalog.forEach((weapon) => {
      const mastery = ui.weaponOptions.querySelector(`[data-weapon-mastery="${weapon.id}"]`);
      if (mastery) mastery.textContent = `${getWeaponArchiveScore(weapon.id)}/${ARCHIVE_WEAPON_MAX} 印`;
    });
  }

  function getRouteArchiveScore(weaponId, battlefieldId, currentRoutePath, route) {
    if (route.stage === 3 && currentRoutePath.length === 1) {
      return countArchiveSeals(getArchiveRecord(weaponId, [currentRoutePath[0], route.id], battlefieldId));
    }
    if (route.stage === 2) {
      return archiveStageThreeRoutes.reduce((best, finalRoute) => Math.max(
        best,
        countArchiveSeals(getArchiveRecord(weaponId, [route.id, finalRoute.id], battlefieldId)),
      ), 0);
    }
    return 0;
  }

  function recordExpeditionRun(scene) {
    if (scene.routePath.length !== 2) {
      return { earnedIds: [], newIds: [], total: getTotalArchiveScore(), recorded: false };
    }
    const key = getArchiveRecordKey(scene.weaponProfile.id, scene.routePath, scene.battlefieldProfile.id);
    const previous = expeditionArchive.records[key] || {};
    const earnedIds = ["dawn"];
    if (scene.patrolCompleted >= PATROL_EVENT_SCHEDULE.length) earnedIds.push("patrol");
    if (scene.surgeCount >= 2) earnedIds.push("lamp");
    const newIds = earnedIds.filter((id) => previous[id] !== true);
    expeditionArchive.records[key] = {
      dawn: previous.dawn === true || earnedIds.includes("dawn"),
      patrol: previous.patrol === true || earnedIds.includes("patrol"),
      lamp: previous.lamp === true || earnedIds.includes("lamp"),
    };
    expeditionArchive = normalizeArchive(expeditionArchive);
    saveExpeditionArchive();
    renderArchiveProgress();
    return { earnedIds, newIds, total: getTotalArchiveScore(), recorded: true };
  }

  class NightScene extends Phaser.Scene {
    constructor() {
      super({ key: "NightScene" });
      this.runProfile = RUN_PROFILE;
    }

    preload() {
      this.load.svg("mirrorHarborBackground", "assets/mirror-harbor/mirror-harbor-bg.svg");
      this.load.svg("keeperArt", "assets/mirror-harbor/keeper.svg");
      this.load.svg("mirrorBossArt", "assets/mirror-harbor/tide-boss.svg");
      this.load.svg("tideweaverArt", "assets/mirror-harbor/tideweaver.svg");
      this.load.svg("harborLampArt", "assets/mirror-harbor/harbor-lamp.svg");
      this.load.svg("lastLightBeacon", "assets/survivor-pack/last-light-beacon.svg");
      this.load.svg("blinkHunterArt", "assets/survivor-pack/blink-hunter.svg");
      this.load.svg("frostOracleArt", "assets/survivor-pack/frost-oracle.svg");
      this.load.svg("emberBomberArt", "assets/survivor-pack/ember-bomber.svg");
      this.load.svg("echoDuelistArt", "assets/survivor-pack/echo-duelist.svg");
      this.load.svg("voidScribeArt", "assets/survivor-pack/void-scribe.svg");
      this.load.svg("prismSentryArt", "assets/survivor-pack/prism-sentry.svg");
    }

    create() {
      activeScene = this;
      this.battlefieldProfile = battlefieldCatalog.find((battlefield) => battlefield.id === selectedBattlefieldId)
        || battlefieldCatalog[0];
      this.stageController = null;
      this.started = false;
      this.ended = false;
      this.pausedByUser = false;
      this.isChoosing = false;
      this.choiceMode = null;
      this.currentUpgradeChoiceIds = [];
      this.upgradeRerollAct = 0;
      this.upgradeRerollAvailable = true;
      this.pendingRouteStage = null;
      this.routeChoicesSeen = new Set();
      this.routePath = [];
      this.activeRouteId = null;
      this.finalRouteId = null;
      this.elapsed = 0;
      this.gameplayTime = 0;
      this.spawnAccumulator = 0;
      this.lastShotAt = -9999;
      this.dawnCooldown = 4500;
      this.bossSpawned = false;
      this.bossAlive = false;
      this.boss = null;
      this.bossPreludeStarted = false;
      this.bossPreludeSecond = null;
      this.bossVulnerabilityNoticeAt = 0;
      this.priorityTarget = null;
      this.overtimeStarted = false;
      this.wavePhase = 0;
      this.patrolEventIndex = 0;
      this.activePatrolEvent = null;
      this.patrolCompleted = 0;
      this.patrolRelics = new Set();
      this.shopRelics = new Set();
      this.equippedShopRelics = new Map();
      this.shopRelicCapacity = 2;
      this.shopCurrency = QA_STARTING_CURRENCY;
      this.shopCurrencyEarned = QA_STARTING_CURRENCY;
      this.shopCurrencySpent = 0;
      this.shopCurrencyRefunded = 0;
      this.shopVisit = 0;
      this.pendingShopVisit = null;
      this.shopVisitsSeen = new Set();
      this.shopVisitsClosed = new Set();
      this.shopOffers = [];
      this.shopSlotsUsed = 0;
      this.shopRefreshUsed = false;
      this.shopPurchasedThisVisit = new Set();
      this.shopPurchaseHistory = [];
      this.shopRefreshHistory = [];
      this.shopSkipHistory = [];
      this.shopSaleHistory = [];
      this.secondaryWeaponId = null;
      this.secondaryWeaponIds = new Set();
      this.secondaryUpgradeIds = new Set();
      this.secondaryEffects = [];
      this.arrayLanceVolleyReady = false;
      this.lastSecondaryShotAt = Number.NEGATIVE_INFINITY;
      this.secondaryLastShotAt = new Map();
      this.secondaryTelemetry = {
        shots: 0,
        spawned: 0,
        hits: 0,
        damageApplied: 0,
        damageToHp: 0,
        criticalHits: 0,
        inheritedDamageBonus: 0,
        extraProjectilePowerHits: 0,
        maxExtraSecondaryUnits: 0,
        maxSecondaryUnitCount: 0,
        surgeDamageHits: 0,
        peakActive: 0,
        pullApplications: 0,
        pullTargets: 0,
        pullDistance: 0,
        maxPullDisplacement: 0,
        projectileCutChance: SWORD_WAVE_PROJECTILE_CUT_CHANCE,
        projectileCutCandidates: 0,
        projectilesCut: 0,
        maxProjectilesCutPerSwordWave: 0,
        maxProjectilesCutPerMeleeSecondary: 0,
        maxSwordWaveDistance: 0,
        maxSwordWaveEnemyHits: 0,
        arrayLanceDistinctTargetVolleys: 0,
        maxArrayLanceDistinctTargets: 0,
        dragonSweepTargets: 0,
        maxDragonSweepTargets: 0,
        maxDragonSweepHitsPerEnemy: 0,
        maxDragonLanceCount: 0,
        laserHits: 0,
        laserMaxAdvance: 0,
        projectileKinds: new Set(),
        fxStyles: new Set(),
        audioCues: new Set(),
        specialTriggers: new Set(),
        bySecondary: {},
      };
      this.primaryAttackTelemetry = {
        attackStyle: null,
        projectileCutChance: 0,
        projectileCutCandidates: 0,
        projectilesCut: 0,
        maxProjectilesCutPerAttack: 0,
        attacks: 0,
        hits: 0,
        damage: 0,
        kills: 0,
        maxTargetsPerAttack: 0,
        maxKillsPerAttack: 0,
        maxHitDistance: 0,
        maxFanAngle: 0,
        maxForwardProjection: 0,
        maxPerpendicularDistance: 0,
      };
      this.bossHazards = [];
      this.bossSummonTelemetry = {
        warnings: 0,
        releases: 0,
        maxActive: 0,
        phaseCounts: { 1: 0, 2: 0, 3: 0 },
        phasesSeen: new Set(),
        lastClearedAt: 0,
        nextAllowedAt: Number.POSITIVE_INFINITY,
      };
      this.bossPressureTelemetry = {
        pulseWaves: 0,
        pulseProjectiles: 0,
        pursuitVolleys: 0,
        pursuitProjectiles: 0,
      };
      this.bossCrowdTelemetry = {
        waves: 0,
        spawned: 0,
        kills: 0,
        maxActive: 0,
        phaseCounts: { 1: 0, 2: 0, 3: 0 },
      };
      this.precisionPrototypeTelemetry = {
        id: PRECISION_PROTOTYPE_ID,
        enabled: PRECISION_PROTOTYPE_MODE,
        expectedDurationSeconds: PRECISION_PROTOTYPE_RUN_PROFILE.runDuration,
        startedAt: null,
        finishedAt: null,
        outcome: null,
        eventCounts: Object.create(null),
        lastEvent: null,
        lastPlayerHit: null,
        tide: { lastWarning: null, lastResolution: null, lastHit: null },
        bossGap: { lastWarning: null, lastRelease: null, lastHit: null },
        perfectDodges: { count: 0, tide: false, bossGap: false, last: null },
        audioResume: {
          pointerdownAttempts: 0,
          successes: 0,
          blocked: 0,
          clickObserved: 0,
          beforeState: null,
          afterState: null,
          confirmationPlayed: false,
          confirmed: false,
          confirmationBlocked: false,
          lastAttempt: null,
          lastSuccess: null,
        },
        horde: {
          schedule: PRECISION_HORDE_BATCHES.map((item) => ({ ...item })),
          spawned: 0,
          activeNow: 0,
          activePeak: 0,
          timeAbove25Ms: 0,
          firstSpawnAt: null,
          lastSpawnAt: null,
          lastKillAt: null,
          kills: 0,
          killTimes: [],
          maxKillsInFiveSeconds: 0,
          comboAccents: 0,
        },
        trackerEvolution: {
          stage: "single",
          targetUpgradeOrder: ["lanternMark", "volley", "focus"],
          targetUpgrades: { lanternMark: 0, volley: 0, focus: 0 },
          autoGrantSchedule: PRECISION_TRACKER_AUTO_GRANTS.map((item) => ({ ...item })),
          autoGrantTimes: { lanternMark: null, volley: null, focus: null },
          autoGrantEvents: [],
          emberVolleyActive: false,
          projectileCount: 1,
          dualLateralSpacing: 0,
          dualVolleyOffsets: [],
          heavyVolleyEvery: 3,
          heavyProjectileCount: 7,
          heavyVolleyCount: 0,
          heavyVolleyOffsets: [],
          maxDualDistinctTargets: 0,
          maxHeavyDistinctTargets: 0,
          lastVolleyTargets: null,
          volleyTargetHistory: [],
          normalizedDamage: null,
          signatureCounter: 0,
          primaryAttackCounter: 0,
          emberVolleyAttackCounter: 0,
          directHits: 0,
          directKills: 0,
          lanternMarkDetonations: 0,
          emberVolleyTriggers: 0,
          lastDirectHit: null,
          lastHeavyImpact: null,
          lastVolleyOffsets: [],
          lastVolleyLateralOffsets: [],
        },
      };
      this.tidePerfectAwarded = false;
      this.bossGapPerfectAwarded = false;
      this.bossGapDodgeTracking = null;
      this.relicFireRateMultiplier = 1;
      this.actDamageTaken = false;
      this.combatUpgradeCount = 0;
      this.surgeDurationBonus = 0;
      this.watchScaleKills = 0;
      this.phaseBanner = null;
      this.kills = 0;
      this.level = 1;
      this.xp = 0;
      this.nextXp = 16;
      this.nextUpgradeAt = 6000;
      this.emberCharge = 0;
      this.emberChargeMax = 120;
      this.emberGainMultiplier = 1;
      this.surgeCount = 0;
      this.surgeUntil = 0;
      this.emberSurgeReadyAt = 0;
      this.playerMaxHealth = 100;
      this.playerHealth = 100;
      this.playerSlowedUntil = 0;
      this.upgradeLevels = Object.fromEntries(upgradeCatalog.map((upgrade) => [upgrade.id, 0]));
      this.activeSynergies = new Set();
      this.seenEnemyKinds = new Set();
      this.scriptedThreatsSpawned = new Set();
      this.spawnEdgeCounts = { top: 0, right: 0, bottom: 0, left: 0 };
      this.sharedVowUsed = false;
      this.nextCrownTickAt = 0;
      this.synergyFeedbackAt = Object.create(null);
      this.trackerFeedbackAt = Object.create(null);
      this.trackerHeavyImpactSeen = new Set();
      this.nextBossCrowdDamageNumberAt = 0;
      this.trackerRuntime = {
        stage: "single",
        targetUpgrades: { lanternMark: 0, volley: 0, focus: 0 },
        emberVolleyActive: false,
        projectileCount: 1,
        dualLateralSpacing: 0,
        dualVolleyOffsets: [],
        heavyVolleyEvery: 3,
        heavyProjectileCount: 7,
        heavyVolleyCount: 0,
        heavyVolleyOffsets: [],
        maxDualDistinctTargets: 0,
        maxHeavyDistinctTargets: 0,
        lastVolleyTargets: null,
        volleyTargetHistory: [],
        normalizedDamage: null,
        primaryAttackCounter: 0,
        emberVolleyAttackCounter: 0,
        directHits: 0,
        directKills: 0,
        emberVolleyTriggers: 0,
        lanternMarkDetonations: 0,
        lastHeavyImpact: null,
      };
      this.prototypeTrackerAutoGrantTimers = [];
      this.prototypeHordeTimers = [];
      this.pressureMeleeNextAt = Number.POSITIVE_INFINITY;
      this.pressureBruiserNextAt = Number.POSITIVE_INFINITY;
      this.pressureFodderKillCredit = 0;
      this.pressureBruiserKillCredit = 0;
      this.citySiegeNextAt = Number.POSITIVE_INFINITY;
      this.citySiegeWaveIndex = 0;
      this.citySiegeKillCredit = 0;
      this.nextScatterKillAccentAt = 0;
      this.prototypeAudioPrompt = null;
      this.nextEnemyId = 1;
      this.chainHitCounter = 0;
      this.arcNodes = [];
      this.arcNodeSequence = 0;
      this.signatureCounter = 0;
      this.playerTrailVfxCredit = 0;
      this.enemyTrailVfxCredit = 0;
      this.deathVfxActive = 0;
      this.aegisReadyAt = 0;
      this.aegisWasReady = false;
      this.dashReadyAt = 0;
      this.dashCooldown = DASH_COOLDOWN;
      this.dashUntil = 0;
      this.dashInvulnerableUntil = 0;
      this.nextDashTrailAt = 0;
      this.nextDashNoticeAt = 0;
      this.dashAfterglowArmed = false;
      this.volleySide = 1;
      this.lastMoveVector = new Phaser.Math.Vector2(0, -1);
      this.weaponProfile = weaponCatalog.find((weapon) => weapon.id === selectedWeaponId) || weaponCatalog[0];
      this.primaryAttackTelemetry.attackStyle = this.weaponProfile.attackStyle || "projectile";
      this.primaryAttackTelemetry.projectileCutChance = this.weaponProfile.attackStyle?.startsWith("melee-")
        ? MELEE_PROJECTILE_CUT_CHANCE
        : 0;
      this.stats = {
        speed: 220,
        damage: this.weaponProfile.damage,
        fireRate: this.weaponProfile.fireRate,
        projectileCount: this.weaponProfile.projectileCount,
        projectileSpeed: this.weaponProfile.projectileSpeed,
        pickupRadius: 165,
        orbitLevel: 0,
        dawnLevel: 0,
        frostLevel: 0,
        chainLevel: 0,
        aegisLevel: 0,
        afterglowLevel: 0,
        signatureLevel: 0,
        criticalChance: 0,
        blazeLevel: 0,
        rangeBonus: 0,
        thornsLevel: 0,
      };

      this.createTextures();
      this.createArena();
      this.createActors();
      this.createGroups();
      this.createInput();
      this.createCollisions();
      this.createBattlefieldMechanics();
      this.resetDom();
      this.updateHud(true);

      this.scale.on("resize", this.handleResize, this);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.scale.off("resize", this.handleResize, this);
        this.stageController?.destroy();
        if (activeScene === this) activeScene = null;
      });

      if (autoStartOnCreate) {
        autoStartOnCreate = false;
        this.time.delayedCall(70, () => this.startRun());
      }
    }

    createTextures() {
      if (this.textures.exists("keeper")) return;
      const graphics = this.make.graphics({ x: 0, y: 0, add: false });

      graphics.fillStyle(0x13262a, 1);
      graphics.fillTriangle(22, 15, 5, 48, 39, 48);
      graphics.fillStyle(COLORS.cyan, 1);
      graphics.fillCircle(22, 13, 8);
      graphics.fillStyle(0xe8f8f3, 1);
      graphics.fillCircle(25, 11, 2);
      graphics.lineStyle(2, COLORS.gold, 1);
      graphics.strokeCircle(22, 31, 7);
      graphics.generateTexture("keeper", 44, 52);
      graphics.clear();

      graphics.fillStyle(0x162a2d, 1);
      graphics.fillRect(30, 48, 34, 54);
      graphics.fillStyle(0x233c3d, 1);
      graphics.fillTriangle(20, 104, 77, 104, 66, 86);
      graphics.fillStyle(0xd99e37, 1);
      graphics.fillRect(25, 24, 44, 31);
      graphics.lineStyle(3, COLORS.gold, 1);
      graphics.strokeRect(25, 24, 44, 31);
      graphics.fillStyle(COLORS.gold, 0.75);
      graphics.fillCircle(47, 39, 11);
      graphics.fillStyle(0xfff2a6, 1);
      graphics.fillTriangle(47, 25, 39, 45, 55, 45);
      graphics.lineStyle(4, 0x263a3d, 1);
      graphics.beginPath();
      graphics.moveTo(18, 102);
      graphics.lineTo(77, 102);
      graphics.strokePath();
      graphics.generateTexture("lamp", 96, 112);
      graphics.clear();

      graphics.fillStyle(0x1b171d, 1);
      graphics.fillEllipse(17, 20, 30, 32);
      graphics.fillTriangle(3, 19, 31, 19, 25, 39);
      graphics.fillStyle(COLORS.red, 1);
      graphics.fillCircle(11, 18, 2);
      graphics.fillCircle(23, 18, 2);
      graphics.generateTexture("shade", 34, 42);
      graphics.clear();

      graphics.fillStyle(0x4a242b, 1);
      graphics.fillEllipse(17, 20, 30, 32);
      graphics.fillTriangle(3, 19, 31, 19, 25, 39);
      graphics.lineStyle(2, 0xff8b7f, 0.9);
      graphics.strokeEllipse(17, 20, 30, 32);
      graphics.beginPath();
      graphics.moveTo(3, 19);
      graphics.lineTo(25, 39);
      graphics.lineTo(31, 19);
      graphics.strokePath();
      graphics.fillStyle(0xffeee8, 1);
      graphics.fillCircle(11, 18, 2.2);
      graphics.fillCircle(23, 18, 2.2);
      graphics.generateTexture("shadeHarbor", 34, 42);
      graphics.clear();

      graphics.fillStyle(0x241215, 1);
      graphics.fillEllipse(16, 16, 27, 22);
      graphics.fillTriangle(4, 14, 0, 5, 12, 11);
      graphics.fillTriangle(28, 14, 32, 5, 20, 11);
      graphics.fillTriangle(8, 24, 16, 34, 24, 24);
      graphics.lineStyle(2, 0xe56b58, 0.9);
      graphics.lineBetween(5, 18, 0, 25);
      graphics.lineBetween(27, 18, 32, 25);
      graphics.fillStyle(0xffd0c7, 1);
      graphics.fillCircle(11, 15, 2);
      graphics.fillCircle(21, 15, 2);
      graphics.generateTexture("gloamling", 32, 35);
      graphics.clear();

      graphics.fillStyle(0x271a33, 0.96);
      graphics.fillTriangle(15, 1, 2, 34, 28, 34);
      graphics.fillStyle(COLORS.violet, 0.95);
      graphics.fillCircle(11, 16, 2);
      graphics.fillCircle(19, 16, 2);
      graphics.lineStyle(1, COLORS.violet, 0.65);
      graphics.strokeCircle(15, 16, 11);
      graphics.generateTexture("wraith", 30, 37);
      graphics.clear();

      graphics.fillStyle(0x2f1717, 1);
      graphics.fillRoundedRect(3, 8, 44, 42, 7);
      graphics.fillStyle(COLORS.red, 0.8);
      graphics.fillRect(7, 15, 36, 5);
      graphics.fillStyle(0xf3b0a7, 1);
      graphics.fillCircle(16, 28, 3);
      graphics.fillCircle(34, 28, 3);
      graphics.generateTexture("brute", 50, 54);
      graphics.clear();

      graphics.fillStyle(0x24151b, 1);
      graphics.fillTriangle(20, 1, 3, 25, 20, 47);
      graphics.fillTriangle(20, 1, 37, 25, 20, 47);
      graphics.lineStyle(2, COLORS.goldHot, 0.9);
      graphics.beginPath();
      graphics.moveTo(20, 7);
      graphics.lineTo(14, 21);
      graphics.lineTo(23, 26);
      graphics.lineTo(17, 40);
      graphics.strokePath();
      graphics.fillStyle(COLORS.red, 1);
      graphics.fillCircle(15, 20, 2);
      graphics.fillCircle(25, 20, 2);
      graphics.generateTexture("splitter", 40, 48);
      graphics.clear();

      graphics.fillStyle(0x2b1820, 0.96);
      graphics.fillTriangle(10, 0, 1, 22, 19, 22);
      graphics.fillStyle(COLORS.goldHot, 0.95);
      graphics.fillCircle(10, 11, 2);
      graphics.generateTexture("shard", 20, 24);
      graphics.clear();

      graphics.fillStyle(0x1d1530, 1);
      graphics.fillCircle(21, 14, 13);
      graphics.fillTriangle(5, 17, 37, 17, 31, 48);
      graphics.lineStyle(2, COLORS.violet, 0.82);
      graphics.strokeCircle(21, 15, 10);
      graphics.fillStyle(0xe7d7ff, 1);
      graphics.fillCircle(17, 14, 2);
      graphics.fillCircle(25, 14, 2);
      graphics.fillStyle(COLORS.violet, 0.45);
      graphics.fillCircle(21, 34, 7);
      graphics.generateTexture("hexer", 42, 50);
      graphics.clear();

      graphics.fillStyle(0x152628, 1);
      graphics.fillRoundedRect(5, 5, 44, 49, 6);
      graphics.fillStyle(0x203c3e, 1);
      graphics.fillTriangle(27, 2, 8, 19, 12, 48);
      graphics.fillTriangle(27, 2, 46, 19, 42, 48);
      graphics.lineStyle(3, COLORS.armor, 0.92);
      graphics.strokeRoundedRect(8, 8, 38, 43, 6);
      graphics.fillStyle(COLORS.armor, 1);
      graphics.fillCircle(21, 23, 2);
      graphics.fillCircle(33, 23, 2);
      graphics.generateTexture("bulwark", 54, 58);
      graphics.clear();

      graphics.fillStyle(0x30151a, 1);
      graphics.fillTriangle(3, 21, 35, 3, 45, 21);
      graphics.fillTriangle(3, 21, 35, 39, 45, 21);
      graphics.lineStyle(3, COLORS.goldHot, 0.92);
      graphics.lineBetween(9, 21, 39, 21);
      graphics.fillStyle(0xffd0a0, 1);
      graphics.fillCircle(33, 17, 2);
      graphics.fillCircle(33, 25, 2);
      graphics.generateTexture("charger", 48, 42);
      graphics.clear();

      graphics.fillStyle(0x13241d, 1);
      graphics.fillCircle(24, 18, 15);
      graphics.fillTriangle(8, 21, 40, 21, 32, 51);
      graphics.lineStyle(2, COLORS.green, 0.86);
      graphics.strokeCircle(24, 18, 11);
      graphics.strokeCircle(24, 18, 6);
      graphics.fillStyle(0xd8ffe2, 1);
      graphics.fillCircle(24, 18, 3);
      graphics.generateTexture("herald", 48, 52);
      graphics.clear();

      graphics.fillStyle(0x1b1230, 1);
      graphics.fillCircle(24, 18, 15);
      graphics.fillTriangle(11, 18, 37, 18, 42, 46);
      graphics.lineStyle(2, COLORS.violet, 0.9);
      graphics.strokeCircle(24, 18, 11);
      graphics.lineBetween(14, 35, 38, 35);
      graphics.lineBetween(17, 41, 39, 41);
      graphics.fillStyle(0xf2e9ff, 1);
      graphics.fillCircle(24, 17, 3);
      graphics.fillStyle(COLORS.gold, 0.9);
      graphics.fillCircle(28, 42, 3);
      graphics.generateTexture("cantor", 48, 52);
      graphics.clear();

      graphics.fillStyle(0x2c1a16, 1);
      graphics.fillRoundedRect(4, 7, 50, 45, 7);
      graphics.fillStyle(0x4a2920, 1);
      graphics.fillRect(8, 12, 42, 14);
      graphics.lineStyle(3, COLORS.goldHot, 0.9);
      graphics.strokeRoundedRect(7, 10, 44, 38, 6);
      graphics.lineBetween(16, 28, 43, 28);
      graphics.lineBetween(29, 29, 29, 50);
      graphics.fillStyle(0xffddad, 1);
      graphics.fillCircle(21, 20, 3);
      graphics.fillCircle(38, 20, 3);
      graphics.generateTexture("rammer", 58, 56);
      graphics.clear();

      graphics.fillStyle(0x171126, 1);
      graphics.fillCircle(24, 18, 15);
      graphics.fillTriangle(8, 20, 40, 20, 34, 52);
      graphics.lineStyle(2, COLORS.violet, 0.9);
      graphics.strokeCircle(24, 18, 11);
      graphics.lineBetween(13, 35, 39, 35);
      graphics.fillStyle(0xf7edff, 1);
      graphics.fillCircle(24, 17, 3);
      graphics.fillStyle(COLORS.gold, 0.9);
      graphics.fillTriangle(34, 28, 48, 23, 48, 33);
      graphics.generateTexture("devourerRanged", 52, 56);
      graphics.clear();

      graphics.fillStyle(0x231014, 1);
      graphics.fillCircle(24, 18, 15);
      graphics.fillTriangle(7, 20, 41, 20, 31, 54);
      graphics.lineStyle(3, COLORS.red, 0.88);
      graphics.strokeCircle(24, 18, 11);
      graphics.lineBetween(10, 39, 38, 28);
      graphics.fillStyle(0xffeee9, 1);
      graphics.fillCircle(19, 17, 2);
      graphics.fillCircle(29, 17, 2);
      graphics.generateTexture("devourerChaser", 48, 56);
      graphics.clear();

      graphics.fillStyle(0x171124, 1);
      graphics.fillCircle(34, 34, 29);
      graphics.lineStyle(3, COLORS.violet, 0.9);
      graphics.strokeCircle(34, 34, 24);
      graphics.lineStyle(2, 0xd8c4ff, 0.66);
      graphics.strokeCircle(34, 34, 15);
      graphics.fillStyle(COLORS.violet, 0.74);
      graphics.fillTriangle(34, 4, 42, 27, 26, 27);
      graphics.fillTriangle(34, 64, 42, 41, 26, 41);
      graphics.fillTriangle(4, 34, 27, 26, 27, 42);
      graphics.fillTriangle(64, 34, 41, 26, 41, 42);
      graphics.fillStyle(0xf1eaff, 1);
      graphics.fillCircle(34, 34, 5);
      graphics.generateTexture("rift", 68, 68);
      graphics.clear();

      graphics.fillStyle(0x120b0c, 1);
      graphics.fillCircle(52, 52, 46);
      graphics.fillStyle(0x351416, 1);
      graphics.fillTriangle(8, 42, 21, 1, 37, 34);
      graphics.fillTriangle(96, 42, 83, 1, 67, 34);
      graphics.lineStyle(4, COLORS.red, 0.9);
      graphics.strokeCircle(52, 52, 36);
      graphics.fillStyle(COLORS.red, 1);
      graphics.fillCircle(36, 48, 5);
      graphics.fillCircle(68, 48, 5);
      graphics.fillStyle(0xf3b0a7, 0.7);
      graphics.fillTriangle(52, 55, 43, 73, 61, 73);
      graphics.generateTexture("boss", 104, 104);
      graphics.clear();

      graphics.fillStyle(COLORS.gold, 0.12);
      graphics.fillEllipse(19, 10, 38, 17);
      graphics.fillStyle(COLORS.goldHot, 0.34);
      graphics.fillTriangle(0, 10, 18, 3, 18, 17);
      graphics.lineStyle(1, COLORS.gold, 0.74);
      graphics.strokeCircle(21, 10, 7);
      graphics.fillStyle(COLORS.gold, 0.95);
      graphics.fillTriangle(8, 10, 22, 2, 38, 10);
      graphics.fillTriangle(8, 10, 22, 18, 38, 10);
      graphics.fillStyle(0xfff8d2, 1);
      graphics.fillTriangle(16, 10, 25, 6, 34, 10);
      graphics.fillTriangle(16, 10, 25, 14, 34, 10);
      graphics.fillCircle(22, 10, 2);
      graphics.generateTexture("bolt", 38, 20);
      graphics.clear();

      graphics.fillStyle(0xff9f43, 0.18);
      graphics.fillCircle(14, 14, 13);
      graphics.fillStyle(0x6f2f16, 1);
      graphics.fillRoundedRect(7, 6, 14, 18, 4);
      graphics.lineStyle(2, 0xffe29a, 0.96);
      graphics.strokeRoundedRect(7, 6, 14, 18, 4);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRect(11, 2, 6, 5);
      graphics.fillStyle(COLORS.goldHot, 1);
      graphics.fillTriangle(8, 21, 14, 12, 20, 21);
      graphics.generateTexture("secondaryBottle", 28, 28);
      graphics.clear();

      graphics.fillStyle(0xfff1ad, 0.18);
      graphics.fillEllipse(19, 8, 38, 16);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillTriangle(0, 8, 20, 2, 38, 8);
      graphics.fillTriangle(0, 8, 20, 14, 38, 8);
      graphics.lineStyle(1, COLORS.gold, 1);
      graphics.lineBetween(7, 8, 34, 8);
      graphics.generateTexture("secondaryDart", 38, 16);
      graphics.clear();

      graphics.fillStyle(0x05070d, 1);
      graphics.fillCircle(18, 18, 13);
      graphics.lineStyle(3, 0x83e9df, 0.94);
      graphics.strokeCircle(18, 18, 15);
      graphics.lineStyle(1, COLORS.gold, 0.86);
      graphics.strokeCircle(18, 18, 10);
      graphics.fillStyle(0xffffff, 0.92);
      graphics.fillCircle(15, 14, 2);
      graphics.generateTexture("secondaryCore", 36, 36);
      graphics.clear();

      graphics.fillStyle(0xef7563, 0.14);
      graphics.fillCircle(12, 10, 10);
      graphics.fillStyle(0xef7563, 0.5);
      graphics.fillTriangle(0, 10, 12, 5, 24, 10);
      graphics.fillTriangle(0, 10, 12, 15, 24, 10);
      graphics.fillTriangle(12, 0, 8, 10, 12, 20);
      graphics.fillTriangle(12, 0, 16, 10, 12, 20);
      graphics.fillStyle(0xffd8d1, 1);
      graphics.fillTriangle(5, 10, 13, 6, 21, 10);
      graphics.fillTriangle(5, 10, 13, 14, 21, 10);
      graphics.fillCircle(13, 10, 2);
      graphics.generateTexture("scatterBolt", 24, 20);
      graphics.clear();

      graphics.fillStyle(0xef7563, 0.16);
      graphics.fillEllipse(22, 10, 44, 18);
      graphics.fillStyle(0xef7563, 0.72);
      graphics.fillTriangle(3, 10, 31, 3, 43, 10);
      graphics.fillTriangle(3, 10, 31, 17, 43, 10);
      graphics.fillStyle(0xfff3ef, 1);
      graphics.fillTriangle(8, 10, 33, 6, 42, 10);
      graphics.fillTriangle(8, 10, 33, 14, 42, 10);
      graphics.lineStyle(2, 0xffbaaa, 0.95);
      graphics.lineBetween(9, 4, 9, 16);
      graphics.fillStyle(0xffe1d8, 1);
      graphics.fillCircle(7, 10, 3);
      graphics.generateTexture("scatterBlade", 44, 20);
      graphics.clear();

      for (let index = 0; index < 6; index += 1) {
        const angle = (index / 6) * Math.PI * 2;
        const tipX = 32 + Math.cos(angle) * 30;
        const tipY = 32 + Math.sin(angle) * 30;
        const leftX = 32 + Math.cos(angle + Math.PI / 2) * 5;
        const leftY = 32 + Math.sin(angle + Math.PI / 2) * 5;
        const rightX = 32 + Math.cos(angle - Math.PI / 2) * 5;
        const rightY = 32 + Math.sin(angle - Math.PI / 2) * 5;
        graphics.fillStyle(index % 2 ? 0xffb09f : 0xef7563, 0.86);
        graphics.fillTriangle(leftX, leftY, tipX, tipY, rightX, rightY);
        graphics.lineStyle(1, 0xfff3ef, 0.92);
        graphics.lineBetween(32, 32, tipX, tipY);
      }
      graphics.fillStyle(0x341316, 1);
      graphics.fillCircle(32, 32, 8);
      graphics.lineStyle(2, 0xffd1c5, 0.95);
      graphics.strokeCircle(32, 32, 7);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(32, 32, 3);
      graphics.generateTexture("scatterMine", 64, 64);
      graphics.clear();

      graphics.fillStyle(COLORS.armor, 0.12);
      graphics.fillEllipse(29, 10, 58, 18);
      graphics.fillStyle(COLORS.armor, 0.35);
      graphics.fillTriangle(0, 10, 42, 2, 58, 10);
      graphics.fillTriangle(0, 10, 42, 18, 58, 10);
      graphics.fillStyle(COLORS.armor, 0.92);
      graphics.fillTriangle(7, 10, 43, 5, 58, 10);
      graphics.fillTriangle(7, 10, 43, 15, 58, 10);
      graphics.fillStyle(0xeafffb, 1);
      graphics.fillTriangle(16, 10, 47, 8, 57, 10);
      graphics.fillTriangle(16, 10, 47, 12, 57, 10);
      graphics.generateTexture("lanceBolt", 58, 20);
      graphics.clear();

      graphics.fillStyle(COLORS.armor, 0.1);
      graphics.fillEllipse(96, 16, 190, 28);
      graphics.fillStyle(0x173f42, 1);
      graphics.fillRect(8, 12, 132, 8);
      graphics.fillStyle(0x7de9de, 1);
      graphics.fillRect(12, 14, 132, 4);
      graphics.lineStyle(2, 0xeafffb, 0.92);
      graphics.lineBetween(14, 13, 138, 13);
      for (let wrapX = 28; wrapX <= 124; wrapX += 24) {
        graphics.lineStyle(2, 0x2c7775, 0.9);
        graphics.lineBetween(wrapX, 11, wrapX + 8, 21);
      }
      graphics.fillStyle(0x0c292c, 1);
      graphics.fillTriangle(132, 5, 145, 16, 132, 27);
      graphics.fillStyle(COLORS.armor, 0.96);
      graphics.fillTriangle(138, 16, 166, 3, 191, 16);
      graphics.fillTriangle(138, 16, 166, 29, 191, 16);
      graphics.fillStyle(0xf4fffd, 1);
      graphics.fillTriangle(151, 16, 173, 10, 190, 16);
      graphics.fillTriangle(151, 16, 173, 22, 190, 16);
      graphics.generateTexture("lanceThrust", 192, 32);
      graphics.clear();

      graphics.fillStyle(0xc19cff, 0.1);
      graphics.fillCircle(20, 20, 19);
      graphics.lineStyle(5, 0xc19cff, 0.86);
      graphics.beginPath();
      graphics.arc(20, 20, 12, -2.28, 2.28, false);
      graphics.strokePath();
      graphics.lineStyle(2, COLORS.ice, 0.92);
      graphics.beginPath();
      graphics.arc(20, 20, 8, -2.15, 2.15, false);
      graphics.strokePath();
      graphics.fillStyle(0xece2ff, 0.96);
      graphics.fillTriangle(10, 10, 5, 13, 10, 17);
      graphics.fillTriangle(10, 23, 5, 27, 10, 30);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(20, 20, 3);
      graphics.generateTexture("returnBolt", 40, 40);
      graphics.clear();

      graphics.fillStyle(0x8fe7ff, 0.12);
      graphics.fillCircle(16, 16, 15);
      graphics.lineStyle(3, 0x8fe7ff, 0.9);
      graphics.beginPath();
      graphics.moveTo(4, 17);
      graphics.lineTo(12, 9);
      graphics.lineTo(17, 18);
      graphics.lineTo(27, 7);
      graphics.strokePath();
      graphics.fillStyle(0xf2fdff, 1);
      graphics.fillCircle(17, 18, 4);
      graphics.generateTexture("arcBolt", 32, 32);
      graphics.clear();

      graphics.fillStyle(0xffcf62, 0.14);
      graphics.fillCircle(20, 20, 19);
      graphics.lineStyle(3, 0xffcf62, 0.88);
      graphics.strokeCircle(20, 20, 13);
      graphics.lineStyle(1, 0xffffff, 0.7);
      graphics.strokeCircle(20, 20, 8);
      graphics.fillStyle(0xff765c, 0.92);
      graphics.fillCircle(20, 20, 7);
      graphics.fillStyle(0xfff7ce, 1);
      graphics.fillCircle(18, 17, 3);
      graphics.generateTexture("novaBolt", 40, 40);
      graphics.clear();

      graphics.fillStyle(COLORS.violet, 0.12);
      graphics.fillCircle(14, 14, 14);
      graphics.lineStyle(2, COLORS.violet, 0.55);
      graphics.strokeCircle(14, 14, 10);
      graphics.lineStyle(1, 0xe7d7ff, 0.6);
      graphics.strokeCircle(14, 14, 6);
      graphics.fillStyle(COLORS.violet, 0.56);
      graphics.fillTriangle(2, 14, 14, 10, 26, 14);
      graphics.fillTriangle(2, 14, 14, 18, 26, 14);
      graphics.fillStyle(0xf4edff, 1);
      graphics.fillCircle(14, 14, 5);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(16, 12, 2);
      graphics.generateTexture("enemyShot", 28, 28);
      graphics.clear();

      graphics.fillStyle(0xff6d79, 0.18);
      graphics.fillTriangle(0, 10, 19, 1, 15, 10);
      graphics.fillTriangle(36, 10, 17, 1, 21, 10);
      graphics.fillStyle(0x43d9d0, 0.92);
      graphics.fillTriangle(2, 10, 19, 5, 15, 10);
      graphics.fillTriangle(34, 10, 17, 5, 21, 10);
      graphics.lineStyle(2, 0xffe3dd, 0.9);
      graphics.lineBetween(5, 10, 31, 10);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(18, 10, 3);
      graphics.generateTexture("enemyBlade", 36, 20);
      graphics.clear();

      const createBossShotTexture = (key, color, coreColor) => {
        graphics.fillStyle(color, 0.12);
        graphics.fillCircle(18, 18, 18);
        graphics.lineStyle(2, color, 0.66);
        graphics.strokeCircle(18, 18, 13);
        graphics.lineStyle(1, coreColor, 0.5);
        graphics.strokeCircle(18, 18, 9);
        graphics.fillStyle(color, 0.56);
        graphics.fillTriangle(18, 0, 14, 18, 22, 18);
        graphics.fillTriangle(18, 36, 14, 18, 22, 18);
        graphics.fillTriangle(0, 18, 18, 14, 18, 22);
        graphics.fillTriangle(36, 18, 18, 14, 18, 22);
        graphics.fillStyle(color, 1);
        graphics.fillCircle(18, 18, 7);
        graphics.fillStyle(coreColor, 1);
        graphics.fillCircle(18, 18, 3);
        graphics.generateTexture(key, 36, 36);
        graphics.clear();
      };
      createBossShotTexture("bossShotRed", COLORS.red, 0xffe2dc);
      createBossShotTexture("bossShotGold", COLORS.goldHot, 0xfff6c4);

      graphics.fillStyle(0xffffff, 0.035);
      graphics.fillCircle(24, 24, 23);
      graphics.fillStyle(0xffffff, 0.055);
      graphics.fillCircle(24, 24, 17);
      graphics.fillStyle(0xffffff, 0.09);
      graphics.fillCircle(24, 24, 12);
      graphics.fillStyle(0xffffff, 0.2);
      graphics.fillCircle(24, 24, 7);
      graphics.fillStyle(0xffffff, 0.9);
      graphics.fillCircle(24, 24, 2);
      graphics.generateTexture("fxGlow", 48, 48);
      graphics.clear();

      graphics.fillStyle(0xffffff, 0.08);
      graphics.fillEllipse(16, 16, 32, 8);
      graphics.fillEllipse(16, 16, 8, 32);
      graphics.fillStyle(0xffffff, 0.38);
      graphics.fillTriangle(16, 0, 12, 16, 20, 16);
      graphics.fillTriangle(16, 32, 12, 16, 20, 16);
      graphics.fillTriangle(0, 16, 16, 12, 16, 20);
      graphics.fillTriangle(32, 16, 16, 12, 16, 20);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(16, 16, 3);
      graphics.generateTexture("fxStar", 32, 32);
      graphics.clear();

      graphics.fillStyle(0xffffff, 0.1);
      graphics.fillEllipse(14, 6, 28, 12);
      graphics.fillStyle(0xffffff, 0.52);
      graphics.fillTriangle(0, 6, 18, 1, 28, 6);
      graphics.fillTriangle(0, 6, 18, 11, 28, 6);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillTriangle(7, 6, 20, 4, 27, 6);
      graphics.fillTriangle(7, 6, 20, 8, 27, 6);
      graphics.generateTexture("fxShard", 28, 12);
      graphics.clear();

      graphics.fillStyle(0xffffff, 0.08);
      graphics.fillEllipse(24, 7, 48, 14);
      graphics.fillStyle(0xffffff, 0.3);
      graphics.fillTriangle(0, 7, 38, 1, 48, 7);
      graphics.fillTriangle(0, 7, 38, 13, 48, 7);
      graphics.fillStyle(0xffffff, 0.92);
      graphics.fillTriangle(10, 7, 41, 5, 48, 7);
      graphics.fillTriangle(10, 7, 41, 9, 48, 7);
      graphics.generateTexture("fxSlash", 48, 14);
      graphics.clear();

      const sweepStart = -0.84;
      const sweepEnd = 0.84;
      const sweepInnerStart = -0.61;
      const sweepInnerEnd = 0.61;
      graphics.lineStyle(22, 0xef7563, 0.12);
      graphics.beginPath();
      graphics.arc(128, 128, 101, sweepStart, sweepEnd, false);
      graphics.strokePath();
      graphics.fillStyle(0xef7563, 0.52);
      graphics.beginPath();
      graphics.moveTo(128 + Math.cos(sweepStart) * 112, 128 + Math.sin(sweepStart) * 112);
      graphics.arc(128, 128, 112, sweepStart, sweepEnd, false);
      graphics.lineTo(128 + Math.cos(sweepInnerEnd) * 90, 128 + Math.sin(sweepInnerEnd) * 90);
      graphics.arc(128, 128, 90, sweepInnerEnd, sweepInnerStart, true);
      graphics.closePath();
      graphics.fillPath();
      graphics.lineStyle(7, 0xffb49f, 0.64);
      graphics.beginPath();
      graphics.arc(128, 128, 106, sweepStart + 0.035, sweepEnd - 0.035, false);
      graphics.strokePath();
      graphics.lineStyle(2, 0xffffff, 1);
      graphics.beginPath();
      graphics.arc(128, 128, 111, sweepStart + 0.055, sweepEnd - 0.055, false);
      graphics.strokePath();
      graphics.lineStyle(2, 0xffd8cf, 0.72);
      graphics.beginPath();
      graphics.arc(128, 128, 92, sweepInnerStart + 0.05, sweepInnerEnd - 0.05, false);
      graphics.strokePath();
      graphics.generateTexture("scatterSweep", 256, 256);
      graphics.clear();

      graphics.fillStyle(0x7b2036, 0.24);
      graphics.beginPath();
      graphics.moveTo(28, 56);
      graphics.lineTo(52, 35);
      graphics.lineTo(78, 38);
      graphics.lineTo(105, 12);
      graphics.lineTo(126, 35);
      graphics.lineTo(164, 27);
      graphics.lineTo(188, 56);
      graphics.lineTo(164, 85);
      graphics.lineTo(126, 77);
      graphics.lineTo(105, 100);
      graphics.lineTo(78, 74);
      graphics.lineTo(52, 79);
      graphics.closePath();
      graphics.fillPath();
      graphics.fillStyle(0xff705f, 0.78);
      graphics.beginPath();
      graphics.moveTo(38, 56);
      graphics.lineTo(70, 35);
      graphics.lineTo(135, 40);
      graphics.lineTo(188, 56);
      graphics.lineTo(135, 72);
      graphics.lineTo(70, 77);
      graphics.closePath();
      graphics.fillPath();
      graphics.lineStyle(3, 0xffa07f, 0.66);
      graphics.beginPath();
      graphics.moveTo(55, 54);
      graphics.lineTo(132, 43);
      graphics.lineTo(181, 56);
      graphics.strokePath();
      graphics.beginPath();
      graphics.moveTo(55, 58);
      graphics.lineTo(132, 69);
      graphics.lineTo(181, 56);
      graphics.strokePath();
      graphics.fillStyle(0xfff1bd, 0.96);
      graphics.beginPath();
      graphics.moveTo(62, 56);
      graphics.lineTo(88, 49);
      graphics.lineTo(151, 51);
      graphics.lineTo(187, 56);
      graphics.lineTo(151, 61);
      graphics.lineTo(88, 63);
      graphics.closePath();
      graphics.fillPath();
      graphics.lineStyle(2, 0xffffff, 0.98);
      graphics.lineBetween(82, 56, 183, 56);
      graphics.fillStyle(0xffd38e, 0.82);
      [[88, 42], [119, 69], [145, 45]].forEach(([x, y]) => {
        graphics.fillTriangle(x, y - 4, x + 4, y, x, y + 4);
        graphics.fillTriangle(x, y - 4, x - 4, y, x, y + 4);
      });
      graphics.fillStyle(0xffffff, 0.92);
      graphics.fillCircle(157, 67, 2);
      graphics.generateTexture("starSwordWave", 192, 112);
      graphics.clear();

      for (let index = 0; index < 4; index += 1) {
        const start = index * Math.PI / 2 + 0.15;
        const end = start + Math.PI / 2 - 0.3;
        graphics.lineStyle(24, 0xef7563, 0.12);
        graphics.beginPath();
        graphics.arc(150, 150, 116, start, end, false);
        graphics.strokePath();
        graphics.lineStyle(12, index % 2 ? 0xffa08c : 0xef7563, 0.72);
        graphics.beginPath();
        graphics.arc(150, 150, 116, start, end, false);
        graphics.strokePath();
        graphics.lineStyle(4, 0xffd0c4, 0.9);
        graphics.beginPath();
        graphics.arc(150, 150, 121, start + 0.02, end - 0.02, false);
        graphics.strokePath();
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.beginPath();
        graphics.arc(150, 150, 124, start + 0.05, end - 0.05, false);
        graphics.strokePath();
      }
      graphics.generateTexture("scatterRingBlade", 300, 300);
      graphics.clear();

      graphics.lineStyle(2, 0xffffff, 0.72);
      graphics.strokeCircle(32, 32, 23);
      graphics.lineStyle(1, 0xffffff, 0.24);
      graphics.strokeCircle(32, 32, 16);
      graphics.lineStyle(2, 0xffffff, 0.66);
      graphics.lineBetween(32, 1, 32, 10);
      graphics.lineBetween(32, 54, 32, 63);
      graphics.lineBetween(1, 32, 10, 32);
      graphics.lineBetween(54, 32, 63, 32);
      graphics.fillStyle(0xffffff, 0.82);
      graphics.fillCircle(13, 13, 2);
      graphics.fillCircle(51, 13, 2);
      graphics.fillCircle(13, 51, 2);
      graphics.fillCircle(51, 51, 2);
      graphics.generateTexture("fxRing", 64, 64);
      graphics.clear();

      graphics.fillStyle(COLORS.gold, 0.35);
      graphics.fillCircle(7, 7, 7);
      graphics.fillStyle(0xfff0a3, 1);
      graphics.fillCircle(7, 7, 3);
      graphics.generateTexture("spark", 14, 14);
      graphics.clear();

      graphics.fillStyle(COLORS.cyan, 0.16);
      graphics.fillTriangle(17, 0, 26, 17, 17, 13);
      graphics.fillTriangle(17, 34, 26, 17, 17, 21);
      graphics.fillStyle(COLORS.gold, 0.88);
      graphics.fillTriangle(0, 17, 17, 9, 13, 17);
      graphics.fillTriangle(34, 17, 17, 9, 21, 17);
      graphics.lineStyle(2, 0x8ff4e8, 0.94);
      graphics.beginPath();
      graphics.moveTo(17, 2);
      graphics.lineTo(31, 17);
      graphics.lineTo(17, 32);
      graphics.lineTo(3, 17);
      graphics.closePath();
      graphics.strokePath();
      graphics.fillStyle(0x102b2e, 1);
      graphics.fillTriangle(17, 9, 25, 17, 17, 25);
      graphics.fillTriangle(17, 9, 9, 17, 17, 25);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRect(15, 12, 4, 10);
      graphics.fillRect(12, 15, 10, 4);
      graphics.generateTexture("orbital", 34, 34);
      graphics.destroy();
    }

    usesCompactControls() {
      return this.scale.width <= 760 || window.matchMedia("(pointer: coarse)").matches;
    }

    getPlayableBottom() {
      if (!this.usesCompactControls()) return this.scale.height - 24;
      const controlReserve = Phaser.Math.Clamp(this.scale.height * 0.27, 175, 230);
      return Math.max(220, this.scale.height - controlReserve);
    }

    getPlayableTop() {
      if (!this.usesCompactControls()) return 96;
      return Phaser.Math.Clamp(this.scale.height * 0.3, 220, 235);
    }

    getBattlefield(id = selectedBattlefieldId) {
      return battlefieldCatalog.find((battlefield) => battlefield.id === id) || battlefieldCatalog[0];
    }

    getBattlefieldAnchor(kind, width = this.scale.width, height = this.scale.height) {
      const profile = this.battlefieldProfile || this.getBattlefield();
      const lampSpec = profile.lamp || { x: 0.5, y: 0.5 };
      const playableTop = this.getPlayableTop();
      const playableBottom = this.getPlayableBottom();
      const lamp = {
        x: Phaser.Math.Clamp(width * lampSpec.x, 72, width - 72),
        y: Phaser.Math.Clamp(height * lampSpec.y, playableTop + 58, playableBottom - 72),
      };
      if (kind === "lamp") return lamp;
      const playerSpec = profile.player || { x: 0.5, yOffset: 130 };
      return {
        x: Phaser.Math.Clamp(width * playerSpec.x, 38, width - 38),
        y: Phaser.Math.Clamp(
          Number.isFinite(playerSpec.y)
            ? playableTop + (playableBottom - playableTop) * playerSpec.y
            : lamp.y + playerSpec.yOffset,
          playableTop + 28,
          playableBottom - 28,
        ),
      };
    }

    createArena() {
      const profile = this.battlefieldProfile;
      this.cameras.main.setBackgroundColor(profile.baseColor || COLORS.night);
      this.background = this.add.graphics().setDepth(-30);
      this.arenaLines = this.add.graphics().setDepth(-25);
      this.stageBackdrop = profile.backgroundTexture && this.textures.exists(profile.backgroundTexture)
        ? this.add.image(this.scale.width / 2, this.scale.height / 2, profile.backgroundTexture)
          .setOrigin(0.5)
          .setAlpha(0.76)
          .setDepth(-29)
        : null;
      this.districtWash = this.add.rectangle(0, 0, this.scale.width, this.scale.height, COLORS.cyan, 0)
        .setOrigin(0)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(-20);
      this.ruins = [];
      const random = new Phaser.Math.RandomDataGenerator([`last-light-${profile.id}`]);
      for (let index = 0; index < 34; index += 1) {
        this.ruins.push({
          x: random.frac(),
          y: random.frac(),
          width: random.between(22, 82),
          height: random.between(16, 60),
          rotation: random.realInRange(-0.18, 0.18),
          light: random.frac() > 0.82,
        });
      }
      this.drawArena(this.scale.width, this.scale.height);
    }

    drawArena(width, height) {
      const profile = this.battlefieldProfile;
      this.background.clear();
      this.arenaLines.clear();
      this.background.fillStyle(profile.groundColor || COLORS.ground, 1);
      this.background.fillRect(0, 0, width, height);

      if (this.stageBackdrop) {
        const source = this.stageBackdrop.texture.getSourceImage();
        const scale = Math.max(width / Math.max(1, source.width), height / Math.max(1, source.height));
        this.stageBackdrop.setPosition(width / 2, height / 2).setScale(scale);
      }

      if (profile.id === "mirror-harbor") {
        const lamp = this.getBattlefieldAnchor("lamp", width, height);
        const playableTop = this.getPlayableTop();
        const playableBottom = this.getPlayableBottom();
        this.arenaLines.lineStyle(1, profile.lineColor, 0.32);
        for (let y = playableTop + 18; y < playableBottom; y += 38) {
          this.arenaLines.beginPath();
          for (let x = -20; x <= width + 20; x += 28) {
            const waveY = y + Math.sin(x / 54 + y * 0.018) * 5;
            if (x < 0) this.arenaLines.moveTo(x, waveY);
            else this.arenaLines.lineTo(x, waveY);
          }
          this.arenaLines.strokePath();
        }
        this.arenaLines.fillStyle(0x0a1719, 0.82);
        this.arenaLines.fillRect(width * 0.08, playableTop + 36, width * 0.18, playableBottom - playableTop - 72);
        this.arenaLines.fillRect(width * 0.48, playableTop + 22, width * 0.11, playableBottom - playableTop - 44);
        this.arenaLines.fillRect(width * 0.78, playableTop + 48, width * 0.14, playableBottom - playableTop - 96);
        this.arenaLines.lineStyle(2, 0x4adbd1, 0.28);
        this.arenaLines.strokeCircle(lamp.x, lamp.y, Math.min(width, height) * 0.2);
        this.arenaLines.lineStyle(1, 0xff6d79, 0.24);
        this.arenaLines.strokeCircle(lamp.x, lamp.y, Math.min(width, height) * 0.29);
        return;
      }

      this.arenaLines.lineStyle(1, profile.lineColor || COLORS.groundLine, 0.32);
      const grid = 64;
      for (let x = 0; x <= width; x += grid) {
        this.arenaLines.lineBetween(x, 0, x, height);
      }
      for (let y = 0; y <= height; y += grid) {
        this.arenaLines.lineBetween(0, y, width, y);
      }

      this.arenaLines.lineStyle(2, 0x213b3f, 0.4);
      this.arenaLines.strokeCircle(width / 2, height / 2, Math.min(width, height) * 0.31);
      this.arenaLines.strokeCircle(width / 2, height / 2, Math.min(width, height) * 0.18);
      this.arenaLines.lineStyle(1, COLORS.gold, 0.11);
      this.arenaLines.lineBetween(width / 2, 0, width / 2, height);
      this.arenaLines.lineBetween(0, height / 2, width, height / 2);
      const playableBottom = this.getPlayableBottom();
      if (playableBottom < height - 40) {
        this.arenaLines.lineStyle(1, COLORS.cyan, 0.14);
        this.arenaLines.lineBetween(0, playableBottom, width, playableBottom);
      }

      this.ruins.forEach((ruin) => {
        const x = ruin.x * width;
        const y = ruin.y * height;
        if (Phaser.Math.Distance.Between(x, y, width / 2, height / 2) < 150) return;
        this.background.save();
        this.background.translateCanvas(x, y);
        this.background.rotateCanvas(ruin.rotation);
        this.background.fillStyle(0x0a1416, 0.82);
        this.background.fillRect(-ruin.width / 2, -ruin.height / 2, ruin.width, ruin.height);
        this.background.lineStyle(1, 0x284145, 0.35);
        this.background.strokeRect(-ruin.width / 2, -ruin.height / 2, ruin.width, ruin.height);
        if (ruin.light) {
          this.background.fillStyle(COLORS.goldHot, 0.25);
          this.background.fillRect(-ruin.width / 4, -ruin.height / 5, 5, 4);
        }
        this.background.restore();
      });
    }

    createActors() {
      const lampPosition = this.getBattlefieldAnchor("lamp");
      const playerPosition = this.getBattlefieldAnchor("player");
      const accent = this.battlefieldProfile.accentValue || COLORS.gold;
      const lampTexture = this.battlefieldProfile.lampTexture && this.textures.exists(this.battlefieldProfile.lampTexture)
        ? this.battlefieldProfile.lampTexture
        : this.textures.exists("lastLightBeacon") ? "lastLightBeacon" : "lamp";
      const keeperTexture = this.textures.exists("keeperArt") ? "keeperArt" : "keeper";
      this.glowOuter = this.add.circle(lampPosition.x, lampPosition.y, 185, accent, 0.045).setBlendMode(Phaser.BlendModes.ADD).setDepth(-5);
      this.glowInner = this.add.circle(lampPosition.x, lampPosition.y, 92, accent, 0.11).setBlendMode(Phaser.BlendModes.ADD).setDepth(-4);
      this.lampAura = this.add.circle(lampPosition.x, lampPosition.y, 60, accent, 0.13).setStrokeStyle(1, accent, 0.34).setDepth(0);
      this.lamp = this.add.image(lampPosition.x, lampPosition.y, lampTexture).setDepth(3);
      if (lampTexture === "lastLightBeacon") this.lamp.setDisplaySize(152, 174);
      else if (lampTexture !== "lamp") this.lamp.setDisplaySize(118, 132);
      this.player = this.physics.add.image(playerPosition.x, playerPosition.y, keeperTexture).setDepth(8);
      if (keeperTexture !== "keeper") this.player.setDisplaySize(52, 62);
      this.player.body.setSize(28, 34).setOffset(8, 12);
      this.player.setCollideWorldBounds(false);
      this.aegisRing = this.add.circle(this.player.x, this.player.y, 27, COLORS.armor, 0.035)
        .setStrokeStyle(2, COLORS.armor, 0.86)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setVisible(false)
        .setDepth(7);
      this.emberHalo = this.add.image(this.player.x, this.player.y - 39, "fxRing")
        .setTint(accent)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setAlpha(0.38)
        .setScale(0.34)
        .setDepth(9);
      this.emberCore = this.add.image(this.player.x, this.player.y - 39, "fxStar")
        .setTint(accent)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setScale(0.42)
        .setDepth(10);

      this.tweens.add({
        targets: [this.glowInner, this.lampAura],
        scale: { from: 0.92, to: 1.12 },
        alpha: { from: 0.68, to: 1 },
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      this.tweens.add({
        targets: this.aegisRing,
        scale: { from: 0.92, to: 1.13 },
        alpha: { from: 0.48, to: 0.95 },
        duration: 760,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    createBattlefieldMechanics() {
      if (this.battlefieldProfile.id !== "mirror-harbor") return;
      const Controller = window.LastLightStages?.MirrorHarborController;
      if (Controller) this.stageController = new Controller(this);
    }

    recordPrecisionPrototypeEvent(type, details = {}) {
      const telemetry = this.precisionPrototypeTelemetry;
      if (!telemetry?.enabled) return null;
      const event = {
        ...details,
        type,
        at: Math.round(Number.isFinite(details.at) ? details.at : this.gameplayTime),
      };
      telemetry.eventCounts[type] = (telemetry.eventCounts[type] || 0) + 1;
      telemetry.lastEvent = event;
      if (type === "prototype-start") telemetry.startedAt = event.at;
      if (type === "prototype-finish") {
        telemetry.finishedAt = event.at;
        telemetry.outcome = event.outcome || null;
      }
      if (type === "tide-warning") telemetry.tide.lastWarning = event;
      if (type === "tide-resolve") telemetry.tide.lastResolution = event;
      if (type === "tide-hit") telemetry.tide.lastHit = event;
      if (type === "boss-gap-warning") telemetry.bossGap.lastWarning = event;
      if (type === "boss-gap-release") telemetry.bossGap.lastRelease = event;
      if (type === "boss-gap-hit") telemetry.bossGap.lastHit = event;
      if (type === "perfect-dodge") telemetry.perfectDodges.last = event;
      if (type === "tide-hit" || type === "boss-gap-hit") telemetry.lastPlayerHit = event;
      return event;
    }

    recordPrecisionPrototypeAudioResume(kind, event) {
      const telemetry = this.precisionPrototypeTelemetry;
      if (!telemetry?.enabled) return null;
      const audio = telemetry.audioResume;
      if (audio.confirmed || audio.confirmationPlayed) return null;
      const pointer = event?.type === "pointerdown"
        ? { pointerType: event.pointerType || "unknown", isPrimary: event.isPrimary !== false }
        : { pointerType: "unknown", isPrimary: false };
      const entry = {
        type: `audio-resume-${kind}`,
        at: Math.round(this.gameplayTime),
        ...pointer,
        beforeState: telemetry.audioResume.beforeState,
        afterState: soundscape.context?.state || "idle",
        contextState: soundscape.context?.state || "idle",
      };
      if (kind === "attempt") {
        audio.pointerdownAttempts += 1;
        audio.lastAttempt = entry;
      } else if (kind === "success") {
        audio.successes += 1;
        audio.afterState = entry.afterState;
        audio.lastSuccess = entry;
      } else if (kind === "blocked") {
        audio.blocked += 1;
        audio.afterState = entry.afterState;
        audio.confirmationBlocked = true;
      }
      telemetry.lastEvent = entry;
      return entry;
    }

    recordPrototypeAudioClickObserved(event, beforeState) {
      const telemetry = this.precisionPrototypeTelemetry;
      if (!telemetry?.enabled) return null;
      const audio = telemetry.audioResume;
      if (audio.confirmed || audio.confirmationPlayed) return null;
      audio.clickObserved += 1;
      audio.beforeState = beforeState;
      audio.afterState = soundscape.context?.state || beforeState;
      return audio;
    }

    confirmPrototypeAudio() {
      const telemetry = this.precisionPrototypeTelemetry;
      if (!telemetry?.enabled) return false;
      const audio = telemetry.audioResume;
      if (audio.confirmed || audio.confirmationPlayed) return false;
      audio.afterState = soundscape.context?.state || "idle";
      const played = soundscape.play("audioConfirm", true) === true;
      audio.confirmationPlayed = played;
      audio.confirmed = played;
      audio.confirmationBlocked = !played;
      if (!played) {
        this.showPrototypeAudioBlocked();
        return false;
      }
      this.clearPrototypeAudioPrompt();
      this.showCombatLabel(this.player.x, this.player.y - 52, "战斗音效已开启", COLORS.gold);
      return true;
    }

    showPrototypeAudioBlocked() {
      const telemetry = this.precisionPrototypeTelemetry;
      if (telemetry?.enabled && !telemetry.audioResume.confirmed) {
        telemetry.audioResume.afterState = soundscape.context?.state || "blocked";
        telemetry.audioResume.confirmationBlocked = true;
      }
      this.showPrototypeAudioPrompt("音效被浏览器阻止");
      return false;
    }

    isPrototypeAudioConfirmed() {
      const audio = this.precisionPrototypeTelemetry?.audioResume;
      return Boolean(this.precisionPrototypeTelemetry?.enabled && (audio?.confirmed || audio?.confirmationPlayed));
    }

    isPrecisionTrackerPrototype() {
      return Boolean(this.precisionPrototypeTelemetry?.enabled && this.weaponProfile?.id === "tracker");
    }

    clearPrototypeTrackerAutoGrants() {
      this.prototypeTrackerAutoGrantTimers.forEach((timer) => timer?.remove(false));
      this.prototypeTrackerAutoGrantTimers = [];
    }

    clearPrototypeHorde() {
      this.prototypeHordeTimers.forEach((timer) => timer?.remove(false));
      this.prototypeHordeTimers = [];
    }

    clearPrototypeAudioPrompt() {
      if (this.prototypeAudioPrompt?.active) this.prototypeAudioPrompt.destroy(true);
      this.prototypeAudioPrompt = null;
    }

    showPrototypeAudioPrompt(message = null) {
      if (!RUN_PROFILE.precisionPrototype || (soundscape.context?.state === "running" && !message)) return false;
      if (this.prototypeAudioPrompt?.active) {
        if (message) {
          const text = this.prototypeAudioPrompt.list?.find((child) => child?.setText);
          text?.setText(message);
        }
        return false;
      }
      const text = this.add.text(0, 0, "点击战场开启战斗音效", {
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        color: "#f3f0e6",
        stroke: "#071012",
        strokeThickness: 3,
      }).setOrigin(0.5);
      if (message) text.setText(message);
      const back = this.add.rectangle(0, 0, text.width + 24, 26, 0x071012, 0.62)
        .setStrokeStyle(1, COLORS.gold, 0.48);
      this.prototypeAudioPrompt = this.add.container(
        this.scale.width / 2,
        Math.max(this.getPlayableTop() + 26, this.getPlayableBottom() - 32),
        [back, text],
      ).setDepth(42);
      this.prototypeAudioPrompt.setSize(back.width, back.height);
      this.prototypeAudioPrompt.setInteractive(
        new Phaser.Geom.Rectangle(-back.width / 2, -back.height / 2, back.width, back.height),
        Phaser.Geom.Rectangle.Contains,
      );
      this.prototypeAudioPrompt.on("pointerdown", (pointer) => soundscape.resumeFromPointerdown(pointer.event || pointer));
      return true;
    }

    schedulePrototypeTrackerAutoGrants() {
      this.clearPrototypeTrackerAutoGrants();
      if (!this.isPrecisionTrackerPrototype()) return false;
      PRECISION_TRACKER_AUTO_GRANTS.forEach((step) => {
        const timer = this.time.delayedCall(step.at, () => this.applyPrototypeTrackerAutoGrant(step.id));
        this.prototypeTrackerAutoGrantTimers.push(timer);
      });
      return true;
    }

    schedulePrototypeHorde() {
      this.clearPrototypeHorde();
      if (!this.isPrecisionTrackerPrototype()) return false;
      PRECISION_HORDE_BATCHES.forEach((batch) => {
        const timer = this.time.delayedCall(batch.at, () => this.spawnPrototypeHordeBatch(batch));
        this.prototypeHordeTimers.push(timer);
      });
      return true;
    }

    getPrototypeHordeSpawnPoint(edge, index, count) {
      const top = this.getPlayableTop() + 24;
      const bottom = this.getPlayableBottom() - 24;
      const progress = (index + 0.5) / Math.max(1, count);
      const laneY = top + (bottom - top) * progress + Phaser.Math.Between(-18, 18);
      if (edge === "left") return { x: -42 - (index % 3) * 12, y: laneY };
      if (edge === "right") return { x: this.scale.width + 42 + (index % 3) * 12, y: laneY };
      if (edge === "top") return { x: this.scale.width * progress + Phaser.Math.Between(-24, 24), y: top - 64 - (index % 3) * 12 };
      return { x: this.scale.width * progress + Phaser.Math.Between(-24, 24), y: bottom + 64 + (index % 3) * 12 };
    }

    spawnPrototypeHordeBatch(batch) {
      if (!this.started || this.ended || !this.isPrecisionTrackerPrototype() || this.bossPreludeStarted || this.bossSpawned) return false;
      for (let index = 0; index < batch.count; index += 1) {
        const point = this.getPrototypeHordeSpawnPoint(batch.edge, index, batch.count);
        this.spawnEnemy("shade", point.x, point.y, {
          prototypeHorde: true,
          spawnEdge: batch.edge,
        });
      }
      this.updatePrototypeHordeActivePeak();
      return true;
    }

    updatePrototypeHordeActivePeak() {
      const horde = this.precisionPrototypeTelemetry?.horde;
      if (!horde?.schedule) return 0;
      let active = 0;
      this.enemies?.children.iterate((enemy) => {
        if (enemy?.active && enemy.getData("prototypeHorde")) active += 1;
      });
      horde.activePeak = Math.max(horde.activePeak, active);
      horde.activeNow = active;
      return active;
    }

    samplePrototypeHordePressure(deltaMs) {
      if (!this.isPrecisionTrackerPrototype()) return 0;
      const active = this.updatePrototypeHordeActivePeak();
      const horde = this.precisionPrototypeTelemetry.horde;
      if (active >= 25) horde.timeAbove25Ms += deltaMs;
      return active;
    }

    recordPrototypeHordeKill(enemy, x, y) {
      if (!this.isPrecisionTrackerPrototype() || !enemy?.getData("prototypeHorde")) return false;
      const horde = this.precisionPrototypeTelemetry.horde;
      const at = Math.round(this.gameplayTime);
      horde.kills += 1;
      horde.lastKillAt = at;
      horde.killTimes.push(at);
      horde.maxKillsInFiveSeconds = Math.max(
        horde.maxKillsInFiveSeconds,
        horde.killTimes.filter((time) => at - time <= 5000).length,
      );
      this.updatePrototypeHordeActivePeak();
      if (horde.kills % 5 === 0) {
        horde.comboAccents += 1;
        this.spawnRipple(x, y, COLORS.goldHot);
        this.spawnRadialShards(x, y, COLORS.goldHot, 6, 36, Math.PI / 10, 0.34);
        soundscape.play("hordeCombo", true);
      }
      return true;
    }

    applyPrototypeTrackerAutoGrant(id) {
      if (!this.started || this.ended || !this.isPrecisionTrackerPrototype()) return false;
      const tracker = this.precisionPrototypeTelemetry?.trackerEvolution;
      if (!tracker || !Object.prototype.hasOwnProperty.call(tracker.autoGrantTimes, id)) return false;
      const at = Math.round(this.gameplayTime);
      if ((this.upgradeLevels[id] || 0) >= 1) {
        tracker.autoGrantEvents.push({ id, at, skipped: true });
        return false;
      }
      const granted = this.grantUpgrade(id);
      if (!granted) {
        tracker.autoGrantEvents.push({ id, at, failed: true });
        return false;
      }
      tracker.autoGrantTimes[id] = at;
      tracker.autoGrantEvents.push({ id, at, skipped: false });
      this.renderBuild();
      this.updateHud(true);
      this.updateWeaponState();
      this.showCombatLabel(this.player.x, this.player.y - 42, granted.upgrade.name, granted.upgrade.color);
      this.spawnRipple(this.player.x, this.player.y, granted.upgrade.colorValue || this.weaponProfile.colorValue);
      soundscape.play(id === "volley" ? "volley" : "upgrade");
      return true;
    }

    isStandardTrackerVerticalSlice() {
      return Boolean(
        this.runProfile?.id === "standard"
        && this.battlefieldProfile?.id === "mirror-harbor"
        && this.weaponProfile?.id === "tracker",
      );
    }

    isStandardMirrorHarborPressureSlice() {
      return Boolean(
        this.runProfile?.id === "standard"
        && this.battlefieldProfile?.id === "mirror-harbor"
        && !this.usesCompactControls(),
      );
    }

    isStandardLanternCourtSiegeSlice() {
      return Boolean(
        this.runProfile?.id === "standard"
        && this.battlefieldProfile?.id === "lantern-court"
        && !this.usesCompactControls(),
      );
    }

    countPressureMelee() {
      let count = 0;
      this.enemies?.children.iterate((enemy) => {
        if (
          enemy?.active
          && enemy.getData("pressureMelee") === true
          && enemy.getData("pressureBruiser") !== true
        ) count += 1;
      });
      return count;
    }

    countPressureBruisers() {
      let count = 0;
      this.enemies?.children.iterate((enemy) => {
        if (enemy?.active && enemy.getData("pressureBruiser") === true) count += 1;
      });
      return count;
    }

    countCitySiege() {
      let count = 0;
      this.enemies?.children.iterate((enemy) => {
        if (enemy?.active && enemy.getData("citySiege") === true) count += 1;
      });
      return count;
    }

    getSpawnActiveCount() {
      const mirrorPressure = this.isStandardMirrorHarborPressureSlice();
      const citySiege = this.isStandardLanternCourtSiegeSlice();
      if (!mirrorPressure && !citySiege) return this.enemies.countActive(true);
      let count = 0;
      this.enemies.children.iterate((enemy) => {
        if (
          enemy?.active
          && (!mirrorPressure || enemy.getData("pressureMelee") !== true)
          && (!citySiege || enemy.getData("citySiege") !== true)
        ) count += 1;
      });
      return count;
    }

    updateStandardMirrorHarborPressureMelee(time = this.gameplayTime) {
      if (!this.isStandardMirrorHarborPressureSlice() || this.ended || this.bossPreludeStarted || this.bossSpawned) return;
      const pressureEnd = BOSS_TIME - BOSS_PRELUDE_DURATION;
      if (
        this.elapsed < STANDARD_MIRROR_PRESSURE_START
        || this.elapsed >= pressureEnd
        || time < this.pressureMeleeNextAt
      ) return;
      const isMidPressure = this.elapsed >= STANDARD_MIRROR_PRESSURE_MID_START;
      const isLatePressure = this.elapsed >= STANDARD_MIRROR_PRESSURE_LATE_START;
      const cap = isLatePressure
        ? STANDARD_MIRROR_PRESSURE_LATE_CAP
        : isMidPressure ? STANDARD_MIRROR_PRESSURE_MID_CAP : STANDARD_MIRROR_PRESSURE_CAP;
      const pack = isLatePressure
        ? STANDARD_MIRROR_PRESSURE_LATE_PACK
        : isMidPressure ? STANDARD_MIRROR_PRESSURE_MID_PACK : STANDARD_MIRROR_PRESSURE_PACK;
      const cadence = isLatePressure
        ? STANDARD_MIRROR_PRESSURE_LATE_CADENCE
        : isMidPressure ? STANDARD_MIRROR_PRESSURE_MID_CADENCE : STANDARD_MIRROR_PRESSURE_CADENCE;
      const remaining = Math.max(0, cap - this.countPressureMelee());
      const spawnCount = Math.min(pack, remaining);
      const pool = isMidPressure ? ["gloamling"] : ["gloamling", "shade", "wraith"];
      for (let index = 0; index < spawnCount; index += 1) {
        const kind = pool[Math.floor(Math.random() * pool.length)];
        this.spawnEnemy(kind, null, null, { pressureMelee: true });
      }
      this.pressureMeleeNextAt = time + cadence;
    }

    updateStandardMirrorHarborPressureBruisers(time = this.gameplayTime) {
      if (!this.isStandardMirrorHarborPressureSlice() || this.ended || this.bossPreludeStarted || this.bossSpawned) return;
      const pressureEnd = BOSS_TIME - BOSS_PRELUDE_DURATION;
      if (
        this.elapsed < STANDARD_MIRROR_BRUISER_START
        || this.elapsed >= pressureEnd
        || time < this.pressureBruiserNextAt
      ) return;
      const isLateBruiserPressure = this.elapsed >= ROUTE_STAGE_THREE_TIME;
      const cap = isLateBruiserPressure ? STANDARD_MIRROR_BRUISER_CAP : STANDARD_MIRROR_BRUISER_MID_CAP;
      const pack = isLateBruiserPressure ? STANDARD_MIRROR_BRUISER_PACK : STANDARD_MIRROR_BRUISER_MID_PACK;
      const cadence = isLateBruiserPressure ? STANDARD_MIRROR_BRUISER_CADENCE : STANDARD_MIRROR_BRUISER_MID_CADENCE;
      const remaining = Math.max(0, cap - this.countPressureBruisers());
      const spawnCount = Math.min(pack, remaining);
      const edges = ["left", "right", "top", "bottom"];
      const edge = edges[Math.floor(Math.random() * edges.length)];
      for (let index = 0; index < spawnCount; index += 1) {
        const point = this.getPrototypeHordeSpawnPoint(edge, index, spawnCount);
        const kind = STANDARD_MIRROR_BRUISER_COMPOSITION[index % STANDARD_MIRROR_BRUISER_COMPOSITION.length];
        this.spawnEnemy(kind, point.x, point.y, {
          pressureMelee: true,
          pressureBruiser: true,
          spawnEdge: edge,
        });
      }
      this.pressureBruiserNextAt = time + cadence;
    }

    updateStandardLanternCourtSiege(time = this.gameplayTime) {
      if (
        !this.isStandardLanternCourtSiegeSlice()
        || this.ended
        || this.bossPreludeStarted
        || this.bossSpawned
        || this.getCleanupWindow()
      ) return;
      const pressureEnd = BOSS_TIME - BOSS_PRELUDE_DURATION;
      if (
        this.elapsed < STANDARD_CITY_SIEGE_START
        || this.elapsed >= pressureEnd
        || time < this.citySiegeNextAt
      ) return;
      const phaseIndex = this.elapsed >= ROUTE_STAGE_THREE_TIME
        ? 2
        : this.elapsed >= ROUTE_STAGE_TWO_TIME ? 1 : 0;
      const cap = STANDARD_CITY_SIEGE_CAPS[phaseIndex];
      const pack = STANDARD_CITY_SIEGE_PACKS[phaseIndex];
      const cadence = STANDARD_CITY_SIEGE_CADENCES[phaseIndex];
      const remaining = Math.max(0, cap - this.countCitySiege());
      const spawnCount = Math.min(pack, remaining);
      const edgePair = this.citySiegeWaveIndex % 2 === 0
        ? ["left", "right"]
        : ["top", "bottom"];
      const composition = STANDARD_CITY_SIEGE_COMPOSITIONS[phaseIndex];
      for (let index = 0; index < spawnCount; index += 1) {
        const edge = edgePair[index % edgePair.length];
        const edgeIndex = Math.floor(index / edgePair.length);
        const edgeCount = Math.ceil(spawnCount / edgePair.length);
        const point = this.getPrototypeHordeSpawnPoint(edge, edgeIndex, edgeCount);
        const kind = composition[index % composition.length];
        this.spawnEnemy(kind, point.x, point.y, { citySiege: true, spawnEdge: edge });
      }
      if (spawnCount > 0) this.citySiegeWaveIndex += 1;
      this.citySiegeNextAt = time + cadence;
    }

    isTrackerEvolutionActive() {
      return this.isPrecisionTrackerPrototype() || this.isStandardTrackerVerticalSlice();
    }

    getTrackerEvolutionRuntime() {
      if (this.isPrecisionTrackerPrototype()) return this.precisionPrototypeTelemetry?.trackerEvolution || null;
      if (this.isStandardTrackerVerticalSlice()) return this.trackerRuntime || null;
      return null;
    }

    getTrackerEvolutionStage() {
      if (!this.isTrackerEvolutionActive()) return null;
      if ((this.upgradeLevels.lanternMark || 0) <= 0) return "single";
      if ((this.upgradeLevels.volley || 0) <= 0) return "lanternMark";
      if (!this.activeSynergies.has("emberVolley")) return "dualVolley";
      return "emberVolley";
    }

    refreshTrackerEvolutionTelemetry(extra = {}) {
      const tracker = this.getTrackerEvolutionRuntime();
      if (!tracker) return null;
      tracker.stage = this.getTrackerEvolutionStage();
      tracker.targetUpgrades = {
        lanternMark: this.upgradeLevels.lanternMark || 0,
        volley: this.upgradeLevels.volley || 0,
        focus: this.upgradeLevels.focus || 0,
      };
      tracker.emberVolleyActive = this.activeSynergies.has("emberVolley");
      tracker.projectileCount = this.stats.projectileCount;
      tracker.signatureCounter = this.signatureCounter;
      Object.assign(tracker, extra);
      return tracker;
    }

    recordTrackerEvolutionMetric(kind, details = {}) {
      const tracker = this.refreshTrackerEvolutionTelemetry();
      if (!tracker) return null;
      if (kind === "direct-hit") {
        tracker.directHits += 1;
        tracker.lastDirectHit = { at: Math.round(this.gameplayTime), ...details };
      } else if (kind === "direct-kill") {
        tracker.directKills += 1;
        tracker.lastDirectKill = { at: Math.round(this.gameplayTime), ...details };
      } else if (kind === "lantern-mark") {
        tracker.lanternMarkDetonations += 1;
        tracker.lastLanternMark = { at: Math.round(this.gameplayTime), ...details };
      } else if (kind === "ember-volley") {
        tracker.emberVolleyTriggers += 1;
        tracker.lastEmberVolley = { at: Math.round(this.gameplayTime), ...details };
      } else if (kind === "heavy-impact") {
        tracker.lastHeavyImpact = { at: Math.round(this.gameplayTime), ...details };
      }
      return tracker;
    }

    getPrecisionPrototypeState() {
      const telemetry = this.precisionPrototypeTelemetry;
      if (!telemetry) return null;
      this.refreshTrackerEvolutionTelemetry();
      return JSON.parse(JSON.stringify({
        ...telemetry,
        timingProfile: this.runProfile?.id || null,
        battlefield: this.battlefieldProfile?.id || null,
        weapon: this.weaponProfile?.id || null,
        elapsed: Math.round(this.elapsed * 100) / 100,
        gameplayTime: Math.round(this.gameplayTime),
        result: this.getPrecisionPrototypeResult(),
      }));
    }

    getPrecisionPrototypeResult() {
      return buildPrecisionPrototypeResult(this.tidePerfectAwarded, this.bossGapPerfectAwarded);
    }

    awardPrecisionPerfectDodge(source, context = {}) {
      const telemetry = this.precisionPrototypeTelemetry;
      if (!telemetry?.enabled || (source !== "tide" && source !== "boss-gap")) return false;
      const lockKey = source === "tide" ? "tidePerfectAwarded" : "bossGapPerfectAwarded";
      if (this[lockKey]) return false;
      this[lockKey] = true;
      telemetry.perfectDodges.tide = this.tidePerfectAwarded;
      telemetry.perfectDodges.bossGap = this.bossGapPerfectAwarded;
      telemetry.perfectDodges.count = Math.min(2, Number(this.tidePerfectAwarded) + Number(this.bossGapPerfectAwarded));
      const count = telemetry.perfectDodges.count;
      this.recordPrecisionPrototypeEvent("perfect-dodge", { source, count });
      this.gainEmberCharge(12, "关键闪避");
      this.showPrecisionPerfectDodgeFeedback(source, count, context);
      return true;
    }

    showPrecisionPerfectDodgeFeedback(source, count, context = {}) {
      if (!this.player?.active || this.ended) return;
      const x = this.player.x;
      const y = this.player.y;
      const ring = this.add.image(x, y + 10, "fxRing")
        .setTint(COLORS.cyan)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(18)
        .setAlpha(0.72)
        .setDisplaySize(32, 32);
      this.tweens.add({
        targets: ring,
        displayWidth: 54,
        displayHeight: 54,
        alpha: 0,
        duration: 200,
        ease: "Sine.easeOut",
        onComplete: () => ring.destroy(),
      });
      soundscape.play("dash");
      this.time.delayedCall(75, () => {
        if (!this.player?.active || this.ended) return;
        const borrowText = source === "tide" && context.enemyHits > 0
          ? ` · 借潮破敌 ${context.enemyHits}`
          : "";
        const successText = source === "tide" ? "潮线闪避成功" : "Boss 缺口通过";
        const label = this.add.text(
          Phaser.Math.Clamp(this.player.x, 118, this.scale.width - 118),
          Phaser.Math.Clamp(this.player.y - 38, this.getPlayableTop() - 18, this.getPlayableBottom() - 18),
          `${successText} · ${count}/2 · 余火 +12${borrowText}`,
          {
            fontFamily: "STKaiti, KaiTi, Georgia, serif",
            fontSize: "12px",
            fontStyle: "bold",
            color: "#eaffff",
            stroke: "#071012",
            strokeThickness: 4,
          },
        ).setOrigin(0.5).setDepth(18);
        this.tweens.add({
          targets: label,
          y: label.y - 18,
          alpha: 0,
          duration: 500,
          ease: "Quad.easeOut",
          onComplete: () => label.destroy(),
        });
      });
      this.time.delayedCall(100, () => {
        if (!this.player?.active || this.ended) return;
        this.burstAt(this.player.x, this.player.y, COLORS.cyan, 4);
      });
    }

    tryResolveBossGapPerfectDodge() {
      const tracking = this.bossGapDodgeTracking;
      if (!tracking?.active || this.bossGapPerfectAwarded) return false;
      const activeGroupProjectile = this.enemyProjectiles?.getChildren().some((shot) => (
        shot?.active
        && shot.getData("prototypeSource") === tracking.source
        && shot.getData("prototypeWarningAt") === tracking.warningAt
      ));
      if (activeGroupProjectile) return false;
      tracking.active = false;
      if (tracking.hit) return false;
      return this.awardPrecisionPerfectDodge("boss-gap", {
        warningAt: tracking.warningAt,
        releasedAt: tracking.releasedAt,
      });
    }

    resetPrecisionPrototypeEndDom() {
      ui.endEyebrow.textContent = END_DOM_DEFAULTS.eyebrow;
      ui.endTitle.textContent = END_DOM_DEFAULTS.title;
      ui.endMessage.textContent = END_DOM_DEFAULTS.message;
      END_STAT_VALUES.forEach((value, index) => {
        if (value) value.textContent = END_DOM_DEFAULTS.values[index];
      });
      END_STAT_LABELS.forEach((label, index) => {
        if (label) label.textContent = END_DOM_DEFAULTS.labels[index];
      });
      ui.endRoute.textContent = END_DOM_DEFAULTS.route;
      ui.restartButton.textContent = END_DOM_DEFAULTS.restartText;
      ui.loadoutButton.textContent = END_DOM_DEFAULTS.loadoutText;
      ui.restartButton.hidden = END_DOM_DEFAULTS.restartHidden;
      ui.loadoutButton.hidden = END_DOM_DEFAULTS.loadoutHidden;
      ui.endSeals.hidden = END_DOM_DEFAULTS.sealsHidden;
      ui.endArchiveSummary.hidden = END_DOM_DEFAULTS.archiveSummaryHidden;
      if (END_ARCHIVE_CONTAINER) END_ARCHIVE_CONTAINER.hidden = END_DOM_DEFAULTS.archiveContainerHidden;
      if (END_DOM_DEFAULTS.resultMode) ui.endPanel.dataset.resultMode = END_DOM_DEFAULTS.resultMode;
      else delete ui.endPanel.dataset.resultMode;
    }

    renderPrecisionPrototypeEnd() {
      const result = this.getPrecisionPrototypeResult();
      ui.endPanel.dataset.resultMode = "precision-prototype";
      ui.endEyebrow.textContent = "90 秒精准读弹";
      ui.endTitle.textContent = `本局关键闪避 ${result.count}/2`;
      ui.endMessage.textContent = result.message;
      const labels = ["关键闪避", "读弹等级", "潮线", "Boss 缺口"];
      const values = [`${result.count}/2`, result.grade, result.tide, result.bossGap];
      END_STAT_LABELS.forEach((label, index) => {
        if (label) label.textContent = labels[index];
      });
      END_STAT_VALUES.forEach((value, index) => {
        if (value) value.textContent = values[index];
      });
      ui.endSeals.innerHTML = "";
      ui.endArchiveSummary.textContent = "";
      ui.endSeals.hidden = true;
      ui.endArchiveSummary.hidden = true;
      if (END_ARCHIVE_CONTAINER) END_ARCHIVE_CONTAINER.hidden = true;
      const tracker = this.refreshTrackerEvolutionTelemetry();
      const horde = this.precisionPrototypeTelemetry?.horde;
      const damage = tracker?.normalizedDamage;
      ui.endRoute.textContent = tracker
        ? `D-022 | horde ${horde?.spawned || 0}/${horde?.kills || 0} max5 ${horde?.maxKillsInFiveSeconds || 0} | distinct d${tracker.maxDualDistinctTargets}/h${tracker.maxHeavyDistinctTargets} | damage ${damage ? `${damage.perProjectile}x${tracker.heavyProjectileCount}<=${damage.baselineDualTotal}` : "n/a"}`
        : "Tracker R2 | telemetry unavailable";
      ui.restartButton.textContent = "再来一次";
      ui.restartButton.hidden = false;
      ui.loadoutButton.hidden = true;
      ui.objectiveText.textContent = "精准读弹验证结束";
      return result;
    }

    createGroups() {
      this.enemies = this.physics.add.group({ allowGravity: false });
      this.bullets = this.physics.add.group({ allowGravity: false });
      this.enemyProjectiles = this.physics.add.group({ allowGravity: false });
      this.sparks = this.physics.add.group({ allowGravity: false });
      this.orbitals = [];
      this.bossTelegraph = this.add.graphics().setDepth(5);
    }

    createInput() {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys("W,A,S,D,P,ESC");
      this.handleDashKey = () => this.tryDash();
      this.handleCanvasPointerDown = (pointer) => {
        if (RUN_PROFILE.precisionPrototype) soundscape.resumeFromPointerdown(pointer.event || pointer);
      };
      this.input.keyboard.on("keydown-SPACE", this.handleDashKey);
      this.input.keyboard.on("keydown-SHIFT", this.handleDashKey);
      this.input.on("pointerdown", this.handleCanvasPointerDown);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.input.keyboard.off("keydown-SPACE", this.handleDashKey);
        this.input.keyboard.off("keydown-SHIFT", this.handleDashKey);
        this.input.off("pointerdown", this.handleCanvasPointerDown);
      });
    }

    createCollisions() {
      this.physics.add.overlap(this.bullets, this.enemies, this.onBulletHit, null, this);
      this.physics.add.overlap(this.player, this.enemyProjectiles, this.onEnemyProjectileHit, null, this);
      this.physics.add.overlap(this.player, this.enemies, this.onPlayerContact, null, this);
    }

    resetDom() {
      this.resetPrecisionPrototypeEndDom();
      this.setGameplayChromeInert(false);
      ui.gameShell.classList.toggle("is-loadout", !autoStartOnCreate);
      ui.startScreen.hidden = autoStartOnCreate;
      ui.pauseScreen.hidden = true;
      ui.upgradeScreen.hidden = true;
      ui.routeScreen.hidden = true;
      ui.secondaryScreen.hidden = true;
      ui.shopScreen.hidden = true;
      ui.endScreen.hidden = true;
      ui.bossStatus.hidden = true;
      ui.bossName.textContent = this.battlefieldProfile.bossName;
      ui.bossPhase.textContent = "一相";
      ui.bossPhase.classList.remove("is-vulnerable");
      ui.patrolStatus.hidden = true;
      ui.threatAlert.hidden = true;
      ui.endPanel.classList.remove("is-defeat");
      ui.lampStatus.classList.remove("is-critical", "is-charged", "is-surging");
      ui.pauseButton.disabled = true;
      ui.gameShell.dataset.battlefield = this.battlefieldProfile.id;
      ui.waveLabel.textContent = `第一幕 · ${this.battlefieldProfile.name}`;
      ui.objectiveText.textContent = "自由穿行 · 击退黑潮 · 蓄满随身火种";
      ui.startEyebrow.textContent = `${this.battlefieldProfile.chapter} · ${RUN_PROFILE.durationLabel}`;
      ui.startDescription.textContent = this.battlefieldProfile.description;
      ui.endRoute.textContent = "远征路线 · 尚未记录";
      ui.endSeals.innerHTML = "";
      ui.endArchiveSummary.textContent = "通关后写入远征档案";
      ui.currencyCount.textContent = "0";
      touchVector.x = 0;
      touchVector.y = 0;
      resetJoystick();
      soundscape.syncButton();
      this.syncBattlefieldSelection();
      renderArchiveProgress();
      this.updateDashState(this.gameplayTime);
      this.renderBuild();
    }

    setGameplayChromeInert(inert) {
      ui.hud.inert = inert;
      ui.dashButton.inert = inert;
    }

    syncBattlefieldSelection() {
      ui.selectedBattlefieldName.textContent = this.battlefieldProfile.name;
      ui.battlefieldOptions.querySelectorAll("[data-battlefield]").forEach((button) => {
        const isSelected = button.dataset.battlefield === this.battlefieldProfile.id;
        button.classList.toggle("is-selected", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
      });
    }

    selectBattlefield(id) {
      if (this.started) return;
      if (PRECISION_PROTOTYPE_MODE && id !== "mirror-harbor") return;
      const profile = this.getBattlefield(id);
      if (!profile) return;
      selectedBattlefieldId = profile.id;
      if (profile.id === this.battlefieldProfile.id) {
        this.syncBattlefieldSelection();
        return;
      }
      this.time.paused = false;
      this.tweens.resumeAll();
      this.scene.restart();
    }

    selectWeapon(id) {
      if (this.started) return;
      if (PRECISION_PROTOTYPE_MODE && id !== "tracker") return;
      const profile = weaponCatalog.find((weapon) => weapon.id === id);
      if (!profile) return;
      selectedWeaponId = profile.id;
      this.weaponProfile = profile;
      this.stats.damage = profile.damage;
      this.stats.fireRate = profile.fireRate;
      this.stats.projectileCount = profile.projectileCount;
      this.stats.projectileSpeed = profile.projectileSpeed;
      Object.assign(this.primaryAttackTelemetry, {
        attackStyle: profile.attackStyle || "projectile",
        projectileCutChance: profile.attackStyle?.startsWith("melee-") ? MELEE_PROJECTILE_CUT_CHANCE : 0,
        projectileCutCandidates: 0,
        projectilesCut: 0,
        maxProjectilesCutPerAttack: 0,
        attacks: 0,
        hits: 0,
        damage: 0,
        kills: 0,
        maxTargetsPerAttack: 0,
        maxKillsPerAttack: 0,
        maxHitDistance: 0,
        maxFanAngle: 0,
        maxForwardProjection: 0,
        maxPerpendicularDistance: 0,
      });
      this.signatureCounter = 0;
      ui.selectedWeaponName.textContent = profile.name;
      ui.weaponOptions.querySelectorAll("[data-weapon]").forEach((button) => {
        const isSelected = button.dataset.weapon === profile.id;
        button.classList.toggle("is-selected", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
      });
      this.updateWeaponState();
      this.renderBuild();
    }

    startRun() {
      if (this.started) return;
      this.time.paused = false;
      this.selectWeapon(selectedWeaponId);
      this.trackerHeavyImpactSeen.clear();
      this.pressureMeleeNextAt = this.isStandardMirrorHarborPressureSlice()
        ? STANDARD_MIRROR_PRESSURE_START * 1000
        : Number.POSITIVE_INFINITY;
      this.pressureBruiserNextAt = this.isStandardMirrorHarborPressureSlice()
        ? STANDARD_MIRROR_BRUISER_START * 1000
        : Number.POSITIVE_INFINITY;
      this.citySiegeNextAt = this.isStandardLanternCourtSiegeSlice()
        ? STANDARD_CITY_SIEGE_START * 1000
        : Number.POSITIVE_INFINITY;
      this.started = true;
      this.recordPrecisionPrototypeEvent("prototype-start", {
        battlefield: this.battlefieldProfile.id,
        weapon: this.weaponProfile.id,
      });
      this.setGameplayChromeInert(false);
      ui.gameShell.classList.remove("is-loadout");
      ui.startScreen.hidden = true;
      ui.pauseButton.disabled = false;
      ui.objectiveText.textContent = `${this.battlefieldProfile.name} · 自由穿行，追猎敌潮`;
      const accent = this.battlefieldProfile.accentValue || COLORS.gold;
      this.cameras.main.flash(
        420,
        (accent >> 16) & 0xff,
        (accent >> 8) & 0xff,
        accent & 0xff,
        false,
      );
      this.wavePhase = 1;
      soundscape.ensure();
      soundscape.play("start");
      soundscape.startMusic(this.battlefieldProfile.id);
      if (RUN_PROFILE.precisionPrototype) {
        this.showPrototypeAudioPrompt();
        this.schedulePrototypeTrackerAutoGrants();
        this.schedulePrototypeHorde();
      }
      this.updateDashState(this.gameplayTime);
      if (RUN_PROFILE.precisionPrototype) {
        this.showPhaseBanner(
          "90 秒精准读弹原型",
          "镜潮港 · 潮线与安全缺口",
          "读取潮线预警并及时换道 · 识别 Boss 弹幕的安全缺口",
        );
      } else {
        this.showPhaseBanner(
          `第一幕 · ${this.battlefieldProfile.name}`,
          this.battlefieldProfile.id === "mirror-harbor" ? "镜潮涨落" : "暗影苏醒",
          `${this.battlefieldProfile.firstActObjective} · ${formatRunTime(ROUTE_STAGE_TWO_TIME)} 后选择远征路线`,
        );
      }
      this.time.delayedCall(350, () => this.spawnEnemy("shade"));
    }

    restartRun() {
      this.clearPrototypeHorde();
      this.clearPrototypeAudioPrompt();
      if (RUN_PROFILE.precisionPrototype) {
        soundscape.stopMusic();
        window.location.replace(buildPrecisionPrototypeRestartUrl(window.location.href));
        return;
      }
      autoStartOnCreate = true;
      soundscape.stopMusic();
      this.time.paused = false;
      this.tweens.resumeAll();
      this.setGameplayChromeInert(false);
      ui.startScreen.hidden = true;
      ui.pauseScreen.hidden = true;
      ui.endScreen.hidden = true;
      ui.upgradeScreen.hidden = true;
      ui.routeScreen.hidden = true;
      ui.secondaryScreen.hidden = true;
      ui.shopScreen.hidden = true;
      this.scene.restart();
    }

    returnToLoadout() {
      autoStartOnCreate = false;
      this.clearPrototypeHorde();
      this.clearPrototypeAudioPrompt();
      soundscape.stopMusic();
      this.time.paused = false;
      this.tweens.resumeAll();
      this.setGameplayChromeInert(false);
      ui.pauseScreen.hidden = true;
      ui.endScreen.hidden = true;
      ui.upgradeScreen.hidden = true;
      ui.routeScreen.hidden = true;
      ui.secondaryScreen.hidden = true;
      ui.shopScreen.hidden = true;
      this.scene.restart();
    }

    getRoute(id) {
      return routeCatalog.find((route) => route.id === id) || null;
    }

    getRouteSummary() {
      const routeNames = this.routePath
        .map((id) => this.getRoute(id)?.name)
        .filter(Boolean);
      return [this.battlefieldProfile.name, ...routeNames, "终夜"].join(" → ");
    }

    enterChoiceMode(mode) {
      if (this.ended || this.choiceMode) return false;
      this.choiceMode = mode;
      this.isChoosing = true;
      this.physics.world.pause();
      this.time.paused = true;
      this.tweens.pauseAll();
      this.setGameplayChromeInert(true);
      this.player.setVelocity(0, 0);
      this.updateDashState(this.gameplayTime);
      return true;
    }

    switchChoiceMode(expectedMode, nextMode) {
      if (!this.isChoosing || this.choiceMode !== expectedMode) return false;
      this.choiceMode = nextMode;
      return true;
    }

    leaveChoiceMode(expectedMode) {
      if (!this.isChoosing || this.choiceMode !== expectedMode) return false;
      this.choiceMode = null;
      this.isChoosing = false;
      this.time.paused = false;
      this.tweens.resumeAll();
      this.setGameplayChromeInert(false);
      this.physics.world.resume();
      this.updateDashState(this.gameplayTime);
      return true;
    }

    showRouteChoice(stage) {
      if (this.ended || this.choiceMode || this.routeChoicesSeen.has(stage)) return false;
      const choices = routeCatalog.filter((route) => route.stage === stage);
      if (!choices.length) return false;
      if (!this.enterChoiceMode("route")) return false;
      this.pendingRouteStage = stage;
      this.routeChoicesSeen.add(stage);
      ui.routeKicker.textContent = `远征抉择 · 第${stage === 2 ? "二" : "三"}幕`;
      ui.routeTitle.textContent = stage === 2 ? "选择下一处战区" : "决定终夜前的最后路线";
      ui.routePrompt.textContent = stage === 2
        ? "路线会立刻改变敌群、奖励和战场气氛。"
        : `最后路线还会改变${this.battlefieldProfile.bossName}更常使用的攻击方式。`;
      ui.routeStageName.textContent = stage === 2 ? "第二幕" : "第三幕";
      ui.routeOrigin.textContent = this.battlefieldProfile.name;
      ui.routeOptions.innerHTML = choices
        .map((route) => {
          const archiveScore = getRouteArchiveScore(
            this.weaponProfile.id,
            this.battlefieldProfile.id,
            this.routePath,
            route,
          );
          const archiveLabel = archiveScore > 0 ? `档案 · 最佳 ${archiveScore}/3 印` : "档案 · 尚未通关";
          return `
            <button class="route-card" type="button" data-route="${route.id}" style="--route-color:${route.color}">
              <span class="route-card__sigil" aria-hidden="true">${route.sigil}</span>
              <span class="route-card__body">
                <span class="route-card__tag">${route.tag}</span>
                <span class="route-card__record">${archiveLabel}</span>
                <strong>${route.name}</strong>
                <span>${route.description}</span>
                <span class="route-card__reward">路线馈赠 · ${route.reward}</span>
              </span>
            </button>`;
        })
        .join("");
      ui.routeScreen.hidden = false;
      ui.routeOptions.querySelector("button")?.focus({ preventScroll: true });
      ui.objectiveText.textContent = `第${stage === 2 ? "二" : "三"}幕 · 选择远征路线`;
      this.updateDashState(this.gameplayTime);
      soundscape.play("wave", true);
      return true;
    }

    applyRouteChoice(id) {
      if (this.choiceMode !== "route" || !this.pendingRouteStage) return false;
      const route = this.getRoute(id);
      if (!route || route.stage !== this.pendingRouteStage) return false;
      const stage = this.pendingRouteStage;
      this.pendingRouteStage = null;
      this.routePath.push(route.id);
      this.activeRouteId = route.id;
      if (stage === 3) this.finalRouteId = route.id;
      route.apply(this);
      this.applyDistrictTheme(route);
      this.spawnAccumulator = 0;
      this.wavePhase = stage;
      ui.routeScreen.hidden = true;
      this.spawnRipple(this.player.x, this.player.y, route.colorValue);
      this.burstAt(this.player.x, this.player.y, route.colorValue, 10);
      this.showCombatLabel(this.player.x, this.player.y - 36, route.name, route.colorValue);
      soundscape.play("upgrade", true);
      this.updateHud(true);
      this.renderBuild();
      const needsSecondaryChoice = stage === 2 && this.getCompatibleSecondaryProfiles().length > 0 && this.getOwnedSecondaryIds().length === 0;
      if (needsSecondaryChoice) {
        if (!this.switchChoiceMode("route", "secondary")) return false;
        if (!this.showSecondaryChoice()) this.leaveChoiceMode("secondary");
        return true;
      }
      if (!this.switchChoiceMode("route", "shop")) return false;
      if (!this.showShop(stage === 2 ? 1 : 2, route)) this.leaveChoiceMode("shop");
      return true;
    }

    getSecondaryProfile(id = this.secondaryWeaponId) {
      return secondaryWeaponCatalog.find((secondary) => secondary.id === id) || null;
    }

    getCompatibleSecondaryProfiles() {
      return secondaryWeaponCatalog.filter((secondary) => secondary.weaponOnly === this.weaponProfile.id);
    }

    getOwnedSecondaryIds() {
      const owned = new Set(this.secondaryWeaponIds ? [...this.secondaryWeaponIds] : []);
      if (this.secondaryWeaponId) owned.add(this.secondaryWeaponId);
      return this.getCompatibleSecondaryProfiles()
        .map((secondary) => secondary.id)
        .filter((id) => owned.has(id));
    }

    getSecondaryProfiles() {
      return this.getOwnedSecondaryIds()
        .map((id) => this.getSecondaryProfile(id))
        .filter(Boolean);
    }

    hasSecondaryWeapon(id) {
      return this.getOwnedSecondaryIds().includes(id);
    }

    unlockSecondaryWeapon(id, time = this.gameplayTime) {
      const secondary = this.getSecondaryProfile(id);
      if (!secondary || secondary.weaponOnly !== this.weaponProfile.id || this.hasSecondaryWeapon(secondary.id)) return null;
      if (!this.secondaryWeaponIds) this.secondaryWeaponIds = new Set();
      if (!this.secondaryLastShotAt) this.secondaryLastShotAt = new Map();
      this.secondaryWeaponIds.add(secondary.id);
      if (!this.secondaryWeaponId) this.secondaryWeaponId = secondary.id;
      const initialShotAt = secondary.weaponOnly === "nova" || secondary.id === "dash-blades"
        ? time - this.getSecondaryInterval(secondary)
        : time;
      this.secondaryLastShotAt.set(secondary.id, initialShotAt);
      this.lastSecondaryShotAt = time;
      return secondary;
    }

    showSecondaryChoice() {
      const choices = this.getCompatibleSecondaryProfiles();
      if (this.choiceMode !== "secondary" || choices.length !== 3 || this.getOwnedSecondaryIds().length > 0) return false;
      ui.secondaryOptions.innerHTML = choices.map((secondary) => `
        <button class="secondary-card" type="button" data-secondary="${secondary.id}" style="--secondary-color:${secondary.color}">
          <span class="secondary-card__meta">${secondary.tag}</span>
          <span class="secondary-card__sigil" aria-hidden="true">${secondary.sigil}</span>
          <strong>${secondary.name}</strong>
          <span>${secondary.description}</span>
          <small>${secondary.detail}</small>
        </button>`).join("");
      ui.secondaryScreen.hidden = false;
      ui.objectiveText.textContent = `${this.weaponProfile.name} · 选择免费副武器`;
      ui.secondaryOptions.querySelector("button")?.focus({ preventScroll: true });
      soundscape.play("wave", true);
      return true;
    }

    applySecondaryChoice(id) {
      if (this.choiceMode !== "secondary" || this.getOwnedSecondaryIds().length > 0) return false;
      const secondary = this.unlockSecondaryWeapon(id, this.gameplayTime);
      if (!secondary) return false;
      ui.secondaryScreen.hidden = true;
      this.spawnExpandingSigil(this.player.x, this.player.y, secondary.colorValue, 76, 420);
      this.showCombatLabel(this.player.x, this.player.y - 38, secondary.name, secondary.colorValue);
      soundscape.play("upgrade", true);
      this.renderBuild();
      if (!this.switchChoiceMode("secondary", "shop")) return false;
      const route = this.getRoute(this.activeRouteId);
      if (!this.showShop(1, route)) this.leaveChoiceMode("shop");
      return true;
    }

    getSecondaryState() {
      const profile = this.getSecondaryProfile();
      const profiles = this.getSecondaryProfiles();
      return {
        open: this.choiceMode === "secondary",
        selectedId: this.secondaryWeaponId,
        ownedIds: profiles.map((secondary) => secondary.id),
        choices: this.getCompatibleSecondaryProfiles().map((secondary) => secondary.id),
        choiceProfiles: this.getCompatibleSecondaryProfiles().map((secondary) => ({
          id: secondary.id,
          weaponOnly: secondary.weaponOnly,
          upgradeIds: secondary.upgrades.map((upgrade) => upgrade.id),
        })),
        upgrades: [...this.secondaryUpgradeIds],
        profile: profile ? { id: profile.id, name: profile.name, interval: this.getSecondaryInterval(profile) } : null,
        profiles: profiles.map((secondary) => ({
          id: secondary.id,
          name: secondary.name,
          interval: this.getSecondaryInterval(secondary),
        })),
        telemetry: {
          ...this.secondaryTelemetry,
          projectileKinds: [...this.secondaryTelemetry.projectileKinds],
          fxStyles: [...this.secondaryTelemetry.fxStyles],
          audioCues: [...this.secondaryTelemetry.audioCues],
          specialTriggers: [...this.secondaryTelemetry.specialTriggers],
          bySecondary: JSON.parse(JSON.stringify(this.secondaryTelemetry.bySecondary)),
        },
      };
    }

    gainShopCurrency(amount, source = "", showFeedback = false) {
      const value = Math.max(0, Math.round(amount));
      if (value <= 0) return 0;
      this.shopCurrency += value;
      this.shopCurrencyEarned += value;
      if (showFeedback) {
        this.showCombatLabel(this.player.x, this.player.y - 34, `灯屑 +${value}`, COLORS.gold);
        if (source) ui.objectiveText.textContent = `${source} · 灯屑 +${value}`;
      }
      return value;
    }

    registerActDamage() {
      if (!this.bossSpawned) this.actDamageTaken = true;
    }

    getShopRefreshCost(visit = this.pendingShopVisit || this.shopVisit || 1) {
      return [25, 35, 45][Math.max(0, Math.min(2, visit - 1))];
    }

    getEligibleShopUpgrades(excluded = new Set()) {
      return upgradeCatalog.filter((upgrade) => (
        !excluded.has(`upgrade:${upgrade.id}`)
        && this.upgradeLevels[upgrade.id] < upgrade.maxLevel
        && (!upgrade.weaponOnly || upgrade.weaponOnly === this.weaponProfile.id)
      ));
    }

    createShopUpgradeOffer(upgrade, category, cost) {
      if (!upgrade) return null;
      const synergy = this.getCompletingSynergy(upgrade.id) || this.getStartingSynergy(upgrade.id);
      return {
        id: `upgrade:${upgrade.id}`,
        type: "upgrade",
        upgradeId: upgrade.id,
        category,
        sigil: upgrade.sigil,
        name: upgrade.name,
        description: upgrade.description,
        detail: synergy ? `关联共鸣 · ${synergy.name}` : `当前 ${this.upgradeLevels[upgrade.id]} / ${upgrade.maxLevel} 级`,
        color: upgrade.color,
        cost,
        slots: 1,
      };
    }

    createSecondaryUpgradeOffer(visit) {
      const profiles = this.getSecondaryProfiles();
      if (!profiles.length || visit < 2) return null;
      const candidates = profiles.flatMap((secondary) => (
        secondary.upgrades
          .filter((upgrade) => !this.secondaryUpgradeIds.has(upgrade.id))
          .map((upgrade) => ({ secondary, upgrade }))
      ));
      if (!candidates.length) return null;
      const candidateIndex = (visit - 2 + (this.shopRefreshUsed ? 1 : 0)) % candidates.length;
      const { secondary, upgrade } = candidates[candidateIndex];
      return {
        id: `secondaryUpgrade:${upgrade.id}`,
        type: "secondaryUpgrade",
        secondaryId: secondary.id,
        secondaryUpgradeId: upgrade.id,
        category: `${secondary.name}改造`,
        sigil: upgrade.sigil,
        name: upgrade.name,
        description: upgrade.description,
        detail: `仅强化 ${secondary.name} · 普通整备位 1`,
        color: upgrade.color,
        cost: 135 + visit * 15,
        slots: 1,
      };
    }

    createSecondaryWeaponOffer(visit) {
      if (this.getOwnedSecondaryIds().length === 0) return null;
      const unowned = this.getCompatibleSecondaryProfiles().filter((secondary) => !this.hasSecondaryWeapon(secondary.id));
      if (!unowned.length) return null;
      const secondary = unowned[(visit - 1 + (this.shopRefreshUsed ? 1 : 0)) % unowned.length];
      return {
        id: `secondaryWeapon:${secondary.id}`,
        type: "secondaryWeapon",
        secondaryId: secondary.id,
        category: "副武器蓝图",
        sigil: secondary.sigil,
        name: secondary.name,
        description: secondary.description,
        detail: "新增一把副武器 · 独立冷却自动发射",
        color: secondary.color,
        cost: [80, 120, 160][Math.max(0, Math.min(2, visit - 1))],
        slots: 1,
      };
    }

    generateShopOffers(visit) {
      const excluded = new Set(this.shopPurchasedThisVisit);
      const available = this.getEligibleShopUpgrades(excluded);
      const used = new Set();
      const takeUpgrade = (preferredIds, predicate = null) => {
        const preferred = preferredIds
          .map((id) => available.find((upgrade) => upgrade.id === id && !used.has(upgrade.id)))
          .find(Boolean);
        const matched = preferred || available.find((upgrade) => !used.has(upgrade.id) && (!predicate || predicate(upgrade)));
        if (matched) used.add(matched.id);
        return matched || null;
      };
      const weaponUpgrade = takeUpgrade([
        this.weaponProfile.signatureUpgrade,
        "focus",
        "rhythm",
        "volley",
        "precision",
        "reach",
      ]);
      const synergyUpgrade = takeUpgrade([], (upgrade) => Boolean(this.getCompletingSynergy(upgrade.id)))
        || takeUpgrade([], (upgrade) => Boolean(this.getStartingSynergy(upgrade.id)))
        || takeUpgrade([]);
      const supplyPool = shopSupplyCatalog.filter((supply) => !excluded.has(`supply:${supply.id}`));
      const supplyIndex = (visit - 1 + (this.shopRefreshUsed ? 1 : 0)) % Math.max(1, supplyPool.length);
      const supply = supplyPool[supplyIndex] || shopSupplyCatalog[0];
      const relicPool = shopRelicCatalog.filter((relic) => !this.shopRelics.has(relic.id));
      const relicIndex = (visit - 1 + (this.shopRefreshUsed ? 3 : 0)) % Math.max(1, relicPool.length);
      const forcedRelic = QA_RELIC_OFFER
        ? relicPool.find((candidate) => candidate.id === QA_RELIC_OFFER)
        : null;
      const relic = forcedRelic || relicPool[relicIndex] || shopRelicCatalog[(visit - 1) % shopRelicCatalog.length];
      const secondaryWeaponOffer = this.createSecondaryWeaponOffer(visit);
      const secondaryUpgradeOffer = this.getOwnedSecondaryIds().length > 0
        ? this.createSecondaryUpgradeOffer(visit)
        : null;
      const secondaryFeatureOffer = visit === 2
        ? secondaryUpgradeOffer || secondaryWeaponOffer
        : secondaryWeaponOffer || secondaryUpgradeOffer;
      const primaryOffer = visit === 2 && synergyUpgrade
        ? this.createShopUpgradeOffer(synergyUpgrade, "共鸣组件", 125 + visit * 15)
        : this.createShopUpgradeOffer(weaponUpgrade, "守夜器强化", 90 + visit * 10);
      const secondarySlotFallback = visit === 2 && synergyUpgrade
        ? this.createShopUpgradeOffer(weaponUpgrade, "守夜器强化", 90 + visit * 10)
        : this.createShopUpgradeOffer(synergyUpgrade, "共鸣组件", 125 + visit * 15);
      const offers = [
        primaryOffer,
        secondaryFeatureOffer || secondarySlotFallback,
        supply ? {
          id: `supply:${supply.id}`,
          type: "supply",
          supplyId: supply.id,
          category: "补给整备",
          sigil: supply.sigil,
          name: supply.name,
          description: supply.description,
          detail: "普通整备位 1",
          color: supply.color,
          cost: 60 + visit * 10,
          slots: 1,
        } : null,
        relic ? {
          id: `relic:${relic.id}`,
          type: "relic",
          relicId: relic.id,
          category: `稀有遗物 · ${relic.category}`,
          sigil: relic.sigil,
          name: relic.name,
          description: relic.description,
          detail: "占用 1 个遗物槽 · 不占普通整备位",
          color: relic.color,
          cost: 245 + visit * 15,
          slots: 0,
          relicSlots: 1,
        } : null,
      ].filter(Boolean);
      return offers;
    }

    showShop(visit, route = null) {
      if (this.ended || this.shopVisitsSeen.has(visit)) return false;
      if (!this.choiceMode && !this.enterChoiceMode("shop")) return false;
      if (this.choiceMode !== "shop") return false;
      this.shopVisit = visit;
      this.pendingShopVisit = visit;
      this.shopVisitsSeen.add(visit);
      this.shopSlotsUsed = 0;
      this.shopRefreshUsed = false;
      this.shopPurchasedThisVisit = new Set();
      const flawlessBonus = this.actDamageTaken ? 0 : this.gainShopCurrency(20, "无伤幕奖");
      this.shopOffers = this.generateShopOffers(visit);
      ui.shopKicker.textContent = `幕间整备 · 第 ${visit} / 3 次`;
      ui.shopTitle.textContent = visit === 3 ? "终夜前，花掉该花的灯屑" : "给下一幕准备一个答案";
      ui.shopPrompt.textContent = route
        ? `${route.name}已经确定。普通整备最多购买两件；遗物使用独立的 2 个遗物槽。`
        : "终夜前最后一次整备。普通整备与遗物槽互不占用，灯屑仍共用。";
      ui.shopNotice.textContent = flawlessBonus > 0
        ? `本幕未受伤 · 额外获得 ${flawlessBonus} 灯屑`
        : "本幕受到过伤害 · 本次没有无伤奖励";
      ui.shopScreen.hidden = false;
      ui.objectiveText.textContent = `幕间商店 · 持有 ${this.shopCurrency} 灯屑`;
      this.renderShop();
      soundscape.play("wave", true);
      return true;
    }

    canPurchaseShopOffer(offer) {
      return this.getShopOfferDisabledReason(offer) === null;
    }

    getShopOfferDisabledReason(offer) {
      if (!offer || this.choiceMode !== "shop") return "shop-closed";
      if (this.shopPurchasedThisVisit.has(offer.id)) return "already-purchased";
      if (offer.type !== "relic" && this.shopSlotsUsed + offer.slots > 2) return "purchase-slots-full";
      if (this.shopCurrency < offer.cost) return "insufficient-currency";
      if (offer.type === "relic" && this.shopRelics.has(offer.relicId)) return "already-equipped";
      if (offer.type === "relic" && this.shopRelics.size >= this.shopRelicCapacity) return "relic-slots-full";
      if (offer.type === "upgrade") {
        const upgrade = upgradeCatalog.find((item) => item.id === offer.upgradeId);
        if (!upgrade || this.upgradeLevels[upgrade.id] >= upgrade.maxLevel) return "upgrade-maxed";
      }
      if (offer.type === "secondaryWeapon") {
        const secondary = this.getSecondaryProfile(offer.secondaryId);
        if (!secondary) return "secondary-missing";
        if (secondary.weaponOnly !== this.weaponProfile.id) return "secondary-incompatible";
        if (this.hasSecondaryWeapon(offer.secondaryId)) return "secondary-owned";
      }
      if (offer.type === "secondaryUpgrade") {
        if (!this.hasSecondaryWeapon(offer.secondaryId)) return "secondary-mismatch";
        const secondary = this.getSecondaryProfile(offer.secondaryId);
        if (!secondary?.upgrades.some((upgrade) => upgrade.id === offer.secondaryUpgradeId)) return "secondary-upgrade-missing";
        if (this.secondaryUpgradeIds.has(offer.secondaryUpgradeId)) return "secondary-upgrade-owned";
      }
      return null;
    }

    purchaseShopOffer(id) {
      if (this.choiceMode !== "shop") return false;
      const offer = this.shopOffers.find((item) => item.id === id);
      if (!this.canPurchaseShopOffer(offer)) return false;
      let grant = null;
      if (offer.type === "upgrade") {
        grant = this.grantUpgrade(offer.upgradeId);
        if (!grant) return false;
      } else if (offer.type === "supply") {
        const supply = shopSupplyCatalog.find((item) => item.id === offer.supplyId);
        if (!supply) return false;
        supply.apply(this);
      } else if (offer.type === "relic") {
        const relic = shopRelicCatalog.find((item) => item.id === offer.relicId);
        if (!relic) return false;
        this.shopRelics.add(relic.id);
        relic.apply(this);
        this.equippedShopRelics.set(relic.id, {
          relicId: relic.id,
          paidCost: offer.cost,
          boughtVisit: this.pendingShopVisit,
          slots: offer.slots,
        });
      } else if (offer.type === "secondaryWeapon") {
        if (!this.unlockSecondaryWeapon(offer.secondaryId, this.gameplayTime)) return false;
      } else if (offer.type === "secondaryUpgrade") {
        if (!this.hasSecondaryWeapon(offer.secondaryId) || this.secondaryUpgradeIds.has(offer.secondaryUpgradeId)) return false;
        this.secondaryUpgradeIds.add(offer.secondaryUpgradeId);
      } else {
        return false;
      }
      this.shopCurrency -= offer.cost;
      this.shopCurrencySpent += offer.cost;
      this.shopSlotsUsed += offer.slots;
      this.shopPurchasedThisVisit.add(offer.id);
      this.shopPurchaseHistory.push({
        visit: this.pendingShopVisit,
        id: offer.id,
        name: offer.name,
        category: offer.category,
        cost: offer.cost,
        slots: offer.slots,
        type: offer.type,
        secondaryId: offer.secondaryId || null,
      });
      const synergy = grant?.unlockedSynergies?.[0];
      ui.shopNotice.textContent = synergy
        ? `购入 ${offer.name} · 解锁 ${synergy.name}`
        : `购入 ${offer.name} · 余下 ${this.shopCurrency} 灯屑`;
      soundscape.play(synergy ? "synergy" : "upgrade", true);
      this.renderBuild();
      this.updateHud(true);
      this.renderShop();
      return true;
    }

    getRelicRefund(entry) {
      return Math.floor((entry?.paidCost || 0) * 0.6 / 5) * 5;
    }

    sellShopRelic(id) {
      if (this.choiceMode !== "shop") return false;
      const entry = this.equippedShopRelics.get(id);
      const relic = shopRelicCatalog.find((item) => item.id === id);
      if (!entry || !relic || !this.shopRelics.has(id)) return false;
      const refund = this.getRelicRefund(entry);
      relic.remove?.(this);
      this.shopRelics.delete(id);
      this.equippedShopRelics.delete(id);
      this.shopCurrency += refund;
      this.shopCurrencyRefunded += refund;
      if (entry.boughtVisit === this.pendingShopVisit) {
        this.shopSlotsUsed = Math.max(0, this.shopSlotsUsed - entry.slots);
      }
      this.shopSaleHistory.push({
        visit: this.pendingShopVisit,
        relicId: id,
        name: relic.name,
        paidCost: entry.paidCost,
        refund,
        boughtVisit: entry.boughtVisit,
        restoredPurchaseSlots: entry.boughtVisit === this.pendingShopVisit ? entry.slots : 0,
      });
      ui.shopNotice.textContent = `卖回 ${relic.name} · 收回 ${refund} 灯屑`;
      ui.objectiveText.textContent = `幕间商店 · 持有 ${this.shopCurrency} 灯屑`;
      soundscape.play("toggle", true);
      this.renderBuild();
      this.updateHud(true);
      this.renderShop();
      return true;
    }

    refreshShop() {
      const canRefreshForRelic = this.shopRelics.size < this.shopRelicCapacity;
      if (this.choiceMode !== "shop" || this.shopRefreshUsed || (this.shopSlotsUsed >= 2 && !canRefreshForRelic)) return false;
      const cost = this.getShopRefreshCost();
      if (this.shopCurrency < cost) return false;
      this.shopCurrency -= cost;
      this.shopCurrencySpent += cost;
      this.shopRefreshUsed = true;
      this.shopRefreshHistory.push({ visit: this.pendingShopVisit, cost });
      this.shopOffers = this.generateShopOffers(this.pendingShopVisit);
      ui.shopNotice.textContent = `货架已刷新 · 花费 ${cost} 灯屑`;
      soundscape.play("toggle", true);
      this.updateHud(true);
      this.renderShop();
      return true;
    }

    renderShop() {
      const refreshCost = this.getShopRefreshCost();
      ui.shopCurrency.textContent = `${this.shopCurrency} 灯屑`;
      ui.shopSlots.textContent = `普通整备 ${this.shopSlotsUsed} / 2`;
      const equippedEntries = [...this.equippedShopRelics.values()];
      ui.shopRelicSummary.textContent = `${equippedEntries.length} / ${this.shopRelicCapacity} 已用 · 每件占 1 槽 · 不占普通整备位`;
      ui.shopRelicSlots.innerHTML = Array.from({ length: this.shopRelicCapacity }, (_value, index) => {
        const entry = equippedEntries[index];
        if (!entry) return `<div class="shop-relic-slot is-empty"><span>${index + 1}</span><small>可装备 1 件</small></div>`;
        const relic = shopRelicCatalog.find((item) => item.id === entry.relicId);
        const refund = this.getRelicRefund(entry);
        return `<div class="shop-relic-slot" style="--relic-color:${relic?.color || "#f2c84b"}">
          <span class="shop-relic-slot__sigil" aria-hidden="true">${relic?.sigil || "遗"}</span>
          <span><strong>${relic?.name || entry.relicId}</strong><small>购入 ${entry.paidCost} · 卖回 ${refund}</small></span>
          <button type="button" data-shop-sell="${entry.relicId}" aria-label="卖回${relic?.name || "遗物"}，收回 ${refund} 灯屑">卖回</button>
        </div>`;
      }).join("");
      ui.shopRefreshButton.textContent = this.shopRefreshUsed ? "本次已刷新" : `刷新货架 · ${refreshCost}`;
      ui.shopRefreshButton.disabled = this.shopRefreshUsed
        || (this.shopSlotsUsed >= 2 && equippedEntries.length >= this.shopRelicCapacity)
        || this.shopCurrency < refreshCost;
      ui.shopOptions.innerHTML = this.shopOffers.map((offer) => {
        const purchased = this.shopPurchasedThisVisit.has(offer.id);
        const affordable = this.shopCurrency >= offer.cost;
        const fits = offer.type === "relic" || this.shopSlotsUsed + offer.slots <= 2;
        const reason = this.getShopOfferDisabledReason(offer);
        const disabled = reason !== null;
        const slotLabel = offer.type === "relic" ? "遗物槽 1" : `${offer.slots} 普通整备位`;
        const state = purchased
          ? "已购入"
          : reason === "relic-slots-full"
            ? "先卖出一件"
            : !fits
              ? "普通整备位不足"
              : !affordable ? "灯屑不足" : "购入";
        return `
          <button class="shop-card${offer.type === "relic" ? " shop-card--relic" : ""}${purchased ? " is-purchased" : ""}" type="button" data-shop-offer="${offer.id}" style="--shop-color:${offer.color}" ${disabled ? "disabled" : ""}>
            <span class="shop-card__meta"><em>${offer.category}</em><b>${slotLabel}</b></span>
            <span class="shop-card__sigil" aria-hidden="true">${offer.sigil}</span>
            <strong>${offer.name}</strong>
            <span class="shop-card__description">${offer.description}</span>
            <small>${offer.detail}</small>
            <span class="shop-card__price"><b>${offer.cost}</b> 灯屑 · ${state}</span>
          </button>`;
      }).join("");
      ui.shopContinueButton.textContent = this.shopSlotsUsed >= 2 ? "结束整备" : "保留灯屑并继续";
      ui.shopOptions.querySelector("button:not(:disabled)")?.focus({ preventScroll: true });
    }

    getShopState() {
      return {
        open: this.choiceMode === "shop",
        visit: this.pendingShopVisit,
        currency: this.shopCurrency,
        earned: this.shopCurrencyEarned,
        spent: this.shopCurrencySpent,
        slotsUsed: this.shopSlotsUsed,
        refreshUsed: this.shopRefreshUsed,
        refreshCost: this.getShopRefreshCost(),
        offers: this.shopOffers.map((offer) => ({
          ...offer,
          affordable: this.shopCurrency >= offer.cost,
          purchasable: this.canPurchaseShopOffer(offer),
          disabledReason: this.getShopOfferDisabledReason(offer),
          purchased: this.shopPurchasedThisVisit.has(offer.id),
        })),
        purchases: this.shopPurchaseHistory.map((entry) => ({ ...entry })),
        refreshes: this.shopRefreshHistory.map((entry) => ({ ...entry })),
        skips: this.shopSkipHistory.map((entry) => ({ ...entry })),
        relics: [...this.shopRelics],
        relicCapacity: this.shopRelicCapacity,
        relicSlots: [...this.equippedShopRelics.values()].map((entry) => ({ ...entry, refund: this.getRelicRefund(entry) })),
        sales: this.shopSaleHistory.map((entry) => ({ ...entry })),
        refunded: this.shopCurrencyRefunded,
        combatState: {
          damage: this.stats.damage,
          rawFireRate: this.stats.fireRate,
          effectiveFireRate: this.getEffectiveFireRate(),
          relicFireRateMultiplier: this.relicFireRateMultiplier,
          maxHp: this.playerMaxHealth,
          hp: this.playerHealth,
        },
      };
    }

    continueFromShop() {
      if (this.choiceMode !== "shop" || !this.pendingShopVisit) return false;
      const visit = this.pendingShopVisit;
      const purchased = this.shopPurchaseHistory.filter((entry) => entry.visit === visit);
      if (!purchased.length) this.shopSkipHistory.push({ visit, currency: this.shopCurrency });
      this.shopVisitsClosed.add(visit);
      this.pendingShopVisit = null;
      this.shopOffers = [];
      this.spawnAccumulator = 0;
      this.actDamageTaken = false;
      ui.shopScreen.hidden = true;
      if (!this.leaveChoiceMode("shop")) return false;
      const route = this.getRoute(this.activeRouteId);
      const title = visit === 1 ? "第二幕 · 黑潮改道" : visit === 2 ? "第三幕 · 精英合流" : "终夜前压 · 最后三十秒";
      const detail = visit === 3
        ? "守住最后一波压力，终夜首领即将现身"
        : `${route?.name || this.battlefieldProfile.name} · 灯屑 ${this.shopCurrency}`;
      ui.objectiveText.textContent = detail;
      this.showPhaseBanner(title, route?.name || this.battlefieldProfile.name, detail);
      ui.pauseButton.focus({ preventScroll: true });
      return true;
    }

    applyDistrictTheme(route) {
      if (!this.districtWash || !route) return;
      this.tweens.killTweensOf(this.districtWash);
      this.districtWash.setFillStyle(route.themeColor, 0.1).setAlpha(0);
      this.tweens.add({
        targets: this.districtWash,
        alpha: 1,
        duration: 520,
        ease: "Sine.easeOut",
      });
    }

    showThreatAlert(message, color = COLORS.red, duration = 1700) {
      if (!message || this.ended) return;
      if (this.threatHideTimer) this.threatHideTimer.remove(false);
      ui.threatText.textContent = message;
      ui.threatAlert.style.setProperty("--threat-color", `#${color.toString(16).padStart(6, "0")}`);
      ui.threatAlert.hidden = false;
      this.threatHideTimer = this.time.delayedCall(duration, () => {
        ui.threatAlert.hidden = true;
        this.threatHideTimer = null;
      });
    }

    clearThreatAlert() {
      if (this.threatHideTimer) this.threatHideTimer.remove(false);
      this.threatHideTimer = null;
      ui.threatAlert.hidden = true;
    }

    handleResize(gameSize) {
      const width = gameSize.width;
      const height = gameSize.height;
      this.physics.world.setBounds(0, 0, width, height);
      this.drawArena(width, height);
      this.districtWash.setSize(width, height);
      const lampPosition = this.getBattlefieldAnchor("lamp", width, height);
      const playerPosition = this.getBattlefieldAnchor("player", width, height);
      this.lamp.setPosition(lampPosition.x, lampPosition.y);
      this.glowOuter.setPosition(lampPosition.x, lampPosition.y);
      this.glowInner.setPosition(lampPosition.x, lampPosition.y);
      this.lampAura.setPosition(lampPosition.x, lampPosition.y);
      if (!this.started) this.player.setPosition(playerPosition.x, playerPosition.y);
      this.player.x = Phaser.Math.Clamp(this.player.x, 24, width - 24);
      this.player.y = Phaser.Math.Clamp(this.player.y, this.getPlayableTop(), this.getPlayableBottom());
      if (this.phaseBanner?.active) {
        this.phaseBanner.setPosition(width / 2, Phaser.Math.Clamp(height * 0.3, 235, 255));
      }
      this.positionPatrolEvent();
      this.stageController?.resize();
    }

    update(_time, delta) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.P) || Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
        this.togglePause();
      }
      if (!this.started || this.ended || this.pausedByUser || this.isChoosing) {
        this.updateDashState(this.gameplayTime);
        return;
      }

      const frameDelta = Math.min(delta, 50);
      const deltaSeconds = frameDelta / 1000;
      this.gameplayTime += frameDelta;
      const time = this.gameplayTime;
      this.updateDashState(time);
      this.elapsed += deltaSeconds;
      this.samplePrototypeHordePressure(frameDelta);
      if (PRECISION_PROTOTYPE_MODE && this.elapsed >= RUN_DURATION) {
        this.finishRun(true, "90 秒精准读弹切片结束；该结果不代表产品方向选择。", "原型结束");
        return;
      }
      this.spawnAccumulator += frameDelta;
      this.dawnCooldown -= frameDelta;

      this.updatePlayer(time);
      if (this.emberCharge >= this.emberChargeMax && time >= this.emberSurgeReadyAt) {
        this.releaseEmberSurge("余热重燃");
      }
      this.syncEmberVisuals(time);
      this.updateAegisState(time);
      this.stageController?.update(time);
      if (this.ended) return;
      this.updateEnemies(time);
      this.updateArcNodes(time);
      this.updateBossHazards(time);
      const vfxBudget = this.getVfxBudgetScale();
      const trailCreditCap = Math.max(2, (this.usesCompactControls() ? 3 : 6) * vfxBudget);
      const trailCreditRate = (this.usesCompactControls() ? 90 : 180) * vfxBudget;
      this.playerTrailVfxCredit = Math.min(trailCreditCap, this.playerTrailVfxCredit + deltaSeconds * trailCreditRate);
      this.enemyTrailVfxCredit = Math.min(trailCreditCap, this.enemyTrailVfxCredit + deltaSeconds * trailCreditRate);
      this.updateProjectiles(frameDelta);
      this.updateSecondaryEffects(time, frameDelta);
      this.updateSparks();
      if (this.xp >= this.nextXp) this.tryShowLevelUp();
      if (this.isChoosing) {
        this.updateHud();
        return;
      }
      this.updateOrbitals(time);
      this.updatePatrolEvents(time, deltaSeconds);
      this.updateWaveState();
      if (this.isChoosing) {
        this.updateHud();
        return;
      }

      if (time - this.lastShotAt >= this.getEffectiveFireRate(time)) {
        this.fireAtNearest(time);
      }
      this.getSecondaryProfiles().forEach((secondary) => {
        const lastShotAt = this.secondaryLastShotAt?.get(secondary.id) ?? Number.NEGATIVE_INFINITY;
        if (time - lastShotAt >= this.getSecondaryInterval(secondary)) {
          this.fireSecondaryWeapon(time, secondary.id);
        }
      });
      if (this.stats.dawnLevel > 0 && this.dawnCooldown <= 0) {
        this.releaseDawnPulse();
      }

      if (this.elapsed >= RUN_DURATION && this.bossAlive && !this.overtimeStarted) {
        this.overtimeStarted = true;
        ui.waveLabel.textContent = `${RUN_END_LABEL} · 黎明决战`;
        ui.objectiveText.textContent = `黎明已至 · 击败${this.battlefieldProfile.bossName}`;
        this.showPhaseBanner("黎明决战", "不再计时", "唯一失败条件 · 守夜人倒下");
        this.cameras.main.flash(260, 242, 200, 75, false);
      }
      this.updateHud();
    }

    updatePlayer(time) {
      if (time < this.dashUntil) {
        if (time >= this.nextDashTrailAt) {
          this.nextDashTrailAt = time + 48;
          this.spawnDashAfterimage();
        }
        this.player.x = Phaser.Math.Clamp(this.player.x, 24, this.scale.width - 24);
        this.player.y = Phaser.Math.Clamp(this.player.y, this.getPlayableTop(), this.getPlayableBottom());
        return;
      }
      this.player.x = Phaser.Math.Clamp(this.player.x, 24, this.scale.width - 24);
      this.player.y = Phaser.Math.Clamp(this.player.y, this.getPlayableTop(), this.getPlayableBottom());
      let moveX = 0;
      let moveY = 0;
      if (this.cursors.left.isDown || this.keys.A.isDown) moveX -= 1;
      if (this.cursors.right.isDown || this.keys.D.isDown) moveX += 1;
      if (this.cursors.up.isDown || this.keys.W.isDown) moveY -= 1;
      if (this.cursors.down.isDown || this.keys.S.isDown) moveY += 1;
      if (Math.abs(touchVector.x) > 0.08 || Math.abs(touchVector.y) > 0.08) {
        moveX = touchVector.x;
        moveY = touchVector.y;
      }
      if (QA_MODE) {
        moveX = qaMoveVector.x;
        moveY = qaMoveVector.y;
      }
      const vector = new Phaser.Math.Vector2(moveX, moveY);
      if (vector.lengthSq() > 1) vector.normalize();
      if (vector.lengthSq() > 0.01) this.lastMoveVector.copy(vector).normalize();
      const movementSpeed = time < this.playerSlowedUntil ? this.stats.speed * 0.72 : this.stats.speed;
      this.player.setVelocity(vector.x * movementSpeed, vector.y * movementSpeed);
      if (Math.abs(vector.x) > 0.05) this.player.setFlipX(vector.x < 0);
      this.player.x = Phaser.Math.Clamp(this.player.x, 24, this.scale.width - 24);
      this.player.y = Phaser.Math.Clamp(this.player.y, this.getPlayableTop(), this.getPlayableBottom());
    }

    getEffectiveFireRate(time = this.gameplayTime) {
      return this.stats.fireRate * this.relicFireRateMultiplier * (time < this.surgeUntil ? 0.82 : 1);
    }

    gainEmberCharge(amount, source = "") {
      if (!Number.isFinite(amount) || amount <= 0 || this.ended) return 0;
      const gained = amount * this.emberGainMultiplier;
      const total = this.emberCharge + gained;
      if (total >= this.emberChargeMax && this.gameplayTime >= this.emberSurgeReadyAt) {
        const overflow = Math.max(0, total - this.emberChargeMax);
        this.releaseEmberSurge(source);
        this.emberCharge = Math.min(this.emberChargeMax - 1, overflow);
      } else {
        this.emberCharge = Math.min(this.emberChargeMax, total);
      }
      this.updateHud(true);
      return gained;
    }

    releaseEmberSurge(source = "") {
      if (this.ended || this.gameplayTime < this.emberSurgeReadyAt) return false;
      this.emberCharge = 0;
      this.surgeCount += 1;
      const surgeDuration = EMBER_SURGE_DURATION + this.surgeDurationBonus;
      this.surgeUntil = this.gameplayTime + surgeDuration;
      this.emberSurgeReadyAt = this.gameplayTime + EMBER_SURGE_COOLDOWN;
      this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 5);
      const damage = 18 + this.level * 3;
      this.enemies.getChildren().slice().forEach((enemy) => {
        if (!enemy?.active) return;
        const isBoss = enemy.getData("kind") === "boss";
        this.damageEnemy(enemy, isBoss ? Math.round(damage * 0.7) : damage, null);
      });
      if (this.ended) return true;
      this.spawnExpandingSigil(this.player.x, this.player.y, COLORS.gold, Math.min(230, this.scale.width * 0.22), 620);
      this.spawnExpandingSigil(this.player.x, this.player.y, COLORS.cyan, Math.min(170, this.scale.width * 0.17), 520, 70, Math.PI / 4);
      this.spawnRadialShards(this.player.x, this.player.y, COLORS.gold, this.usesCompactControls() ? 12 : 18, 112, 0, 0.62);
      this.burstAt(this.player.x, this.player.y, COLORS.gold, this.usesCompactControls() ? 18 : 28);
      this.cameras.main.flash(260, 242, 200, 75, false);
      this.cameras.main.shake(180, 0.008);
      this.showPhaseBanner("火种满溢", "蓄光爆发", `${source ? `${source} · ` : ""}清场震荡 · ${(surgeDuration / 1000).toFixed(1)} 秒余辉加速`);
      ui.objectiveText.textContent = `蓄光爆发 ${this.surgeCount} 次 · 余热 20 秒`;
      soundscape.play("synergy", true);
      return true;
    }

    syncEmberVisuals(time = this.gameplayTime) {
      if (!this.emberCore?.active || !this.emberHalo?.active || !this.player?.active) return;
      const chargeRatio = Phaser.Math.Clamp(this.emberCharge / this.emberChargeMax, 0, 1);
      const surging = time < this.surgeUntil;
      const bob = Math.sin(time * 0.0045) * 5;
      const x = this.player.x + (this.player.flipX ? 13 : -13);
      const y = this.player.y - 37 + bob;
      this.emberCore
        .setPosition(x, y)
        .setAngle(time * 0.07)
        .setScale((surging ? 0.72 : 0.38 + chargeRatio * 0.26) * (1 + Math.sin(time * 0.012) * 0.08))
        .setAlpha(surging ? 1 : 0.58 + chargeRatio * 0.4);
      this.emberHalo
        .setPosition(x, y)
        .setAngle(-time * 0.045)
        .setScale(surging ? 0.72 : 0.28 + chargeRatio * 0.42)
        .setAlpha(surging ? 0.9 : 0.2 + chargeRatio * 0.48);
    }

    trySharedVow() {
      if (
        !this.activeSynergies.has("sharedVow") ||
        this.sharedVowUsed ||
        this.playerHealth / this.playerMaxHealth > 0.35
      ) return false;
      this.sharedVowUsed = true;
      this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 25);
      this.gainEmberCharge(50, "灯命相契");
      this.spawnExpandingSigil(this.player.x, this.player.y, COLORS.green, 96, 430);
      this.burstAt(this.player.x, this.player.y, COLORS.green, 14);
      this.announceSynergyTrigger("sharedVow", this.player.x, this.player.y - 30, "生命 +25 · 火种 +50");
      soundscape.play("shield", true);
      return true;
    }

    getDashDirection() {
      let moveX = 0;
      let moveY = 0;
      if (this.cursors.left.isDown || this.keys.A.isDown) moveX -= 1;
      if (this.cursors.right.isDown || this.keys.D.isDown) moveX += 1;
      if (this.cursors.up.isDown || this.keys.W.isDown) moveY -= 1;
      if (this.cursors.down.isDown || this.keys.S.isDown) moveY += 1;
      if (Math.abs(touchVector.x) > 0.08 || Math.abs(touchVector.y) > 0.08) {
        moveX = touchVector.x;
        moveY = touchVector.y;
      }
      if (QA_MODE) {
        moveX = qaMoveVector.x;
        moveY = qaMoveVector.y;
      }
      const inputDirection = new Phaser.Math.Vector2(moveX, moveY);
      if (inputDirection.lengthSq() > 0.01) return inputDirection.normalize();

      let nearestEnemy = null;
      let nearestDistance = Number.POSITIVE_INFINITY;
      this.enemies.children.iterate((enemy) => {
        if (!enemy?.active) return;
        const distance = Phaser.Math.Distance.Squared(this.player.x, this.player.y, enemy.x, enemy.y);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestEnemy = enemy;
        }
      });
      if (nearestEnemy) {
        return new Phaser.Math.Vector2(this.player.x - nearestEnemy.x, this.player.y - nearestEnemy.y).normalize();
      }
      return this.lastMoveVector.clone().normalize();
    }

    tryDash(time = this.gameplayTime) {
      if (!this.started || this.ended || this.pausedByUser || this.isChoosing || time < this.dashReadyAt) return false;
      const direction = this.getDashDirection();
      this.lastMoveVector.copy(direction);
      this.dashReadyAt = time + this.dashCooldown;
      this.dashUntil = time + DASH_DURATION;
      this.dashInvulnerableUntil = time + DASH_INVULNERABILITY;
      this.nextDashTrailAt = 0;
      this.dashAfterglowArmed = this.stats.afterglowLevel > 0;
      this.player.setVelocity(direction.x * 760, direction.y * 760);
      this.player.setFlipX(direction.x < -0.05);
      this.player.setTint(COLORS.cyan);
      this.spawnDashAfterimage();
      this.spawnRipple(this.player.x, this.player.y, COLORS.cyan);
      this.showCombatLabel(this.player.x, this.player.y - 34, "闪步", COLORS.cyan);
      this.cameras.main.shake(70, 0.0025);
      soundscape.play("dash");
      this.time.delayedCall(DASH_DURATION + 60, () => {
        if (this.player?.active) this.player.clearTint();
      });
      this.updateDashState(time);
      return true;
    }

    spawnDashAfterimage() {
      const x = this.player.x;
      const y = this.player.y;
      const detonates = this.dashAfterglowArmed;
      this.dashAfterglowArmed = false;
      const afterimage = this.add.image(this.player.x, this.player.y, this.player.texture.key)
        .setDepth(7)
        .setAlpha(0.38)
        .setTint(COLORS.cyan)
        .setFlipX(this.player.flipX);
      this.tweens.add({
        targets: afterimage,
        alpha: 0,
        scale: 0.72,
        duration: 230,
        ease: "Quad.easeOut",
        onComplete: () => {
          afterimage.destroy();
          if (detonates && !this.ended) this.detonateAfterglow(x, y);
        },
      });
    }

    detonateAfterglow(x, y, isEcho = false) {
      const level = this.stats.afterglowLevel;
      if (level <= 0 || this.ended) return;
      const radius = 58 + level * 10 + (isEcho ? 16 : 0);
      const damage = Math.round((11 + level * 8) * (isEcho ? 0.72 : 1));
      const color = isEcho ? 0x7ce5d8 : COLORS.cyan;
      this.spawnExpandingSigil(x, y, color, radius, isEcho ? 390 : 320, 0, isEcho ? Math.PI / 4 : 0);
      this.spawnExpandingSigil(x, y, color, radius * 0.72, isEcho ? 430 : 360, 55, Math.PI / 4);
      this.spawnRadialShards(x, y, color, isEcho ? 8 : 10, radius * 0.58, Math.PI / 10, isEcho ? 0.36 : 0.44);
      const targets = [];
      this.enemies.children.iterate((enemy) => {
        if (!enemy?.active) return;
        if (Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= radius) targets.push(enemy);
      });
      targets.forEach((enemy) => this.damageEnemy(enemy, damage, null));
      this.burstAt(x, y, color, isEcho ? 12 : 9 + level * 2);
      if (isEcho) {
        this.announceSynergyTrigger("lightTrail", x, y, `回响 ${damage}`);
        soundscape.play("synergy", true);
        return;
      }
      this.showCombatLabel(x, y - 26, `余辉 ${damage} · ${targets.length}影`, COLORS.cyan);
      soundscape.play("pulse");
      if (this.activeSynergies.has("lightTrail")) {
        this.time.delayedCall(250, () => this.detonateAfterglow(x, y, true));
      }
    }

    updateDashState(time) {
      const remaining = Math.max(0, this.dashReadyAt - time);
      const canUse = this.started && !this.ended && !this.pausedByUser && !this.isChoosing && remaining <= 0;
      ui.dashButton.disabled = !canUse;
      ui.dashButton.classList.toggle("is-ready", canUse);
      ui.dashButton.classList.toggle("is-cooling", this.started && !this.ended && remaining > 0);
      ui.dashButton.style.setProperty("--dash-cooldown", String(Math.min(1, remaining / this.dashCooldown)));
      ui.dashCooldown.textContent = remaining > 0 ? (remaining / 1000).toFixed(1) : "SPACE";
      if (!this.started) {
        ui.dashButton.setAttribute("aria-label", "闪步（尚未开始）");
      } else if (this.ended) {
        ui.dashButton.setAttribute("aria-label", "闪步（本局已结束）");
      } else if (this.pausedByUser || this.isChoosing) {
        ui.dashButton.setAttribute("aria-label", "闪步（暂不可用）");
      } else if (remaining > 0) {
        ui.dashButton.setAttribute("aria-label", `闪步（冷却 ${Math.ceil(remaining / 100) / 10} 秒）`);
      } else {
        ui.dashButton.setAttribute("aria-label", "闪步（可用）");
      }
    }

    showDashEvade(x, y) {
      if (this.gameplayTime < this.nextDashNoticeAt) return;
      this.nextDashNoticeAt = this.gameplayTime + 420;
      this.burstAt(x, y, COLORS.cyan, 6);
      this.showCombatLabel(this.player.x, this.player.y - 31, "闪避", COLORS.cyan);
    }

    updateAegisState(time) {
      if (this.stats.aegisLevel <= 0) {
        this.aegisRing.setVisible(false);
        return;
      }
      const ready = time >= this.aegisReadyAt;
      this.aegisRing.setPosition(this.player.x, this.player.y).setVisible(ready);
      if (ready && !this.aegisWasReady) {
        this.spawnRipple(this.player.x, this.player.y, COLORS.armor);
        this.showCombatLabel(this.player.x, this.player.y - 35, "微光盾已充能", COLORS.armor);
      }
      this.aegisWasReady = ready;
    }

    tryAegisBlock(impactX, impactY) {
      if (this.stats.aegisLevel <= 0 || this.gameplayTime < this.aegisReadyAt) return false;
      const cooldown = Math.max(6200, 10800 - this.stats.aegisLevel * 1400);
      this.aegisReadyAt = this.gameplayTime + cooldown;
      this.aegisWasReady = false;
      this.aegisRing.setVisible(false);
      ui.objectiveText.textContent = "技能触发 · 微光盾";
      this.spawnRipple(this.player.x, this.player.y, COLORS.armor);
      this.burstAt(impactX, impactY, COLORS.armor, 10);
      this.showCombatLabel(this.player.x, this.player.y - 34, "微光盾 · 已抵挡", COLORS.armor);
      if (this.activeSynergies.has("reprisalAegis")) {
        const radius = 95;
        const damage = 12 + this.stats.thornsLevel * 8;
        this.spawnExpandingSigil(this.player.x, this.player.y, COLORS.armor, radius, 360);
        this.enemies.getChildren().slice().forEach((enemy) => {
          if (!enemy?.active || Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) > radius) return;
          this.damageEnemy(enemy, damage, null);
        });
        this.announceSynergyTrigger("reprisalAegis", this.player.x, this.player.y - 48, `反击 ${damage}`);
      }
      soundscape.play("shield");
      return true;
    }

    applyFrost(enemy) {
      if (!enemy.active || this.stats.frostLevel <= 0) return;
      const isBoss = enemy.getData("kind") === "boss";
      const slowFactor = isBoss ? 0.86 : Math.max(0.5, 0.79 - this.stats.frostLevel * 0.09);
      enemy.setData({
        slowedUntil: Math.max(enemy.getData("slowedUntil") || 0, this.gameplayTime + 1150 + this.stats.frostLevel * 260),
        slowFactor,
      });
      if (this.gameplayTime < (enemy.getData("nextFrostFxAt") || 0)) return;
      enemy.setData("nextFrostFxAt", this.gameplayTime + 520);
      this.spawnFrostBloom(enemy.x, enemy.y);
      if (
        this.gameplayTime >= (this.nextFrostNoticeAt || 0) &&
        !ui.objectiveText.textContent.includes("锁定") &&
        !this.bossAlive
      ) {
        this.nextFrostNoticeAt = this.gameplayTime + 1800;
        ui.objectiveText.textContent = "技能触发 · 霜火减速";
        this.showCombatLabel(enemy.x, enemy.y - 26, "霜火 · 减速", COLORS.ice);
      }
    }

    applyBlaze(enemy) {
      if (!enemy.active || this.stats.blazeLevel <= 0) return;
      enemy.setData({
        burnUntil: this.gameplayTime + 2400,
        nextBurnAt: Math.min(enemy.getData("nextBurnAt") || Number.POSITIVE_INFINITY, this.gameplayTime + 420),
        burnDamage: 2 + this.stats.blazeLevel * 2,
      });
    }

    triggerFrostfire(enemy, x, y) {
      if (
        !enemy.active ||
        !this.activeSynergies.has("frostfire") ||
        this.gameplayTime < (enemy.getData("frostfireReadyAt") || 0)
      ) return;
      enemy.setData("frostfireReadyAt", this.gameplayTime + 700);
      const radius = 68;
      const damage = 8 + this.stats.frostLevel * 3 + this.stats.blazeLevel * 3;
      this.spawnExpandingSigil(x, y, COLORS.ice, radius, 340);
      this.spawnRadialShards(x, y, COLORS.goldHot, 8, 48, Math.PI / 8, 0.46);
      this.enemies.getChildren().slice().forEach((target) => {
        if (!target?.active || target === enemy) return;
        if (Phaser.Math.Distance.Between(x, y, target.x, target.y) <= radius) this.damageEnemy(target, damage, null);
      });
      this.announceSynergyTrigger("frostfire", x, y - 24, `裂变 ${damage}`);
    }

    tryChainLightning(origin, x, y, critical = false) {
      if (this.stats.chainLevel <= 0) return;
      this.chainHitCounter += critical && this.activeSynergies.has("stormMirror") ? 2 : 1;
      const threshold = Math.max(3, 7 - this.stats.chainLevel);
      if (this.chainHitCounter < threshold) return;
      const range = 175 + this.stats.chainLevel * 28;
      let target = null;
      let nearestDistance = range * range;
      this.enemies.children.iterate((enemy) => {
        if (!enemy || !enemy.active || enemy === origin) return;
        const distance = Phaser.Math.Distance.Squared(x, y, enemy.x, enemy.y);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          target = enemy;
        }
      });
      if (!target) {
        this.chainHitCounter = threshold - 1;
        return;
      }
      this.chainHitCounter = 0;
      if (!ui.objectiveText.textContent.includes("锁定") && !this.bossAlive) {
        ui.objectiveText.textContent = "技能触发 · 引雷";
      }
      const targetX = target.x;
      const targetY = target.y;
      this.drawLightning(x, y, targetX, targetY);
      const damage = 9 + this.stats.chainLevel * 7;
      this.damageEnemy(target, damage, null);
      this.showCombatLabel((x + targetX) / 2, (y + targetY) / 2 - 12, "引雷", 0xbca4ff);
      if (this.activeSynergies.has("stormMirror")) {
        let second = null;
        let secondDistance = range * range;
        this.enemies.children.iterate((enemy) => {
          if (!enemy?.active || enemy === origin || enemy === target) return;
          const distance = Phaser.Math.Distance.Squared(targetX, targetY, enemy.x, enemy.y);
          if (distance < secondDistance) {
            secondDistance = distance;
            second = enemy;
          }
        });
        if (second) {
          const secondX = second.x;
          const secondY = second.y;
          this.drawLightning(targetX, targetY, secondX, secondY);
          this.damageEnemy(second, Math.round(damage * 0.7), null);
          this.announceSynergyTrigger("stormMirror", secondX, secondY - 24, "二次折射");
        }
      }
      soundscape.play("chain");
    }

    drawLightning(x1, y1, x2, y2) {
      const lightning = this.add.graphics()
        .setDepth(32)
        .setBlendMode(Phaser.BlendModes.ADD);
      const angle = Phaser.Math.Angle.Between(x1, y1, x2, y2);
      const normalX = -Math.sin(angle);
      const normalY = Math.cos(angle);
      const points = [{ x: x1, y: y1 }];
      for (let index = 1; index < 6; index += 1) {
        const progress = index / 6;
        const jitter = Phaser.Math.Between(-14, 14);
        points.push({
          x: Phaser.Math.Linear(x1, x2, progress) + normalX * jitter,
          y: Phaser.Math.Linear(y1, y2, progress) + normalY * jitter,
        });
      }
      points.push({ x: x2, y: y2 });

      const strokeBolt = (width, color, alpha) => {
        lightning.lineStyle(width, color, alpha);
        lightning.beginPath();
        lightning.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach((point) => lightning.lineTo(point.x, point.y));
        lightning.strokePath();
      };
      strokeBolt(10, 0x7252c7, 0.16);
      strokeBolt(4, 0xbca4ff, 0.72);
      strokeBolt(1, 0xffffff, 1);

      [2, 4].forEach((pointIndex, branchIndex) => {
        const origin = points[pointIndex];
        const branchAngle = angle + (branchIndex === 0 ? -0.82 : 0.82);
        const midX = origin.x + Math.cos(branchAngle) * 13 + Phaser.Math.Between(-4, 4);
        const midY = origin.y + Math.sin(branchAngle) * 13 + Phaser.Math.Between(-4, 4);
        const endX = origin.x + Math.cos(branchAngle) * 28;
        const endY = origin.y + Math.sin(branchAngle) * 28;
        lightning.lineStyle(4, 0x8c6ee0, 0.2);
        lightning.beginPath();
        lightning.moveTo(origin.x, origin.y);
        lightning.lineTo(midX, midY);
        lightning.lineTo(endX, endY);
        lightning.strokePath();
        lightning.lineStyle(1, 0xf5efff, 0.8);
        lightning.strokePath();
      });
      this.burstAt(x2, y2, 0xbca4ff, 5);
      this.tweens.add({
        targets: lightning,
        alpha: 0,
        duration: 220,
        ease: "Quad.easeOut",
        onComplete: () => lightning.destroy(),
      });
    }

    updateEnemies(time) {
      this.enemies.children.iterate((enemy) => {
        if (!enemy || !enemy.active) return;
        const kind = enemy.getData("kind");
        this.updateEnemyBurn(enemy, time);
        if (!enemy.active || this.ended) return;
        this.updateEnemyDecorations(enemy);
        if (kind === "boss") {
          this.updateBossBehavior(enemy, time);
          return;
        }
        if (kind === "rift") {
          this.updateRift(enemy, time);
          return;
        }
        if (kind === "charger") {
          this.updateCharger(enemy, time);
          return;
        }
        if (kind === "herald") {
          this.updateHerald(enemy, time);
          return;
        }
        if (kind === "hexer") {
          this.updateHexer(enemy, time);
          return;
        }
        if (kind === "cantor") {
          this.updateCantor(enemy, time);
          return;
        }
        if (kind === "tideweaver") {
          this.updateTideweaver(enemy, time);
          return;
        }
        if (kind === "mirrorAcolyte") {
          this.updateMirrorAcolyte(enemy, time);
          return;
        }
        if (kind === "rammer") {
          this.updateRammer(enemy, time);
          return;
        }
        if (kind === "blinkHunter") {
          this.updateBlinkHunter(enemy, time);
          return;
        }
        if (kind === "frostOracle") {
          this.updateFrostOracle(enemy, time);
          return;
        }
        if (kind === "emberBomber") {
          this.updateEmberBomber(enemy, time);
          return;
        }
        if (kind === "echoDuelist") {
          this.updateEchoDuelist(enemy, time);
          return;
        }
        if (kind === "voidScribe") {
          this.updateVoidScribe(enemy, time);
          return;
        }
        if (kind === "prismSentry") {
          this.updatePrismSentry(enemy, time);
          return;
        }
        if (kind === "devourerRanged") {
          this.updateDevourerRanged(enemy, time);
          return;
        }

        const target = this.player;
        const speed = this.getEnemySpeed(enemy, time);
        if (kind === "wraith") {
          const baseAngle = Phaser.Math.Angle.Between(enemy.x, enemy.y, target.x, target.y);
          const drift = Math.sin(time / 210 + enemy.getData("driftPhase")) * 0.34;
          enemy.setVelocity(Math.cos(baseAngle + drift) * speed, Math.sin(baseAngle + drift) * speed);
          enemy.rotation = drift * 0.22;
        } else {
          this.physics.moveToObject(enemy, target, speed);
        }
      });
    }

    getEnemySpeed(enemy, time) {
      const slowFactor = time < (enemy.getData("slowedUntil") || 0) ? enemy.getData("slowFactor") || 0.72 : 1;
      const hasteFactor = time < (enemy.getData("hasteUntil") || 0) ? 1.34 : 1;
      return enemy.getData("speed") * slowFactor * hasteFactor;
    }

    updateEnemyBurn(enemy, time) {
      if (time >= (enemy.getData("burnUntil") || 0) || time < (enemy.getData("nextBurnAt") || 0)) return;
      enemy.setData("nextBurnAt", time + 600);
      const damage = enemy.getData("burnDamage") || 4;
      this.damageEnemy(enemy, damage, null);
      if (!enemy.active) return;
      this.burstAt(enemy.x, enemy.y, COLORS.goldHot, 2);
    }

    updateCharger(enemy, time) {
      const state = enemy.getData("attackState");
      if (state === "warning") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("attackAt")) this.beginChargerCharge(enemy, time);
        return;
      }
      if (state === "charging") {
        const targetX = enemy.getData("chargeTargetX");
        const targetY = enemy.getData("chargeTargetY");
        const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, targetX, targetY);
        if (time >= enemy.getData("chargeEndAt") || distance < 18) {
          this.endChargerCharge(enemy, time);
          return;
        }
        this.physics.moveTo(enemy, targetX, targetY, 430);
        enemy.rotation = Phaser.Math.Angle.Between(enemy.x, enemy.y, targetX, targetY);
        return;
      }
      if (state === "recovering") {
        enemy.setVelocity(0, 0);
        enemy.rotation = 0;
        if (time >= enemy.getData("recoverUntil")) enemy.setData("attackState", "moving");
        return;
      }

      const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      this.physics.moveToObject(enemy, this.player, this.getEnemySpeed(enemy, time));
      enemy.rotation = angle;
      if (distance <= 350 && time >= enemy.getData("nextAttackAt")) this.beginChargerWarning(enemy, time);
    }

    beginChargerWarning(enemy, time) {
      const targetX = this.player.x;
      const targetY = this.player.y;
      const targetRing = this.add.circle(targetX, targetY, 28, COLORS.goldHot, 0.045)
        .setStrokeStyle(2, COLORS.goldHot, 0.84)
        .setDepth(5);
      this.tweens.add({ targets: targetRing, scale: 0.48, alpha: 0.18, duration: 640, ease: "Sine.easeIn" });
      enemy.setData({
        attackState: "warning",
        attackAt: time + 640,
        chargeTargetX: targetX,
        chargeTargetY: targetY,
        chargeTargetRing: targetRing,
      });
      enemy.setVelocity(0, 0);
      enemy.setTint(COLORS.goldHot);
      if (!this.activePatrolEvent && !this.bossAlive && time >= (this.nextChargerNoticeAt || 0)) {
        this.nextChargerNoticeAt = time + 3600;
        this.showThreatAlert("奔魇锁定直线 · 横移或闪步躲开", COLORS.goldHot, 1100);
        soundscape.play("warning");
      }
    }

    beginChargerCharge(enemy, time) {
      if (!enemy.active) return;
      const targetX = enemy.getData("chargeTargetX");
      const targetY = enemy.getData("chargeTargetY");
      this.clearChargerTelegraph(enemy);
      enemy.setData({ attackState: "charging", chargeEndAt: time + 920 });
      enemy.clearTint();
      this.physics.moveTo(enemy, targetX, targetY, 430);
      this.spawnRipple(enemy.x, enemy.y, COLORS.goldHot);
      soundscape.play("charge");
    }

    endChargerCharge(enemy, time) {
      if (!enemy.active) return;
      this.clearChargerTelegraph(enemy);
      enemy.setVelocity(0, 0);
      enemy.setData({
        attackState: "recovering",
        recoverUntil: time + 520,
        nextAttackAt: time + Phaser.Math.Between(1900, 2500),
      });
      enemy.clearTint();
      this.spawnRipple(enemy.x, enemy.y, COLORS.goldHot);
      this.burstAt(enemy.x, enemy.y, COLORS.goldHot, 5);
    }

    clearChargerTelegraph(enemy) {
      ["chargeLine", "chargeTargetRing"].forEach((key) => {
        const decoration = enemy.getData(key);
        if (decoration?.active) {
          this.tweens.killTweensOf(decoration);
          decoration.destroy();
        }
        enemy.setData(key, null);
      });
    }

    steerRangedEnemy(enemy, time, minDistance, maxDistance, strafeScale = 0.7) {
      const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const speed = this.getEnemySpeed(enemy, time);
      if (distance > maxDistance) {
        enemy.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      } else if (distance < minDistance) {
        enemy.setVelocity(-Math.cos(angle) * speed, -Math.sin(angle) * speed);
      } else {
        const strafe = enemy.getData("strafeDirection") || 1;
        enemy.setVelocity(
          Math.cos(angle + Math.PI / 2) * speed * strafeScale * strafe,
          Math.sin(angle + Math.PI / 2) * speed * strafeScale * strafe,
        );
      }
      return { distance, angle };
    }

    updateMirrorAcolyte(enemy, time) {
      const state = enemy.getData("attackState");
      if (state === "warning") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("attackAt")) this.fireMirrorAcolyte(enemy, time);
        return;
      }
      if (state === "recovering") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("recoverUntil")) enemy.setData("attackState", "moving");
        return;
      }
      const { angle } = this.steerRangedEnemy(enemy, time, 215, 340, 0.78);
      enemy.rotation = Math.sin(time / 190 + enemy.getData("driftPhase")) * 0.12;
      if (time >= enemy.getData("nextAttackAt")) this.beginMirrorAcolyteAttack(enemy, time, angle);
    }

    beginMirrorAcolyteAttack(enemy, time, angle) {
      const duration = 720;
      const sourceRing = this.add.image(enemy.x, enemy.y, "fxRing")
        .setTint(COLORS.violet)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setAlpha(0.86)
        .setScale(0.5)
        .setDepth(5);
      this.tweens.add({ targets: sourceRing, scale: 1.5, angle: 190, alpha: 0.08, duration, ease: "Sine.easeIn" });
      enemy.setVelocity(0, 0).setTint(COLORS.violet);
      enemy.setData({ attackState: "warning", attackAt: time + duration, shotAngle: angle, sourceRing, fanTelegraph: null });
      this.showCombatLabel(enemy.x, enemy.y - 38, "双相蓄射", COLORS.violet);
    }

    fireMirrorAcolyte(enemy, time) {
      if (!enemy.active) return;
      const baseAngle = enemy.getData("shotAngle") || 0;
      enemy.getData("sourceRing")?.destroy();
      enemy.getData("fanTelegraph")?.destroy();
      [-0.18, 0.18].forEach((offset, index) => {
        const angle = baseAngle + offset;
        const color = index === 0 ? COLORS.cyan : 0xff6d79;
        const shot = this.enemyProjectiles.create(enemy.x, enemy.y, "enemyShot")
          .setDepth(19)
          .setTint(color)
          .setBlendMode(Phaser.BlendModes.NORMAL);
        shot.body.setCircle(7, 7, 7);
        shot.setVelocity(Math.cos(angle) * 218, Math.sin(angle) * 218);
        shot.setData({
          damage: enemy.getData("damage"),
          life: 2900,
          trailAt: 0,
          color,
          trailRadius: 5,
          fxStyle: "tide",
          curveRate: index === 0 ? 0.0001 : -0.0001,
        });
      });
      enemy.setData({
        attackState: "recovering",
        recoverUntil: time + 460,
        nextAttackAt: time + Phaser.Math.Between(2900, 3500),
        sourceRing: null,
        fanTelegraph: null,
        strafeDirection: -(enemy.getData("strafeDirection") || 1),
      });
      enemy.clearTint();
      this.spawnExpandingSigil(enemy.x, enemy.y, COLORS.cyan, 74, 330);
      this.spawnRadialShards(enemy.x, enemy.y, 0xff6d79, 8, 54, baseAngle, 0.46, Math.PI);
      soundscape.play("enemyShot", true);
    }

    updateBlinkHunter(enemy, time) {
      const state = enemy.getData("attackState");
      if (state === "vanishing") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("attackAt")) this.executeBlinkHunter(enemy, time);
        return;
      }
      if (state === "reappearing") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("recoverUntil")) {
          enemy.setData("attackState", "moving");
          enemy.clearTint().setAlpha(1);
        }
        return;
      }
      this.physics.moveToObject(enemy, this.player, this.getEnemySpeed(enemy, time));
      enemy.rotation = Math.sin(time / 120 + enemy.getData("driftPhase")) * 0.18;
      const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      if (distance < 520 && time >= enemy.getData("nextAttackAt")) this.beginBlinkHunter(enemy, time);
    }

    beginBlinkHunter(enemy, time) {
      const perpendicularX = -this.lastMoveVector.y;
      const perpendicularY = this.lastMoveVector.x;
      const side = enemy.getData("strafeDirection") || 1;
      const targetX = Phaser.Math.Clamp(
        this.player.x - this.lastMoveVector.x * 92 + perpendicularX * 54 * side,
        34,
        this.scale.width - 34,
      );
      const targetY = Phaser.Math.Clamp(
        this.player.y - this.lastMoveVector.y * 92 + perpendicularY * 54 * side,
        this.getPlayableTop() + 24,
        this.getPlayableBottom() - 24,
      );
      const sourceRing = this.add.image(enemy.x, enemy.y, "fxRing")
        .setTint(COLORS.cyan).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.78).setScale(0.5).setDepth(5);
      const targetRing = this.add.image(targetX, targetY, "fxRing")
        .setTint(COLORS.red).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.76).setScale(1.1).setDepth(5);
      this.tweens.add({ targets: sourceRing, scale: 1.35, angle: 140, alpha: 0.08, duration: 620, ease: "Sine.easeIn" });
      this.tweens.add({ targets: targetRing, scale: 0.52, angle: -120, alpha: 0.22, duration: 620, ease: "Sine.easeIn" });
      enemy.setVelocity(0, 0);
      enemy.body.checkCollision.none = true;
      enemy.setAlpha(0.52).setTint(COLORS.cyan);
      enemy.setData({
        attackState: "vanishing",
        attackAt: time + 620,
        blinkTargetX: targetX,
        blinkTargetY: targetY,
        sourceRing,
        targetRing,
      });
      this.showThreatAlert("跃影猎手消失 · 红环处即将现身", COLORS.cyan, 980);
      soundscape.play("warning");
    }

    executeBlinkHunter(enemy, time) {
      if (!enemy.active) return;
      enemy.getData("sourceRing")?.destroy();
      enemy.getData("targetRing")?.destroy();
      enemy.setPosition(enemy.getData("blinkTargetX"), enemy.getData("blinkTargetY"));
      enemy.body.checkCollision.none = false;
      enemy.setAlpha(1).setTint(COLORS.red);
      enemy.setData({
        attackState: "reappearing",
        recoverUntil: time + 420,
        nextAttackAt: time + Phaser.Math.Between(2600, 3200),
        sourceRing: null,
        targetRing: null,
        strafeDirection: -(enemy.getData("strafeDirection") || 1),
      });
      this.spawnExpandingSigil(enemy.x, enemy.y, COLORS.cyan, 74, 330);
      this.spawnRadialShards(enemy.x, enemy.y, COLORS.red, 8, 52, 0, 0.52);
      this.burstAt(enemy.x, enemy.y, COLORS.cyan, 10);
      soundscape.play("dash", true);
    }

    updateFrostOracle(enemy, time) {
      const state = enemy.getData("attackState");
      if (state === "warning") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("attackAt")) this.fireFrostOracle(enemy, time);
        return;
      }
      if (state === "recovering") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("recoverUntil")) enemy.setData("attackState", "moving");
        return;
      }
      const { angle } = this.steerRangedEnemy(enemy, time, 245, 360, 0.66);
      enemy.rotation = Math.sin(time / 230 + enemy.getData("driftPhase")) * 0.08;
      if (time >= enemy.getData("nextAttackAt")) this.beginFrostOracle(enemy, time, angle);
    }

    beginFrostOracle(enemy, time, angle) {
      const sourceRing = this.add.image(enemy.x, enemy.y, "fxRing")
        .setTint(COLORS.ice).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.82).setScale(0.52).setDepth(5);
      this.tweens.add({ targets: sourceRing, scale: 1.4, angle: 160, alpha: 0.1, duration: 780, ease: "Sine.easeIn" });
      enemy.setVelocity(0, 0).setTint(COLORS.ice);
      enemy.setData({ attackState: "warning", attackAt: time + 780, shotAngle: angle, sourceRing, fanTelegraph: null });
      this.showThreatAlert("霜蚀祭司三向寒弹 · 命中会减速", COLORS.ice, 1200);
      soundscape.play("warning");
    }

    fireFrostOracle(enemy, time) {
      if (!enemy.active) return;
      const baseAngle = enemy.getData("shotAngle") || 0;
      enemy.getData("sourceRing")?.destroy();
      enemy.getData("fanTelegraph")?.destroy();
      [-0.28, 0, 0.28].forEach((offset) => {
        const angle = baseAngle + offset;
        const shot = this.enemyProjectiles.create(enemy.x, enemy.y, "enemyShot")
          .setDepth(19).setTint(COLORS.ice).setBlendMode(Phaser.BlendModes.NORMAL);
        shot.body.setCircle(7, 7, 7);
        shot.setVelocity(Math.cos(angle) * 198, Math.sin(angle) * 198);
        shot.setData({
          damage: enemy.getData("damage"), life: 3000, trailAt: 0, color: COLORS.ice,
          trailRadius: 5, fxStyle: "frost", slowDuration: 1700,
        });
      });
      enemy.setData({
        attackState: "recovering", recoverUntil: time + 460,
        nextAttackAt: time + Phaser.Math.Between(2500, 3100), sourceRing: null, fanTelegraph: null,
        strafeDirection: -(enemy.getData("strafeDirection") || 1),
      });
      enemy.clearTint();
      this.spawnExpandingSigil(enemy.x, enemy.y, COLORS.ice, 76, 330);
      soundscape.play("enemyShot");
    }

    updateEmberBomber(enemy, time) {
      const state = enemy.getData("attackState");
      if (state === "warning") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("attackAt")) this.detonateEmberBomb(enemy, time);
        return;
      }
      if (state === "recovering") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("recoverUntil")) enemy.setData("attackState", "moving");
        return;
      }
      this.steerRangedEnemy(enemy, time, 300, 420, 0.52);
      enemy.rotation = Math.sin(time / 260 + enemy.getData("driftPhase")) * 0.08;
      if (time >= enemy.getData("nextAttackAt")) this.beginEmberBomb(enemy, time);
    }

    beginEmberBomb(enemy, time) {
      const targetX = this.player.x;
      const targetY = this.player.y;
      const marker = this.add.graphics().setDepth(5).setBlendMode(Phaser.BlendModes.ADD);
      marker.fillStyle(COLORS.red, 0.08);
      marker.fillCircle(targetX, targetY, 72);
      marker.lineStyle(3, COLORS.goldHot, 0.88);
      marker.strokeCircle(targetX, targetY, 72);
      marker.lineStyle(1, 0xfff0a3, 0.72);
      marker.lineBetween(targetX - 78, targetY, targetX + 78, targetY);
      marker.lineBetween(targetX, targetY - 78, targetX, targetY + 78);
      this.tweens.add({ targets: marker, alpha: { from: 0.34, to: 1 }, duration: 900, ease: "Sine.easeIn" });
      enemy.setVelocity(0, 0).setTint(COLORS.goldHot);
      enemy.setData({ attackState: "warning", attackAt: time + 900, bombX: targetX, bombY: targetY, bombMarker: marker });
      this.showThreatAlert("烬星落点锁定 · 离开橙色范围", COLORS.goldHot, 1250);
      soundscape.play("warning");
    }

    detonateEmberBomb(enemy, time) {
      if (!enemy.active) return;
      const x = enemy.getData("bombX");
      const y = enemy.getData("bombY");
      enemy.getData("bombMarker")?.destroy();
      this.spawnExpandingSigil(x, y, COLORS.goldHot, 92, 420);
      this.spawnExpandingSigil(x, y, COLORS.red, 68, 340, 50, Math.PI / 4);
      this.spawnRadialShards(x, y, COLORS.goldHot, 12, 72, 0, 0.58);
      this.burstAt(x, y, COLORS.red, 16);
      if (Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) <= 74) {
        this.damagePlayerFromHazard(enemy.getData("damage"), x, y, "烬星", COLORS.goldHot);
      }
      enemy.setData({
        attackState: "recovering", recoverUntil: time + 540,
        nextAttackAt: time + Phaser.Math.Between(3000, 3600), bombMarker: null,
        strafeDirection: -(enemy.getData("strafeDirection") || 1),
      });
      enemy.clearTint();
      this.cameras.main.shake(140, 0.006);
      soundscape.play("pulse");
    }

    updateEchoDuelist(enemy, time) {
      const state = enemy.getData("attackState");
      if (state === "warning") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("attackAt")) this.fireEchoDuelist(enemy, time);
        return;
      }
      if (state === "recovering") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("recoverUntil")) enemy.setData("attackState", "moving");
        return;
      }
      const { angle } = this.steerRangedEnemy(enemy, time, 225, 350, 0.82);
      enemy.rotation = angle + Math.sin(time / 150 + enemy.getData("driftPhase")) * 0.12;
      if (time >= enemy.getData("nextAttackAt")) this.beginEchoDuelist(enemy, time, angle);
    }

    beginEchoDuelist(enemy, time, angle) {
      const duration = 720;
      const sourceRing = this.add.image(enemy.x, enemy.y, "fxRing")
        .setTint(COLORS.cyan).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.84).setScale(0.48).setDepth(5);
      this.tweens.add({ targets: sourceRing, scale: 1.42, angle: 190, alpha: 0.08, duration, ease: "Sine.easeIn" });
      enemy.setVelocity(0, 0).setTint(COLORS.cyan);
      enemy.setData({ attackState: "warning", attackAt: time + duration, shotAngle: angle, sourceRing, fanTelegraph: null });
      this.showThreatAlert("回潮双刃 · 第一程后会折返追击", COLORS.cyan, duration + 620);
      soundscape.play("warning");
    }

    fireEchoDuelist(enemy, time) {
      if (!enemy.active) return;
      const baseAngle = enemy.getData("shotAngle") || 0;
      enemy.getData("sourceRing")?.destroy();
      enemy.getData("fanTelegraph")?.destroy();
      [-0.16, 0.16].forEach((offset, index) => {
        const angle = baseAngle + offset;
        const color = index === 0 ? COLORS.cyan : 0xff6d79;
        const shot = this.enemyProjectiles.create(enemy.x, enemy.y, "enemyBlade")
          .setDepth(19).setTint(color).setBlendMode(Phaser.BlendModes.NORMAL).setRotation(angle);
        shot.body.setSize(25, 8, true);
        shot.setVelocity(Math.cos(angle) * 286, Math.sin(angle) * 286);
        shot.setAngularVelocity(index === 0 ? 340 : -340);
        shot.setData({
          damage: enemy.getData("damage"), life: 2800, trailAt: 0, color,
          trailRadius: 5, fxStyle: "tide", reverseAt: time + 680,
          reverseSpeed: 326, reversed: false,
        });
      });
      enemy.setData({
        attackState: "recovering", recoverUntil: time + 480,
        nextAttackAt: time + Phaser.Math.Between(2700, 3300), sourceRing: null, fanTelegraph: null,
        strafeDirection: -(enemy.getData("strafeDirection") || 1),
      });
      enemy.clearTint();
      this.spawnExpandingSigil(enemy.x, enemy.y, COLORS.cyan, 88, 360);
      this.spawnRadialShards(enemy.x, enemy.y, 0xff6d79, 8, 58, baseAngle, 0.44, Math.PI);
      soundscape.play("enemyShot");
    }

    updateVoidScribe(enemy, time) {
      const state = enemy.getData("attackState");
      if (state === "warning") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("attackAt")) this.releaseVoidScribe(enemy, time);
        return;
      }
      if (state === "recovering") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("recoverUntil")) enemy.setData("attackState", "moving");
        return;
      }
      const { angle } = this.steerRangedEnemy(enemy, time, 300, 445, 0.48);
      enemy.rotation = Math.sin(time / 220 + enemy.getData("driftPhase")) * 0.08;
      if (time >= enemy.getData("nextAttackAt")) this.beginVoidScribe(enemy, time, angle);
    }

    beginVoidScribe(enemy, time, angle) {
      const duration = 920;
      const centerX = this.player.x;
      const centerY = this.player.y;
      const length = Math.hypot(this.scale.width, this.scale.height);
      const x1 = centerX - Math.cos(angle) * length;
      const y1 = centerY - Math.sin(angle) * length;
      const x2 = centerX + Math.cos(angle) * length;
      const y2 = centerY + Math.sin(angle) * length;
      const fanTelegraph = this.add.graphics().setDepth(5).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.38);
      fanTelegraph.lineStyle(42, 0xff6d79, 0.08);
      fanTelegraph.lineBetween(x1, y1, x2, y2);
      fanTelegraph.lineStyle(6, 0xff6d79, 0.78);
      fanTelegraph.lineBetween(x1, y1, x2, y2);
      fanTelegraph.lineStyle(2, COLORS.cyan, 0.9);
      fanTelegraph.lineBetween(x1, y1, x2, y2);
      const targetRing = this.add.image(centerX, centerY, "fxRing")
        .setTint(0xff6d79).setBlendMode(Phaser.BlendModes.ADD).setDepth(5).setAlpha(0.82).setScale(1.04);
      this.tweens.add({ targets: fanTelegraph, alpha: 0.98, duration, ease: "Sine.easeIn" });
      this.tweens.add({ targets: targetRing, scale: 0.48, angle: -180, alpha: 0.18, duration, ease: "Sine.easeIn" });
      enemy.setVelocity(0, 0).setTint(0xff6d79);
      enemy.setData({
        attackState: "warning", attackAt: time + duration,
        beamCenterX: centerX, beamCenterY: centerY, beamAngle: angle,
        fanTelegraph, targetRing,
      });
      this.showThreatAlert("裂光裁廊 · 离开红青光线", 0xff6d79, duration + 480);
      soundscape.play("warning", true);
    }

    releaseVoidScribe(enemy, time) {
      if (!enemy.active) return;
      const centerX = enemy.getData("beamCenterX");
      const centerY = enemy.getData("beamCenterY");
      const angle = enemy.getData("beamAngle") || 0;
      const length = Math.hypot(this.scale.width, this.scale.height);
      const x1 = centerX - Math.cos(angle) * length;
      const y1 = centerY - Math.sin(angle) * length;
      const x2 = centerX + Math.cos(angle) * length;
      const y2 = centerY + Math.sin(angle) * length;
      enemy.getData("fanTelegraph")?.destroy();
      enemy.getData("targetRing")?.destroy();
      const beam = this.add.graphics().setDepth(21).setBlendMode(Phaser.BlendModes.ADD);
      beam.lineStyle(72, 0xff6d79, 0.12);
      beam.lineBetween(x1, y1, x2, y2);
      beam.lineStyle(18, 0xff6d79, 0.86);
      beam.lineBetween(x1, y1, x2, y2);
      beam.lineStyle(5, 0xffffff, 0.96);
      beam.lineBetween(x1, y1, x2, y2);
      beam.lineStyle(2, COLORS.cyan, 1);
      beam.lineBetween(x1, y1, x2, y2);
      this.tweens.add({ targets: beam, alpha: 0, duration: 360, ease: "Quad.easeOut", onComplete: () => beam.destroy() });
      const playerOffsetX = this.player.x - centerX;
      const playerOffsetY = this.player.y - centerY;
      const distanceFromBeam = Math.abs(-Math.sin(angle) * playerOffsetX + Math.cos(angle) * playerOffsetY);
      if (distanceFromBeam <= 38) {
        this.damagePlayerFromHazard(enemy.getData("damage"), this.player.x, this.player.y, "裂光", 0xff6d79);
      }
      for (let index = -3; index <= 3; index += 1) {
        const x = centerX + Math.cos(angle) * index * 86;
        const y = centerY + Math.sin(angle) * index * 86;
        this.spawnRadialShards(x, y, index % 2 === 0 ? COLORS.cyan : 0xff6d79, 4, 36, angle + Math.PI / 2, 0.36, Math.PI);
      }
      this.spawnExpandingSigil(centerX, centerY, 0xff6d79, 118, 420);
      this.cameras.main.shake(170, 0.008);
      enemy.setData({
        attackState: "recovering", recoverUntil: time + 560,
        nextAttackAt: time + Phaser.Math.Between(3300, 3900), fanTelegraph: null, targetRing: null,
        strafeDirection: -(enemy.getData("strafeDirection") || 1),
      });
      enemy.clearTint();
      soundscape.play("pulse", true);
    }

    updatePrismSentry(enemy, time) {
      const state = enemy.getData("attackState");
      if (state === "warning") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("attackAt")) this.firePrismSentry(enemy, time);
        return;
      }
      if (state === "recovering") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("recoverUntil")) enemy.setData("attackState", "moving");
        return;
      }
      const { distance, angle } = this.steerRangedEnemy(enemy, time, 260, 410, 0.74);
      enemy.rotation = Math.sin(time / 175 + enemy.getData("driftPhase")) * 0.1;
      if (time >= enemy.getData("nextAttackAt")) this.beginPrismSentry(enemy, time, distance > 330 ? "sniper" : "fan", angle);
    }

    beginPrismSentry(enemy, time, mode, angle) {
      const duration = mode === "sniper" ? 900 : 660;
      const sourceRing = this.add.image(enemy.x, enemy.y, "fxRing")
        .setTint(COLORS.violet).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.82).setScale(0.52).setDepth(5);
      this.tweens.add({ targets: sourceRing, scale: 1.48, angle: 180, alpha: 0.08, duration, ease: "Sine.easeIn" });
      enemy.setVelocity(0, 0).setTint(mode === "sniper" ? COLORS.red : COLORS.violet);
      enemy.setData({ attackState: "warning", attackAt: time + duration, prismMode: mode, shotAngle: angle, sourceRing, fanTelegraph: null });
      this.showThreatAlert(mode === "sniper" ? "棱镜狙击锁定 · 看见弹头后横移" : "棱镜七向折射 · 穿过弹缝", mode === "sniper" ? COLORS.red : COLORS.violet, duration + 420);
      soundscape.play("warning");
    }

    firePrismSentry(enemy, time) {
      if (!enemy.active) return;
      const mode = enemy.getData("prismMode") || "fan";
      const baseAngle = enemy.getData("shotAngle") || 0;
      enemy.getData("sourceRing")?.destroy();
      enemy.getData("fanTelegraph")?.destroy();
      const offsets = mode === "sniper" ? [0] : [-0.42, -0.28, -0.14, 0, 0.14, 0.28, 0.42];
      offsets.forEach((offset, index) => {
        const angle = baseAngle + offset;
        const frostShot = mode !== "sniper" && index % 2 === 0;
        const color = mode === "sniper" ? COLORS.red : frostShot ? COLORS.ice : COLORS.violet;
        const shot = this.enemyProjectiles.create(enemy.x, enemy.y, mode === "sniper" ? "bossShotRed" : "enemyShot")
          .setDepth(19).setTint(color).setBlendMode(Phaser.BlendModes.NORMAL);
        shot.body.setCircle(7, mode === "sniper" ? 11 : 7, mode === "sniper" ? 11 : 7);
        const speed = mode === "sniper" ? 440 : 224;
        shot.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        shot.setData({
          damage: mode === "sniper" ? Math.round(enemy.getData("damage") * 1.45) : enemy.getData("damage"),
          life: mode === "sniper" ? 2200 : 3200, trailAt: 0, color,
          trailRadius: mode === "sniper" ? 5 : 4, fxStyle: mode === "sniper" ? "bossRed" : "prism",
          slowDuration: frostShot ? 1100 : 0,
        });
      });
      enemy.setData({
        attackState: "recovering", recoverUntil: time + 520,
        nextAttackAt: time + Phaser.Math.Between(2700, 3300), sourceRing: null, fanTelegraph: null,
        prismMode: null, strafeDirection: -(enemy.getData("strafeDirection") || 1),
      });
      enemy.clearTint();
      this.spawnExpandingSigil(enemy.x, enemy.y, COLORS.violet, 82, 340);
      soundscape.play("enemyShot");
    }

    damagePlayerFromHazard(amount, x, y, label, color) {
      if (this.ended) return false;
      if (this.gameplayTime < this.dashInvulnerableUntil) {
        this.showDashEvade(x, y);
        return false;
      }
      if (this.stats.aegisLevel > 0 && this.tryAegisBlock(x, y)) return false;
      this.registerActDamage();
      this.playerHealth = Math.max(0, this.playerHealth - amount);
      this.showCombatLabel(this.player.x, this.player.y - 34, `${label} -${amount}`, color);
      this.flashDamage();
      if (this.playerHealth <= 0) this.finishRun(false, "守夜人倒下了，随身火种沉入长夜。");
      return true;
    }

    updateHerald(enemy, time) {
      const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const speed = this.getEnemySpeed(enemy, time);
      if (distance > 285) {
        this.physics.moveToObject(enemy, this.player, speed);
      } else if (distance < 220) {
        enemy.setVelocity(-Math.cos(angle) * speed, -Math.sin(angle) * speed);
      } else {
        const strafe = enemy.getData("strafeDirection") || 1;
        enemy.setVelocity(Math.cos(angle + Math.PI / 2) * speed * 0.62 * strafe, Math.sin(angle + Math.PI / 2) * speed * 0.62 * strafe);
      }
      enemy.rotation = Math.sin(time / 260 + enemy.getData("driftPhase")) * 0.08;
      if (time >= enemy.getData("nextSupportAt")) this.releaseHeraldPulse(enemy, time);
    }

    releaseHeraldPulse(enemy, time) {
      if (!enemy.active) return;
      enemy.setData("nextSupportAt", time + Phaser.Math.Between(2700, 3200));
      const radius = 190;
      const ring = this.add.circle(enemy.x, enemy.y, 28, COLORS.green, 0.045)
        .setStrokeStyle(3, COLORS.green, 0.8)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(5);
      this.tweens.add({
        targets: ring,
        radius,
        alpha: 0,
        duration: 520,
        ease: "Cubic.easeOut",
        onComplete: () => ring.destroy(),
      });
      let affected = 0;
      this.enemies.children.iterate((target) => {
        if (!target?.active || target === enemy) return;
        const kind = target.getData("kind");
        if (kind === "boss" || kind === "rift" || kind === "herald") return;
        if (Phaser.Math.Distance.Between(enemy.x, enemy.y, target.x, target.y) > radius) return;
        target.setData("hasteUntil", Math.max(target.getData("hasteUntil") || 0, time + 2300));
        this.burstAt(target.x, target.y, COLORS.green, 2);
        affected += 1;
      });
      this.burstAt(enemy.x, enemy.y, COLORS.green, 8);
      this.showCombatLabel(enemy.x, enemy.y - 34, `鸣潮 · ${affected}影加速`, COLORS.green);
      if (affected > 0 && !this.activePatrolEvent && !this.bossAlive && time >= (this.nextHeraldNoticeAt || 0)) {
        this.nextHeraldNoticeAt = time + 4200;
        ui.objectiveText.textContent = "鸣潮者正在加速黑潮，优先击破";
      }
      soundscape.play("wave");
    }

    updateHexer(enemy, time) {
      if (enemy.getData("attackState") === "warning") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("attackAt")) this.fireHexerShot(enemy, time);
        return;
      }

      const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const speed = this.getEnemySpeed(enemy, time);
      if (distance > 330) {
        enemy.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      } else if (distance < 220) {
        enemy.setVelocity(-Math.cos(angle) * speed, -Math.sin(angle) * speed);
      } else {
        const strafe = enemy.getData("strafeDirection") || 1;
        enemy.setVelocity(Math.cos(angle + Math.PI / 2) * speed * strafe, Math.sin(angle + Math.PI / 2) * speed * strafe);
      }
      enemy.rotation = Math.sin(time / 240 + enemy.getData("driftPhase")) * 0.06;
      if (time >= enemy.getData("nextAttackAt")) this.beginHexerWarning(enemy, time);
    }

    updateRift(enemy, time) {
      enemy.setVelocity(0, 0);
      enemy.rotation = Math.sin(time / 360) * 0.08;
      const event = this.activePatrolEvent;
      if (event?.type !== "rift" || event.target !== enemy) return;
      if (time < (enemy.getData("nextSummonAt") || 0)) return;
      const angle = Math.random() * Math.PI * 2;
      const x = Phaser.Math.Clamp(enemy.x + Math.cos(angle) * 62, 28, this.scale.width - 28);
      const y = Phaser.Math.Clamp(enemy.y + Math.sin(angle) * 62, this.getPlayableTop(), this.getPlayableBottom() - 4);
      this.spawnEnemy(Math.random() > 0.45 ? "wraith" : "shade", x, y);
      enemy.setData("nextSummonAt", time + 1900);
      this.spawnRipple(enemy.x, enemy.y, COLORS.violet);
      this.showCombatLabel(enemy.x, enemy.y - 52, "裂隙增援", COLORS.violet);
      soundscape.play("enemyShot");
    }

    beginHexerWarning(enemy, time) {
      const targetX = this.player.x;
      const targetY = this.player.y;
      const sourceRing = this.add.image(enemy.x, enemy.y, "fxRing")
        .setTint(COLORS.violet)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setAlpha(0.84)
        .setScale(0.46)
        .setDepth(5);
      const targetRing = this.add.image(targetX, targetY, "fxRing")
        .setTint(COLORS.red)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setAlpha(0.7)
        .setScale(1.12)
        .setDepth(4);
      enemy.setData({
        attackState: "warning",
        attackAt: time + 720,
        shotTargetX: targetX,
        shotTargetY: targetY,
        sourceRing,
        targetRing,
      });
      enemy.setTint(COLORS.violet);
      this.tweens.add({ targets: sourceRing, scale: 1.26, angle: 120, alpha: 0.12, duration: 720, ease: "Sine.easeIn" });
      this.tweens.add({ targets: targetRing, scale: 0.52, angle: -90, alpha: 0.2, duration: 720, ease: "Sine.easeIn" });
      if (time >= (this.nextHexerNoticeAt || 0)) {
        this.nextHexerNoticeAt = time + 4200;
        this.showThreatAlert("咒灯者锁定 · 离开紫色锁定点", COLORS.violet, 1200);
        soundscape.play("warning");
      }
    }

    fireHexerShot(enemy, time) {
      if (!enemy.active) return;
      const targetX = enemy.getData("shotTargetX");
      const targetY = enemy.getData("shotTargetY");
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, targetX, targetY);
      const shot = this.enemyProjectiles.create(enemy.x, enemy.y, "enemyShot")
        .setDepth(19)
        .setBlendMode(Phaser.BlendModes.NORMAL);
      shot.body.setCircle(7, 7, 7);
      shot.setVelocity(Math.cos(angle) * 245, Math.sin(angle) * 245);
      shot.setAngularVelocity(110);
      shot.setData({
        damage: enemy.getData("damage"),
        life: 2600,
        trailAt: 0,
        color: COLORS.violet,
        trailRadius: 4,
        fxStyle: "hexer",
      });
      this.spawnRipple(enemy.x, enemy.y, COLORS.violet);
      soundscape.play("enemyShot");
      enemy.getData("sourceRing")?.destroy();
      enemy.getData("targetRing")?.destroy();
      enemy.setData({
        attackState: "moving",
        nextAttackAt: time + Phaser.Math.Between(2300, 3000),
        sourceRing: null,
        targetRing: null,
        strafeDirection: -(enemy.getData("strafeDirection") || 1),
      });
      enemy.clearTint();
    }

    updateCantor(enemy, time) {
      if (enemy.getData("attackState") === "warning") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("attackAt")) this.fireCantorVolley(enemy, time);
        return;
      }

      const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const speed = this.getEnemySpeed(enemy, time);
      if (distance > 360) {
        enemy.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      } else if (distance < 245) {
        enemy.setVelocity(-Math.cos(angle) * speed, -Math.sin(angle) * speed);
      } else {
        const strafe = enemy.getData("strafeDirection") || 1;
        enemy.setVelocity(
          Math.cos(angle + Math.PI / 2) * speed * 0.72 * strafe,
          Math.sin(angle + Math.PI / 2) * speed * 0.72 * strafe,
        );
      }
      enemy.rotation = Math.sin(time / 180 + enemy.getData("driftPhase")) * 0.09;
      if (time >= enemy.getData("nextAttackAt")) this.beginCantorWarning(enemy, time);
    }

    beginCantorWarning(enemy, time) {
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const sourceRing = this.add.image(enemy.x, enemy.y, "fxRing")
        .setTint(COLORS.violet).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.82).setScale(0.5).setDepth(5);
      this.tweens.add({ targets: sourceRing, scale: 1.38, angle: 150, alpha: 0.1, duration: 680, ease: "Sine.easeIn" });
      enemy.setData({
        attackState: "warning",
        attackAt: time + 680,
        shotAngle: angle,
        sourceRing,
        fanTelegraph: null,
      });
      enemy.setVelocity(0, 0);
      enemy.setTint(COLORS.violet);
      if (!this.bossAlive && time >= (this.nextCantorNoticeAt || 0)) {
        this.nextCantorNoticeAt = time + 4200;
        this.showThreatAlert("钟咏者三向扇射 · 观察弹头间隙横移", COLORS.violet, 1250);
        soundscape.play("warning");
      }
    }

    fireCantorVolley(enemy, time) {
      if (!enemy.active) return;
      const baseAngle = enemy.getData("shotAngle") || 0;
      enemy.getData("sourceRing")?.destroy();
      enemy.getData("fanTelegraph")?.destroy();
      [-0.2, 0, 0.2].forEach((offset, index) => {
        const angle = baseAngle + offset;
        const shot = this.enemyProjectiles.create(enemy.x, enemy.y, "enemyShot")
          .setDepth(19)
          .setTint(index === 1 ? COLORS.gold : 0xd7baff)
          .setBlendMode(Phaser.BlendModes.NORMAL);
        shot.body.setCircle(7, 7, 7);
        shot.setVelocity(Math.cos(angle) * 232, Math.sin(angle) * 232);
        shot.setAngularVelocity((index - 1) * 100);
        shot.setData({
          damage: enemy.getData("damage"),
          life: 2700,
          trailAt: 0,
          color: index === 1 ? COLORS.gold : COLORS.violet,
          trailRadius: index === 1 ? 4 : 3,
          fxStyle: "hexer",
        });
      });
      enemy.setData({
        attackState: "moving",
        nextAttackAt: time + Phaser.Math.Between(2500, 3000),
        sourceRing: null,
        fanTelegraph: null,
        strafeDirection: -(enemy.getData("strafeDirection") || 1),
      });
      enemy.clearTint();
      this.spawnRipple(enemy.x, enemy.y, COLORS.violet);
      this.burstAt(enemy.x, enemy.y, COLORS.gold, 6);
      soundscape.play("enemyShot");
    }

    updateTideweaver(enemy, time) {
      if (enemy.getData("attackState") === "warning") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("attackAt")) this.fireTideweaverFan(enemy, time);
        return;
      }
      const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const speed = this.getEnemySpeed(enemy, time);
      if (distance > 370) {
        enemy.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      } else if (distance < 245) {
        enemy.setVelocity(-Math.cos(angle) * speed, -Math.sin(angle) * speed);
      } else {
        const strafe = enemy.getData("strafeDirection") || 1;
        enemy.setVelocity(
          Math.cos(angle + Math.PI / 2) * speed * 0.78 * strafe,
          Math.sin(angle + Math.PI / 2) * speed * 0.78 * strafe,
        );
      }
      enemy.rotation = Math.sin(time / 190 + enemy.getData("driftPhase")) * 0.12;
      if (time >= enemy.getData("nextAttackAt")) this.beginTideweaverWarning(enemy, time);
    }

    beginTideweaverWarning(enemy, time) {
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const sourceRing = this.add.image(enemy.x, enemy.y, "fxRing")
        .setTint(0x43d9d0)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setAlpha(0.82)
        .setScale(0.5)
        .setDepth(5);
      this.tweens.add({ targets: sourceRing, scale: 1.34, angle: 145, alpha: 0.12, duration: 760, ease: "Sine.easeIn" });
      enemy.setData({
        attackState: "warning",
        attackAt: time + 760,
        shotAngle: angle,
        sourceRing,
        fanTelegraph: null,
      });
      enemy.setTint(0x43d9d0);
      if (!this.bossAlive && time >= (this.nextTideweaverNoticeAt || 0)) {
        this.nextTideweaverNoticeAt = time + 4300;
        this.showThreatAlert("织潮祭士五连弧弹 · 穿过潮弹外侧", 0x43d9d0, 1300);
        soundscape.play("warning");
      }
    }

    fireTideweaverFan(enemy, time) {
      if (!enemy.active) return;
      const baseAngle = enemy.getData("shotAngle") || 0;
      enemy.getData("sourceRing")?.destroy();
      enemy.getData("fanTelegraph")?.destroy();
      [-0.34, -0.17, 0, 0.17, 0.34].forEach((offset, index) => {
        const angle = baseAngle + offset;
        const color = index % 2 === 0 ? 0x43d9d0 : 0xff6d79;
        const shot = this.enemyProjectiles.create(enemy.x, enemy.y, "enemyShot")
          .setDepth(19)
          .setTint(color)
          .setBlendMode(Phaser.BlendModes.NORMAL);
        shot.body.setCircle(7, 7, 7);
        shot.setVelocity(Math.cos(angle) * 214, Math.sin(angle) * 214);
        shot.setData({
          damage: enemy.getData("damage"),
          life: 2900,
          trailAt: 0,
          color,
          trailRadius: index === 2 ? 5 : 4,
          fxStyle: "tide",
          curveRate: (index - 2) * 0.00016,
        });
      });
      enemy.setData({
        attackState: "moving",
        nextAttackAt: time + Phaser.Math.Between(2500, 3100),
        sourceRing: null,
        fanTelegraph: null,
        strafeDirection: -(enemy.getData("strafeDirection") || 1),
      });
      enemy.clearTint();
      this.spawnExpandingSigil(enemy.x, enemy.y, 0x43d9d0, 68, 320);
      this.spawnRadialShards(enemy.x, enemy.y, 0xff6d79, 7, 48, baseAngle, 0.42, Math.PI);
      soundscape.play("enemyShot");
    }

    updateRammer(enemy, time) {
      const state = enemy.getData("attackState");
      if (state === "warning") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("attackAt")) this.releaseRammerShockwave(enemy, time);
        return;
      }
      if (state === "recovering") {
        enemy.setVelocity(0, 0);
        if (time >= enemy.getData("recoverUntil")) enemy.setData("attackState", "moving");
        return;
      }

      const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const speed = this.getEnemySpeed(enemy, time);
      if (distance > 235) {
        this.physics.moveToObject(enemy, this.player, speed);
      } else {
        const strafe = enemy.getData("strafeDirection") || 1;
        enemy.setVelocity(
          Math.cos(angle + Math.PI / 2) * speed * 0.45 * strafe,
          Math.sin(angle + Math.PI / 2) * speed * 0.45 * strafe,
        );
      }
      enemy.rotation = Math.sin(time / 230 + enemy.getData("driftPhase")) * 0.05;
      if (distance <= 300 && time >= enemy.getData("nextAttackAt")) this.beginRammerWarning(enemy, time);
    }

    beginRammerWarning(enemy, time) {
      const slamRing = this.add.image(enemy.x, enemy.y, "fxRing")
        .setTint(COLORS.goldHot)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(5)
        .setAlpha(0.88)
        .setScale(0.7);
      this.tweens.add({
        targets: slamRing,
        scale: 4.3,
        angle: 135,
        alpha: 0.14,
        duration: 760,
        ease: "Sine.easeIn",
      });
      enemy.setData({
        attackState: "warning",
        attackAt: time + 760,
        slamRing,
      });
      enemy.setVelocity(0, 0);
      enemy.setTint(COLORS.goldHot);
      if (!this.bossAlive && time >= (this.nextRammerNoticeAt || 0)) {
        this.nextRammerNoticeAt = time + 4400;
        this.showThreatAlert("震槌者蓄力震波 · 拉开距离或闪步穿过", COLORS.goldHot, 1300);
        soundscape.play("warning");
      }
    }

    releaseRammerShockwave(enemy, time) {
      if (!enemy.active) return;
      enemy.getData("slamRing")?.destroy();
      const count = 8;
      const offset = enemy.getData("driftPhase") || 0;
      for (let index = 0; index < count; index += 1) {
        const angle = offset + (Math.PI * 2 * index) / count;
        const shot = this.enemyProjectiles.create(
          enemy.x + Math.cos(angle) * 30,
          enemy.y + Math.sin(angle) * 30,
          "bossShotGold",
        ).setDepth(19).setBlendMode(Phaser.BlendModes.NORMAL);
        shot.body.setCircle(7, 11, 11);
        shot.rotation = angle;
        shot.setVelocity(Math.cos(angle) * 172, Math.sin(angle) * 172);
        shot.setAngularVelocity((index % 2 === 0 ? 1 : -1) * 90);
        shot.setData({
          damage: 5,
          life: 2500,
          trailAt: 0,
          color: COLORS.goldHot,
          trailRadius: 4,
          fxStyle: "bossGold",
        });
      }
      enemy.setData({
        attackState: "recovering",
        recoverUntil: time + 620,
        nextAttackAt: time + Phaser.Math.Between(2800, 3400),
        slamRing: null,
        strafeDirection: -(enemy.getData("strafeDirection") || 1),
      });
      enemy.clearTint();
      this.spawnExpandingSigil(enemy.x, enemy.y, COLORS.goldHot, 112, 390);
      this.spawnRadialShards(enemy.x, enemy.y, COLORS.goldHot, 10, 72, offset, 0.48);
      this.burstAt(enemy.x, enemy.y, COLORS.goldHot, 12);
      this.cameras.main.shake(130, 0.005);
      soundscape.play("pulse");
    }

    updateDevourerRanged(enemy, time) {
      if (enemy.getData("attackState") === "warning") {
        enemy.setVelocity(0, 0);
        if (time < enemy.getData("attackAt")) return;
        const angle = enemy.getData("shotAngle") || Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
        [-0.14, 0, 0.14].forEach((offset, index) => {
          const shotAngle = angle + offset;
          const shot = this.enemyProjectiles.create(enemy.x, enemy.y, "enemyShot").setDepth(19).setBlendMode(Phaser.BlendModes.NORMAL);
          shot.body.setCircle(7, 7, 7);
          shot.setVelocity(Math.cos(shotAngle) * (index === 1 ? 225 : 208), Math.sin(shotAngle) * (index === 1 ? 225 : 208));
          shot.setAngularVelocity(index === 1 ? 130 : -90);
          shot.setData({ damage: enemy.getData("damage"), life: 2800, trailAt: 0, color: COLORS.violet, trailRadius: 4, fxStyle: "hexer" });
        });
        enemy.getData("sourceRing")?.destroy();
        enemy.getData("fanTelegraph")?.destroy();
        enemy.setData({ attackState: "moving", nextAttackAt: time + Phaser.Math.Between(2200, 2800), sourceRing: null, fanTelegraph: null });
        enemy.clearTint();
        this.spawnRipple(enemy.x, enemy.y, COLORS.violet);
        soundscape.play("enemyShot");
        return;
      }
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      const speed = this.getEnemySpeed(enemy, time);
      if (distance > 350) enemy.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      else if (distance < 235) enemy.setVelocity(-Math.cos(angle) * speed, -Math.sin(angle) * speed);
      else enemy.setVelocity(Math.cos(angle + Math.PI / 2) * speed * 0.72, Math.sin(angle + Math.PI / 2) * speed * 0.72);
      if (time < (enemy.getData("nextAttackAt") || 0)) return;
      const warningDuration = 650;
      const sourceRing = this.add.image(enemy.x, enemy.y, "fxRing").setTint(COLORS.violet).setBlendMode(Phaser.BlendModes.ADD).setDepth(5).setAlpha(0.8).setScale(0.55);
      this.tweens.add({ targets: sourceRing, scale: 1.1, angle: 120, alpha: 0.15, duration: warningDuration, ease: "Sine.easeIn" });
      enemy.setData({ attackState: "warning", attackAt: time + warningDuration, shotAngle: angle, sourceRing, fanTelegraph: null });
      enemy.setTint(COLORS.violet);
    }

    updateBossBehavior(boss, time) {
      const state = boss.getData("attackState");
      if (state === "entering") {
        const entryY = boss.getData("entryY") || this.getBossEntryY();
        boss.body.checkCollision.none = true;
        if (boss.y < entryY) {
          boss.setVelocity(0, 175);
          return;
        }
        boss.setPosition(boss.x, entryY);
        boss.setVelocity(0, 0);
        const settledAt = boss.getData("entrySettledAt") || 0;
        if (settledAt <= 0) {
          boss.setData("entrySettledAt", time + 600);
          const entryColor = this.battlefieldProfile.id === "mirror-harbor" ? 0x43d9d0 : COLORS.red;
          this.spawnExpandingSigil(boss.x, boss.y, entryColor, 92, 520);
          this.showCombatLabel(boss.x, boss.y - 62, `${this.battlefieldProfile.bossName} · 现身`, entryColor);
          return;
        }
        if (time < settledAt) return;
        boss.body.checkCollision.none = false;
        boss.setData({
          attackState: "chasing",
          nextSpecialAt: time + 1150,
          nextCrowdAt: time + 700,
          nextSummonAt: this.battlefieldProfile.id === "mirror-harbor"
            ? time + 9000
            : Number.POSITIVE_INFINITY,
        });
        ui.objectiveText.textContent = `${this.battlefieldProfile.bossName}现身，击败它`;
        this.updateBossPhaseHud(boss);
        return;
      }
      this.updateBossCrowd(boss, time);
      const phase = boss.getData("phase") || 1;
      this.bossSummonTelemetry.phasesSeen.add(phase);
      const healthRatio = boss.getData("hp") / boss.getData("maxHp");
      if (!RUN_PROFILE.precisionPrototype && state !== "pulseWarning" && state !== "mirrorWarning") {
        if (phase === 1 && healthRatio <= 0.68) {
          this.enterBossPhase(boss, 2, time);
          return;
        }
        if (phase === 2 && healthRatio <= 0.34) {
          this.enterBossPhase(boss, 3, time);
          return;
        }
      }

      if (state === "pulseWarning") {
        boss.setVelocity(0, 0);
        if (time >= boss.getData("pulseAt")) this.releaseBossPulse(boss, time);
        return;
      }
      if (state === "summonWarning") {
        boss.setVelocity(0, 0);
        if (time >= boss.getData("summonAt")) this.releaseBossSummon(boss, time);
        return;
      }
      if (state === "summonCombo") {
        boss.setVelocity(0, 0);
        if (time >= boss.getData("comboAt")) this.beginBossPulseWarning(boss, time, true);
        return;
      }
      if (state === "phaseTransition") {
        boss.setVelocity(0, 0);
        if (time >= boss.getData("phaseTransitionUntil")) {
          const transitionMode = boss.getData("phaseTransitionMode") || "refraction";
          boss.setData({ phaseTransitionUntil: 0, phaseTransitionMode: null });
          this.beginMirrorBossWarning(boss, time, transitionMode);
        }
        return;
      }
      if (state === "mirrorWarning") {
        boss.setVelocity(0, 0);
        if (time >= boss.getData("attackAt")) this.releaseMirrorBossAttack(boss, time);
        return;
      }
      if (state === "warning") {
        boss.setVelocity(0, 0);
        this.drawBossTelegraph(boss, time);
        if (time >= boss.getData("attackAt")) this.beginBossCharge(boss, time);
        return;
      }

      if (state === "charging") {
        const targetX = boss.getData("chargeTargetX");
        const targetY = boss.getData("chargeTargetY");
        const distance = Phaser.Math.Distance.Between(boss.x, boss.y, targetX, targetY);
        if (time >= boss.getData("chargeEndAt") || distance < 22) {
          this.endBossCharge(boss, time);
          return;
        }
        this.physics.moveTo(boss, targetX, targetY, boss.getData("chargeSpeed") || 480);
        if (this.battlefieldProfile.id === "lantern-court" && time >= (boss.getData("nextDarkTrailAt") || 0)) {
          boss.setData("nextDarkTrailAt", time + 145);
          this.spawnBossDarkTrail(boss.x, boss.y, time);
        }
        boss.rotation = Math.sin(time / 45) * 0.055;
        return;
      }

      if (state === "recovering") {
        boss.setVelocity(0, 0);
        boss.rotation = 0;
        if (time >= boss.getData("recoverUntil")) {
          if (boss.getData("queuedAttack") === "charge") {
            boss.setData("queuedAttack", null);
            this.beginBossWarning(boss, time);
            return;
          }
          boss.setData("attackState", "chasing");
          ui.objectiveText.textContent = `${this.battlefieldProfile.bossName}现身，击败它`;
          this.updateBossPhaseHud(boss);
        }
        return;
      }

      if (this.battlefieldProfile.id === "mirror-harbor") {
        const targetX = this.scale.width * 0.56;
        const targetY = this.getBossEntryY() + Math.sin(time / 720) * 52;
        this.physics.moveTo(boss, targetX, targetY, this.getEnemySpeed(boss, time));
      } else {
        this.physics.moveToObject(boss, this.player, this.getEnemySpeed(boss, time));
      }
      boss.rotation = Math.sin(time / 380) * 0.035;
      if (time >= boss.getData("nextSpecialAt")) {
        if (RUN_PROFILE.precisionPrototype) {
          const warningCount = this.precisionPrototypeTelemetry.eventCounts["boss-gap-warning"] || 0;
          if (warningCount === 0) this.beginBossPulseWarning(boss, time);
          else boss.setData("nextSpecialAt", Number.POSITIVE_INFINITY);
          return;
        }
        const specialIndex = (boss.getData("specialIndex") || 0) + 1;
        boss.setData("specialIndex", specialIndex);
        if (this.battlefieldProfile.id === "mirror-harbor") {
          const bossBias = this.getRoute(this.finalRouteId)?.bossBias;
          const modes = bossBias === "pulse"
            ? (phase === 1
              ? ["refraction", "spiral", "refraction"]
              : phase === 2
                ? ["refraction", "lattice", "spiral", "refraction"]
                : ["spiral", "refraction", "cross", "spiral", "refraction"])
            : bossBias === "charge"
              ? (phase === 1
                ? ["lattice", "spiral", "lattice"]
                : phase === 2
                  ? ["lattice", "cross", "refraction", "lattice"]
                  : ["cross", "lattice", "cross", "spiral", "lattice"])
              : (phase === 1
                ? ["refraction", "lattice", "spiral"]
                : phase === 2
                  ? ["lattice", "refraction", "cross", "spiral"]
                  : ["cross", "spiral", "lattice", "refraction"]);
          let activeAcolytes = 0;
          this.enemies.children.iterate((enemy) => {
            if (enemy?.active && enemy.getData("kind") === "mirrorAcolyte") activeAcolytes += 1;
          });
          const summonReady = phase >= 2
            && time >= (boss.getData("nextSummonAt") || Number.POSITIVE_INFINITY)
            && activeAcolytes === 0;
          const mirrorMode = summonReady ? "summon" : modes[(specialIndex - 1) % modes.length];
          this.beginMirrorBossWarning(boss, time, mirrorMode);
          return;
        }
        const bossBias = this.getRoute(this.finalRouteId)?.bossBias;
        const summonReady = phase >= 2
          && this.countBossAttendants() === 0
          && time >= (boss.getData("nextSummonAt") || Number.POSITIVE_INFINITY);
        if (summonReady) {
          this.beginBossSummonWarning(boss, time, false);
          return;
        }
        const usePulse = phase >= 2 && (
          bossBias === "pulse" ? specialIndex % 3 !== 0
            : bossBias === "charge" ? specialIndex % 3 === 0
              : specialIndex % 2 === 0
        );
        if (usePulse) this.beginBossPulseWarning(boss, time);
        else this.beginBossWarning(boss, time);
      }
    }

    beginMirrorBossWarning(boss, time, mode) {
      const warningDuration = mode === "summon" ? 1350 : mode === "cross" ? 1250 : mode === "lattice" ? 1150 : 1100;
      const angle = Phaser.Math.Angle.Between(boss.x, boss.y, this.player.x, this.player.y);
      const telegraph = this.add.graphics().setDepth(5).setBlendMode(Phaser.BlendModes.ADD);
      let mirrorNodes = null;
      let mirrorCross = null;
      if (mode === "refraction") {
        telegraph.fillStyle(0x43d9d0, 0.08);
        telegraph.fillCircle(boss.x, boss.y, 74);
        telegraph.lineStyle(3, 0xff6d79, 0.78);
        telegraph.strokeCircle(boss.x, boss.y, 74);
      } else if (mode === "spiral") {
        telegraph.lineStyle(3, 0x43d9d0, 0.72);
        telegraph.strokeCircle(boss.x, boss.y, 68);
        telegraph.lineStyle(2, 0xff6d79, 0.64);
        telegraph.strokeCircle(boss.x, boss.y, 106);
      } else if (mode === "lattice") {
        const top = this.getPlayableTop() + 54;
        const bottom = this.getPlayableBottom() - 54;
        mirrorNodes = [
          { x: Phaser.Math.Clamp(this.player.x - 150, 80, this.scale.width - 80), y: Phaser.Math.Clamp(this.player.y - 96, top, bottom) },
          { x: Phaser.Math.Clamp(this.player.x + 150, 80, this.scale.width - 80), y: Phaser.Math.Clamp(this.player.y - 74, top, bottom) },
          { x: Phaser.Math.Clamp(this.player.x, 80, this.scale.width - 80), y: Phaser.Math.Clamp(this.player.y + 132, top, bottom) },
        ];
        mirrorNodes.forEach((node, index) => {
          telegraph.fillStyle(index % 2 === 0 ? 0x43d9d0 : 0xff6d79, 0.08);
          telegraph.fillCircle(node.x, node.y, 44);
          telegraph.lineStyle(3, index % 2 === 0 ? 0x43d9d0 : 0xff6d79, 0.88);
          telegraph.strokeCircle(node.x, node.y, 44);
          telegraph.lineStyle(1, 0xffffff, 0.74);
          telegraph.strokeCircle(node.x, node.y, 13);
        });
      } else if (mode === "summon") {
        const top = this.getPlayableTop();
        const bottom = this.getPlayableBottom();
        const offsetX = Math.min(118, this.scale.width * 0.11);
        const summonY = Phaser.Math.Clamp(boss.y + 118, top + 70, bottom - 70);
        mirrorNodes = [
          { x: Phaser.Math.Clamp(boss.x - offsetX, 62, this.scale.width - 62), y: summonY - 20 },
          { x: Phaser.Math.Clamp(boss.x + offsetX, 62, this.scale.width - 62), y: summonY + 20 },
        ];
        mirrorNodes.forEach((node, index) => {
          const color = index === 0 ? COLORS.cyan : 0xff6d79;
          telegraph.fillStyle(color, 0.08);
          telegraph.fillCircle(node.x, node.y, 42);
          telegraph.lineStyle(4, color, 0.9);
          telegraph.strokeCircle(node.x, node.y, 42);
          telegraph.lineStyle(1, 0xffffff, 0.82);
          telegraph.strokeCircle(node.x, node.y, 18);
        });
        boss.setData("nextSummonAt", Number.POSITIVE_INFINITY);
      } else {
        const top = this.getPlayableTop();
        const bottom = this.getPlayableBottom();
        const centerX = Phaser.Math.Clamp(this.player.x, 90, this.scale.width - 90);
        const centerY = Phaser.Math.Clamp(this.player.y, top + 70, bottom - 70);
        const halfWidth = 44;
        mirrorCross = { x: centerX, y: centerY, halfWidth };
        telegraph.fillStyle(0xff6d79, 0.055);
        telegraph.fillRect(centerX - halfWidth, top, halfWidth * 2, bottom - top);
        telegraph.fillStyle(0x43d9d0, 0.045);
        telegraph.fillRect(0, centerY - halfWidth, this.scale.width, halfWidth * 2);
        [centerX - halfWidth, centerX + halfWidth].forEach((x) => {
          telegraph.lineStyle(3, 0xff6d79, 0.84);
          telegraph.lineBetween(x, top, x, bottom);
        });
        [centerY - halfWidth, centerY + halfWidth].forEach((y) => {
          telegraph.lineStyle(3, 0x43d9d0, 0.84);
          telegraph.lineBetween(0, y, this.scale.width, y);
        });
        telegraph.lineStyle(2, 0xffffff, 0.72);
        telegraph.strokeCircle(centerX, centerY, 22);
      }
      this.tweens.add({ targets: telegraph, alpha: { from: 0.26, to: 0.94 }, duration: warningDuration, ease: "Sine.easeIn" });
      boss.setVelocity(0, 0);
      const modeColor = mode === "summon" ? COLORS.violet : mode === "refraction" || mode === "lattice" ? 0x43d9d0 : 0xff6d79;
      boss.setTint(modeColor);
      boss.setData({
        attackState: "mirrorWarning",
        attackAt: time + warningDuration,
        mirrorMode: mode,
        mirrorAngle: angle,
        mirrorTelegraph: telegraph,
        mirrorNodes,
        mirrorCross,
      });
      const alerts = {
        refraction: "折光航路 · 穿过弹缝",
        spiral: "潮镜轮舞 · 向外换位",
        lattice: "三点棱阵 · 离开三角节点",
        cross: "镜海裁光 · 躲进四角空区",
        summon: "镜侍临潮 · 优先击破召唤物",
      };
      this.showThreatAlert(alerts[mode] || alerts.refraction, modeColor, warningDuration + 420);
      soundscape.play(mode === "summon" ? "summon" : "warning", true);
    }

    releaseMirrorBossAttack(boss, time) {
      if (!boss.active) return;
      const mode = boss.getData("mirrorMode") || "refraction";
      const baseAngle = boss.getData("mirrorAngle") || 0;
      boss.getData("mirrorTelegraph")?.destroy();
      const spawnMirrorShot = (x, y, angle, speed, color, index, damage = 7, curveRate = 0) => {
        const shot = this.enemyProjectiles.create(
          x,
          y,
          index % 2 === 0 ? "bossShotGold" : "bossShotRed",
        )
          .setDepth(19)
          .setTint(color)
          .setBlendMode(Phaser.BlendModes.NORMAL);
        shot.body.setCircle(7, 11, 11);
        shot.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        shot.setData({
          damage,
          life: 3300,
          trailAt: 0,
          color,
          trailRadius: 5,
          fxStyle: "tide",
          curveRate,
        });
      };

      let recoveryDelay = 2400;
      let recoveryCause = "折光破碎";
      if (mode === "summon") {
        const nodes = boss.getData("mirrorNodes") || [];
        let activeAcolytes = 0;
        this.enemies.children.iterate((enemy) => {
          if (enemy?.active && enemy.getData("kind") === "mirrorAcolyte") activeAcolytes += 1;
        });
        nodes.slice(0, Math.max(0, 2 - activeAcolytes)).forEach((node, index) => {
          const color = index === 0 ? COLORS.cyan : 0xff6d79;
          this.spawnEnemy("mirrorAcolyte", node.x, node.y);
          this.spawnExpandingSigil(node.x, node.y, color, 96, 460, index * 80, index * Math.PI / 3);
          this.spawnRadialShards(node.x, node.y, color, 10, 68, index * Math.PI / 4, 0.54);
          this.burstAt(node.x, node.y, color, 12);
        });
        boss.setData("nextSummonAt", time + 12000);
        recoveryDelay = 3200;
        recoveryCause = "镜侍分灵";
      } else if (mode === "lattice") {
        const nodes = boss.getData("mirrorNodes") || [];
        nodes.forEach((node, nodeIndex) => {
          this.spawnExpandingSigil(node.x, node.y, nodeIndex % 2 === 0 ? 0x43d9d0 : 0xff6d79, 94, 430, nodeIndex * 45, nodeIndex * Math.PI / 5);
          this.spawnRadialShards(node.x, node.y, 0xffffff, 7, 62, nodeIndex * 0.36, 0.46);
          for (let index = 0; index < 5; index += 1) {
            const angle = baseAngle + nodeIndex * 0.42 + (Math.PI * 2 * index) / 5;
            const color = (index + nodeIndex) % 2 === 0 ? 0x43d9d0 : 0xff6d79;
            spawnMirrorShot(node.x, node.y, angle, 188 + nodeIndex * 12, color, index + nodeIndex, 6, index % 2 === 0 ? 0.00012 : -0.00012);
          }
        });
        recoveryDelay = 2500;
        recoveryCause = "棱阵崩解";
      } else if (mode === "cross") {
        const cross = boss.getData("mirrorCross") || { x: this.player.x, y: this.player.y, halfWidth: 44 };
        const top = this.getPlayableTop();
        const bottom = this.getPlayableBottom();
        const beam = this.add.graphics().setDepth(21).setBlendMode(Phaser.BlendModes.ADD);
        beam.fillStyle(0xff6d79, 0.14);
        beam.fillRect(cross.x - cross.halfWidth, top, cross.halfWidth * 2, bottom - top);
        beam.fillStyle(0x43d9d0, 0.12);
        beam.fillRect(0, cross.y - cross.halfWidth, this.scale.width, cross.halfWidth * 2);
        beam.lineStyle(15, 0xff6d79, 0.88);
        beam.lineBetween(cross.x, top, cross.x, bottom);
        beam.lineStyle(15, 0x43d9d0, 0.88);
        beam.lineBetween(0, cross.y, this.scale.width, cross.y);
        beam.lineStyle(3, 0xffffff, 1);
        beam.lineBetween(cross.x, top, cross.x, bottom);
        beam.lineBetween(0, cross.y, this.scale.width, cross.y);
        this.tweens.add({ targets: beam, alpha: 0, duration: 460, ease: "Quad.easeOut", onComplete: () => beam.destroy() });
        if (Math.abs(this.player.x - cross.x) <= cross.halfWidth || Math.abs(this.player.y - cross.y) <= cross.halfWidth) {
          this.damagePlayerFromHazard(13, cross.x, cross.y, "镜海裁光", 0xff6d79);
        }
        this.spawnExpandingSigil(cross.x, cross.y, 0xffffff, 156, 480);
        this.spawnRadialShards(cross.x, cross.y, 0xff6d79, 16, 118, Math.PI / 8, 0.56);
        [Math.PI / 4, Math.PI * 3 / 4, Math.PI * 5 / 4, Math.PI * 7 / 4].forEach((angle, index) => {
          spawnMirrorShot(boss.x, boss.y, angle, 244, index % 2 === 0 ? 0x43d9d0 : 0xff6d79, index, 8);
        });
        recoveryDelay = 2700;
        recoveryCause = "裁光过载";
      } else {
        const offsets = mode === "refraction"
          ? [-0.42, -0.28, -0.14, 0, 0.14, 0.28, 0.42]
          : Array.from({ length: 12 }, (_value, index) => (Math.PI * 2 * index) / 12);
        offsets.forEach((offset, index) => {
          const angle = baseAngle + offset;
          const color = index % 2 === 0 ? 0x43d9d0 : 0xff6d79;
          spawnMirrorShot(
            boss.x + Math.cos(angle) * 44,
            boss.y + Math.sin(angle) * 44,
            angle,
            mode === "refraction" ? 255 : 205,
            color,
            index,
            mode === "refraction" ? 8 : 7,
            mode === "spiral" ? (index % 2 === 0 ? 0.00024 : -0.00024) : (index - 3) * 0.00004,
          );
        });
        if (mode === "spiral") {
          recoveryDelay = 2100;
          recoveryCause = "潮镜失衡";
        }
      }
      boss.setData({ mirrorTelegraph: null, mirrorMode: null, mirrorNodes: null, mirrorCross: null });
      boss.clearTint();
      const heavyPattern = mode === "spiral" || mode === "cross" || mode === "lattice" || mode === "summon";
      this.spawnExpandingSigil(boss.x, boss.y, 0x43d9d0, heavyPattern ? 158 : 112, heavyPattern ? 520 : 440);
      this.spawnExpandingSigil(boss.x, boss.y, 0xff6d79, heavyPattern ? 112 : 82, 390, 45, Math.PI / 4);
      this.spawnRadialShards(boss.x, boss.y, 0xff6d79, heavyPattern ? 16 : 9, heavyPattern ? 108 : 92, baseAngle, heavyPattern ? 0.64 : 0.56);
      this.burstAt(boss.x, boss.y, 0x43d9d0, heavyPattern ? 22 : 13);
      this.cameras.main.shake(heavyPattern ? 280 : 210, heavyPattern ? 0.013 : 0.009);
      soundscape.play("pulse", true);
      this.beginBossRecovery(boss, time, recoveryDelay, recoveryCause);
    }

    beginBossWarning(boss, time) {
      const phase = boss.getData("phase") || 1;
      const favorsCharge = this.getRoute(this.finalRouteId)?.bossBias === "charge";
      const warningDuration = (phase === 3 ? 620 : phase === 2 ? 740 : 850) - (favorsCharge ? 60 : 0);
      const angle = Phaser.Math.Angle.Between(boss.x, boss.y, this.player.x, this.player.y);
      const targetX = Phaser.Math.Clamp(this.player.x + Math.cos(angle) * 72, 42, this.scale.width - 42);
      const targetY = Phaser.Math.Clamp(this.player.y + Math.sin(angle) * 72, this.getPlayableTop() + 8, this.getPlayableBottom() - 18);
      boss.setData({
        attackState: "warning",
        warningStartedAt: time,
        warningDuration,
        attackAt: time + warningDuration,
        chargeTargetX: targetX,
        chargeTargetY: targetY,
      });
      boss.setVelocity(0, 0);
      boss.setTint(COLORS.red);
      this.showThreatAlert("吞灯者锁定 · 离开红色印记", COLORS.red, warningDuration + 420);
      soundscape.play("warning");
      this.drawBossTelegraph(boss, time);
    }

    drawBossTelegraph(boss, time) {
      const targetX = boss.getData("chargeTargetX");
      const targetY = boss.getData("chargeTargetY");
      const progress = Phaser.Math.Clamp((time - boss.getData("warningStartedAt")) / (boss.getData("warningDuration") || 850), 0, 1);
      const radius = 40 - progress * 17;
      this.bossTelegraph.clear();
      this.bossTelegraph.fillStyle(COLORS.red, 0.04 + progress * 0.1);
      this.bossTelegraph.fillCircle(targetX, targetY, radius);
      this.bossTelegraph.lineStyle(3, COLORS.red, 0.55 + progress * 0.4);
      this.bossTelegraph.strokeCircle(targetX, targetY, radius);
      this.bossTelegraph.lineStyle(1, 0xffd4ce, 0.72);
      this.bossTelegraph.strokeCircle(targetX, targetY, 8 + progress * 6);
    }

    beginBossCharge(boss, time) {
      const phase = boss.getData("phase") || 1;
      const favorsCharge = this.getRoute(this.finalRouteId)?.bossBias === "charge";
      const chargeSpeed = (phase === 3 ? 560 : phase === 2 ? 520 : 480) + (favorsCharge ? 28 : 0);
      boss.setData({
        attackState: "charging",
        chargeSpeed,
        chargeEndAt: time + (phase === 3 ? 920 : phase === 2 ? 1080 : 1300),
        nextDarkTrailAt: time,
      });
      boss.clearTint();
      this.bossTelegraph.clear();
      this.physics.moveTo(boss, boss.getData("chargeTargetX"), boss.getData("chargeTargetY"), chargeSpeed);
      soundscape.play("charge");
      this.cameras.main.shake(150, 0.006);
    }

    endBossCharge(boss, time) {
      if (!boss.active) return;
      boss.setVelocity(0, 0);
      boss.rotation = 0;
      this.bossTelegraph.clear();
      this.spawnRipple(boss.x, boss.y, COLORS.red);
      this.burstAt(boss.x, boss.y, COLORS.red, 7);
      this.cameras.main.shake(180, 0.008);
      const phase = boss.getData("phase") || 1;
      if (this.battlefieldProfile.id === "lantern-court") {
        this.showThreatAlert("吞灯者落点追光 · 横移躲开扇形弹", COLORS.goldHot, 900);
        this.time.delayedCall(140, () => {
          if (!boss.active || this.ended || this.battlefieldProfile.id !== "lantern-court") return;
          this.spawnBossPursuitVolley(boss, phase);
        });
      }
      this.beginBossRecovery(boss, time, phase === 3 ? 1750 : phase === 2 ? 2400 : 3200, "冲锋失衡");
    }

    spawnBossPursuitVolley(boss, phase = 1) {
      if (!boss?.active || this.battlefieldProfile.id !== "lantern-court") return false;
      const count = phase === 3 ? 7 : phase === 2 ? 5 : 3;
      const spread = phase === 3 ? 0.56 : phase === 2 ? 0.42 : 0.3;
      const baseAngle = Phaser.Math.Angle.Between(boss.x, boss.y, this.player.x, this.player.y);
      const color = phase === 3 ? COLORS.goldHot : COLORS.red;
      for (let index = 0; index < count; index += 1) {
        const ratio = count === 1 ? 0 : index / (count - 1) - 0.5;
        const angle = baseAngle + ratio * spread;
        const speed = (phase === 3 ? 330 : phase === 2 ? 300 : 275) + Math.abs(ratio) * 22;
        const shot = this.enemyProjectiles.create(
          boss.x + Math.cos(angle) * 42,
          boss.y + Math.sin(angle) * 42,
          phase === 3 && index % 2 === 0 ? "bossShotGold" : "bossShotRed",
        )
          .setDepth(19)
          .setTint(index % 2 === 0 ? color : COLORS.violet)
          .setBlendMode(Phaser.BlendModes.NORMAL);
        shot.body.setCircle(7, 11, 11);
        shot.rotation = angle;
        shot.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        shot.setAngularVelocity((index % 2 === 0 ? 1 : -1) * (phase === 3 ? 170 : 120));
        shot.setData({
          damage: phase === 3 ? 10 : phase === 2 ? 8 : 6,
          life: 2400,
          trailAt: 0,
          color: index % 2 === 0 ? color : COLORS.violet,
          trailRadius: phase === 3 ? 5 : 4,
          fxStyle: phase === 3 ? "bossGold" : "bossRed",
          curveRate: ratio * (phase === 3 ? 0.0001 : 0.00007),
        });
      }
      this.bossPressureTelemetry.pursuitVolleys += 1;
      this.bossPressureTelemetry.pursuitProjectiles += count;
      this.spawnExpandingSigil(boss.x, boss.y, color, phase === 3 ? 118 : 92, 360);
      this.spawnRadialShards(boss.x, boss.y, color, phase === 3 ? 11 : 7, phase === 3 ? 76 : 58, baseAngle, 0.44);
      soundscape.play("enemyShot", true);
      return true;
    }

    enterBossPhase(boss, phase, time) {
      if (!boss.active) return;
      const mirrorBoss = this.battlefieldProfile.id === "mirror-harbor";
      const bossBias = this.getRoute(this.finalRouteId)?.bossBias;
      const transitionMode = bossBias === "pulse"
        ? (phase === 3 ? "spiral" : "refraction")
        : (phase === 3 ? "cross" : "lattice");
      this.bossTelegraph.clear();
      boss.setData({
        phase,
        specialIndex: (boss.getData("specialIndex") || 0) + 1,
        nextCrowdAt: Math.min(boss.getData("nextCrowdAt") || Number.POSITIVE_INFINITY, time + 600),
      });
      this.bossSummonTelemetry.phasesSeen.add(phase);
      const aura = boss.getData("bossAura");
      const phaseColor = mirrorBoss ? (phase === 3 ? 0xff6d79 : 0x43d9d0) : (phase === 3 ? COLORS.goldHot : COLORS.red);
      if (aura?.active) {
        aura.setStrokeStyle(phase === 3 ? 4 : 3, phaseColor, 0.88);
        aura.setFillStyle(phaseColor, phase === 3 ? 0.055 : 0.035);
      }
      const title = mirrorBoss
        ? (phase === 3 ? "终相 · 双港退潮" : "二相 · 潮镜倒悬")
        : (phase === 3 ? "终相 · 吞灯" : "二相 · 暗潮");
      const mirrorPhaseDetails = {
        refraction: "折光航路展开 · 看清弹缝后横向穿行",
        spiral: "潮镜轮舞加速 · 先向外换位再反击",
        lattice: "三点棱阵成形 · 不要停在节点之间",
        cross: "镜海裁光锁住十字航路 · 躲进四角空区",
      };
      const detail = mirrorBoss
        ? mirrorPhaseDetails[transitionMode]
        : (phase === 3 ? "双重暗潮袭来 · 第二道缺口旋转九十度" : "青色缺口标记出现 · 按顺时针规律移动");
      const bannerY = mirrorBoss
        ? Phaser.Math.Clamp(this.getBossEntryY() + 150, this.getPlayableTop() + 140, this.getPlayableBottom() - 90)
        : null;
      this.showPhaseBanner(mirrorBoss ? "潮镜圣母倒悬" : "吞灯者蜕变", title, detail, bannerY);
      this.cameras.main.flash(mirrorBoss ? 130 : 260, mirrorBoss ? (phase === 3 ? 255 : 67) : (phase === 3 ? 255 : 239), mirrorBoss ? (phase === 3 ? 109 : 217) : (phase === 3 ? 159 : 90), mirrorBoss ? (phase === 3 ? 121 : 208) : (phase === 3 ? 67 : 79), false);
      this.cameras.main.shake(320, 0.01);
      soundscape.play("bossPhase", true);
      if (mirrorBoss) {
        boss.setData({
          attackState: "phaseTransition",
          phaseTransitionUntil: time + 150,
          phaseTransitionMode: transitionMode,
        });
        return;
      }
      if (phase === 3) {
        this.clearBossAttendants(false);
      }
      this.beginBossSummonWarning(boss, time, true);
    }

    beginBossPulseWarning(boss, time, isTransition = false) {
      if (!boss.active) return;
      const previousRing = boss.getData("bossPulseRing");
      if (previousRing?.active) previousRing.destroy();
      const phase = boss.getData("phase") || 2;
      const color = phase === 3 ? COLORS.goldHot : COLORS.red;
      const duration = RUN_PROFILE.precisionPrototype
        ? RUN_PROFILE.prototypeBossGapWarningDuration
        : isTransition ? 920 : phase === 3 ? 680 : 780;
      const pulsePatternIndex = boss.getData("pulsePatternIndex") || 0;
      const safeAngle = (pulsePatternIndex % 4) * (Math.PI / 2);
      const pulseCount = phase === 3 ? 18 : 16;
      const pulseSpeed = phase === 3 ? 228 : 205;
      const prototypePulseSpec = RUN_PROFILE.precisionPrototype
        ? {
            warningAt: time,
            dangerAt: time + duration,
            safeAngle,
            count: pulseCount,
            speed: pulseSpeed,
            gapIndices: [0, pulseCount - 1],
            step: (Math.PI * 2) / pulseCount,
          }
        : null;
      const ring = this.add.image(boss.x, boss.y, "fxRing")
        .setTint(color)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(5)
        .setAlpha(0.82)
        .setScale(0.92);
      this.tweens.add({
        targets: ring,
        scale: phase === 3 ? 6.2 : 5.35,
        angle: phase === 3 ? 150 : 110,
        alpha: 0.1,
        duration,
        ease: "Sine.easeIn",
      });
      boss.setData({
        attackState: "pulseWarning",
        pulseAt: time + duration,
        bossPulseRing: ring,
        pulseSafeAngle: safeAngle,
        prototypePulseSpec,
      });
      boss.setVelocity(0, 0);
      boss.setTint(color);
      this.bossTelegraph.clear();
      const safeMarkerDistance = Math.min(this.scale.width, this.scale.height) * 0.24;
      const safeMarkerX = boss.x + Math.cos(safeAngle) * safeMarkerDistance;
      const safeMarkerY = boss.y + Math.sin(safeAngle) * safeMarkerDistance;
      if (prototypePulseSpec) {
        this.recordPrecisionPrototypeEvent("boss-gap-warning", {
          ...prototypePulseSpec,
          marker: { x: safeMarkerX, y: safeMarkerY, radius: 30 },
        });
      }
      this.bossTelegraph.fillStyle(COLORS.ice, 0.12);
      this.bossTelegraph.fillCircle(safeMarkerX, safeMarkerY, 30);
      this.bossTelegraph.lineStyle(3, COLORS.ice, 0.84);
      this.bossTelegraph.strokeCircle(safeMarkerX, safeMarkerY, 30);
      this.bossTelegraph.lineStyle(1, 0xffffff, 0.72);
      this.bossTelegraph.strokeCircle(safeMarkerX, safeMarkerY, 11);
      this.showCombatLabel(
        boss.x + Math.cos(safeAngle) * 92,
        boss.y + Math.sin(safeAngle) * 92,
        "安全缺口",
        COLORS.ice,
      );
      this.showThreatAlert(
        phase === 3
          ? "双重暗潮将至 · 第二道缺口旋转九十度"
          : "暗潮将至 · 青色圆标方向是安全缺口",
        COLORS.ice,
        duration + 420,
      );
      this.updateBossPhaseHud(boss);
      soundscape.play("warning");
    }

    releaseBossPulse(boss, time) {
      if (!boss.active) return;
      const phase = boss.getData("phase") || 2;
      const prototypePulseSpec = boss.getData("prototypePulseSpec");
      const ring = boss.getData("bossPulseRing");
      if (ring?.active) ring.destroy();
      boss.setData("bossPulseRing", null);
      boss.clearTint();
      this.bossTelegraph.clear();
      const count = prototypePulseSpec?.count || (phase === 3 ? 18 : 16);
      const speed = prototypePulseSpec?.speed || (phase === 3 ? 228 : 205);
      const safeAngle = prototypePulseSpec?.safeAngle ?? boss.getData("pulseSafeAngle") ?? 0;
      const pulsePatternIndex = boss.getData("pulsePatternIndex") || 0;
      boss.setData("pulsePatternIndex", pulsePatternIndex + 1);
      this.spawnBossPulseWave(boss, count, speed, safeAngle, phase, prototypePulseSpec);
      if (prototypePulseSpec) {
        this.recordPrecisionPrototypeEvent("boss-gap-release", {
          ...prototypePulseSpec,
          releasedAt: time,
          projectileCount: count - prototypePulseSpec.gapIndices.length,
        });
        this.bossGapDodgeTracking = {
          active: true,
          hit: false,
          source: "boss-safe-gap",
          warningAt: prototypePulseSpec.warningAt,
          releasedAt: time,
        };
      }
      if (phase === 3 && !prototypePulseSpec) {
        this.time.delayedCall(240, () => {
          if (!boss.active || this.ended) return;
          this.spawnBossPulseWave(boss, count, speed + 18, safeAngle + Math.PI / 2, phase);
        });
      }
      const color = phase === 3 ? COLORS.goldHot : COLORS.red;
      this.spawnExpandingSigil(boss.x, boss.y, color, phase === 3 ? 152 : 126, phase === 3 ? 480 : 420);
      this.spawnExpandingSigil(boss.x, boss.y, phase === 3 ? COLORS.gold : COLORS.violet, phase === 3 ? 108 : 88, 380, 45, Math.PI / 4);
      this.spawnRadialShards(boss.x, boss.y, color, phase === 3 ? 12 : 10, phase === 3 ? 94 : 76, safeAngle, 0.54);
      this.burstAt(boss.x, boss.y, color, phase === 3 ? 18 : 13);
      this.cameras.main.shake(220, phase === 3 ? 0.012 : 0.008);
      soundscape.play("pulse");
      if (phase === 3 && boss.getData("comboChargePending")) {
        boss.setData({ queuedAttack: "charge", comboChargePending: false });
      }
      this.beginBossRecovery(
        boss,
        time,
        prototypePulseSpec ? RUN_PROFILE.prototypeBossPostGapDelay : phase === 3 ? 1750 : 2400,
        "暗潮反噬",
      );
    }

    spawnBossPulseWave(boss, count, speed, safeAngle, phase, prototypePulseSpec = null) {
      const color = phase === 3 ? COLORS.goldHot : COLORS.red;
      const step = (Math.PI * 2) / count;
      let spawned = 0;
      for (let index = 0; index < count; index += 1) {
        if (index === 0 || index === count - 1) continue;
        const angle = safeAngle + step / 2 + step * index;
        const x = boss.x + Math.cos(angle) * 48;
        const y = boss.y + Math.sin(angle) * 48;
        const texture = phase === 3 ? "bossShotGold" : "bossShotRed";
        const shot = this.enemyProjectiles.create(x, y, texture)
          .setDepth(19)
          .setBlendMode(Phaser.BlendModes.NORMAL);
        shot.body.setCircle(7, 11, 11);
        shot.rotation = angle;
        shot.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        shot.setAngularVelocity((index % 2 === 0 ? 1 : -1) * (phase === 3 ? 150 : 105));
        shot.setData({
          damage: phase === 3 ? 9 : 7,
          life: 3200,
          trailAt: 0,
          color,
          trailRadius: phase === 3 ? 5 : 4,
          fxStyle: phase === 3 ? "bossGold" : "bossRed",
          ...(prototypePulseSpec
            ? {
                prototypeSource: "boss-safe-gap",
                prototypeWarningAt: prototypePulseSpec.warningAt,
                prototypeDangerAt: prototypePulseSpec.dangerAt,
              }
            : {}),
        });
        spawned += 1;
      }
      this.bossPressureTelemetry.pulseWaves += 1;
      this.bossPressureTelemetry.pulseProjectiles += spawned;
    }

    countBossAttendants() {
      let count = 0;
      this.enemies?.children.iterate((enemy) => {
        if (enemy?.active && enemyCatalog[enemy.getData("kind")]?.bossMinion) count += 1;
      });
      return count;
    }

    countBossCrowd() {
      let count = 0;
      this.enemies?.children.iterate((enemy) => {
        if (enemy?.active && enemy.getData("bossWaveMinion")) count += 1;
      });
      return count;
    }

    countBossCrowdBruisers() {
      let count = 0;
      this.enemies?.children.iterate((enemy) => {
        if (
          enemy?.active
          && enemy.getData("bossWaveMinion")
          && enemy.getData("pressureBruiser")
        ) count += 1;
      });
      return count;
    }

    getBossSupportCount() {
      let count = this.countBossAttendants();
      this.enemies?.children.iterate((enemy) => {
        if (enemy?.active && enemy.getData("kind") === "mirrorAcolyte") count += 1;
      });
      return count;
    }

    updateBossCrowd(boss, time) {
      if (RUN_PROFILE.precisionPrototype) return;
      if (!boss?.active || this.ended) return;
      const state = boss.getData("attackState");
      if (state !== "chasing" && state !== "recovering") return;
      if (time < (boss.getData("nextCrowdAt") || Number.POSITIVE_INFINITY)) return;
      const phase = boss.getData("phase") || 1;
      const pressureBossCrowd = this.isStandardMirrorHarborPressureSlice();
      const citySiegeBossCrowd = this.isStandardLanternCourtSiegeSlice();
      const phaseIndex = Math.min(2, Math.max(0, phase - 1));
      const baseLimit = pressureBossCrowd
        ? phase >= 3
          ? STANDARD_MIRROR_BOSS_PRESSURE_PHASE3_CAP
          : phase === 2 ? STANDARD_MIRROR_BOSS_PRESSURE_PHASE2_CAP : STANDARD_MIRROR_BOSS_PRESSURE_CAP
        : citySiegeBossCrowd
          ? STANDARD_CITY_BOSS_SIEGE_CAPS[phaseIndex]
        : phase >= 3 ? 6 : phase === 2 ? 5 : 4;
      const supportPenalty = this.getBossSupportCount() > 0 ? 2 : 0;
      const mobilePenalty = this.usesCompactControls() ? 1 : 0;
      const limit = pressureBossCrowd || citySiegeBossCrowd
        ? baseLimit
        : Math.max(2, baseLimit - supportPenalty - mobilePenalty);
      const active = this.countBossCrowd();
      if (active >= limit) return;

      const basePackSize = pressureBossCrowd
        ? phase >= 3
          ? STANDARD_MIRROR_BOSS_PRESSURE_PHASE3_PACK
          : phase === 2 ? STANDARD_MIRROR_BOSS_PRESSURE_PHASE2_PACK : STANDARD_MIRROR_BOSS_PRESSURE_PACK
        : citySiegeBossCrowd
          ? STANDARD_CITY_BOSS_SIEGE_PACKS[phaseIndex]
        : phase >= 3 ? 3 : 2;
      const packSize = pressureBossCrowd || citySiegeBossCrowd
        ? basePackSize
        : phase === 2 && Math.random() > 0.5 ? 3 : basePackSize;
      const spawnCount = Math.min(packSize, limit - active);
      const pressureEdge = pressureBossCrowd
        ? ["left", "right", "top", "bottom"][Math.floor(Math.random() * 4)]
        : null;
      const pressureBruiserRemaining = pressureBossCrowd
        ? Math.max(0, STANDARD_MIRROR_BOSS_BRUISER_CAPS[phaseIndex] - this.countBossCrowdBruisers())
        : 0;
      const heavyCount = pressureBossCrowd
        ? Math.min(spawnCount, STANDARD_MIRROR_BOSS_BRUISER_COUNTS[phaseIndex], pressureBruiserRemaining)
        : 0;
      const cityEdgePair = this.citySiegeWaveIndex % 2 === 0
        ? ["left", "right"]
        : ["top", "bottom"];
      const cityComposition = STANDARD_CITY_SIEGE_COMPOSITIONS[phaseIndex];
      let spawned = 0;
      for (let index = 0; index < spawnCount; index += 1) {
        const pressureBruiser = index < heavyCount;
        const kind = pressureBruiser
          ? STANDARD_MIRROR_BRUISER_COMPOSITION[index % STANDARD_MIRROR_BRUISER_COMPOSITION.length]
          : citySiegeBossCrowd
            ? cityComposition[index % cityComposition.length]
          : "gloamling";
        const cityEdge = citySiegeBossCrowd ? cityEdgePair[index % cityEdgePair.length] : null;
        const cityEdgeIndex = Math.floor(index / cityEdgePair.length);
        const cityEdgeCount = Math.ceil(spawnCount / cityEdgePair.length);
        const point = pressureBossCrowd || citySiegeBossCrowd
          ? this.getPrototypeHordeSpawnPoint(
            pressureBossCrowd ? pressureEdge : cityEdge,
            pressureBossCrowd ? index : cityEdgeIndex,
            pressureBossCrowd ? spawnCount : cityEdgeCount,
          )
          : { x: null, y: null };
        const minion = this.spawnEnemy(kind, point.x, point.y, {
          pressureMelee: pressureBossCrowd,
          pressureBruiser,
          citySiege: citySiegeBossCrowd,
          spawnEdge: pressureBossCrowd ? pressureEdge : cityEdge,
        });
        if (!minion) continue;
        minion.setData({ bossWaveMinion: true, xp: 0 });
        spawned += 1;
      }
      if (citySiegeBossCrowd && spawned > 0) this.citySiegeWaveIndex += 1;
      const interval = pressureBossCrowd
        ? phase >= 3
          ? STANDARD_MIRROR_BOSS_PRESSURE_PHASE3_CADENCE
          : phase === 2 ? STANDARD_MIRROR_BOSS_PRESSURE_PHASE2_CADENCE : STANDARD_MIRROR_BOSS_PRESSURE_CADENCE
        : citySiegeBossCrowd
          ? STANDARD_CITY_BOSS_SIEGE_CADENCES[phaseIndex]
        : phase >= 3 ? 6000 : phase === 2 ? 7000 : 8000;
      boss.setData("nextCrowdAt", time + interval);
      if (!spawned) return;
      this.bossCrowdTelemetry.waves += 1;
      this.bossCrowdTelemetry.spawned += spawned;
      this.bossCrowdTelemetry.phaseCounts[phase] += spawned;
      this.bossCrowdTelemetry.maxActive = Math.max(this.bossCrowdTelemetry.maxActive, this.countBossCrowd());
      if (this.bossCrowdTelemetry.waves === 1) {
        this.showThreatAlert(
          pressureBossCrowd
            ? "厚潮近战群涌入 · 清怪蓄光，再压制首领"
            : citySiegeBossCrowd
              ? "四门围城军压境 · 先破火线，再压制首领"
              : "扑灯幼影涌入 · 清怪蓄光，再压制首领",
          0xe56b58,
          1500,
        );
      }
    }

    clearBossCrowd() {
      this.enemies?.getChildren().slice().forEach((enemy) => {
        if (!enemy?.active || !enemy.getData("bossWaveMinion")) return;
        this.destroyEnemyDecorations(enemy);
        enemy.destroy();
      });
    }

    beginBossSummonWarning(boss, time, isTransition = false) {
      if (!boss?.active || this.battlefieldProfile.id !== "lantern-court") return false;
      const phase = boss.getData("phase") || 2;
      const duration = isTransition ? 880 : 760;
      const telegraph = this.add.graphics().setDepth(5).setBlendMode(Phaser.BlendModes.ADD);
      const count = phase >= 3 ? 3 : 2;
      const radius = phase >= 3 ? 118 : 92;
      for (let index = 0; index < count; index += 1) {
        const angle = -Math.PI / 2 + (Math.PI * 2 * index) / count;
        const x = Phaser.Math.Clamp(boss.x + Math.cos(angle) * radius, 58, this.scale.width - 58);
        const y = Phaser.Math.Clamp(boss.y + Math.sin(angle) * radius, this.getPlayableTop() + 48, this.getPlayableBottom() - 48);
        telegraph.fillStyle(index % 2 === 0 ? COLORS.violet : COLORS.red, 0.07);
        telegraph.fillCircle(x, y, 38);
        telegraph.lineStyle(3, index % 2 === 0 ? COLORS.violet : COLORS.red, 0.86);
        telegraph.strokeCircle(x, y, 38);
        telegraph.lineStyle(1, 0xffffff, 0.72);
        telegraph.strokeCircle(x, y, 14);
      }
      this.tweens.add({ targets: telegraph, alpha: { from: 0.28, to: 1 }, duration, ease: "Sine.easeIn" });
      boss.setData({ attackState: "summonWarning", summonAt: time + duration, summonTelegraph: telegraph, nextSummonAt: Number.POSITIVE_INFINITY });
      boss.setVelocity(0, 0);
      boss.setTint(COLORS.violet);
      this.bossSummonTelemetry.warnings += 1;
      this.showThreatAlert(`噬光侍从将至 · 击破后解除首领减伤`, COLORS.violet, duration + 520);
      soundscape.play("summon", true);
      return true;
    }

    getBossAttendantComposition(phase) {
      if (phase < 3) return ["devourerRanged", "devourerChaser"];
      const bias = this.getRoute(this.finalRouteId)?.bossBias;
      return bias === "pulse"
        ? ["devourerRanged", "devourerRanged", "devourerChaser"]
        : ["devourerChaser", "devourerChaser", "devourerRanged"];
    }

    releaseBossSummon(boss, time) {
      if (!boss?.active) return false;
      boss.getData("summonTelegraph")?.destroy();
      boss.setData("summonTelegraph", null);
      boss.clearTint();
      const phase = boss.getData("phase") || 2;
      const composition = this.getBossAttendantComposition(phase);
      const radius = phase >= 3 ? 118 : 94;
      composition.slice(0, Math.max(0, 3 - this.countBossAttendants())).forEach((kind, index) => {
        const angle = -Math.PI / 2 + (Math.PI * 2 * index) / composition.length;
        const x = Phaser.Math.Clamp(boss.x + Math.cos(angle) * radius, 52, this.scale.width - 52);
        const y = Phaser.Math.Clamp(boss.y + Math.sin(angle) * radius, this.getPlayableTop() + 44, this.getPlayableBottom() - 44);
        const attendant = this.spawnEnemy(kind, x, y);
        if (!attendant) return;
        attendant.setData({ bossMinion: true, attendantRole: enemyCatalog[kind].attendantRole, summonedPhase: phase });
        this.spawnExpandingSigil(x, y, enemyCatalog[kind].color, 84, 420, index * 55, index * Math.PI / 4);
        this.spawnRadialShards(x, y, enemyCatalog[kind].color, 8, 58, index * 0.5, 0.5);
      });
      const active = this.countBossAttendants();
      this.bossSummonTelemetry.releases += 1;
      this.bossSummonTelemetry.phaseCounts[phase] = (this.bossSummonTelemetry.phaseCounts[phase] || 0) + active;
      this.bossSummonTelemetry.maxActive = Math.max(this.bossSummonTelemetry.maxActive, active);
      this.bossSummonTelemetry.nextAllowedAt = Number.POSITIVE_INFINITY;
      this.showCombatLabel(boss.x, boss.y - 62, `侍从护灯 · 减伤 20%`, COLORS.violet);
      soundscape.play("summon", true);
      if (phase >= 3) {
        boss.setData({ attackState: "summonCombo", comboAt: time + 900, comboChargePending: true });
      } else {
        this.beginBossRecovery(boss, time, 2400, "侍从分灯");
      }
      this.updateBossPhaseHud(boss);
      return true;
    }

    clearBossAttendants(grantCharge = false) {
      this.enemies?.getChildren().slice().forEach((enemy) => {
        if (!enemy?.active || !enemyCatalog[enemy.getData("kind")]?.bossMinion) return;
        const x = enemy.x;
        const y = enemy.y;
        this.destroyEnemyDecorations(enemy);
        enemy.destroy();
        this.spawnExpandingSigil(x, y, COLORS.violet, 54, 280);
        if (grantCharge) this.gainEmberCharge(10, "噬光侍从");
      });
    }

    spawnBossDarkTrail(x, y, time) {
      const pool = this.add.circle(x, y, 27, 0x120918, 0.52).setStrokeStyle(2, COLORS.violet, 0.66).setDepth(3);
      const ring = this.add.image(x, y, "fxRing").setTint(COLORS.violet).setBlendMode(Phaser.BlendModes.ADD).setDepth(4).setAlpha(0.48).setScale(0.62);
      this.tweens.add({ targets: ring, angle: 180, scale: 1.05, alpha: 0.08, duration: 1450, ease: "Sine.easeOut" });
      this.bossHazards.push({ x, y, radius: 30, expiresAt: time + 1450, pool, ring });
    }

    updateBossHazards(time) {
      this.bossHazards = this.bossHazards.filter((hazard) => {
        if (time >= hazard.expiresAt) {
          hazard.pool?.destroy();
          hazard.ring?.destroy();
          return false;
        }
        if (
          time >= (this.nextBossTrailDamageAt || 0)
          && Phaser.Math.Distance.Between(this.player.x, this.player.y, hazard.x, hazard.y) <= hazard.radius + 12
        ) {
          this.nextBossTrailDamageAt = time + 720;
          this.damagePlayerFromHazard(5, hazard.x, hazard.y, "暗迹灼灯", COLORS.violet);
        }
        return true;
      });
    }

    clearBossHazards() {
      this.bossHazards.forEach((hazard) => {
        hazard.pool?.destroy();
        hazard.ring?.destroy();
      });
      this.bossHazards = [];
    }

    getBossCombatState() {
      const activeAttendants = this.countBossAttendants();
      return {
        phase: this.boss?.getData("phase") || null,
        attackState: this.boss?.getData("attackState") || null,
        activeAttendants,
        attendantDamageMultiplier: activeAttendants > 0 ? 0.8 : 1,
        nextSummonAt: this.boss?.getData("nextSummonAt") || null,
        telemetry: {
          ...this.bossSummonTelemetry,
          phaseCounts: { ...this.bossSummonTelemetry.phaseCounts },
          phasesSeen: [...this.bossSummonTelemetry.phasesSeen],
        },
        pressure: { ...this.bossPressureTelemetry },
        crowd: {
          ...this.bossCrowdTelemetry,
          phaseCounts: { ...this.bossCrowdTelemetry.phaseCounts },
          active: this.countBossCrowd(),
        },
      };
    }

    beginBossRecovery(boss, time, nextSpecialDelay, cause) {
      if (!boss.active) return;
      const timingScale = RUN_PROFILE.id === "standard"
        ? (this.battlefieldProfile.id === "mirror-harbor" ? 0.86 : 0.9)
        : 1;
      boss.setVelocity(0, 0);
      boss.setData({
        attackState: "recovering",
        recoverUntil: time + 720,
        nextSpecialAt: time + Math.round(nextSpecialDelay * timingScale),
      });
      ui.objectiveText.textContent = `${cause} · 破绽伤害 ×1.35`;
      this.showCombatLabel(boss.x, boss.y - 58, "破绽 ×1.35", COLORS.gold);
      this.updateBossPhaseHud(boss);
    }

    updateBossPhaseHud(boss = this.boss) {
      if (!boss?.active) return;
      const state = boss.getData("attackState");
      const vulnerable = state === "recovering";
      const phase = boss.getData("phase") || 1;
      const attendants = this.battlefieldProfile.id === "lantern-court" ? this.countBossAttendants() : 0;
      ui.bossPhase.textContent = state === "entering"
        ? "现身"
        : attendants > 0
          ? `护灯 ${attendants} · 减伤 20%`
          : vulnerable ? "破绽 ×1.35" : phase === 3 ? "终相" : phase === 2 ? "二相" : "一相";
      ui.bossPhase.classList.toggle("is-vulnerable", vulnerable);
    }

    updateProjectiles(delta) {
      this.bullets.children.iterate((bullet) => {
        if (!bullet || !bullet.active) return;
        if ((bullet.getData("projectileCutChance") || 0) > 0) {
          const previousX = bullet.getData("previousX") ?? bullet.x;
          const previousY = bullet.getData("previousY") ?? bullet.y;
          this.cutEnemyProjectilesWithSwordWave(bullet, previousX, previousY);
          bullet.setData({ previousX: bullet.x, previousY: bullet.y });
          const swordWaveOriginX = bullet.getData("swordWaveOriginX") ?? bullet.x;
          const swordWaveOriginY = bullet.getData("swordWaveOriginY") ?? bullet.y;
          this.secondaryTelemetry.maxSwordWaveDistance = Math.max(
            this.secondaryTelemetry.maxSwordWaveDistance,
            Phaser.Math.Distance.Between(swordWaveOriginX, swordWaveOriginY, bullet.x, bullet.y),
          );
        }
        const returnAfter = bullet.getData("returnAfter") || 0;
        const outboundAge = this.gameplayTime - (bullet.getData("spawnedAt") || 0);
        const velocity = bullet.body.velocity;
        const secondaryBehavior = bullet.getData("secondaryBehavior");
        if (secondaryBehavior && this.gameplayTime >= (bullet.getData("secondaryArrivalAt") || Number.POSITIVE_INFINITY)) {
          this.detonateSecondaryProjectile(bullet);
          return;
        }
        if (secondaryBehavior === "solar-rocket") {
          const impactX = bullet.getData("secondaryImpactX");
          const impactY = bullet.getData("secondaryImpactY");
          const toImpactX = impactX - bullet.x;
          const toImpactY = impactY - bullet.y;
          const passedImpact = toImpactX * velocity.x + toImpactY * velocity.y <= 0;
          const reachesImpactThisFrame = Math.hypot(toImpactX, toImpactY)
            <= (bullet.getData("speed") || 0) * (delta / 1000) + 4;
          if (passedImpact || reachesImpactThisFrame) {
            bullet.setPosition(impactX, impactY);
            bullet.setVelocity(0, 0);
          }
        }
        const reachedTravelEdge = outboundAge >= 60 && (
          (bullet.x <= 8 && velocity.x < 0) ||
          (bullet.x >= this.scale.width - 8 && velocity.x > 0) ||
          (bullet.y <= 86 && velocity.y < 0) ||
          (bullet.y >= this.getPlayableBottom() - 8 && velocity.y > 0)
        );
        if (
          returnAfter > 0 &&
          !bullet.getData("returning") &&
          (outboundAge >= returnAfter || reachedTravelEdge)
        ) {
          this.beginReturnFlight(bullet);
        }

        const speed = bullet.getData("speed") || this.stats.projectileSpeed;
        if (bullet.getData("returning")) {
          let returnX = this.player.x;
          let returnY = this.player.y - 5;
          const waypoint = bullet.getData("returnWaypoint");
          const waypointActive = waypoint?.active
            && this.gameplayTime < (bullet.getData("returnWaypointUntil") || 0);
          if (waypointActive) {
            const waypointDistance = Phaser.Math.Distance.Between(bullet.x, bullet.y, waypoint.x, waypoint.y);
            if (waypointDistance > 34) {
              returnX = waypoint.x;
              returnY = waypoint.y;
            } else {
              bullet.setData({ returnWaypoint: null, returnWaypointUntil: 0 });
            }
          } else if (waypoint) {
            bullet.setData({ returnWaypoint: null, returnWaypointUntil: 0 });
          }
          const distance = Phaser.Math.Distance.Between(bullet.x, bullet.y, this.player.x, this.player.y - 5);
          if (!bullet.getData("returnWaypoint") && distance <= 28) {
            this.catchReturner(bullet);
            return;
          }
          const desiredAngle = Phaser.Math.Angle.Between(bullet.x, bullet.y, returnX, returnY);
          const currentAngle = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
          const angle = Phaser.Math.Angle.RotateTo(currentAngle, desiredAngle, Math.min(0.28, 0.12 + delta * 0.004));
          bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        } else {
          const target = bullet.getData("target");
          const homing = bullet.getData("homing") || 0;
          if (target?.active && homing > 0) {
            const desiredAngle = Phaser.Math.Angle.Between(bullet.x, bullet.y, target.x, target.y);
            const currentAngle = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
            const angle = Phaser.Math.Angle.RotateTo(currentAngle, desiredAngle, homing);
            if (bullet.getData("fxStyle") !== "returner") bullet.rotation = angle;
            bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
          }
          const curveRate = bullet.getData("secondaryCurveRate") || 0;
          if (curveRate !== 0 && (!target?.active || homing <= 0)) {
            const curvedAngle = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x) + curveRate * delta;
            bullet.rotation = curvedAngle;
            bullet.setVelocity(Math.cos(curvedAngle) * speed, Math.sin(curvedAngle) * speed);
          }
        }
        const glowSprite = bullet.getData("glowSprite");
        if (glowSprite?.active) {
          const pulse = 0.9 + Math.sin(this.gameplayTime * 0.018) * 0.12;
          glowSprite
            .setPosition(bullet.x, bullet.y)
            .setRotation(Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x))
            .setAlpha(0.56 + pulse * 0.18)
            .setScale((bullet.getData("fxStyle") === "lance" ? 0.78 : 0.52) * pulse);
        }
        if (this.gameplayTime >= (bullet.getData("trailAt") || 0)) {
          const trailSpawned = this.spawnProjectileTrail(
            bullet.x,
            bullet.y,
            bullet.getData("color") || COLORS.gold,
            bullet.getData("trailRadius") || 3,
            bullet.getData("fxStyle") || "tracker",
            Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x),
            "player",
          );
          if (trailSpawned) bullet.setData("trailAt", this.gameplayTime + 52);
        }
        bullet.setData("life", bullet.getData("life") - delta);
        const boundsMargin = returnAfter > 0 ? 96 : 40;
        if (
          bullet.getData("life") <= 0 ||
          bullet.x < -boundsMargin || bullet.x > this.scale.width + boundsMargin ||
          bullet.y < -boundsMargin || bullet.y > this.scale.height + boundsMargin
        ) {
          bullet.destroy();
        }
      });
      this.enemyProjectiles.children.iterate((shot) => {
        if (!shot || !shot.active) return;
        shot.setData("life", shot.getData("life") - delta);
        const reverseAt = shot.getData("reverseAt") || 0;
        if (reverseAt > 0 && !shot.getData("reversed") && this.gameplayTime >= reverseAt) {
          const angle = Phaser.Math.Angle.Between(shot.x, shot.y, this.player.x, this.player.y);
          const speed = shot.getData("reverseSpeed") || shot.body.velocity.length();
          shot.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
          shot.setTint(COLORS.goldHot);
          shot.setData({ reversed: true, color: COLORS.goldHot, reverseAt: 0 });
          this.spawnExpandingSigil(shot.x, shot.y, COLORS.cyan, 42, 250);
          this.spawnRadialShards(shot.x, shot.y, COLORS.goldHot, 4, 28, angle, 0.3, Math.PI);
        }
        const curveRate = shot.getData("curveRate") || 0;
        if (curveRate !== 0) {
          const speed = shot.body.velocity.length();
          const angle = Math.atan2(shot.body.velocity.y, shot.body.velocity.x) + curveRate * delta;
          shot.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
          shot.rotation = angle;
        }
        shot.setTint(ENEMY_PROJECTILE_ALERT_COLOR);
        if (this.gameplayTime >= (shot.getData("trailAt") || 0)) {
          const trailSpawned = this.spawnProjectileTrail(
            shot.x,
            shot.y,
            shot.getData("color") || COLORS.violet,
            shot.getData("trailRadius") || 4,
            shot.getData("fxStyle") || "hexer",
            Math.atan2(shot.body.velocity.y, shot.body.velocity.x),
            "enemy",
          );
          if (trailSpawned) shot.setData("trailAt", this.gameplayTime + 58);
        }
        if (
          shot.getData("life") <= 0 ||
          shot.x < -40 || shot.x > this.scale.width + 40 ||
          shot.y < -40 || shot.y > this.scale.height + 40
        ) {
          shot.destroy();
        }
      });
      this.tryResolveBossGapPerfectDodge();
    }

    updateSparks() {
      this.sparks.children.iterate((spark) => {
        if (!spark || !spark.active) return;
        const distance = Phaser.Math.Distance.Between(spark.x, spark.y, this.player.x, this.player.y);
        const hasWaited = this.gameplayTime - spark.getData("bornAt") > 1800;
        if (distance < this.stats.pickupRadius || hasWaited) {
          const pullSpeed = hasWaited ? 360 : 260 + (this.stats.pickupRadius - distance) * 2;
          this.physics.moveToObject(spark, this.player, pullSpeed);
        } else {
          spark.body.velocity.scale(0.94);
        }
        if (distance < 22) this.collectSpark(spark);
      });
    }

    updateOrbitals(time) {
      if (!this.orbitals.length) return;
      const gravityHalo = this.activeSynergies.has("gravityHalo");
      const orbitVisualLevel = Math.max(0, Math.min(4, this.stats.orbitLevel || 0));
      const rhythmLevel = Math.max(0, Math.min(5, this.upgradeLevels.rhythm || 0));
      const orbitalScale = 1.12 + orbitVisualLevel * 0.14;
      const orbitAngularSpeed = Math.min(0.0048, 0.0022 + orbitVisualLevel * 0.00035 + rhythmLevel * 0.00016);
      const radius = 56 + this.stats.orbitLevel * 8 + (gravityHalo ? 28 : 0);
      this.orbitals.forEach((orbital, index) => {
        const angle = time * orbitAngularSpeed + (Math.PI * 2 * index) / this.orbitals.length;
        orbital
          .setPosition(this.player.x + Math.cos(angle) * radius, this.player.y + Math.sin(angle) * radius)
          .setRotation(angle + Math.PI / 4)
          .setScale(orbitalScale + Math.sin(time * 0.008 + index) * 0.1);
        if (time >= (orbital.getData("trailAt") || 0)) {
          const trail = this.add.image(orbital.x, orbital.y, "fxShard")
            .setTint(index % 2 === 0 ? COLORS.cyan : COLORS.gold)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(7)
            .setRotation(angle + Math.PI)
            .setAlpha(0.58)
            .setScale(0.5, 0.28);
          this.tweens.add({
            targets: trail,
            x: trail.x - Math.cos(angle) * 30,
            y: trail.y - Math.sin(angle) * 30,
            scaleX: 0.16,
            scaleY: 0.1,
            alpha: 0,
            duration: 220,
            ease: "Quad.easeOut",
            onComplete: () => trail.destroy(),
          });
          orbital.setData("trailAt", time + (this.usesCompactControls() ? 230 : 160));
        }
        this.enemies.children.iterate((enemy) => {
          if (!enemy || !enemy.active) return;
          if (Phaser.Math.Distance.Squared(orbital.x, orbital.y, enemy.x, enemy.y) > 650) return;
          const nextHit = enemy.getData("orbitHitAt") || 0;
          if (time < nextHit) return;
          enemy.setData("orbitHitAt", time + 420);
          const distanceFromPlayer = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
          const baseDamage = 10 + this.stats.orbitLevel * 6;
          this.damageEnemy(enemy, gravityHalo && distanceFromPlayer >= 80 ? Math.round(baseDamage * 1.35) : baseDamage, null);
          if (this.activeSynergies.has("solarCrown") && time >= this.nextCrownTickAt) {
            this.dawnCooldown = Math.max(0, this.dawnCooldown - 140);
            this.nextCrownTickAt = time + 120;
            this.announceSynergyTrigger("solarCrown", this.player.x, this.player.y, "天光加速");
          }
        });
      });
    }

    getCleanupWindow() {
      return RUN_PROFILE.cleanupWindows.find((window) => (
        this.elapsed >= window.start && this.elapsed < window.end
      )) || null;
    }

    updateWaveState() {
      this.updateStandardMirrorHarborPressureMelee(this.gameplayTime);
      this.updateStandardMirrorHarborPressureBruisers(this.gameplayTime);
      const threatTimes = RUN_PROFILE.scriptedThreats;
      if (this.elapsed >= ROUTE_STAGE_THREE_TIME && this.wavePhase < 3) {
        if (this.showRouteChoice(3)) return;
      } else if (this.elapsed >= ROUTE_STAGE_TWO_TIME && this.wavePhase < 2) {
        if (this.showRouteChoice(2)) return;
      }
      if (this.elapsed >= FINAL_SHOP_TIME && !this.shopVisitsSeen.has(3)) {
        if (this.showShop(3)) return;
      }
      this.updateStandardLanternCourtSiege(this.gameplayTime);
      const cleanupWindow = this.getCleanupWindow();
      if (cleanupWindow) {
        const remaining = Math.max(1, Math.ceil(cleanupWindow.end - this.elapsed));
        ui.waveLabel.textContent = `第${["一", "二", "三"][cleanupWindow.act - 1]}幕 · 清场 ${remaining}`;
        ui.objectiveText.textContent = `清理场上残敌 · ${remaining} 秒后进入幕间整备`;
        return;
      }
      if (!this.bossPreludeStarted && this.elapsed >= threatTimes.opening && !this.scriptedThreatsSpawned.has("opening-threat")) {
        this.scriptedThreatsSpawned.add("opening-threat");
        this.spawnEnemy(this.battlefieldProfile.signatureEnemy || "charger");
      }
      if (!this.bossPreludeStarted && this.elapsed >= threatTimes.blink && !this.scriptedThreatsSpawned.has("blink-intro")) {
        this.scriptedThreatsSpawned.add("blink-intro");
        this.spawnEnemy("blinkHunter");
      }
      if (!this.bossPreludeStarted && this.elapsed >= threatTimes.route && !this.scriptedThreatsSpawned.has("route-threat")) {
        this.scriptedThreatsSpawned.add("route-threat");
        const routeThreat = this.getRoute(this.activeRouteId)?.scriptedThreat || "herald";
        this.spawnEnemy(routeThreat);
      }
      if (!this.bossPreludeStarted && this.elapsed >= threatTimes.frost && !this.scriptedThreatsSpawned.has("frost-intro")) {
        this.scriptedThreatsSpawned.add("frost-intro");
        this.spawnEnemy("frostOracle");
      }
      if (!this.bossPreludeStarted && this.elapsed >= threatTimes.bomber && !this.scriptedThreatsSpawned.has("bomber-intro")) {
        this.scriptedThreatsSpawned.add("bomber-intro");
        this.spawnEnemy("emberBomber");
      }
      if (!this.bossPreludeStarted && this.elapsed >= threatTimes.echo && !this.scriptedThreatsSpawned.has("echo-duelist-intro")) {
        this.scriptedThreatsSpawned.add("echo-duelist-intro");
        this.spawnEnemy("echoDuelist");
      }
      if (!this.bossPreludeStarted && this.elapsed >= threatTimes.void && !this.scriptedThreatsSpawned.has("void-scribe-intro")) {
        this.scriptedThreatsSpawned.add("void-scribe-intro");
        this.spawnEnemy("voidScribe");
      }
      if (!this.bossPreludeStarted && this.elapsed >= threatTimes.prism && !this.scriptedThreatsSpawned.has("prism-intro")) {
        this.scriptedThreatsSpawned.add("prism-intro");
        this.spawnEnemy("prismSentry");
      }
      if (!this.bossPreludeStarted && this.elapsed >= threatTimes.signature && !this.scriptedThreatsSpawned.has("signature-enemy")) {
        const signatureEnemy = this.getRoute(this.activeRouteId)?.signatureEnemy;
        if (signatureEnemy) {
          this.scriptedThreatsSpawned.add("signature-enemy");
          this.spawnEnemy(signatureEnemy);
        }
      }
      if (!this.bossPreludeStarted && this.elapsed >= BOSS_TIME - BOSS_PRELUDE_DURATION) {
        if (!this.startBossPrelude()) return;
      }
      if (!this.bossSpawned && this.elapsed >= BOSS_TIME) {
        this.spawnBoss();
      }

      const preludeSeconds = Math.max(1, Math.ceil(BOSS_TIME - this.elapsed));
      if (this.bossPreludeStarted && !this.bossSpawned && preludeSeconds !== this.bossPreludeSecond) {
        this.bossPreludeSecond = preludeSeconds;
        ui.objectiveText.textContent = `终夜将至 · ${this.battlefieldProfile.bossName} ${preludeSeconds} 秒后现身`;
      }

      const interval = this.getSpawnInterval();
      if (!this.bossSpawned && !this.bossPreludeStarted && this.spawnAccumulator >= interval && this.getSpawnActiveCount() < this.getEnemyCap()) {
        this.spawnAccumulator = 0;
        this.spawnEnemy(this.pickEnemyKind());
        const meleePackChance = this.elapsed >= ROUTE_STAGE_TWO_TIME ? 0.44 : this.elapsed >= 10 ? 0.34 : 0.2;
        if (Math.random() < meleePackChance && this.getSpawnActiveCount() < this.getEnemyCap()) {
          this.spawnEnemy(this.pickMeleeEnemyKind());
        }
        if (this.elapsed > RUN_PROFILE.doubleSpawnAt && Math.random() > 0.58 && this.getSpawnActiveCount() < this.getEnemyCap()) {
          this.spawnEnemy(this.pickEnemyKind());
        }
      }

      if (this.elapsed < ROUTE_STAGE_TWO_TIME) {
        ui.waveLabel.textContent = `第一幕 · ${this.battlefieldProfile.name}`;
      } else if (this.elapsed < ROUTE_STAGE_THREE_TIME) {
        ui.waveLabel.textContent = `第二幕 · ${this.getRoute(this.activeRouteId)?.name || "路线抉择"}`;
      } else if (this.bossPreludeStarted && this.elapsed < BOSS_TIME) {
        ui.waveLabel.textContent = `终夜将至 · ${preludeSeconds}`;
      } else if (this.elapsed < BOSS_TIME) {
        ui.waveLabel.textContent = `第三幕 · ${this.getRoute(this.activeRouteId)?.name || "路线抉择"}`;
      } else if (this.bossAlive) {
        ui.waveLabel.textContent = `终夜 · ${this.battlefieldProfile.bossName}`;
      } else if (this.elapsed < RUN_DURATION) {
        ui.waveLabel.textContent = "终夜 · 等待黎明";
      } else {
        ui.waveLabel.textContent = `${RUN_END_LABEL} · 黎明抵达`;
      }
    }

    getPatrolPoint(type) {
      if (this.battlefieldProfile.id === "mirror-harbor") {
        const playableTop = this.getPlayableTop();
        const playableBottom = this.getPlayableBottom();
        return {
          x: this.scale.width * (type === "beacon" ? 0.34 : 0.5),
          y: playableTop + (playableBottom - playableTop) * (type === "beacon" ? 0.28 : 0.72),
        };
      }
      const inset = Phaser.Math.Clamp(this.scale.width * 0.1, 72, 128);
      return {
        x: type === "beacon" ? this.scale.width - inset : inset,
        y: Phaser.Math.Clamp(
          this.scale.height * (type === "beacon" ? 0.61 : 0.4),
          230,
          this.getPlayableBottom() - 36,
        ),
      };
    }

    positionPatrolEvent() {
      const event = this.activePatrolEvent;
      if (!event) return;
      const point = this.getPatrolPoint(event.type);
      event.x = point.x;
      event.y = point.y;
      if (event.container?.active) event.container.setPosition(point.x, point.y);
      if (event.target?.active) {
        event.target.setPosition(point.x, point.y);
        this.updateEnemyDecorations(event.target);
      }
    }

    showPatrolStatus(event, progress, detail) {
      const isRift = event.type === "rift";
      const mirrorHarbor = this.battlefieldProfile.id === "mirror-harbor";
      ui.patrolStatus.hidden = false;
      ui.patrolStatus.dataset.type = event.type;
      ui.patrolKind.textContent = mirrorHarbor
        ? (isRift ? "下港 · 讨伐" : "上港 · 回收")
        : (isRift ? "城西 · 讨伐" : "城东 · 回收");
      ui.patrolTitle.textContent = isRift ? "暗潮裂隙" : "失落火种";
      ui.patrolMark.textContent = isRift ? "隙" : "巡";
      ui.patrolTimer.textContent = `${Math.max(0, event.remaining).toFixed(1)}s`;
      ui.patrolDetail.textContent = detail;
      const percent = Math.round(Phaser.Math.Clamp(progress, 0, 1) * 100);
      ui.patrolFill.style.width = `${percent}%`;
      ui.patrolTrack.setAttribute("aria-valuenow", String(percent));
    }

    startPatrolEvent(type) {
      if (type === "beacon") this.startBeaconEvent();
      else this.startRiftEvent();
    }

    startBeaconEvent() {
      const point = this.getPatrolPoint("beacon");
      const outer = this.add.circle(0, 0, 48, COLORS.gold, 0.055)
        .setStrokeStyle(2, COLORS.gold, 0.72);
      const inner = this.add.circle(0, 0, 22, COLORS.gold, 0.09)
        .setStrokeStyle(1, 0xfff0a3, 0.7);
      const rayX = this.add.rectangle(0, 0, 42, 2, COLORS.gold, 0.44);
      const rayY = this.add.rectangle(0, 0, 2, 42, COLORS.gold, 0.44);
      const core = this.add.circle(0, 0, 7, 0xfff0a3, 0.96)
        .setBlendMode(Phaser.BlendModes.ADD);
      const progressRing = this.add.graphics();
      const label = this.add.text(0, -71, "失落火种", {
        fontFamily: "STKaiti, KaiTi, Georgia, serif",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#fff0a3",
        stroke: "#071012",
        strokeThickness: 4,
      }).setOrigin(0.5);
      const hint = this.add.text(0, -53, "进入光圈 · 停留 1.5 秒", {
        fontFamily: "Georgia, serif",
        fontSize: "9px",
        color: "#d8d4c7",
        stroke: "#071012",
        strokeThickness: 3,
      }).setOrigin(0.5);
      const container = this.add.container(point.x, point.y, [outer, inner, rayX, rayY, core, progressRing, label, hint])
        .setDepth(11);
      this.tweens.add({
        targets: outer,
        scale: { from: 0.92, to: 1.12 },
        alpha: { from: 0.46, to: 0.95 },
        duration: 760,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      this.activePatrolEvent = {
        type: "beacon",
        x: point.x,
        y: point.y,
        remaining: 9,
        capture: 0,
        captureGoal: 1.5,
        playerInside: false,
        container,
        outer,
        core,
        progressRing,
      };
      const location = this.battlefieldProfile.id === "mirror-harbor" ? "上港" : "城东";
      ui.objectiveText.textContent = `巡夜事件 · 前往${location}回收失落火种`;
      this.showPatrolStatus(this.activePatrolEvent, 0, "进入金色光圈，停留 1.5 秒");
      this.showPhaseBanner("巡夜事件", "失落火种", `前往${location} · 进入光圈回收`);
      soundscape.play("wave", true);
    }

    startRiftEvent() {
      const point = this.getPatrolPoint("rift");
      const target = this.spawnEnemy("rift", point.x, point.y);
      if (!target) return;
      target.setDepth(8);
      target.setData("nextSummonAt", this.gameplayTime + 1200);
      const aura = this.add.circle(point.x, point.y, 47, COLORS.violet, 0.04)
        .setStrokeStyle(2, COLORS.violet, 0.68)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(5);
      const label = this.add.text(point.x, point.y - 68, "暗潮裂隙", {
        fontFamily: "STKaiti, KaiTi, Georgia, serif",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#d8c4ff",
        stroke: "#071012",
        strokeThickness: 4,
      }).setOrigin(0.5).setDepth(10);
      target.setData({ riftAura: aura, riftLabel: label });
      this.tweens.add({
        targets: aura,
        scale: { from: 0.9, to: 1.18 },
        alpha: { from: 0.34, to: 0.88 },
        duration: 680,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      this.activePatrolEvent = {
        type: "rift",
        x: point.x,
        y: point.y,
        remaining: 9,
        target,
      };
      const location = this.battlefieldProfile.id === "mirror-harbor" ? "下港" : "城西";
      ui.objectiveText.textContent = `巡夜事件 · 前往${location}摧毁暗潮裂隙`;
      this.showPatrolStatus(this.activePatrolEvent, 0, `裂隙 ${target.getData("hp")} / ${target.getData("maxHp")}`);
      this.showPhaseBanner("巡夜事件", "暗潮裂隙", `前往${location} · 在增援涌出前摧毁它`);
      soundscape.play("warning", true);
    }

    updatePatrolEvents(time, deltaSeconds) {
      const scheduled = PATROL_EVENT_SCHEDULE[this.patrolEventIndex];
      if (!this.activePatrolEvent && scheduled && this.elapsed >= scheduled.time && !this.bossPreludeStarted) {
        this.patrolEventIndex += 1;
        this.startPatrolEvent(scheduled.type);
      }
      const event = this.activePatrolEvent;
      if (!event) return;
      event.remaining -= deltaSeconds;
      if (event.type === "beacon") {
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, event.x, event.y);
        const inside = distance <= 64;
        event.capture = Phaser.Math.Clamp(
          event.capture + deltaSeconds * (inside ? 1 : -0.55),
          0,
          event.captureGoal,
        );
        if (inside && !event.playerInside) {
          ui.objectiveText.textContent = "回收中 · 留在光圈内";
          this.showCombatLabel(event.x, event.y - 47, "开始回收", COLORS.gold);
        }
        event.playerInside = inside;
        const progress = event.capture / event.captureGoal;
        event.progressRing.clear();
        if (progress > 0) {
          event.progressRing.lineStyle(4, COLORS.gold, 0.94);
          event.progressRing.beginPath();
          event.progressRing.arc(0, 0, 54, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress, false);
          event.progressRing.strokePath();
        }
        event.core.setScale(1 + progress * 0.55);
        const location = this.battlefieldProfile.id === "mirror-harbor" ? "上港" : "城东";
        this.showPatrolStatus(event, progress, inside ? "回收中 · 保持在光圈内" : `前往${location}的金色光圈`);
        if (event.capture >= event.captureGoal) {
          this.completePatrolEvent("beacon", event.x, event.y);
          return;
        }
      } else {
        if (!event.target?.active) return;
        const health = Math.max(0, event.target.getData("hp"));
        const maxHealth = event.target.getData("maxHp");
        const progress = 1 - health / maxHealth;
        this.showPatrolStatus(event, progress, `裂隙 ${Math.ceil(health)} / ${maxHealth}`);
      }
      if (event.remaining <= 0) this.failPatrolEvent();
    }

    completePatrolEvent(type, x, y) {
      if (this.activePatrolEvent?.type !== type) return;
      this.clearPatrolEvent();
      this.patrolCompleted += 1;
      this.spawnRipple(x, y, type === "beacon" ? COLORS.gold : COLORS.violet);
      this.burstAt(x, y, type === "beacon" ? COLORS.gold : COLORS.violet, 18);
      this.cameras.main.flash(220, type === "beacon" ? 242 : 169, type === "beacon" ? 200 : 132, type === "beacon" ? 75 : 214, false);
      this.gainShopCurrency(25, "巡夜完成", true);
      this.grantPatrolRelic(type === "beacon" ? "wayfinderEmber" : "riftGlass");
    }

    failPatrolEvent() {
      const event = this.activePatrolEvent;
      if (!event) return;
      const { type, x, y } = event;
      this.clearPatrolEvent();
      this.spawnRipple(x, y, COLORS.red);
      this.burstAt(x, y, COLORS.red, 10);
      ui.objectiveText.textContent = "巡夜机会消散 · 本局继续";
      this.showPhaseBanner("可选事件结束", type === "beacon" ? "火种熄散" : "裂隙闭合", "未获得遗物 · 不影响远征继续");
      soundscape.play("warning", true);
      this.cameras.main.shake(150, 0.005);
      this.updateHud(true);
    }

    grantPatrolRelic(id) {
      if (this.patrolRelics.has(id)) return;
      const relic = patrolRelicCatalog.find((item) => item.id === id);
      if (!relic) return;
      this.patrolRelics.add(id);
      relic.apply(this);
      ui.objectiveText.textContent = `巡夜完成 · 获得 ${relic.name}`;
      this.showPhaseBanner("巡夜馈赠", relic.name, relic.description);
      if (id === "wayfinderEmber") {
        this.showCombatLabel(this.player.x, this.player.y - 35, "火种 +28 · 生命 +8", COLORS.gold);
      } else {
        this.showCombatLabel(this.player.x, this.player.y - 35, "伤害 +6 · 攻速 +8%", COLORS.violet);
      }
      soundscape.play("synergy", true);
      this.renderBuild();
      this.updateHud(true);
    }

    clearPatrolEvent() {
      const event = this.activePatrolEvent;
      if (event?.container?.active) event.container.destroy(true);
      if (event?.target?.active) {
        this.destroyEnemyDecorations(event.target);
        event.target.destroy();
      }
      this.activePatrolEvent = null;
      ui.patrolStatus.hidden = true;
      ui.patrolFill.style.width = "0%";
      ui.patrolTrack.setAttribute("aria-valuenow", "0");
    }

    startBossPrelude() {
      if (this.bossPreludeStarted || this.bossSpawned || this.ended) return false;
      let bankedXp = 0;
      this.sparks.getChildren().slice().forEach((spark) => {
        if (!spark.active) return;
        bankedXp += spark.getData("value") || 1;
        spark.destroy();
      });
      if (bankedXp > 0) this.xp += bankedXp;
      if (this.tryShowLevelUp()) return false;
      this.bossPreludeStarted = true;
      this.spawnAccumulator = 0;
      this.clearThreatAlert();
      this.clearPatrolEvent();
      this.clearSecondaryEffects();
      this.clearBossHazards();
      this.clearBossAttendants(false);
      this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 18);
      this.gainEmberCharge(18, "终夜回响");
      this.spawnRipple(this.player.x, this.player.y, COLORS.cyan);
      this.spawnRipple(this.lamp.x, this.lamp.y, COLORS.gold);
      this.burstAt(this.player.x, this.player.y, COLORS.cyan, 9);
      this.burstAt(this.lamp.x, this.lamp.y, COLORS.gold, 12);
      this.showCombatLabel(this.player.x, this.player.y - 34, "生命 +18 · 火种 +18", COLORS.cyan);
      soundscape.play("wave", true);
      this.showPhaseBanner("终夜将至", "强敌压境", "残余敌潮不会退场 · 生命与充能 +18");
      this.updateHud(true);
      return true;
    }

    showPhaseBanner(kicker, title, detail, positionY = null) {
      if (this.phaseBanner?.active) this.phaseBanner.destroy(true);
      const kickerText = this.add.text(0, -24, kicker, {
        fontFamily: "Georgia, serif",
        fontSize: "11px",
        fontStyle: "bold",
        color: "#f2c84b",
      }).setOrigin(0.5).setLetterSpacing(3);
      const titleText = this.add.text(0, 0, title, {
        fontFamily: "STKaiti, KaiTi, Georgia, serif",
        fontSize: "26px",
        fontStyle: "bold",
        color: "#f3f0e6",
        stroke: "#071012",
        strokeThickness: 5,
      }).setOrigin(0.5);
      const detailText = this.add.text(0, 31, detail, {
        fontFamily: "Georgia, serif",
        fontSize: "12px",
        color: "#c9d8d4",
        stroke: "#071012",
        strokeThickness: 3,
      }).setOrigin(0.5);
      const banner = this.add.container(
        this.scale.width / 2,
        Number.isFinite(positionY) ? positionY : Phaser.Math.Clamp(this.scale.height * 0.3, 235, 255),
        [kickerText, titleText, detailText],
      ).setAlpha(0).setDepth(40);
      this.phaseBanner = banner;
      this.tweens.add({
        targets: banner,
        alpha: 1,
        y: banner.y + 8,
        duration: 220,
        ease: "Quad.easeOut",
      });
      this.time.delayedCall(1050, () => {
        if (!banner.active) return;
        this.tweens.add({
          targets: banner,
          alpha: 0,
          y: banner.y - 8,
          duration: 300,
          ease: "Quad.easeIn",
          onComplete: () => {
            if (this.phaseBanner === banner) this.phaseBanner = null;
            banner.destroy(true);
          },
        });
      });
    }

    getSpawnInterval() {
      const phase = RUN_PROFILE.spawnPhases.find((entry) => this.elapsed < entry.until)
        || RUN_PROFILE.spawnPhases[RUN_PROFILE.spawnPhases.length - 1];
      let interval = phase.interval;
      if (this.activePatrolEvent) interval *= 1.25;
      const actDensity = this.elapsed >= ROUTE_STAGE_THREE_TIME ? 0.86 : this.elapsed >= ROUTE_STAGE_TWO_TIME ? 0.91 : 0.96;
      const route = this.getRoute(this.activeRouteId);
      return Math.round(interval * actDensity * (route?.spawnRate || 1) * (this.battlefieldProfile.spawnRate || 1));
    }

    getEnemyCap() {
      const phase = RUN_PROFILE.spawnPhases.find((entry) => this.elapsed < entry.until)
        || RUN_PROFILE.spawnPhases[RUN_PROFILE.spawnPhases.length - 1];
      const actBonus = this.elapsed >= ROUTE_STAGE_THREE_TIME ? 5 : this.elapsed >= ROUTE_STAGE_TWO_TIME ? 3 : 1;
      return phase.cap + actBonus;
    }

    getEnemyTiming(kind) {
      const stats = enemyCatalog[kind] || {};
      const override = RUN_PROFILE.enemyTimings[kind] || {};
      return {
        unlockAt: override.unlockAt ?? stats.unlockAt ?? 0,
        randomAt: override.randomAt ?? stats.randomAt ?? override.unlockAt ?? stats.unlockAt ?? 0,
      };
    }

    pickWeightedEnemy(weights) {
      const available = weights.filter(([kind]) => this.getEnemyTiming(kind).randomAt <= this.elapsed);
      const pool = available.length ? available : [["shade", 1]];
      const totalWeight = pool.reduce((sum, entry) => sum + entry[1], 0);
      let roll = Math.random() * totalWeight;
      for (const [kind, weight] of pool) {
        roll -= weight;
        if (roll <= 0) return kind;
      }
      return pool[pool.length - 1]?.[0] || "shade";
    }

    pickEnemyKind() {
      const roll = Math.random();
      if (this.battlefieldProfile.id === "mirror-harbor" && this.elapsed >= RUN_PROFILE.tideweaverAt && Math.random() < 0.18) {
        return "tideweaver";
      }
      if (this.elapsed < 6) return "shade";
      if (this.elapsed < 12) return roll < 0.52 ? "shade" : roll < 0.76 ? "wraith" : "gloamling";
      if (this.elapsed < 18) return roll < 0.3 ? "shade" : roll < 0.5 ? "wraith" : roll < 0.76 ? "gloamling" : "splitter";
      if (this.elapsed < ROUTE_STAGE_TWO_TIME) return roll < 0.24 ? "shade" : roll < 0.4 ? "wraith" : roll < 0.6 ? "gloamling" : roll < 0.8 ? "splitter" : "charger";
      const route = this.getRoute(this.activeRouteId);
      if (route?.enemyWeights) {
        const enemyWeights = this.isStandardLanternCourtSiegeSlice() && this.elapsed >= ROUTE_STAGE_THREE_TIME
          ? route.enemyWeights.map(([kind, weight]) => [
              kind,
              weight * (STANDARD_CITY_LATE_RANGED_KINDS.includes(kind)
                ? STANDARD_CITY_LATE_RANGED_WEIGHT_SCALE
                : 1),
            ])
          : route.enemyWeights;
        return this.pickWeightedEnemy(enemyWeights);
      }
      if (this.elapsed < ROUTE_STAGE_THREE_TIME) {
        if (roll < 0.27) return "shade";
        if (roll < 0.44) return "wraith";
        if (roll < 0.59) return "splitter";
        if (roll < 0.73) return "hexer";
        if (roll < 0.86) return "charger";
        if (roll < 0.94 || this.elapsed < 24) return "brute";
        return "herald";
      }
      if (roll < 0.14) return "shade";
      if (roll < 0.26) return "wraith";
      if (roll < 0.39) return "splitter";
      if (roll < 0.53) return "hexer";
      if (roll < 0.67) return "charger";
      if (roll < 0.79) return "brute";
      if (roll < 0.91) return "bulwark";
      return "herald";
    }

    pickMeleeEnemyKind() {
      const roll = Math.random();
      if (this.elapsed < ROUTE_STAGE_TWO_TIME) {
        return roll < 0.58 ? "gloamling" : roll < 0.8 ? "shade" : "wraith";
      }
      if (this.elapsed < ROUTE_STAGE_THREE_TIME) {
        return roll < 0.52 ? "gloamling" : roll < 0.7 ? "wraith" : roll < 0.88 ? "splitter" : "brute";
      }
      return roll < 0.5 ? "gloamling" : roll < 0.66 ? "wraith" : roll < 0.84 ? "splitter" : "brute";
    }

    spawnEnemy(kind, spawnX = null, spawnY = null, options = {}) {
      if (!this.started || this.ended) return;
      const stats = enemyCatalog[kind];
      if (!stats || this.getEnemyTiming(kind).unlockAt > this.elapsed) return;
      const pressureSlice = this.isStandardMirrorHarborPressureSlice();
      const citySiege = options.citySiege === true && this.isStandardLanternCourtSiegeSlice();
      const pressureBruiser = options.pressureBruiser === true
        && options.pressureMelee === true
        && pressureSlice
        && this.elapsed >= STANDARD_MIRROR_BRUISER_START
        && ["shade", "splitter", "brute"].includes(kind);
      const pressureMelee = options.pressureMelee === true
        && pressureSlice
        && (["gloamling", "shade", "wraith"].includes(kind) || pressureBruiser);
      const maxActive = stats.maxActive || (kind === "tideweaver" ? 1 : null);
      if (maxActive && !options.prototypeHorde && !pressureMelee && !citySiege) {
        let activeCount = 0;
        this.enemies.children.iterate((enemy) => {
          if (enemy?.active && enemy.getData("kind") === kind) activeCount += 1;
        });
        if (activeCount >= maxActive) return;
      }
      const margin = 35;
      let x = spawnX;
      let y = spawnY;
      let spawnEdge = null;
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        if (this.battlefieldProfile.id === "mirror-harbor") {
          const playableTop = this.getPlayableTop();
          const playableBottom = this.getPlayableBottom();
          const laneY = Math.random() > 0.5
            ? playableTop + (playableBottom - playableTop) * 0.28
            : playableTop + (playableBottom - playableTop) * 0.72;
          const side = Phaser.Math.Between(0, 3);
          if (side === 0) {
            spawnEdge = "top";
            x = Phaser.Math.Between(28, this.scale.width - 28);
            y = playableTop - margin;
          } else if (side === 1) {
            spawnEdge = "right";
            x = this.scale.width + margin;
            y = laneY + Phaser.Math.Between(-24, 24);
          } else if (side === 2) {
            spawnEdge = "bottom";
            x = Phaser.Math.Between(28, this.scale.width - 28);
            y = playableBottom + margin;
          } else {
            spawnEdge = "left";
            x = -margin;
            y = laneY + Phaser.Math.Between(-24, 24);
          }
        } else {
          const side = Phaser.Math.Between(0, 3);
          if (side === 0) {
            spawnEdge = "top";
            x = Phaser.Math.Between(0, this.scale.width);
            y = -margin;
          } else if (side === 1) {
            spawnEdge = "right";
            x = this.scale.width + margin;
            y = Phaser.Math.Between(this.getPlayableTop(), this.getPlayableBottom());
          } else if (side === 2) {
            spawnEdge = "bottom";
            x = Phaser.Math.Between(0, this.scale.width);
            y = this.getPlayableBottom() + margin;
          } else {
            spawnEdge = "left";
            x = -margin;
            y = Phaser.Math.Between(this.getPlayableTop(), this.getPlayableBottom());
          }
        }
      }
      if (!spawnEdge && options.spawnEdge) spawnEdge = options.spawnEdge;
      if (spawnEdge) this.spawnEdgeCounts[spawnEdge] += 1;

      const actHealthScale = this.elapsed >= ROUTE_STAGE_THREE_TIME ? 1.18 : this.elapsed >= ROUTE_STAGE_TWO_TIME ? 1.1 : 1;
      const timeHealthScale = stats.bossMinion
        ? (RUN_PROFILE.id === "standard" ? 1.25 : 1)
        : 1 + Math.max(0, this.elapsed - 20) * 0.003;
      const healthScale = timeHealthScale * actHealthScale;
      const damageScale = this.elapsed >= ROUTE_STAGE_THREE_TIME
        ? 1.08
        : this.elapsed >= ROUTE_STAGE_TWO_TIME ? 1.04 : 1;
      const textureMap = {
        tideweaver: "tideweaverArt",
        mirrorAcolyte: "mirrorBossArt",
        blinkHunter: "blinkHunterArt",
        frostOracle: "frostOracleArt",
        emberBomber: "emberBomberArt",
        echoDuelist: "echoDuelistArt",
        voidScribe: "voidScribeArt",
        prismSentry: "prismSentryArt",
        devourerRanged: "devourerRanged",
        devourerChaser: "devourerChaser",
      };
      const preferredTexture = textureMap[kind];
      const harborShade = this.battlefieldProfile.id === "mirror-harbor" && kind === "shade" && this.textures.exists("shadeHarbor");
      const texture = harborShade
        ? "shadeHarbor"
        : preferredTexture && this.textures.exists(preferredTexture) ? preferredTexture : kind;
      const enemy = this.enemies.create(x, y, texture).setDepth(6);
      const enemyId = this.nextEnemyId;
      this.nextEnemyId += 1;
      const prototypeHorde = options.prototypeHorde === true && this.isPrecisionTrackerPrototype();
      const pressureFodder = pressureMelee
        && kind === "gloamling"
        && this.elapsed >= ROUTE_STAGE_TWO_TIME;
      const scaledHp = Math.round(stats.hp * healthScale);
      const baseHp = prototypeHorde
        ? 12
        : pressureFodder
          ? Math.min(STANDARD_MIRROR_FODDER_HEALTH_CAP, scaledHp)
          : pressureBruiser ? Math.round(scaledHp * STANDARD_MIRROR_BRUISER_HEALTH_SCALE) : scaledHp;
      const scaledDamage = stats.damage * damageScale;
      const baseDamage = prototypeHorde
        ? 1
        : pressureFodder
          ? Math.min(STANDARD_MIRROR_FODDER_DAMAGE_CAP, scaledDamage)
          : pressureBruiser ? Math.max(1, Math.round(scaledDamage * STANDARD_MIRROR_BRUISER_DAMAGE_SCALE)) : scaledDamage;
      if (kind === "tideweaver" && texture === "tideweaverArt") enemy.setDisplaySize(54, 60);
      if (kind === "mirrorAcolyte" && texture === "mirrorBossArt") enemy.setDisplaySize(58, 58);
      if (["blinkHunter", "frostOracle", "emberBomber", "echoDuelist", "voidScribe", "prismSentry"].includes(kind) && texture === preferredTexture) {
        const sizes = { blinkHunter: [62, 68], frostOracle: [64, 72], emberBomber: [68, 72], echoDuelist: [66, 70], voidScribe: [66, 72], prismSentry: [66, 70] };
        enemy.setDisplaySize(...sizes[kind]);
      }
      const visualScale = stats.elite ? 1.08 : 1.12;
      enemy.setDisplaySize(enemy.displayWidth * visualScale, enemy.displayHeight * visualScale);
      enemy.body.setCircle(Math.min(enemy.width, enemy.height) * 0.36 * (1.05 / visualScale));
      enemy.setData({
        id: enemyId,
        kind,
        spawnEdge,
        prototypeHorde,
        pressureMelee,
        pressureFodder,
        pressureBruiser,
        citySiege,
        hp: baseHp,
        maxHp: baseHp,
        armor: stats.armor || 0,
        maxArmor: stats.armor || 0,
        speed: prototypeHorde
          ? Math.max(stats.speed, 126)
          : pressureFodder
            ? stats.speed * STANDARD_MIRROR_FODDER_SPEED_SCALE
            : pressureMelee ? stats.speed * STANDARD_MIRROR_PRESSURE_SPEED_SCALE : stats.speed,
        damage: baseDamage,
        xp: prototypeHorde || pressureMelee || citySiege ? 0 : stats.xp,
        nextPlayerHitAt: 0,
        orbitHitAt: 0,
        slowedUntil: 0,
        slowFactor: 1,
        hasteUntil: 0,
        driftPhase: Math.random() * Math.PI * 2,
        attackState: "moving",
        nextAttackAt: this.gameplayTime + Phaser.Math.Between(1200, 2200),
        nextSupportAt: this.gameplayTime + Phaser.Math.Between(1200, 1900),
        strafeDirection: Math.random() > 0.5 ? 1 : -1,
      });
      if (prototypeHorde) {
        enemy.setTint(0xffd766);
        const horde = this.precisionPrototypeTelemetry.horde;
        const spawnedAt = Math.round(this.gameplayTime);
        horde.spawned += 1;
        if (horde.firstSpawnAt === null) horde.firstSpawnAt = spawnedAt;
        horde.lastSpawnAt = spawnedAt;
        this.updatePrototypeHordeActivePeak();
      }
      this.createEnemyDecorations(enemy, stats);
      this.spawnRipple(x, y, stats.color);
      if (stats.introduce && !this.seenEnemyKinds.has(kind)) {
        this.seenEnemyKinds.add(kind);
        ui.objectiveText.textContent = `${stats.name}出现 · ${stats.role}`;
        this.time.delayedCall(520, () => {
          if (enemy.active) this.showCombatLabel(enemy.x, enemy.y - enemy.height * 0.7, `${stats.name} · ${stats.role}`, stats.color);
        });
      }
      return enemy;
    }

    createEnemyDecorations(enemy, stats) {
      if (stats.elite) {
        const y = enemy.y - enemy.displayHeight * 0.62;
        const hpBarBack = this.add.rectangle(enemy.x, y, 34, 4, COLORS.night, 0.86)
          .setStrokeStyle(1, stats.color, 0.45)
          .setDepth(8);
        const hpBarFill = this.add.rectangle(enemy.x - 16, y, 32, 2, stats.color, 0.92)
          .setOrigin(0, 0.5)
          .setDepth(9);
        enemy.setData({ hpBarBack, hpBarFill });
      }
      if (stats.armor) {
        const armorRing = this.add.circle(enemy.x, enemy.y, enemy.displayWidth * 0.49, COLORS.armor, 0.035)
          .setStrokeStyle(2, COLORS.armor, 0.82)
          .setDepth(5);
        enemy.setData("armorRing", armorRing);
      }
      if (stats.support) {
        const supportAura = this.add.circle(enemy.x, enemy.y, enemy.width * 0.58, COLORS.green, 0.025)
          .setStrokeStyle(2, COLORS.green, 0.62)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(5);
        enemy.setData("supportAura", supportAura);
        this.tweens.add({ targets: supportAura, scale: 1.22, alpha: 0.22, duration: 760, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      }
      if (stats.mirrorSummon) {
        const outer = this.add.image(enemy.x, enemy.y, "fxRing")
          .setTint(COLORS.cyan)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(5)
          .setAlpha(0.7)
          .setScale(0.54);
        const inner = this.add.image(enemy.x, enemy.y, "fxRing")
          .setTint(0xff6d79)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(5)
          .setAlpha(0.66)
          .setScale(0.36);
        this.tweens.add({ targets: outer, angle: 360, scale: 0.66, duration: 1800, repeat: -1, ease: "Linear" });
        this.tweens.add({ targets: inner, angle: -360, scale: 0.46, duration: 1350, repeat: -1, ease: "Linear" });
        enemy.setData({ mirrorSummonOuter: outer, mirrorSummonInner: inner });
      }
    }

    updateEnemyDecorations(enemy) {
      const y = enemy.y - enemy.displayHeight * 0.62;
      const hpBarBack = enemy.getData("hpBarBack");
      const hpBarFill = enemy.getData("hpBarFill");
      if (hpBarBack?.active) hpBarBack.setPosition(enemy.x, y);
      if (hpBarFill?.active) {
        hpBarFill.setPosition(enemy.x - 16, y);
        hpBarFill.setScale(Math.max(0.001, enemy.getData("hp") / enemy.getData("maxHp")), 1);
      }
      const armorRing = enemy.getData("armorRing");
      if (armorRing?.active) {
        armorRing.setPosition(enemy.x, enemy.y);
        armorRing.setAlpha(0.28 + 0.64 * (enemy.getData("armor") / enemy.getData("maxArmor")));
      }
      const riftAura = enemy.getData("riftAura");
      if (riftAura?.active) riftAura.setPosition(enemy.x, enemy.y);
      const riftLabel = enemy.getData("riftLabel");
      if (riftLabel?.active) riftLabel.setPosition(enemy.x, enemy.y - 68);
      const supportAura = enemy.getData("supportAura");
      if (supportAura?.active) supportAura.setPosition(enemy.x, enemy.y);
      const mirrorSummonOuter = enemy.getData("mirrorSummonOuter");
      if (mirrorSummonOuter?.active) mirrorSummonOuter.setPosition(enemy.x, enemy.y);
      const mirrorSummonInner = enemy.getData("mirrorSummonInner");
      if (mirrorSummonInner?.active) mirrorSummonInner.setPosition(enemy.x, enemy.y);
      const bossAura = enemy.getData("bossAura");
      if (bossAura?.active) bossAura.setPosition(enemy.x, enemy.y);
      const bossPulseRing = enemy.getData("bossPulseRing");
      if (bossPulseRing?.active) bossPulseRing.setPosition(enemy.x, enemy.y);
    }

    destroyEnemyDecorations(enemy) {
      ["hpBarBack", "hpBarFill", "armorRing", "sourceRing", "targetRing", "riftAura", "riftLabel", "supportAura", "mirrorSummonOuter", "mirrorSummonInner", "chargeLine", "chargeTargetRing", "fanTelegraph", "bombMarker", "slamRing", "bossAura", "bossPulseRing", "mirrorTelegraph", "summonTelegraph"].forEach((key) => {
        const decoration = enemy.getData(key);
        if (decoration?.active) {
          this.tweens.killTweensOf(decoration);
          decoration.destroy();
        }
        enemy.setData(key, null);
      });
    }

    getBossEntryY() {
      const ratio = this.usesCompactControls() ? 0.31 : 0.28;
      const entryY = Phaser.Math.Clamp(this.scale.height * ratio, 245, 280);
      return this.usesCompactControls() ? Math.max(entryY, this.getPlayableTop() + 42) : entryY;
    }

    spawnBoss() {
      this.bossSpawned = true;
      this.bossAlive = true;
      const mirrorBoss = this.battlefieldProfile.id === "mirror-harbor";
      const x = mirrorBoss ? this.scale.width * 0.56 : this.scale.width / 2;
      const y = RUN_PROFILE.precisionPrototype ? this.getBossEntryY() : -72;
      const bossTexture = this.textures.exists(this.battlefieldProfile.bossTexture)
        ? this.battlefieldProfile.bossTexture
        : "boss";
      const boss = this.enemies.create(x, y, bossTexture).setDepth(7);
      if (mirrorBoss && bossTexture !== "boss") boss.setDisplaySize(136, 136);
      if (mirrorBoss) {
        const hitboxRadius = Math.min(boss.width, boss.height) * 0.4;
        boss.body.setCircle(
          hitboxRadius,
          (boss.width - hitboxRadius * 2) / 2,
          (boss.height - hitboxRadius * 2) / 2,
        );
      } else {
        boss.body.setCircle(42, 10, 10);
      }
      boss.body.checkCollision.none = true;
      boss.setVelocity(0, 175);
      const baseBossHealth = mirrorBoss ? 1900 + this.level * 65 : 2050 + this.level * 75;
      const runBossHealthMultiplier = mirrorBoss
        ? (RUN_PROFILE.mirrorBossHealthMultiplier ?? RUN_PROFILE.bossHealthMultiplier)
        : (RUN_PROFILE.cityBossHealthMultiplier ?? RUN_PROFILE.bossHealthMultiplier);
      const bossHealth = Math.round(
        baseBossHealth
        * (this.battlefieldProfile.bossHealthScale || 1)
        * runBossHealthMultiplier,
      );
      const bossColor = mirrorBoss ? 0x43d9d0 : COLORS.red;
      const bossAura = this.add.circle(x, y, mirrorBoss ? 66 : 56, bossColor, 0.025)
        .setStrokeStyle(3, bossColor, 0.66)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(5);
      this.tweens.add({
        targets: bossAura,
        scale: { from: 0.94, to: 1.14 },
        alpha: { from: 0.38, to: 0.86 },
        duration: 760,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      boss.setData({
        kind: "boss",
        hp: bossHealth,
        maxHp: bossHealth,
        speed: mirrorBoss ? 22 : 28,
        damage: 3,
        xp: 0,
        nextPlayerHitAt: 0,
        orbitHitAt: 0,
        phase: 1,
        specialIndex: 0,
        pulsePatternIndex: 0,
        attackState: "entering",
        entryY: this.getBossEntryY(),
        entrySettledAt: 0,
        nextSpecialAt: Number.POSITIVE_INFINITY,
        nextCrowdAt: Number.POSITIVE_INFINITY,
        nextSummonAt: Number.POSITIVE_INFINITY,
        battlefieldId: this.battlefieldProfile.id,
        bossAura,
        bossPulseRing: null,
        summonTelegraph: null,
        queuedAttack: null,
        comboChargePending: false,
      });
      this.boss = boss;
      this.bossSummonTelemetry.phasesSeen.add(1);
      this.wavePhase = 4;
      this.updateBossHud();
      ui.bossStatus.hidden = false;
      ui.bossName.textContent = this.battlefieldProfile.bossName;
      ui.objectiveText.textContent = `${this.battlefieldProfile.bossName}现身，击败它`;
      soundscape.play("boss");
      const bossBias = this.getRoute(this.finalRouteId)?.bossBias;
      const routeDetail = mirrorBoss
        ? (bossBias === "pulse" ? "折光更频繁 · 看清珊瑚红航路" : "轮舞与退潮更频繁 · 在上下港之间换道")
        : (bossBias === "pulse" ? "钟楼共振 · 暗潮更频繁 · 认准青色安全缺口" : "断墙震鸣 · 冲锋更频繁 · 闪开红线后反击");
      this.showPhaseBanner("终夜 · 一相", `${this.battlefieldProfile.bossName}现身`, routeDetail);
      this.cameras.main.shake(650, 0.013);
      this.cameras.main.flash(280, mirrorBoss ? 67 : 239, mirrorBoss ? 217 : 90, mirrorBoss ? 208 : 79, false);
    }

    getSignatureUpgrade() {
      return upgradeCatalog.find((upgrade) => upgrade.id === this.weaponProfile.signatureUpgrade);
    }

    getSignatureCycle() {
      return this.weaponProfile.signatureCycle || 3;
    }

    updateWeaponState() {
      const signature = this.getSignatureUpgrade();
      if (!signature || this.stats.signatureLevel <= 0) {
        ui.weaponState.textContent = `${this.weaponProfile.name} · ${signature?.name || "专属成长"}待唤醒`;
        ui.weaponState.dataset.compact = "待唤醒";
        return;
      }
      const cycle = this.getSignatureCycle();
      ui.weaponState.textContent = `${this.weaponProfile.name} · ${signature.name} ${this.stats.signatureLevel}级 · ${this.signatureCounter}/${cycle}`;
      ui.weaponState.dataset.compact = `${this.signatureCounter}/${cycle}`;
    }

    spawnPlayerBullet(angle, target, options = {}) {
      const profile = this.weaponProfile;
      const texture = options.texture ?? profile.texture;
      const speed = options.speed ?? this.stats.projectileSpeed;
      const homing = options.homing ?? profile.homing;
      const spawnX = this.player.x + (options.spawnOffsetX || 0);
      const spawnY = this.player.y - 5 + (options.spawnOffsetY || 0);
      const bullet = this.bullets.create(spawnX, spawnY, texture).setDepth(7);
      const projectileSizeScale = this.getPlayerProjectileSizeScale();
      const hitScale = (options.hitScale ?? 1) * projectileSizeScale;
      const fxStyle = options.fxStyle ?? profile.fxStyle ?? profile.id;
      const baseScale = (options.scale ?? 1) * projectileSizeScale;
      const baseLife = options.life ?? profile.life;
      bullet.setScale(baseScale);
      if (options.tintProjectile === true) bullet.setTint(options.color ?? profile.colorValue);
      else bullet.clearTint();
      bullet.body.setSize(
        Math.max(8, (options.hitWidth ?? profile.hitWidth ?? bullet.width) * hitScale),
        Math.max(6, (options.hitHeight ?? profile.hitHeight ?? bullet.height) * hitScale),
        true,
      );
      bullet.rotation = angle;
      bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      bullet.setBlendMode(Phaser.BlendModes.ADD);
      if (fxStyle === "returner") bullet.setAngularVelocity(540);
      bullet.setData({
        damage: options.damage ?? this.stats.damage,
        pierce: options.pierce ?? profile.pierce,
        life: baseLife + (this.stats.rangeBonus / Math.max(1, speed)) * 1000,
        target: homing > 0 ? target : null,
        speed,
        homing,
        color: options.color ?? profile.colorValue,
        trailRadius: (options.trailRadius ?? profile.trailRadius) * projectileSizeScale,
        projectileSizeScale,
        fxStyle,
        trailAt: 0,
        signature: options.signature ?? null,
        weaponEffect: options.weaponEffect ?? null,
        effectLevel: options.effectLevel ?? 0,
        novaFullVfx: options.novaFullVfx !== false,
        spawnedAt: this.gameplayTime,
        returnAfter: options.returnAfter ?? profile.returnAfter ?? 0,
        returning: false,
        returnPulseLevel: options.returnPulseLevel ?? 0,
        returnDamageMultiplier: options.returnDamageMultiplier ?? 1,
        returnOnHit: options.returnOnHit === true,
        returnBurstDamage: options.returnBurstDamage ?? 0,
        returnBurstRadius: options.returnBurstRadius ?? 0,
        arcVolleyHitTargets: options.arcVolleyHitTargets ?? null,
        returnWaypoint: null,
        returnWaypointUntil: 0,
        source: options.source ?? "primary",
        secondaryId: options.secondaryId ?? null,
        trackerDirect: options.trackerDirect === true,
        heavyVolley: options.heavyVolley === true,
        heavyVolleyId: options.heavyVolleyId ?? null,
        canCrit: options.canCrit !== false,
        projectileKind: options.projectileKind ?? null,
        secondaryBehavior: options.secondaryBehavior ?? null,
        secondaryArrivalAt: options.secondaryArrivalAt ?? Number.POSITIVE_INFINITY,
        secondaryCurveRate: options.secondaryCurveRate ?? 0,
        projectileCutChance: options.projectileCutChance ?? 0,
        projectileCutVolleyTargets: options.projectileCutVolleyTargets ?? null,
        projectileCuts: 0,
        previousX: spawnX,
        previousY: spawnY,
        glow: options.glow === true,
        baseScale,
        hitTargets: new Set(),
      });
      if (options.glow === true) {
        const glow = this.add.image(bullet.x, bullet.y, "fxGlow")
          .setTint(options.color ?? profile.colorValue)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(6)
          .setAlpha(0.62)
          .setScale(fxStyle === "lance" ? 0.78 : 0.52);
        bullet.setData("glowSprite", glow);
        bullet.once(Phaser.GameObjects.Events.DESTROY, () => {
          if (glow.active) glow.destroy();
        });
      }
      return bullet;
    }

    announceWeaponTrigger(x, y, detail) {
      const signature = this.getSignatureUpgrade();
      if (!signature) return;
      ui.objectiveText.textContent = `专属触发 · ${signature.name}`;
      this.showCombatLabel(x, y, `${signature.name} · ${detail}`, this.weaponProfile.colorValue);
    }

    showTrackerDirectFeedback(x, y, kind) {
      if (!this.isTrackerEvolutionActive()) return;
      const now = this.gameplayTime;
      const key = kind === "heavy" ? "heavy" : kind === "kill" ? "kill" : "hit";
      const nextAt = this.trackerFeedbackAt[key] || 0;
      if (now < nextAt) return;
      this.trackerFeedbackAt[key] = now + (kind === "heavy" ? 220 : kind === "kill" ? 260 : 130);
      const color = kind === "heavy" || kind === "kill" ? COLORS.goldHot : COLORS.gold;
      const ring = this.add.image(x, y, "fxRing")
        .setTint(color)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(19)
        .setAlpha(kind === "heavy" ? 0.66 : kind === "kill" ? 0.78 : 0.52)
        .setScale(kind === "heavy" ? 0.24 : kind === "kill" ? 0.28 : 0.18);
      this.tweens.add({
        targets: ring,
        scale: kind === "heavy" ? 0.92 : kind === "kill" ? 1.05 : 0.62,
        alpha: 0,
        duration: kind === "heavy" ? 230 : kind === "kill" ? 260 : 170,
        ease: "Quad.easeOut",
        onComplete: () => ring.destroy(),
      });
      if (kind === "heavy") {
        this.spawnRadialShards(x, y, COLORS.goldHot, 4, 22, Math.PI / 10, 0.26);
      } else if (kind === "kill") {
        this.spawnRadialShards(x, y, COLORS.goldHot, 5, 26, Math.PI / 8, 0.3);
        this.showCombatLabel(x, y - 32, "引灯击破", COLORS.goldHot);
      }
    }

    spawnTrackerHeavyAccent(angle) {
      if (!this.isTrackerEvolutionActive()) return;
      const x = this.player.x + Math.cos(angle) * 18;
      const y = this.player.y - 5 + Math.sin(angle) * 18;
      const ring = this.add.image(x, y, "fxRing")
        .setTint(0xfff7c2)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(18)
        .setRotation(angle)
        .setAlpha(0.72)
        .setScale(0.28);
      this.tweens.add({
        targets: ring,
        scale: 1.18,
        alpha: 0,
        duration: 260,
        ease: "Quad.easeOut",
        onComplete: () => ring.destroy(),
      });
      [-0.42, -0.28, -0.14, 0, 0.14, 0.28, 0.42].forEach((offset, index) => {
        const slash = this.add.image(x, y, "fxSlash")
          .setTint(index === 3 ? 0xffffff : 0xfff0a3)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(19)
          .setRotation(angle + offset)
          .setAlpha(0.58)
          .setScale(0.24, 0.12);
        this.tweens.add({
          targets: slash,
          x: x + Math.cos(angle + offset) * 34,
          y: y + Math.sin(angle + offset) * 34,
          scaleX: 0.88,
          alpha: 0,
          duration: 210,
          ease: "Quad.easeOut",
          onComplete: () => slash.destroy(),
        });
      });
      this.spawnRadialShards(x, y, 0xfff0a3, 7, 42, Math.PI / 12, 0.34);
      soundscape.play("trackerHeavy", true);
    }

    registerTrackerHeavyImpact(bullet, x, y) {
      if (!this.isTrackerEvolutionActive() || bullet?.getData("heavyVolley") !== true) return false;
      const volleyId = bullet.getData("heavyVolleyId") || `heavy-${Math.round(bullet.getData("spawnedAt") || this.gameplayTime)}`;
      if (this.trackerHeavyImpactSeen.has(volleyId)) return false;
      this.trackerHeavyImpactSeen.add(volleyId);
      this.recordTrackerEvolutionMetric("heavy-impact", { volleyId, x: Math.round(x), y: Math.round(y) });
      this.showTrackerDirectFeedback(x, y, "heavy");
      soundscape.play("trackerHeavy", true);
      return true;
    }

    getPrimaryAttackRange(profile = this.weaponProfile) {
      if (profile.id === "scatter") return profile.range + Math.min(70, this.stats.rangeBonus * 0.34);
      if (profile.id === "lance") return profile.range + Math.min(130, this.stats.rangeBonus * 0.6);
      return profile.range + this.stats.rangeBonus;
    }

    getArcShotPlan(nearest, offsets, targetCandidates) {
      const orderedTargets = [
        nearest,
        ...targetCandidates
          .filter((candidate) => candidate.enemy?.active && candidate.enemy !== nearest)
          .sort((left, right) => right.priority - left.priority || left.distance - right.distance)
          .map((candidate) => candidate.enemy),
      ];
      return offsets.map((offset, index) => ({
        target: orderedTargets[index % orderedTargets.length] || nearest,
        angleOffset: index < orderedTargets.length ? 0 : offset,
        lateralOffset: 0,
        damage: this.stats.damage,
        arcPrimary: index === 0,
        arcSplitPath: index >= orderedTargets.length,
      }));
    }

    getTrackerVolleyOffsets(count, spread) {
      if (count <= 1) return [0];
      const laneGap = Math.max(0.16, spread * 1.2);
      const offsets = [];
      for (let lane = 0; offsets.length < count; lane += 1) {
        const magnitude = laneGap * (lane + 1);
        offsets.push(-magnitude);
        if (offsets.length < count) offsets.push(magnitude);
      }
      if (count % 2 === 1) offsets[offsets.length - 1] = 0;
      return offsets;
    }

    getPrototypeTrackerTargets(targetCandidates, desiredCount) {
      const live = targetCandidates
        .filter((candidate) => candidate.enemy?.active)
        .sort((a, b) => {
          const hordeDelta = Number(Boolean(b.enemy.getData("prototypeHorde"))) - Number(Boolean(a.enemy.getData("prototypeHorde")));
          if (hordeDelta !== 0) return hordeDelta;
          if (b.priority !== a.priority) return b.priority - a.priority;
          return a.distance - b.distance;
        })
        .map((candidate) => candidate.enemy);
      if (live.length === 0) return [];
      const selected = [];
      const used = new Set();
      live.forEach((enemy) => {
        const id = enemy.getData("id");
        if (selected.length >= desiredCount || used.has(id)) return;
        used.add(id);
        selected.push(enemy);
      });
      for (let index = 0; selected.length < desiredCount && live.length > 0; index += 1) {
        selected.push(live[index % live.length]);
      }
      return selected;
    }

    recordPrototypeTrackerVolleyTargets(kind, targets) {
      const tracker = this.refreshTrackerEvolutionTelemetry();
      if (!tracker) return 0;
      const ids = targets.map((target) => target?.getData("id") ?? null);
      const distinctCount = new Set(ids.filter((id) => id !== null)).size;
      const record = {
        at: Math.round(this.gameplayTime),
        kind,
        targetIds: ids,
        distinctTargetCount: distinctCount,
      };
      tracker.lastVolleyTargets = record;
      tracker.volleyTargetHistory.push(record);
      if (tracker.volleyTargetHistory.length > 32) tracker.volleyTargetHistory.shift();
      if (kind === "heavy") tracker.maxHeavyDistinctTargets = Math.max(tracker.maxHeavyDistinctTargets, distinctCount);
      else tracker.maxDualDistinctTargets = Math.max(tracker.maxDualDistinctTargets, distinctCount);
      return distinctCount;
    }

    getTrackerShotPlan(baseAngle, count, spread, targetCandidates = []) {
      const stage = this.getTrackerEvolutionStage();
      const tracker = this.refreshTrackerEvolutionTelemetry();
      if (!tracker || count <= 1) {
        return {
          stage,
          heavy: false,
          shots: [{ angleOffset: 0, lateralOffset: 0, damage: this.stats.damage }],
        };
      }
      tracker.primaryAttackCounter += 1;
      if (stage === "emberVolley") tracker.emberVolleyAttackCounter += 1;
      else tracker.emberVolleyAttackCounter = 0;
      const heavyReady = stage === "emberVolley" && tracker.emberVolleyAttackCounter % tracker.heavyVolleyEvery === 0;
      const lightCount = Math.max(2, count);
      const dualOffsets = this.getTrackerVolleyOffsets(lightCount, spread).sort((a, b) => a - b);
      const dualLateral = 44;
      const lightLateralOffsets = Array.from(
        { length: lightCount },
        (_, index) => (index - (lightCount - 1) / 2) * dualLateral,
      );
      if (!heavyReady) {
        const targets = this.getPrototypeTrackerTargets(targetCandidates, lightCount);
        const shots = dualOffsets.map((angleOffset, index) => ({
          angleOffset,
          lateralOffset: lightLateralOffsets[index],
          damage: this.stats.damage,
          target: targets[index] || null,
        }));
        this.recordPrototypeTrackerVolleyTargets("dual", shots.map((shot) => shot.target));
        tracker.dualVolleyOffsets = dualOffsets.map((offset) => Math.round(offset * 1000) / 1000);
        tracker.dualLateralSpacing = dualLateral;
        tracker.lastVolleyOffsets = tracker.dualVolleyOffsets.slice();
        tracker.lastVolleyLateralOffsets = shots.map((shot) => shot.lateralOffset);
        return { stage, heavy: false, shots };
      }
      const heavyCount = 7 + Math.max(0, lightCount - 2);
      const heavyOffsets = Array.from(
        { length: heavyCount },
        (_, index) => (index - (heavyCount - 1) / 2) * 0.16,
      );
      const heavyLateral = Array.from(
        { length: heavyCount },
        (_, index) => (index - (heavyCount - 1) / 2) * 18,
      );
      const heavyTargets = this.getPrototypeTrackerTargets(targetCandidates, heavyCount);
      const baselineDamage = this.stats.damage * lightCount;
      const perProjectileDamage = Math.max(1, Math.floor(baselineDamage / heavyCount));
      const normalizedDamage = {
        baselineDualTotal: baselineDamage,
        perProjectile: perProjectileDamage,
        maxVolleyTotal: perProjectileDamage * heavyCount,
      };
      const firstHeavyVolley = tracker.heavyVolleyCount === 0;
      tracker.heavyVolleyCount += 1;
      tracker.heavyProjectileCount = heavyCount;
      tracker.heavyVolleyOffsets = heavyOffsets.slice();
      tracker.lastVolleyOffsets = heavyOffsets.slice();
      tracker.lastVolleyLateralOffsets = heavyLateral.slice();
      tracker.normalizedDamage = normalizedDamage;
      this.recordPrototypeTrackerVolleyTargets("heavy", heavyTargets);
      this.recordTrackerEvolutionMetric("ember-volley", {
        mode: "heavy-volley",
        attack: tracker.primaryAttackCounter,
        projectileCount: heavyCount,
        offsets: heavyOffsets,
        lateralOffsets: heavyLateral,
        normalizedDamage,
      });
      this.spawnTrackerHeavyAccent(baseAngle);
      if (firstHeavyVolley) {
        this.showCombatLabel(this.player.x, this.player.y - 60, `组合触发 · 烈焰齐射 ${heavyCount} 发`, COLORS.goldHot);
      }
      return {
        stage,
        heavy: true,
        volleyId: `heavy-${tracker.primaryAttackCounter}`,
        shots: heavyOffsets.map((angleOffset, index) => ({
          angleOffset,
          lateralOffset: heavyLateral[index],
          damage: perProjectileDamage,
          target: heavyTargets[index] || null,
        })),
      };
    }

    recordPrimaryMeleeAttack(hits, damage, geometry = {}) {
      const telemetry = this.primaryAttackTelemetry;
      telemetry.attacks += 1;
      telemetry.hits += hits;
      telemetry.damage += damage;
      telemetry.kills += geometry.kills || 0;
      telemetry.maxTargetsPerAttack = Math.max(telemetry.maxTargetsPerAttack, hits);
      telemetry.maxKillsPerAttack = Math.max(telemetry.maxKillsPerAttack, geometry.kills || 0);
      telemetry.maxHitDistance = Math.max(telemetry.maxHitDistance, geometry.maxHitDistance || 0);
      telemetry.maxFanAngle = Math.max(telemetry.maxFanAngle, geometry.maxFanAngle || 0);
      telemetry.maxForwardProjection = Math.max(
        telemetry.maxForwardProjection,
        geometry.maxForwardProjection || 0,
      );
      telemetry.maxPerpendicularDistance = Math.max(
        telemetry.maxPerpendicularDistance,
        geometry.maxPerpendicularDistance || 0,
      );
    }

    cutEnemyProjectilesInMeleeArea(options) {
      const originX = options.originX ?? this.player.x;
      const originY = options.originY ?? this.player.y;
      const attackAngle = options.angle ?? 0;
      const range = options.range ?? 0;
      const mode = options.mode || "fan";
      let candidates = 0;
      let cut = 0;
      let visibleCuts = 0;

      this.enemyProjectiles.getChildren().slice().forEach((shot) => {
        if (!shot?.active) return;
        const offsetX = shot.x - originX;
        const offsetY = shot.y - originY;
        const distance = Math.hypot(offsetX, offsetY);
        const shotRadius = Math.min(18, Math.max(6, Math.max(shot.body?.width || 0, shot.displayWidth || 0) * 0.32));
        let insideAttack = false;

        if (mode === "ring") {
          insideAttack = distance <= range + shotRadius;
        } else if (mode === "line") {
          const directionX = Math.cos(attackAngle);
          const directionY = Math.sin(attackAngle);
          const projection = offsetX * directionX + offsetY * directionY;
          const perpendicular = Math.abs(offsetX * directionY - offsetY * directionX);
          insideAttack = projection >= -shotRadius
            && projection <= range + shotRadius
            && perpendicular <= (options.halfWidth || 0) + shotRadius;
        } else {
          if (distance <= range + shotRadius) {
            const projectileAngle = Math.atan2(offsetY, offsetX);
            const angleDelta = Math.abs(Phaser.Math.Angle.Wrap(projectileAngle - attackAngle));
            const angularAllowance = Math.asin(Math.min(1, shotRadius / Math.max(1, distance)));
            insideAttack = angleDelta <= (options.fanAngle || 0) / 2 + angularAllowance;
          }
        }

        if (!insideAttack) return;
        candidates += 1;
        if (Math.random() >= MELEE_PROJECTILE_CUT_CHANCE) return;
        const impactX = shot.x;
        const impactY = shot.y;
        const impactAngle = mode === "ring" ? Math.atan2(offsetY, offsetX) : attackAngle;
        shot.destroy();
        cut += 1;
        if (visibleCuts < 6) {
          this.spawnProjectileImpact(impactX, impactY, options.color ?? this.weaponProfile.colorValue, "secondary-blade", impactAngle);
          visibleCuts += 1;
        }
      });

      if (options.secondaryId) {
        this.secondaryTelemetry.projectileCutCandidates += candidates;
        this.secondaryTelemetry.projectilesCut += cut;
        this.secondaryTelemetry.maxProjectilesCutPerMeleeSecondary = Math.max(
          this.secondaryTelemetry.maxProjectilesCutPerMeleeSecondary,
          cut,
        );
        this.recordSecondaryEvent(options.secondaryId, "projectileCutCandidates", candidates);
        this.recordSecondaryEvent(options.secondaryId, "projectilesCut", cut);
      } else {
        const telemetry = this.primaryAttackTelemetry;
        telemetry.projectileCutCandidates += candidates;
        telemetry.projectilesCut += cut;
        telemetry.maxProjectilesCutPerAttack = Math.max(telemetry.maxProjectilesCutPerAttack, cut);
      }
      if (cut > 0) {
        const labelDistance = mode === "ring" ? 0 : Math.min(76, range * 0.38);
        this.showCombatLabel(
          originX + Math.cos(attackAngle) * labelDistance,
          originY - 30 + Math.sin(attackAngle) * labelDistance,
          `断弹 ×${cut}`,
          options.color ?? this.weaponProfile.colorValue,
        );
        this.cameras.main.shake(46, this.usesCompactControls() ? 0.001 : 0.0014);
        soundscape.play("projectileCut");
      }
      return { candidates, cut };
    }

    cutEnemyProjectilesWithSwordWave(bullet, previousX, previousY) {
      const chance = bullet.getData("projectileCutChance") || 0;
      const checkedProjectiles = bullet.getData("projectileCutVolleyTargets");
      if (chance <= 0 || !checkedProjectiles) return { candidates: 0, cut: 0 };
      const waveHalfWidth = Math.max(10, (bullet.body?.height || bullet.displayHeight || 20) * 0.5);
      let candidates = 0;
      let cut = 0;

      this.enemyProjectiles.getChildren().slice().forEach((shot) => {
        if (!shot?.active || checkedProjectiles.has(shot)) return;
        const shotRadius = Math.min(18, Math.max(6, Math.max(shot.body?.width || 0, shot.displayWidth || 0) * 0.32));
        const sweepMargin = waveHalfWidth + shotRadius + 8;
        if (this.getDistanceToSegment(shot.x, shot.y, previousX, previousY, bullet.x, bullet.y) > sweepMargin) return;
        checkedProjectiles.add(shot);
        candidates += 1;
        if (Math.random() >= chance) return;
        const impactX = shot.x;
        const impactY = shot.y;
        const impactAngle = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
        shot.destroy();
        cut += 1;
        this.spawnProjectileImpact(impactX, impactY, bullet.getData("color"), "secondary-sword-wave", impactAngle);
      });

      if (candidates > 0) {
        this.secondaryTelemetry.projectileCutCandidates += candidates;
        this.recordSecondaryEvent(bullet.getData("secondaryId"), "projectileCutCandidates", candidates);
      }
      if (cut > 0) {
        const totalCuts = (bullet.getData("projectileCuts") || 0) + cut;
        bullet.setData("projectileCuts", totalCuts);
        this.secondaryTelemetry.projectilesCut += cut;
        this.secondaryTelemetry.maxProjectilesCutPerSwordWave = Math.max(
          this.secondaryTelemetry.maxProjectilesCutPerSwordWave,
          totalCuts,
        );
        this.recordSecondaryEvent(bullet.getData("secondaryId"), "projectilesCut", cut);
        this.recordSecondaryEvent(bullet.getData("secondaryId"), "special", "sword-wave-cut");
        if (!bullet.getData("projectileCutFeedbackShown")) {
          bullet.setData("projectileCutFeedbackShown", true);
          this.showCombatLabel(bullet.x, bullet.y - 22, `剑气断弹 ×${cut}`, bullet.getData("color"));
        }
        soundscape.play("projectileCut");
      }
      return { candidates, cut };
    }

    applyPrimaryAttackHit(enemy, options = {}) {
      if (!enemy?.active || this.ended) return 0;
      const bullet = options.bullet || null;
      const color = options.color ?? bullet?.getData("color") ?? this.weaponProfile.colorValue;
      const fxStyle = options.fxStyle ?? bullet?.getData("fxStyle") ?? this.weaponProfile.fxStyle;
      const impactAngle = options.impactAngle ?? Math.atan2(
        bullet?.body?.velocity?.y || 0,
        bullet?.body?.velocity?.x || 1,
      );
      const signature = options.signature ?? bullet?.getData("signature") ?? null;
      const weaponEffect = options.weaponEffect ?? bullet?.getData("weaponEffect") ?? null;
      const effectLevel = options.effectLevel ?? bullet?.getData("effectLevel") ?? 0;
      const novaFullVfx = options.novaFullVfx ?? bullet?.getData("novaFullVfx") ?? true;
      const rawDamage = options.damage ?? bullet?.getData("damage") ?? this.stats.damage;
      const canCrit = options.canCrit ?? bullet?.getData("canCrit") ?? true;
      const critical = canCrit && this.stats.criticalChance > 0 && Math.random() < this.stats.criticalChance;
      const surgeMultiplier = this.gameplayTime < this.surgeUntil ? 1.25 : 1;
      const directDamage = Math.round(rawDamage * (critical ? 1.8 : 1) * surgeMultiplier);
      const impactX = enemy.x;
      const impactY = enemy.y;
      this.spawnProjectileImpact(impactX, impactY, color, fxStyle, impactAngle);
      this.applyFrost(enemy);
      this.applyBlaze(enemy);
      this.triggerFrostfire(enemy, impactX, impactY);
      if (critical) soundscape.recordCritical();
      this.damageEnemy(enemy, directDamage, bullet, color);
      if (this.weaponProfile.id === "arc" && bullet?.getData("source") === "primary") {
        this.registerArcNodeHit(enemy, impactX, impactY, bullet);
      }
      if (critical) this.showCombatLabel(impactX, impactY - 28, `暴击 ${directDamage}`, COLORS.gold);
      if (this.ended) return directDamage;
      if (signature === "tracker") {
        this.signatureCounter += 1;
        if (this.signatureCounter >= this.getSignatureCycle()) {
          this.signatureCounter = 0;
          this.detonateLanternMark(impactX, impactY);
        }
        this.updateWeaponState();
      }
      if (weaponEffect === "arc") {
        this.releaseArcGlyph(enemy, impactX, impactY, effectLevel);
      } else if (weaponEffect === "nova") {
        this.releaseNovaRing(enemy, impactX, impactY, effectLevel, rawDamage, novaFullVfx);
      }
      this.tryChainLightning(enemy, impactX, impactY, critical);
      if (this.activeSynergies.has("emberVolley") && !this.isPrecisionTrackerPrototype()) {
        this.time.delayedCall(90, () => {
          if (this.ended) return;
          this.spawnRipple(impactX, impactY, COLORS.goldHot);
          if (enemy.active) this.damageEnemy(enemy, 10, null, COLORS.goldHot);
          this.recordTrackerEvolutionMetric("ember-volley", { x: Math.round(impactX), y: Math.round(impactY), damage: 10 });
          soundscape.play("ember");
          this.announceSynergyTrigger("emberVolley", impactX, impactY, "余焰 +10");
        });
      }
      return directDamage;
    }

    spawnScatterBladeArc(x, y, angle, range, options = {}) {
      const createSweep = () => {
        if (!this.sys?.isActive()) return;
        const scale = range / 112;
        const sweep = this.add.image(x, y - 5, "scatterSweep")
          .setTint(options.tint ?? this.weaponProfile.colorValue)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(options.depth ?? 18)
          .setRotation(angle - (options.rotationLead ?? 0.2))
          .setAlpha(options.alpha ?? 0.96)
          .setScale(
            scale * (options.startScale ?? 0.78),
            scale * (options.startScale ?? 0.78) * (options.fanScale ?? 1),
          );
        this.tweens.add({
          targets: sweep,
          rotation: angle + (options.rotationFollow ?? 0.08),
          scaleX: scale * (options.endScale ?? 1),
          scaleY: scale * (options.endScale ?? 1) * (options.fanScale ?? 1),
          alpha: 0,
          duration: options.duration ?? 155,
          ease: "Cubic.easeOut",
          onComplete: () => sweep.destroy(),
        });
      };
      if ((options.delay ?? 0) > 0) this.time.delayedCall(options.delay, createSweep);
      else createSweep();
    }

    spawnScatterSweepVfx(angle, range, fanAngle, empowered = false) {
      const originX = this.player.x;
      const originY = this.player.y;
      const fanScale = Phaser.Math.Clamp(fanAngle / 1.9, 1, 1.22);
      this.spawnScatterBladeArc(originX, originY, angle, range, {
        fanScale,
        tint: 0xff8a72,
        rotationLead: 0.28,
        rotationFollow: 0.12,
        startScale: 0.72,
        duration: 175,
      });
      this.spawnScatterBladeArc(originX, originY, angle + 0.055, range * 0.92, {
        alpha: 0.58,
        delay: 30,
        duration: 190,
        fanScale: fanScale * 0.94,
        rotationLead: 0.2,
        rotationFollow: 0.16,
        startScale: 0.68,
        tint: 0xffd49a,
      });
      if (empowered) {
        this.spawnScatterBladeArc(originX, originY, angle - 0.1, range * 1.12, {
          alpha: 0.74,
          delay: 54,
          duration: 230,
          fanScale: fanScale * 1.04,
          rotationLead: 0.34,
          rotationFollow: 0.18,
          startScale: 0.66,
          tint: 0xffffff,
        });
      }
    }

    spawnLanceThrustVfx(angle, range, count, charged = false, originOffsetX = 0, originOffsetY = 0, colorOverride = null) {
      const lateralSpacing = charged ? 19 : 16;
      const color = colorOverride ?? this.weaponProfile.colorValue;
      for (let index = 0; index < count; index += 1) {
        const lateral = (index - (count - 1) / 2) * lateralSpacing;
        const originX = this.player.x + originOffsetX + Math.cos(angle) * 13 + Math.cos(angle + Math.PI / 2) * lateral;
        const originY = this.player.y - 5 + originOffsetY + Math.sin(angle) * 13 + Math.sin(angle + Math.PI / 2) * lateral;
        const thrust = this.add.image(originX, originY, "lanceThrust")
          .setOrigin(0, 0.5)
          .setTint(charged && index === Math.floor(count / 2) ? 0xffffff : color)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(18)
          .setRotation(angle)
          .setAlpha(charged ? 0.98 : 0.9)
          .setScale(0.08, charged ? 1.18 : 0.86);
        this.tweens.add({
          targets: thrust,
          scaleX: range / 192,
          duration: charged ? 115 : 82,
          ease: "Quart.easeOut",
          onComplete: () => {
            if (!thrust.active) return;
            this.tweens.add({
              targets: thrust,
              x: originX + Math.cos(angle) * (charged ? 28 : 18),
              y: originY + Math.sin(angle) * (charged ? 28 : 18),
              scaleX: range / 192 * 0.78,
              alpha: 0,
              duration: charged ? 150 : 110,
              ease: "Cubic.easeIn",
              onComplete: () => thrust.destroy(),
            });
          },
        });
        const wind = this.add.image(
          originX + Math.cos(angle) * range * 0.42,
          originY + Math.sin(angle) * range * 0.42,
          "fxSlash",
        )
          .setTint(color)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(17)
          .setRotation(angle)
          .setAlpha(charged ? 0.56 : 0.32)
          .setScale(0.2, charged ? 0.55 : 0.34);
        this.tweens.add({
          targets: wind,
          scaleX: range / 52,
          alpha: 0,
          duration: charged ? 230 : 160,
          ease: "Cubic.easeOut",
          onComplete: () => wind.destroy(),
        });
      }
      const tip = this.add.image(
        this.player.x + originOffsetX + Math.cos(angle) * 22,
        this.player.y - 5 + originOffsetY + Math.sin(angle) * 22,
        "fxStar",
      )
        .setTint(charged ? 0xffffff : color)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(19)
        .setAlpha(0.78)
        .setScale(charged ? 0.58 : 0.34);
      this.tweens.add({
        targets: tip,
        x: this.player.x + originOffsetX + Math.cos(angle) * range,
        y: this.player.y - 5 + originOffsetY + Math.sin(angle) * range,
        scale: charged ? 0.94 : 0.62,
        alpha: charged ? 0.95 : 0.82,
        duration: charged ? 115 : 82,
        ease: "Quart.easeOut",
        onComplete: () => {
          if (!tip.active) return;
          this.spawnRipple(tip.x, tip.y, color);
          this.tweens.add({
            targets: tip,
            scale: charged ? 1.5 : 1.02,
            alpha: 0,
            duration: charged ? 170 : 120,
            ease: "Quad.easeOut",
            onComplete: () => tip.destroy(),
          });
        },
      });
      if (charged) this.cameras.main.shake(105, this.usesCompactControls() ? 0.0024 : 0.0036);
    }

    fireScatterSweep(baseAngle, signatureTriggered) {
      const profile = this.weaponProfile;
      const extraFacets = Math.max(0, this.stats.projectileCount - profile.projectileCount);
      const range = this.getPrimaryAttackRange(profile);
      const fanAngle = Math.min(2.35, 1.9 + extraFacets * 0.15);
      const damage = Math.round(this.stats.damage * (2.55 + extraFacets * 0.28));
      let hits = 0;
      let kills = 0;
      let sweepHits = 0;
      let totalDamage = 0;
      let maxHitDistance = 0;
      let impactX = 0;
      let impactY = 0;
      this.enemies.getChildren().slice().forEach((enemy) => {
        if (!enemy?.active || this.ended) return;
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
        const enemyRadius = Math.min(34, Math.max(enemy.body?.width || 0, enemy.displayWidth || 0) * 0.32);
        if (distance > range + enemyRadius) return;
        const enemyAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
        const hitX = enemy.x;
        const hitY = enemy.y;
        const angleDelta = Math.abs(Phaser.Math.Angle.Wrap(enemyAngle - baseAngle));
        const angularAllowance = Math.asin(Math.min(1, enemyRadius / Math.max(1, distance)));
        if (angleDelta > fanAngle / 2 + angularAllowance) return;
        const wasActive = enemy.active;
        totalDamage += this.applyPrimaryAttackHit(enemy, {
          damage,
          color: profile.colorValue,
          fxStyle: "scatter",
          impactAngle: enemyAngle,
        });
        if (wasActive && !enemy.active) kills += 1;
        hits += 1;
        sweepHits += 1;
        impactX += hitX;
        impactY += hitY;
        maxHitDistance = Math.max(maxHitDistance, distance);
      });
      this.spawnScatterSweepVfx(baseAngle, range, fanAngle, signatureTriggered);
      let projectileCutMode = "fan";
      let projectileCutRange = range;
      if (signatureTriggered) {
        const burst = this.releaseScatterBurst(this.stats.signatureLevel);
        hits += burst.hits;
        kills += burst.kills;
        totalDamage += burst.damage;
        maxHitDistance = Math.max(maxHitDistance, burst.maxHitDistance);
        projectileCutMode = "ring";
        projectileCutRange = burst.radius;
      }
      this.cutEnemyProjectilesInMeleeArea({
        mode: projectileCutMode,
        originX: this.player.x,
        originY: this.player.y,
        angle: baseAngle,
        range: projectileCutRange,
        fanAngle,
        color: profile.colorValue,
      });
      this.recordPrimaryMeleeAttack(hits, totalDamage, {
        kills,
        maxHitDistance,
        maxFanAngle: fanAngle,
      });
      if (hits > 0) {
        const compactScale = this.usesCompactControls() ? 0.7 : 1;
        const hitWeight = Math.min(5, hits);
        const shakeDuration = signatureTriggered ? 105 : 58 + hitWeight * 7;
        const shakeStrength = signatureTriggered ? 0.0032 : 0.0014 + hitWeight * 0.00025;
        this.cameras.main.shake(shakeDuration, shakeStrength * compactScale);
        if (sweepHits > 0) {
          this.spawnExpandingSigil(
            impactX / sweepHits,
            impactY / sweepHits,
            profile.colorValue,
            Math.min(58, 28 + sweepHits * 5),
            210,
          );
        }
      }
      if (kills >= 3 && this.gameplayTime >= this.nextScatterKillAccentAt) {
        this.nextScatterKillAccentAt = this.gameplayTime + 700;
        this.showCombatLabel(this.player.x, this.player.y - 48, `碎星横扫 · 斩灭 ×${kills}`, 0xffd49a);
        this.spawnRadialShards(this.player.x, this.player.y - 5, 0xffd49a, Math.min(14, 6 + kills), 58, baseAngle, 0.5);
        soundscape.play("hordeCombo", true);
      }
      return hits;
    }

    releaseScatterBurst(level) {
      const radius = 200 + level * 16;
      const damage = Math.round(this.stats.damage * (1.2 + level * 0.2));
      let hits = 0;
      let kills = 0;
      let totalDamage = 0;
      let maxHitDistance = 0;
      this.enemies.getChildren().slice().forEach((enemy) => {
        if (!enemy?.active || this.ended) return;
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
        if (distance > radius) return;
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
        const wasActive = enemy.active;
        totalDamage += this.applyPrimaryAttackHit(enemy, {
          damage,
          color: this.weaponProfile.colorValue,
          fxStyle: "scatter",
          impactAngle: angle,
          signature: "scatter",
        });
        if (wasActive && !enemy.active) kills += 1;
        hits += 1;
        maxHitDistance = Math.max(maxHitDistance, distance);
      });
      const ringScale = radius / 124;
      const ringBlade = this.add.image(this.player.x, this.player.y - 5, "scatterRingBlade")
        .setTint(0xff8a72)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(18)
        .setAlpha(0.94)
        .setRotation(-0.18)
        .setScale(ringScale * 0.7);
      this.tweens.add({
        targets: ringBlade,
        rotation: 0.42,
        scale: ringScale * 1.06,
        alpha: 0,
        duration: 285,
        ease: "Cubic.easeOut",
        onComplete: () => ringBlade.destroy(),
      });
      const counterBlade = this.add.image(this.player.x, this.player.y - 5, "scatterRingBlade")
        .setTint(0xffffff)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(17)
        .setAlpha(0.62)
        .setRotation(0.3)
        .setScale(ringScale * 0.56);
      this.tweens.add({
        targets: counterBlade,
        rotation: -0.5,
        scale: ringScale * 1.18,
        alpha: 0,
        duration: 340,
        ease: "Cubic.easeOut",
        onComplete: () => counterBlade.destroy(),
      });
      this.spawnExpandingSigil(this.player.x, this.player.y, this.weaponProfile.colorValue, radius, 330);
      this.spawnRadialShards(this.player.x, this.player.y - 5, 0xffd49a, 10 + level * 2, radius * 0.58, -Math.PI / 8, 0.56);
      this.burstAt(this.player.x, this.player.y, this.weaponProfile.colorValue, 10 + level * 2);
      this.announceWeaponTrigger(this.player.x, this.player.y - 34, `回身旋刃 · ${hits} 目标`);
      soundscape.play("pulse");
      return { hits, kills, damage: totalDamage, maxHitDistance, radius };
    }

    fireLanceThrust(baseAngle, charged) {
      const profile = this.weaponProfile;
      const level = this.stats.signatureLevel;
      const extraLanes = Math.max(0, this.stats.projectileCount - profile.projectileCount);
      const range = this.getPrimaryAttackRange(profile) + (charged ? 60 + level * 25 : 0) + extraLanes * 8;
      const halfWidth = (charged ? 36 + level * 4 : 24) + extraLanes * 7;
      const directionX = Math.cos(baseAngle);
      const directionY = Math.sin(baseAngle);
      const originX = this.player.x;
      const originY = this.player.y - 5;
      const candidates = this.enemies.getChildren()
        .filter((enemy) => enemy?.active)
        .map((enemy) => {
          const offsetX = enemy.x - originX;
          const offsetY = enemy.y - originY;
          const projection = offsetX * directionX + offsetY * directionY;
          const perpendicular = Math.abs(offsetX * directionY - offsetY * directionX);
          const enemyRadius = Math.min(36, Math.max(enemy.body?.width || 0, enemy.displayWidth || 0) * 0.34);
          return { enemy, projection, perpendicular, enemyRadius };
        })
        .filter((candidate) => (
          candidate.projection >= -candidate.enemyRadius
          && candidate.projection <= range + candidate.enemyRadius
          && candidate.perpendicular <= halfWidth + candidate.enemyRadius
        ))
        .sort((left, right) => left.projection - right.projection);
      const hitLimit = profile.pierce + 1 + extraLanes + (charged ? 1 + level : 0);
      const damage = charged
        ? Math.round(this.stats.damage * (1.45 + level * 0.25))
        : Math.round(this.stats.damage * 1.18);
      let hits = 0;
      let totalDamage = 0;
      let maxHitDistance = 0;
      let maxForwardProjection = 0;
      let maxPerpendicularDistance = 0;
      candidates.slice(0, hitLimit).forEach((candidate) => {
        if (!candidate.enemy.active || this.ended) return;
        totalDamage += this.applyPrimaryAttackHit(candidate.enemy, {
          damage,
          color: profile.colorValue,
          fxStyle: "lance",
          impactAngle: baseAngle,
          signature: charged ? "lance" : null,
        });
        hits += 1;
        maxHitDistance = Math.max(
          maxHitDistance,
          Phaser.Math.Distance.Between(originX, originY, candidate.enemy.x, candidate.enemy.y),
        );
        maxForwardProjection = Math.max(maxForwardProjection, candidate.projection);
        maxPerpendicularDistance = Math.max(maxPerpendicularDistance, candidate.perpendicular);
      });
      this.spawnLanceThrustVfx(baseAngle, range, Math.max(1, this.stats.projectileCount), charged);
      this.cutEnemyProjectilesInMeleeArea({
        mode: "line",
        originX,
        originY,
        angle: baseAngle,
        range,
        halfWidth,
        color: profile.colorValue,
      });
      this.recordPrimaryMeleeAttack(hits, totalDamage, {
        maxHitDistance,
        maxForwardProjection,
        maxPerpendicularDistance,
      });
      return hits;
    }

    detonateLanternMark(x, y) {
      const level = this.stats.signatureLevel;
      const radius = 78 + level * 14;
      const damage = 12 + level * 8;
      this.recordTrackerEvolutionMetric("lantern-mark", { x: Math.round(x), y: Math.round(y), radius, damage });
      this.spawnExpandingSigil(x, y, COLORS.gold, radius, 430);
      this.spawnExpandingSigil(x, y, COLORS.goldHot, radius * 0.68, 370, 40, Math.PI / 4);
      this.spawnRadialShards(x, y, COLORS.gold, 8 + level * 2, radius * 0.58, Math.PI / 8, 0.42);
      const targets = [];
      this.enemies.children.iterate((enemy) => {
        if (!enemy?.active) return;
        if (Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= radius) targets.push(enemy);
      });
      targets.forEach((enemy) => this.damageEnemy(enemy, damage, null));
      this.burstAt(x, y, COLORS.gold, 10 + level * 2);
      this.announceWeaponTrigger(x, y - 28, `爆印 ${damage}`);
      soundscape.play("trackerMark", true);
    }

    getArcNodePosition(node) {
      if (node?.enemy?.active) {
        node.x = node.enemy.x;
        node.y = node.enemy.y;
      }
      return {
        x: Number.isFinite(node?.x) ? node.x : 0,
        y: Number.isFinite(node?.y) ? node.y : 0,
      };
    }

    getActiveArcNodes(time = this.gameplayTime) {
      if (!this.arcNodes) this.arcNodes = [];
      this.arcNodes = this.arcNodes.filter((node) => {
        const active = time < node.expiresAt;
        if (active) this.getArcNodePosition(node);
        if (!active && node.marker?.active) node.marker.destroy();
        return active;
      });
      return this.arcNodes;
    }

    updateArcNodes(time) {
      this.getActiveArcNodes(time).forEach((node, index) => {
        if (!node.marker?.active) return;
        const pulse = 0.42 + Math.sin(time * 0.012 + index) * 0.05;
        const position = this.getArcNodePosition(node);
        node.marker
          .setPosition(position.x, position.y)
          .setRotation(time * 0.0035 + index)
          .setScale(pulse)
          .setAlpha(0.58 + Math.sin(time * 0.016 + index) * 0.12);
      });
    }

    clearArcNodes() {
      (this.arcNodes || []).forEach((node) => {
        if (node.marker?.active) node.marker.destroy();
      });
      this.arcNodes = [];
    }

    registerArcNodeHit(enemy, x, y, bullet) {
      if (this.ended) return;
      const nodes = this.getActiveArcNodes();
      const existing = nodes.find((node) => node.enemy === enemy);
      const previousNode = nodes
        .slice()
        .sort((left, right) => right.sequence - left.sequence)
        .find((node) => node !== existing) || null;
      if (previousNode) {
        const linkDamage = Math.max(1, Math.round(this.stats.damage * 0.4));
        const linkHits = bullet?.getData("arcVolleyHitTargets") || new Set();
        const previousPosition = this.getArcNodePosition(previousNode);
        this.drawLightning(previousPosition.x, previousPosition.y, x, y);
        this.enemies.getChildren().slice().forEach((target) => {
          if (!target?.active || linkHits.has(target)) return;
          const targetRadius = Math.min(30, Math.max(target.body?.width || 0, target.displayWidth || 0) * 0.32);
          if (this.getDistanceToSegment(target.x, target.y, previousPosition.x, previousPosition.y, x, y) > 18 + targetRadius) return;
          linkHits.add(target);
          this.damageEnemy(target, linkDamage, null, 0x8fe7ff);
        });
        this.spawnExpandingSigil(x, y, 0x8fe7ff, 34, 220);
      }
      if (existing) {
        existing.x = x;
        existing.y = y;
        existing.expiresAt = this.gameplayTime + 3200;
        existing.sequence = ++this.arcNodeSequence;
        return;
      }
      const marker = this.add.image(x, y, "fxRing")
        .setTint(0x8fe7ff)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(6)
        .setAlpha(0.68)
        .setScale(0.42);
      nodes.push({
        enemy,
        x,
        y,
        marker,
        expiresAt: this.gameplayTime + 3200,
        sequence: ++this.arcNodeSequence,
      });
      if (nodes.length > 5) {
        const oldest = nodes.slice().sort((left, right) => left.sequence - right.sequence)[0];
        if (oldest.marker?.active) oldest.marker.destroy();
        this.arcNodes = nodes.filter((node) => node !== oldest);
      }
    }

    releaseArcGlyph(origin, x, y, level) {
      if (level <= 0) return;
      const nodeCap = 2 + level;
      const linkRange = 240 + level * 40;
      const networkDamage = Math.max(1, Math.round(this.stats.damage * (0.65 + level * 0.1)));
      const activeNodes = this.getActiveArcNodes();
      const originNode = activeNodes.find((node) => node.enemy === origin) || {
        enemy: origin,
        x,
        y,
        sequence: Number.POSITIVE_INFINITY,
      };
      const route = [originNode];
      const usedNodes = new Set([originNode]);
      while (route.length < nodeCap) {
        const from = route[route.length - 1];
        const fromPosition = this.getArcNodePosition(from);
        const next = activeNodes
          .filter((node) => !usedNodes.has(node))
          .map((node) => {
            const position = this.getArcNodePosition(node);
            return {
              node,
              distance: Phaser.Math.Distance.Squared(fromPosition.x, fromPosition.y, position.x, position.y),
            };
          })
          .filter((candidate) => candidate.distance <= linkRange * linkRange)
          .sort((left, right) => left.distance - right.distance)[0]?.node;
        if (!next) break;
        route.push(next);
        usedNodes.add(next);
      }

      const networkTargets = new Set();
      route.forEach((node) => {
        if (node.enemy?.active) networkTargets.add(node.enemy);
      });
      const halfWidth = level >= 2 ? 28 : 18;
      for (let index = 1; index < route.length; index += 1) {
        const from = route[index - 1];
        const to = route[index];
        const fromPosition = this.getArcNodePosition(from);
        const toPosition = this.getArcNodePosition(to);
        this.drawLightning(fromPosition.x, fromPosition.y, toPosition.x, toPosition.y);
        this.enemies.getChildren().slice().forEach((enemy) => {
          if (!enemy?.active || networkTargets.has(enemy)) return;
          const enemyRadius = Math.min(30, Math.max(enemy.body?.width || 0, enemy.displayWidth || 0) * 0.32);
          if (this.getDistanceToSegment(enemy.x, enemy.y, fromPosition.x, fromPosition.y, toPosition.x, toPosition.y) <= halfWidth + enemyRadius) {
            networkTargets.add(enemy);
          }
        });
      }
      const activeCombatTargetCount = this.enemies
        .getChildren()
        .filter((enemy) => enemy?.active && enemy.getData("kind") !== "rift").length;
      networkTargets.forEach((enemy) => {
        if (enemy.active) this.damageEnemy(enemy, networkDamage, null, 0x8fe7ff);
      });

      let foldCount = 0;
      if (activeCombatTargetCount === 1 && origin?.active) {
        foldCount = Math.min(4, nodeCap - 1);
        const foldDamage = Math.max(1, Math.round(networkDamage * 0.4 * foldCount));
        this.damageEnemy(origin, foldDamage, null, 0x8fe7ff);
        this.spawnRadialShards(x, y, 0x8fe7ff, 5 + foldCount, 42 + foldCount * 6, 0, 0.38);
      }

      if (level >= 3 && route.length >= 2) {
        const first = route[0];
        const last = route[route.length - 1];
        const firstPosition = this.getArcNodePosition(first);
        const lastPosition = this.getArcNodePosition(last);
        this.drawLightning(lastPosition.x, lastPosition.y, firstPosition.x, firstPosition.y);
        const refluxDamage = Math.max(1, Math.round(networkDamage * 0.6));
        networkTargets.forEach((enemy) => {
          if (enemy.active) this.damageEnemy(enemy, refluxDamage, null, COLORS.ice);
        });
      }
      this.spawnExpandingSigil(x, y, 0x8fe7ff, 78 + level * 12, 390);
      this.announceWeaponTrigger(
        x,
        y - 28,
        foldCount > 0 ? `聚雷折叠 ×${foldCount}` : level >= 3 && route.length >= 2 ? `${route.length}节点闭环` : `${route.length}节点放电`,
      );
      soundscape.play("chain", true);
    }

    getNovaBlastProfile(rawDamage, level = 0) {
      const damage = Math.max(1, Math.round(rawDamage || this.stats.damage || 1));
      const sizeScale = this.getPlayerProjectileSizeScale();
      const pulseCount = level <= 0 ? 0 : level >= 2 ? 3 : 2;
      const pulseRatio = level >= 2 ? 0.6 : 0.55;
      return {
        rawDamage: damage,
        radius: 92 * sizeScale,
        splashDamage: Math.max(1, Math.round(damage * 0.7)),
        coreDamage: Math.max(1, Math.round(damage * 0.9)),
        pulseCount,
        pulseDamage: pulseCount > 0 ? Math.max(1, Math.round(damage * pulseRatio)) : 0,
        pulseRadii: Array.from({ length: pulseCount }, (_value, index) => (120 + index * 40) * sizeScale),
        pulseDelays: Array.from({ length: pulseCount }, (_value, index) => 240 + index * 260),
        pullDistance: level >= 2 ? 14 : 0,
        finalDamage: level >= 3 ? Math.max(1, Math.round(damage * 1.25)) : 0,
        finalRadius: level >= 3 ? 230 * sizeScale : 0,
        finalDelay: level >= 3 ? 1020 : 0,
        cleanupDelay: level >= 3 ? 1440 : pulseCount > 0 ? 240 + (pulseCount - 1) * 260 + 420 : 0,
        sizeScale,
      };
    }

    releaseNovaPulse(x, y, radius, damage, pullDistance = 0, final = false) {
      const targets = this.enemies.getChildren().slice().filter((enemy) => (
        enemy?.active
        && Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= radius
      ));
      targets.forEach((enemy) => {
        const kind = enemy.getData("kind");
        const attackState = enemy.getData("attackState");
        if (
          pullDistance > 0
          && enemy.body
          && kind !== "boss"
          && kind !== "rift"
          && !enemy.body.checkCollision.none
          && attackState !== "charging"
          && attackState !== "vanishing"
          && attackState !== "reappearing"
        ) {
          const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, x, y);
          if (distance > 18) {
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, x, y);
            const displacement = Math.min(pullDistance, distance - 18);
            enemy.setPosition(
              enemy.x + Math.cos(angle) * displacement,
              enemy.y + Math.sin(angle) * displacement,
            );
          }
        }
        if (enemy.active) this.damageEnemy(enemy, damage, null, final ? COLORS.goldHot : 0xffcf62);
      });
      this.spawnExpandingSigil(x, y, final ? COLORS.goldHot : 0xffcf62, radius, final ? 500 : 380, 0, final ? Math.PI / 8 : 0);
      this.spawnRadialShards(x, y, final ? 0xffffff : 0xffe19a, final ? 18 : 10, radius * 0.62, 0, final ? 0.72 : 0.5);
      if (final) {
        this.burstAt(x, y, COLORS.goldHot, 18);
        this.cameras.main.shake(120, 0.005);
        soundscape.play("pulse", true);
      }
      return targets.length;
    }

    releaseNovaRing(origin, x, y, level, rawDamage = this.stats.damage, fullVfx = true) {
      const profile = this.getNovaBlastProfile(rawDamage, level);
      if (fullVfx || level > 0) {
        this.spawnExpandingSigil(x, y, 0xffcf62, profile.radius, level > 0 ? 420 : 350);
        this.spawnExpandingSigil(x, y, COLORS.goldHot, profile.radius * 0.62, 320, 40, Math.PI / 4);
        this.spawnRadialShards(x, y, 0xffcf62, level > 0 ? 12 + level * 2 : 8, profile.radius * 0.56, 0, 0.5);
      } else {
        const lightRing = this.add.image(x, y, "fxRing")
          .setTint(0xffcf62)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(4)
          .setAlpha(0.28)
          .setScale(0.22 * profile.sizeScale);
        this.tweens.add({
          targets: lightRing,
          scale: profile.radius / 23,
          angle: lightRing.angle + 24,
          alpha: 0,
          duration: 260,
          ease: "Cubic.easeOut",
          onComplete: () => lightRing.destroy(),
        });
      }
      if (origin?.active) this.damageEnemy(origin, profile.coreDamage, null, COLORS.goldHot);
      this.enemies.getChildren().slice().forEach((enemy) => {
        if (!enemy?.active || enemy === origin) return;
        if (Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= profile.radius) {
          this.damageEnemy(enemy, profile.splashDamage, null, 0xffcf62);
        }
      });
      if (level <= 0) {
        soundscape.play("ember");
        return profile;
      }

      const core = this.add.image(x, y, "novaBolt")
        .setTint(0xffcf62)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(17)
        .setAlpha(0.92)
        .setScale(0.58 * profile.sizeScale);
      const halo = this.add.image(x, y, "fxRing")
        .setTint(level >= 3 ? 0xffffff : COLORS.goldHot)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(16)
        .setAlpha(0.72)
        .setScale(0.72 * profile.sizeScale);
      this.tweens.add({
        targets: core,
        angle: core.angle + 360,
        scale: 0.86 * profile.sizeScale,
        duration: profile.cleanupDelay,
        ease: "Sine.easeInOut",
      });
      this.tweens.add({
        targets: halo,
        angle: halo.angle - 540,
        scale: 0.36 * profile.sizeScale,
        alpha: 0.28,
        duration: profile.cleanupDelay,
        ease: "Cubic.easeIn",
      });

      profile.pulseDelays.forEach((delay, index) => {
        this.time.delayedCall(delay, () => {
          if (this.ended || (this.sys?.isActive && !this.sys.isActive())) return;
          this.releaseNovaPulse(
            x,
            y,
            profile.pulseRadii[index],
            profile.pulseDamage,
            profile.pullDistance,
            false,
          );
          if (index === 0) soundscape.play("ember", true);
        });
      });
      if (profile.finalDamage > 0) {
        this.time.delayedCall(profile.finalDelay, () => {
          if (this.ended || (this.sys?.isActive && !this.sys.isActive())) return;
          this.releaseNovaPulse(x, y, profile.finalRadius, profile.finalDamage, 0, true);
          this.tweens.killTweensOf(core);
          this.tweens.killTweensOf(halo);
          const fadingTargets = [core, halo].filter((effect) => effect.active);
          if (fadingTargets.length > 0) {
            this.tweens.add({
              targets: fadingTargets,
              alpha: 0,
              duration: 180,
              ease: "Quad.easeOut",
              onComplete: () => fadingTargets.forEach((effect) => {
                if (effect.active) effect.destroy();
              }),
            });
          }
        });
      }
      this.time.delayedCall(profile.cleanupDelay, () => {
        this.tweens.killTweensOf(core);
        this.tweens.killTweensOf(halo);
        if (core.active) core.destroy();
        if (halo.active) halo.destroy();
      });
      this.announceWeaponTrigger(
        x,
        y - 28,
        level >= 3 ? "超新星蓄燃" : `${profile.pulseCount}重日核脉冲`,
      );
      soundscape.play("pulse", true);
      return profile;
    }

    getReturnerRouteTargets(x, y, count, excludedTargets = new Set()) {
      const candidates = this.enemies.getChildren().filter((enemy) => (
        enemy?.active
        && enemy.getData("kind") !== "rift"
        && !excludedTargets.has(enemy)
        && Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= 280
      ));
      return candidates
        .map((enemy) => {
          const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
          const nearby = candidates.reduce((total, other) => (
            total + (Phaser.Math.Distance.Between(enemy.x, enemy.y, other.x, other.y) <= 150 ? 1 : 0)
          ), 0);
          const kind = enemy.getData("kind");
          const priority = kind === "mirrorAcolyte" || kind === "herald" ? 2 : kind === "boss" ? 1 : 0;
          return { enemy, score: priority * 180 + nearby * 96 - distance };
        })
        .sort((left, right) => right.score - left.score)
        .slice(0, Math.max(0, count))
        .map((entry) => entry.enemy);
    }

    beginReturnFlight(bullet) {
      if (!bullet?.active || bullet.getData("returning")) return;
      const outboundHits = new Set(bullet.getData("hitTargets") || []);
      const baseDamage = bullet.getData("damage") || 0;
      bullet.setData("returning", true);
      bullet.setData("target", null);
      bullet.setData("homing", 0);
      bullet.getData("hitTargets")?.clear();
      bullet.setAngularVelocity(780);

      const returnDamageMultiplier = bullet.getData("returnDamageMultiplier") || 1;
      bullet.setData("damage", Math.max(1, Math.round(baseDamage * returnDamageMultiplier)));
      const returnBurstDamage = bullet.getData("returnBurstDamage") || 0;
      const returnBurstRadius = bullet.getData("returnBurstRadius") || 0;
      const secondaryId = bullet.getData("secondaryId");
      if (returnBurstDamage > 0 && returnBurstRadius > 0 && secondaryId) {
        const x = bullet.x;
        const y = bullet.y;
        this.enemies.getChildren().slice().forEach((enemy) => {
          if (enemy?.active && Phaser.Math.Distance.Squared(x, y, enemy.x, enemy.y) <= returnBurstRadius ** 2) {
            this.applySecondaryHit(enemy, returnBurstDamage, secondaryId);
          }
        });
        this.spawnExpandingSigil(x, y, 0xc19cff, returnBurstRadius, 380, 0, Math.PI / 4);
        this.spawnRadialShards(x, y, COLORS.ice, 10, returnBurstRadius * 0.66, Math.PI / 10, 0.46);
        this.recordSecondaryEvent(secondaryId, "special", "far-eclipse-burst");
        soundscape.play("pulse", true);
      }

      const level = bullet.getData("returnPulseLevel") || 0;
      if (level <= 0) return;
      const x = bullet.x;
      const y = bullet.y;
      const echoCount = Math.max(0, level - 1);
      const radius = 72 + level * 15;
      const pulseDamage = 10 + level * 8;
      bullet.setScale(bullet.scaleX * (1.12 + level * 0.05));
      this.spawnExpandingSigil(x, y, 0xc19cff, radius, 420, 0, Math.PI / 4);
      this.spawnExpandingSigil(x, y, COLORS.ice, radius * 0.68, 340, 35);
      this.spawnRadialShards(x, y, 0xc19cff, 7 + level * 2, radius * 0.55, Math.PI / 8, 0.4);
      const targets = [];
      this.enemies.children.iterate((enemy) => {
        if (!enemy?.active) return;
        if (Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= radius) targets.push(enemy);
      });
      targets.forEach((enemy) => this.damageEnemy(enemy, pulseDamage, null));
      const routeTargets = this.getReturnerRouteTargets(x, y, 1 + echoCount, outboundHits);
      const returnWaypoint = routeTargets[0] || null;
      if (returnWaypoint) {
        bullet.setData({
          returnWaypoint,
          returnWaypointUntil: this.gameplayTime + 620,
        });
      }
      const fallbackBaseAngle = Phaser.Math.Angle.Between(x, y, this.player.x, this.player.y - 5) + Math.PI;
      const fallbackOffsets = echoCount === 1 ? [0] : [-0.34, 0.34];
      for (let index = 0; index < echoCount; index += 1) {
        const echoTarget = routeTargets[index + 1] || null;
        const angle = echoTarget?.active
          ? Phaser.Math.Angle.Between(x, y, echoTarget.x, echoTarget.y)
          : fallbackBaseAngle + fallbackOffsets[index];
        const echoDamage = Math.max(1, Math.round(baseDamage * (0.55 + level * 0.07)));
        const echo = this.spawnPlayerBullet(angle, echoTarget, {
          damage: echoDamage,
          pierce: 99,
          homing: echoTarget?.active ? 0.11 : 0,
          life: 1350,
          returnAfter: 360,
          returnPulseLevel: 0,
          returnDamageMultiplier: 1,
          scale: 0.76 + level * 0.05,
          hitScale: 0.9,
          color: 0xece2ff,
          trailRadius: 3,
          fxStyle: "returner",
          projectileKind: "returner-eclipse-echo",
          tintProjectile: true,
        });
        echo.setPosition(x, y);
        echo.setData({ previousX: x, previousY: y });
      }
      this.burstAt(x, y, COLORS.ice, 8 + level * 2);
      this.announceWeaponTrigger(
        x,
        y - 30,
        level >= 2 ? `月蚀轮舞 ${1 + echoCount}路` : `折月回环 ${pulseDamage}`,
      );
      soundscape.play("pulse");
    }

    catchReturner(bullet) {
      if (!bullet?.active) return;
      const color = bullet.getData("color") || 0xc19cff;
      const echo = this.add.image(bullet.x, bullet.y, "returnBolt")
        .setTint(color)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(16)
        .setAlpha(0.72)
        .setScale(Math.max(0.45, bullet.scaleX * 0.7));
      this.tweens.add({
        targets: echo,
        x: this.player.x,
        y: this.player.y - 5,
        scale: 0.16,
        alpha: 0,
        angle: echo.angle + 180,
        duration: 150,
        ease: "Cubic.easeIn",
        onComplete: () => echo.destroy(),
      });
      this.burstAt(this.player.x, this.player.y - 5, color, 3);
      bullet.destroy();
    }

    getSecondaryPersistentFireRateScale() {
      const baseFireRate = Math.max(1, this.weaponProfile?.fireRate || this.stats?.fireRate || 1);
      const persistentFireRate = Math.max(
        1,
        (this.stats?.fireRate || baseFireRate) * (this.relicFireRateMultiplier ?? 1),
      );
      const mainScale = Math.min(1, persistentFireRate / baseFireRate);
      return 1 - (1 - mainScale) * SECONDARY_FIRE_RATE_BONUS_INHERITANCE;
    }

    getSecondaryProjectileSpeed(baseSpeed) {
      if (!Number.isFinite(baseSpeed)) return baseSpeed;
      const basePrimarySpeed = this.weaponProfile?.projectileSpeed || this.stats?.projectileSpeed || 0;
      const inheritedSpeed = Math.max(0, (this.stats?.projectileSpeed || basePrimarySpeed) - basePrimarySpeed);
      return Math.max(1, Math.round(baseSpeed + inheritedSpeed));
    }

    getSecondaryExtraUnitCount() {
      const baseProjectileCount = this.weaponProfile?.projectileCount || this.stats?.projectileCount || 1;
      return Math.max(0, Math.floor((this.stats?.projectileCount || baseProjectileCount) - baseProjectileCount));
    }

    getPlayerProjectileSizeScale() {
      const reachLevels = Math.max(0, (this.stats?.rangeBonus || 0) / REACH_RANGE_PER_LEVEL);
      return 1 + reachLevels * REACH_PROJECTILE_SIZE_PER_LEVEL;
    }

    getCenteredSecondaryOffsets(count, spacing, maxSpan = Number.POSITIVE_INFINITY) {
      const safeCount = Math.max(1, Math.floor(count));
      if (safeCount === 1) return [0];
      const span = Math.min(maxSpan, spacing * (safeCount - 1));
      return Array.from({ length: safeCount }, (_, index) => -span / 2 + (span * index) / (safeCount - 1));
    }

    recordSecondaryUnitCount(secondaryId, totalCount, extraCount = this.getSecondaryExtraUnitCount()) {
      this.secondaryTelemetry.maxExtraSecondaryUnits = Math.max(this.secondaryTelemetry.maxExtraSecondaryUnits, extraCount);
      this.secondaryTelemetry.maxSecondaryUnitCount = Math.max(this.secondaryTelemetry.maxSecondaryUnitCount, totalCount);
      this.recordSecondaryEvent(secondaryId, "special", `units-${totalCount}`);
      const bucket = this.secondaryTelemetry.bySecondary[secondaryId];
      if (bucket) bucket.maxUnits = Math.max(bucket.maxUnits || 0, totalCount);
    }

    resolveSecondaryDamage(baseDamage, secondaryId = null) {
      const normalizedBaseDamage = Math.max(0, Number(baseDamage) || 0);
      if (normalizedBaseDamage <= 0) {
        return {
          damage: 0,
          inheritedDamageBonus: 0,
          extraProjectilePower: 0,
          convertedProjectileCount: 0,
          critical: false,
          surgeActive: false,
        };
      }
      const basePrimaryDamage = this.weaponProfile?.damage || this.stats?.damage || 0;
      const genericDamageBonus = Math.max(0, (this.stats?.damage || basePrimaryDamage) - basePrimaryDamage);
      const inheritedDamageBonus = Math.min(
        Math.round(genericDamageBonus * SECONDARY_DAMAGE_BONUS_INHERITANCE),
        Math.round(normalizedBaseDamage * SECONDARY_INHERITED_DAMAGE_CAP_RATIO),
      );
      const baseProjectileCount = this.weaponProfile?.projectileCount || this.stats?.projectileCount || 1;
      const extraProjectileCount = Math.max(0, (this.stats?.projectileCount || baseProjectileCount) - baseProjectileCount);
      const convertedProjectileCount = extraProjectileCount;
      const extraProjectilePower = 0;
      let damage = Math.round(normalizedBaseDamage + inheritedDamageBonus);
      const criticalChance = Math.max(0, Math.min(1, this.stats?.criticalChance || 0));
      const critical = criticalChance > 0 && Math.random() < criticalChance;
      if (critical) damage = Math.round(damage * SECONDARY_CRITICAL_MULTIPLIER);
      const surgeActive = (this.gameplayTime || 0) < (this.surgeUntil || 0);
      if (surgeActive) damage = Math.round(damage * SECONDARY_SURGE_MULTIPLIER);
      return {
        damage,
        inheritedDamageBonus,
        extraProjectilePower,
        convertedProjectileCount,
        critical,
        surgeActive,
      };
    }

    getSecondaryInterval(profile = this.getSecondaryProfile()) {
      if (!profile) return Number.POSITIVE_INFINITY;
      const catalogReduction = profile.upgrades.reduce((total, upgrade) => (
        total + (this.secondaryUpgradeIds.has(upgrade.id) ? upgrade.intervalReduction || 0 : 0)
      ), 0);
      const legacyReduction = profile.id === "fire-bottle" && this.secondaryUpgradeIds.has("fire-bottle-glaze")
        ? 450
        : profile.id === "shadow-darts" && this.secondaryUpgradeIds.has("shadow-darts-resonance") ? 250 : 0;
      const baseInterval = profile.interval - catalogReduction - legacyReduction;
      if (!Number.isFinite(baseInterval)) return Number.POSITIVE_INFINITY;
      return Math.max(
        SECONDARY_MIN_INTERVAL,
        Math.round(baseInterval * this.getSecondaryPersistentFireRateScale()),
      );
    }

    getSecondaryTargets(excluded = null) {
      return this.enemies.getChildren()
        .filter((enemy) => enemy?.active && enemy !== excluded && enemy.getData("kind") !== "rift")
        .sort((left, right) => (
          Phaser.Math.Distance.Squared(this.player.x, this.player.y, left.x, left.y)
          - Phaser.Math.Distance.Squared(this.player.x, this.player.y, right.x, right.y)
        ));
    }

    getDenseSecondaryTarget() {
      const targets = this.getSecondaryTargets();
      let best = targets[0] || null;
      let bestScore = -1;
      targets.forEach((candidate) => {
        const nearby = targets.reduce((score, target) => (
          score + (Phaser.Math.Distance.Squared(candidate.x, candidate.y, target.x, target.y) <= 150 * 150 ? 1 : 0)
        ), 0);
        const distancePenalty = Phaser.Math.Distance.Between(this.player.x, this.player.y, candidate.x, candidate.y) / 900;
        const score = nearby - distancePenalty;
        if (score > bestScore) {
          bestScore = score;
          best = candidate;
        }
      });
      return best;
    }

    getDenseSecondaryTargets(count = 1, radius = 150, separation = radius) {
      const targets = this.getSecondaryTargets();
      const scored = targets.map((candidate) => {
        const nearby = targets.reduce((score, target) => (
          score + (Phaser.Math.Distance.Squared(candidate.x, candidate.y, target.x, target.y) <= radius * radius ? 1 : 0)
        ), 0);
        const distancePenalty = Phaser.Math.Distance.Between(this.player.x, this.player.y, candidate.x, candidate.y) / 900;
        return { target: candidate, score: nearby - distancePenalty };
      }).sort((left, right) => right.score - left.score);
      const selected = [];
      scored.forEach((entry) => {
        if (selected.length >= count) return;
        const separated = selected.every((target) => (
          Phaser.Math.Distance.Squared(target.x, target.y, entry.target.x, entry.target.y) >= separation * separation
        ));
        if (separated) selected.push(entry.target);
      });
      scored.forEach((entry) => {
        if (selected.length < count && !selected.includes(entry.target)) selected.push(entry.target);
      });
      return selected;
    }

    spawnStarBlinkSlashVfx(point, angle, secondary, radius, echo = false) {
      const visualScale = radius / 76;
      const blade = this.add.image(point.x, point.y, "scatterBlade")
        .setTint(echo ? 0xffb3a3 : 0xfff3ef)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(18)
        .setRotation(angle)
        .setAlpha(echo ? 0.72 : 0.9)
        .setScale(0.62 * visualScale, 0.82 * visualScale);
      const slash = this.add.image(point.x, point.y, "fxSlash")
        .setTint(echo ? secondary.colorValue : 0xffffff)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(19)
        .setRotation(angle + (echo ? -0.56 : 0.56))
        .setAlpha(echo ? 0.64 : 0.88)
        .setScale(0.36 * visualScale, 0.5 * visualScale);
      this.tweens.add({
        targets: blade,
        scaleX: 1.22 * visualScale,
        scaleY: 1.08 * visualScale,
        alpha: 0,
        duration: echo ? 205 : 220,
        ease: "Cubic.easeOut",
        onComplete: () => blade.destroy(),
      });
      this.tweens.add({
        targets: slash,
        scaleX: 1.7 * visualScale,
        scaleY: 0.78 * visualScale,
        alpha: 0,
        duration: echo ? 190 : 210,
        ease: "Cubic.easeOut",
        onComplete: () => slash.destroy(),
      });
    }

    applyStarBlinkSlashUnit(secondary, point, damage, radius, phaseHitTargets, maxHits, preferredExclusions = null, echo = false) {
      const candidates = this.enemies.getChildren()
        .filter((enemy) => (
          enemy?.active
          && enemy.getData("kind") !== "rift"
          && !phaseHitTargets.has(enemy)
          && Phaser.Math.Distance.Squared(point.x, point.y, enemy.x, enemy.y) <= radius * radius
        ))
        .sort((left, right) => {
          const leftPreferred = preferredExclusions?.has(left) ? 1 : 0;
          const rightPreferred = preferredExclusions?.has(right) ? 1 : 0;
          if (leftPreferred !== rightPreferred) return leftPreferred - rightPreferred;
          return Phaser.Math.Distance.Squared(point.x, point.y, left.x, left.y)
            - Phaser.Math.Distance.Squared(point.x, point.y, right.x, right.y);
        })
        .slice(0, maxHits);
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, point.x, point.y);
      this.spawnStarBlinkSlashVfx(point, angle, secondary, radius, echo);
      candidates.forEach((enemy) => {
        phaseHitTargets.add(enemy);
        this.applySecondaryHit(enemy, damage, secondary.id);
      });
      return candidates.length;
    }

    recordSecondaryProjectile(secondary, projectileKind, fxStyle, audioCue) {
      this.secondaryTelemetry.spawned += 1;
      this.secondaryTelemetry.projectileKinds.add(projectileKind);
      this.secondaryTelemetry.fxStyles.add(fxStyle);
      this.secondaryTelemetry.audioCues.add(audioCue);
      this.recordSecondaryEvent(secondary.id, "spawned");
      soundscape.play(audioCue);
    }

    recordSecondaryEvent(secondaryId, event, value = 1) {
      if (!secondaryId) return;
      const bucket = this.secondaryTelemetry.bySecondary[secondaryId] || {
        shots: 0,
        spawned: 0,
        hits: 0,
        damage: 0,
        specials: {},
      };
      if (event === "special") {
        const special = String(value);
        bucket.specials[special] = (bucket.specials[special] || 0) + 1;
        this.secondaryTelemetry.specialTriggers.add(`${secondaryId}:${special}`);
      } else {
        bucket[event] = (bucket[event] || 0) + value;
      }
      this.secondaryTelemetry.bySecondary[secondaryId] = bucket;
    }

    spawnSecondaryShot(secondary, target, angle, options) {
      const projectileKind = options.projectileKind || secondary.id;
      const fxStyle = options.fxStyle || `secondary-${secondary.weaponOnly}`;
      const audioCue = options.audioCue || "secondaryDart";
      const bullet = this.spawnPlayerBullet(angle, target, {
        ...options,
        speed: this.getSecondaryProjectileSpeed(options.speed),
        color: options.color ?? secondary.colorValue,
        fxStyle,
        source: "secondary",
        secondaryId: secondary.id,
        projectileKind,
      });
      this.recordSecondaryProjectile(secondary, projectileKind, fxStyle, audioCue);
      return bullet;
    }

    getSwordWaveEdgeTravel(angle, baseSpeed = 360) {
      const directionX = Math.cos(angle);
      const directionY = Math.sin(angle);
      const originX = this.player.x;
      const originY = this.player.y - 5;
      const edgeDistanceX = directionX > 0.000001
        ? (this.scale.width - originX) / directionX
        : directionX < -0.000001 ? originX / -directionX : Number.POSITIVE_INFINITY;
      const edgeDistanceY = directionY > 0.000001
        ? (this.scale.height - originY) / directionY
        : directionY < -0.000001 ? originY / -directionY : Number.POSITIVE_INFINITY;
      const edgeDistance = Math.max(0, Math.min(edgeDistanceX, edgeDistanceY));
      const speed = this.getSecondaryProjectileSpeed(baseSpeed);
      const life = Math.max(1250, Math.ceil((edgeDistance / speed) * 1000) + 80);
      return { edgeDistance, speed, life };
    }

    getHighestHealthSecondaryTarget() {
      return this.getSecondaryTargets().sort((left, right) => (
        (right.getData("hp") || 0) + (right.getData("armor") || 0)
        - (left.getData("hp") || 0) - (left.getData("armor") || 0)
      ))[0] || null;
    }

    getFarthestSecondaryTargets() {
      return this.getSecondaryTargets().sort((left, right) => {
        const leftKind = left.getData("kind");
        const rightKind = right.getData("kind");
        const leftThreat = leftKind === "boss" || enemyCatalog[leftKind]?.elite ? 1 : 0;
        const rightThreat = rightKind === "boss" || enemyCatalog[rightKind]?.elite ? 1 : 0;
        if (leftThreat !== rightThreat) return rightThreat - leftThreat;
        return Phaser.Math.Distance.Squared(this.player.x, this.player.y, right.x, right.y)
          - Phaser.Math.Distance.Squared(this.player.x, this.player.y, left.x, left.y);
      });
    }

    queueArrayLanceVolley(time, secondary) {
      if (this.arrayLanceVolleyReady || this.getSecondaryTargets().length === 0) return false;
      if (!this.secondaryLastShotAt) this.secondaryLastShotAt = new Map();
      this.secondaryLastShotAt.set(secondary.id, time);
      this.arrayLanceVolleyReady = true;
      this.recordSecondaryEvent(secondary.id, "special", "tri-lance-ready");
      return true;
    }

    getArrayLanceVolleyTargets(mainTarget, baseAngle, desiredCount = 2) {
      const candidates = this.getSecondaryTargets()
        .filter((enemy) => enemy !== mainTarget)
        .map((enemy) => ({
          enemy,
          angleDelta: Phaser.Math.Angle.Wrap(
            Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y) - baseAngle,
          ),
          distance: Phaser.Math.Distance.Squared(this.player.x, this.player.y, enemy.x, enemy.y),
        }));
      const byDistance = (left, right) => left.distance - right.distance;
      const chosen = [];
      const addCandidate = (candidate) => {
        if (candidate && !chosen.some((entry) => entry.enemy === candidate.enemy)) chosen.push(candidate);
      };
      addCandidate(candidates.filter((candidate) => candidate.angleDelta >= 0.16).sort(byDistance)[0]);
      addCandidate(candidates.filter((candidate) => candidate.angleDelta <= -0.16).sort(byDistance)[0]);
      candidates
        .slice()
        .sort((left, right) => Math.abs(right.angleDelta) - Math.abs(left.angleDelta) || byDistance(left, right))
        .forEach((candidate) => {
          if (chosen.length < desiredCount) addCandidate(candidate);
        });
      const targets = chosen.slice(0, desiredCount).map((candidate) => candidate.enemy);
      while (targets.length < desiredCount && mainTarget?.active) targets.push(mainTarget);
      return targets;
    }

    fireArrayLanceThrust(secondary, target, baseAngle, lateral, damage, pierce) {
      const perpendicular = baseAngle + Math.PI / 2;
      const originOffsetX = Math.cos(perpendicular) * lateral;
      const originOffsetY = Math.sin(perpendicular) * lateral;
      const originX = this.player.x + originOffsetX;
      const originY = this.player.y - 5 + originOffsetY;
      const angle = Phaser.Math.Angle.Between(originX, originY, target.x, target.y);
      const directionX = Math.cos(angle);
      const directionY = Math.sin(angle);
      const range = this.getPrimaryAttackRange(this.weaponProfile);
      const halfWidth = 24 * this.getPlayerProjectileSizeScale();
      const candidates = this.enemies.getChildren()
        .filter((enemy) => enemy?.active)
        .map((enemy) => {
          const offsetX = enemy.x - originX;
          const offsetY = enemy.y - originY;
          const projection = offsetX * directionX + offsetY * directionY;
          const lineDistance = Math.abs(offsetX * directionY - offsetY * directionX);
          const enemyRadius = Math.min(36, Math.max(enemy.body?.width || 0, enemy.displayWidth || 0) * 0.34);
          return { enemy, projection, lineDistance, enemyRadius };
        })
        .filter((candidate) => (
          candidate.projection >= -candidate.enemyRadius
          && candidate.projection <= range + candidate.enemyRadius
          && candidate.lineDistance <= halfWidth + candidate.enemyRadius
        ))
        .sort((left, right) => left.projection - right.projection)
        .slice(0, pierce + 1);
      candidates.forEach((candidate) => {
        this.spawnProjectileImpact(candidate.enemy.x, candidate.enemy.y, secondary.colorValue, "lance", angle);
        this.applySecondaryHit(candidate.enemy, damage, secondary.id);
      });
      this.spawnLanceThrustVfx(angle, range, 1, false, originOffsetX, originOffsetY, secondary.colorValue);
      this.cutEnemyProjectilesInMeleeArea({
        mode: "line",
        originX,
        originY,
        angle,
        range,
        halfWidth,
        color: secondary.colorValue,
        secondaryId: secondary.id,
      });
      this.recordSecondaryProjectile(secondary, "instant-floating-lance-thrust", "secondary-lance-thrust", "lanceThrust");
      this.recordSecondaryEvent(secondary.id, "special", `floating-thrust-hits-${candidates.length}`);
      return candidates.length;
    }

    releaseArrayLanceVolley(time, mainTarget, baseAngle) {
      const secondary = this.getSecondaryProfile("array-lances");
      if (!this.arrayLanceVolleyReady || !secondary || !this.hasSecondaryWeapon(secondary.id) || !mainTarget?.active) return false;
      this.arrayLanceVolleyReady = false;
      const extraUnitCount = this.getSecondaryExtraUnitCount();
      const floatingLanceCount = 2 + extraUnitCount;
      const targets = this.getArrayLanceVolleyTargets(mainTarget, baseAngle, floatingLanceCount);
      if (targets.length === 0) return false;
      const empowered = this.secondaryUpgradeIds.has("array-lances-needle");
      const damage = empowered ? 44 : 34;
      const pierce = empowered ? 6 : 4;
      this.lastSecondaryShotAt = time;
      this.secondaryTelemetry.shots += 1;
      this.recordSecondaryEvent(secondary.id, "shots");
      targets.forEach((target, index) => {
        const lateral = (index % 2 === 0 ? -1 : 1) * 24 * (Math.floor(index / 2) + 1);
        this.fireArrayLanceThrust(secondary, target, baseAngle, lateral, damage, pierce);
      });
      this.recordSecondaryUnitCount(secondary.id, floatingLanceCount, extraUnitCount);
      const distinctTargets = new Set([mainTarget, ...targets]).size;
      this.secondaryTelemetry.maxArrayLanceDistinctTargets = Math.max(
        this.secondaryTelemetry.maxArrayLanceDistinctTargets,
        distinctTargets,
      );
      if (distinctTargets >= 3) {
        this.secondaryTelemetry.arrayLanceDistinctTargetVolleys += 1;
        this.recordSecondaryEvent(secondary.id, "special", "three-way-lock");
      }
      this.recordSecondaryEvent(secondary.id, "special", `${floatingLanceCount}-floating-lances`);
      return true;
    }

    addSecondaryEffect(secondary, effect) {
      this.secondaryEffects.push({ ...effect, secondaryId: secondary.id });
      this.recordSecondaryEvent(secondary.id, "special", effect.type);
    }

    getDistanceToSegment(x, y, x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const lengthSquared = dx * dx + dy * dy;
      if (lengthSquared <= 0.001) return Phaser.Math.Distance.Between(x, y, x1, y1);
      const progress = Phaser.Math.Clamp(((x - x1) * dx + (y - y1) * dy) / lengthSquared, 0, 1);
      return Phaser.Math.Distance.Between(x, y, x1 + progress * dx, y1 + progress * dy);
    }

    spawnSkyLaserEffect(secondary, target, time, angleOffset = 0, emitChargeMotes = true) {
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y) + angleOffset;
      const length = Math.max(this.scale.width, this.scale.height) * 1.65;
      const warning = this.add.graphics().setDepth(18).setBlendMode(Phaser.BlendModes.ADD);
      const beam = this.add.graphics().setDepth(20).setBlendMode(Phaser.BlendModes.ADD).setVisible(false);
      const muzzle = this.add.image(this.player.x, this.player.y - 5, "fxRing")
        .setTint(secondary.colorValue).setDepth(19).setBlendMode(Phaser.BlendModes.ADD).setScale(0.72).setAlpha(0.9);
      const head = this.add.image(this.player.x, this.player.y - 5, "fxStar")
        .setTint(0xffffff).setDepth(21).setBlendMode(Phaser.BlendModes.ADD).setScale(0.72).setVisible(false);
      const chargeCore = this.add.image(this.player.x, this.player.y - 5, "fxGlow")
        .setTint(0xffffff).setDepth(21).setBlendMode(Phaser.BlendModes.ADD).setScale(0.24).setAlpha(0.34);
      const chargeRingOuter = this.add.image(this.player.x, this.player.y - 5, "fxRing")
        .setTint(secondary.colorValue).setDepth(19).setBlendMode(Phaser.BlendModes.ADD).setScale(1.34).setAlpha(0.42);
      const chargeRingInner = this.add.image(this.player.x, this.player.y - 5, "fxRing")
        .setTint(0xffffff).setDepth(20).setBlendMode(Phaser.BlendModes.ADD).setScale(0.88).setAlpha(0.58);
      const focused = this.secondaryUpgradeIds.has("sky-laser-focus");
      const accelerated = this.secondaryUpgradeIds.has("sky-laser-capacitor");
      const sizeScale = this.getPlayerProjectileSizeScale();
      this.addSecondaryEffect(secondary, {
        type: "laser",
        target,
        angle,
        trackingAngleOffset: angleOffset,
        length,
        originX: this.player.x,
        originY: this.player.y - 5,
        width: (focused ? 34 : 24) * sizeScale,
        damage: focused ? 128 : 96,
        startedAt: time,
        releaseAt: time + (accelerated ? 420 : 620),
        advanceDuration: accelerated ? 230 : 320,
        expiresAt: time + (accelerated ? 790 : 1080),
        released: false,
        travelComplete: false,
        lastAdvance: 0,
        nextChargeMoteAt: time,
        emitChargeMotes,
        hitTargets: new Set(),
        trajectoryLine: true,
        warning,
        beam,
        muzzle,
        head,
        chargeCore,
        chargeRingOuter,
        chargeRingInner,
        objects: [warning, beam, muzzle, head, chargeCore, chargeRingOuter, chargeRingInner],
      });
      this.recordSecondaryProjectile(secondary, "player-origin-advancing-laser", "secondary-laser", "warning");
      this.recordSecondaryEvent(secondary.id, "special", "laser-warning");
    }

    fireSecondaryWeapon(time, secondaryId = this.secondaryWeaponId) {
      const secondary = this.getSecondaryProfile(secondaryId);
      if (!secondary || this.ended || this.pausedByUser || this.isChoosing) return false;
      if (secondary.id === "array-lances") return this.queueArrayLanceVolley(time, secondary);
      let denseTarget;
      if (secondary.id === "ember-bellows") {
        const activationRange = 310 * this.getPlayerProjectileSizeScale();
        denseTarget = this.getSecondaryTargets().find((enemy) => (
          Phaser.Math.Distance.Squared(this.player.x, this.player.y, enemy.x, enemy.y) <= activationRange * activationRange
        )) || null;
        if (!denseTarget) {
          if (!this.secondaryLastShotAt) this.secondaryLastShotAt = new Map();
          this.secondaryLastShotAt.set(secondary.id, time - this.getSecondaryInterval(secondary) + 200);
          return false;
        }
      } else denseTarget = this.getDenseSecondaryTarget();
      if (!denseTarget) return false;
      if (!this.secondaryLastShotAt) this.secondaryLastShotAt = new Map();
      this.secondaryLastShotAt.set(secondary.id, time);
      this.lastSecondaryShotAt = time;
      this.secondaryTelemetry.shots += 1;
      this.recordSecondaryEvent(secondary.id, "shots");
      const secondaryExtraUnitCount = this.getSecondaryExtraUnitCount();
      const secondarySizeScale = this.getPlayerProjectileSizeScale();

      if (secondary.id === "fire-bottle") {
        const bottleCount = 1 + secondaryExtraUnitCount;
        const targets = this.getSecondaryTargets();
        const fallbackOffsets = this.getCenteredSecondaryOffsets(bottleCount, 0.16, 0.64);
        for (let index = 0; index < bottleCount; index += 1) {
          const target = targets[index] || denseTarget;
          const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y)
            + (targets[index] ? 0 : fallbackOffsets[index]);
          const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, target.x, target.y);
          const speed = this.getSecondaryProjectileSpeed(330);
          const bullet = this.spawnPlayerBullet(angle, target, {
            texture: "secondaryBottle",
            damage: 0,
            pierce: 0,
            life: Math.max(900, (distance / speed) * 1000 + 260),
            speed,
            homing: 0.025,
            scale: 0.92,
            hitWidth: 20,
            hitHeight: 20,
            color: secondary.colorValue,
            trailRadius: 4,
            fxStyle: "secondary-bottle",
            source: "secondary",
            secondaryId: secondary.id,
            projectileKind: "lobbed-bottle",
            secondaryBehavior: "fire-bottle",
            secondaryArrivalAt: time + Math.max(520, (distance / speed) * 1000),
            glow: true,
          });
          bullet.setAngularVelocity(620);
          this.recordSecondaryProjectile(secondary, "lobbed-bottle", "secondary-bottle", "secondaryBottle");
        }
        this.recordSecondaryUnitCount(secondary.id, bottleCount, secondaryExtraUnitCount);
      } else if (secondary.id === "shadow-darts") {
        const candidates = this.getSecondaryTargets(this.lastMainTarget);
        const fallback = this.getSecondaryTargets();
        const damage = this.secondaryUpgradeIds.has("shadow-darts-fletching") ? 29 : 26;
        const dartCount = 2 + secondaryExtraUnitCount;
        const angleOffsets = this.getCenteredSecondaryOffsets(dartCount, 0.24, 0.92);
        for (let index = 0; index < dartCount; index += 1) {
          const target = candidates[index % Math.max(1, candidates.length)] || fallback[index % Math.max(1, fallback.length)] || denseTarget;
          const baseAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y);
          const offset = angleOffsets[index];
          this.spawnPlayerBullet(baseAngle + offset, target, {
            texture: "secondaryDart",
            damage,
            pierce: 0,
            life: 1500,
            speed: this.getSecondaryProjectileSpeed(475),
            homing: this.secondaryUpgradeIds.has("shadow-darts-fletching") ? 0.19 : 0.15,
            scale: 0.9,
            hitWidth: 28,
            hitHeight: 10,
            color: secondary.colorValue,
            trailRadius: 3,
            fxStyle: "secondary-dart",
            source: "secondary",
            secondaryId: secondary.id,
            projectileKind: "curved-homing-dart",
            secondaryCurveRate: index === 0 ? -0.00034 : 0.00034,
            glow: true,
          });
          this.recordSecondaryProjectile(secondary, "curved-homing-dart", "secondary-dart", "secondaryDart");
        }
        this.recordSecondaryUnitCount(secondary.id, dartCount, secondaryExtraUnitCount);
      } else if (secondary.id === "eclipse-core") {
        const coreCount = 1 + secondaryExtraUnitCount;
        const targets = this.getSecondaryTargets();
        const fallbackOffsets = this.getCenteredSecondaryOffsets(coreCount, 0.14, 0.56);
        for (let index = 0; index < coreCount; index += 1) {
          const target = targets[index] || denseTarget;
          const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y)
            + (targets[index] ? 0 : fallbackOffsets[index]);
          const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, target.x, target.y);
          const speed = this.getSecondaryProjectileSpeed(260);
          const bullet = this.spawnPlayerBullet(angle, target, {
            texture: "secondaryCore",
            damage: 0,
            pierce: 0,
            life: Math.max(1100, (distance / speed) * 1000 + 320),
            speed,
            homing: 0.035,
            scale: 0.92,
            hitWidth: 24,
            hitHeight: 24,
            color: secondary.colorValue,
            trailRadius: 5,
            fxStyle: "secondary-core",
            source: "secondary",
            secondaryId: secondary.id,
            projectileKind: "black-hole-core",
            secondaryBehavior: "eclipse-core",
            secondaryArrivalAt: time + Math.max(620, (distance / speed) * 1000),
            glow: true,
          });
          bullet.setAngularVelocity(-210);
          this.recordSecondaryProjectile(secondary, "black-hole-core", "secondary-core", "secondaryCore");
        }
        this.recordSecondaryUnitCount(secondary.id, coreCount, secondaryExtraUnitCount);
      } else if (secondary.id === "dash-blades") {
        const empowered = this.secondaryUpgradeIds.has("dash-blades-edge");
        const hasEcho = this.secondaryUpgradeIds.has("dash-blades-echo");
        const extraUnitCount = Math.min(4, secondaryExtraUnitCount);
        const unitCount = 2 + extraUnitCount;
        const damage = empowered ? 58 : 42;
        const radius = (empowered ? 96 : 76) * secondarySizeScale;
        const denseTargets = this.getDenseSecondaryTargets(unitCount, radius * 1.6, radius * 0.85);
        const capturedPoints = Array.from({ length: unitCount }, (_value, index) => {
          const anchor = denseTargets[index] || denseTargets[index % denseTargets.length] || denseTarget;
          const repeatsAnchor = index >= denseTargets.length;
          const offsetAngle = index * 2.399963229728653;
          const offsetDistance = repeatsAnchor ? radius * 0.42 : 0;
          return {
            x: Phaser.Math.Clamp(anchor.x + Math.cos(offsetAngle) * offsetDistance, 24, this.scale.width - 24),
            y: Phaser.Math.Clamp(anchor.y + Math.sin(offsetAngle) * offsetDistance, this.getPlayableTop(), this.getPlayableBottom()),
          };
        });
        const primaryHitTargets = new Set();
        capturedPoints.forEach((point) => {
          this.applyStarBlinkSlashUnit(secondary, point, damage, radius, primaryHitTargets, 2);
        });
        this.secondaryTelemetry.spawned += unitCount;
        this.secondaryTelemetry.projectileKinds.add("automatic-star-blink-slash");
        this.secondaryTelemetry.fxStyles.add("secondary-star-blink");
        this.secondaryTelemetry.audioCues.add("scatterSlash");
        this.recordSecondaryEvent(secondary.id, "spawned", unitCount);
        this.recordSecondaryUnitCount(secondary.id, unitCount, extraUnitCount);
        this.recordSecondaryEvent(secondary.id, "special", "automatic-star-blink-slash");
        soundscape.play("scatterSlash");
        if (hasEcho) {
          this.time.delayedCall(240, () => {
            if (
              this.ended
              || this.pausedByUser
              || this.isChoosing
              || !this.player?.active
              || !this.hasSecondaryWeapon(secondary.id)
            ) return;
            const echoHitTargets = new Set();
            capturedPoints.forEach((point) => {
              this.applyStarBlinkSlashUnit(secondary, point, 30, radius, echoHitTargets, 1, primaryHitTargets, true);
            });
            this.recordSecondaryEvent(secondary.id, "special", "automatic-star-blink-echo");
            soundscape.play("secondaryDart", true);
          });
        }
      } else if (secondary.id === "star-mine") {
        const baseAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, denseTarget.x, denseTarget.y);
        const expanded = this.secondaryUpgradeIds.has("star-mine-cluster");
        const baseWaveCount = expanded ? 4 : 2;
        const waveCount = baseWaveCount + secondaryExtraUnitCount;
        const angleOffsets = secondaryExtraUnitCount === 0
          ? (expanded ? [-0.34, -0.11, 0.11, 0.34] : [-0.16, 0.16])
          : this.getCenteredSecondaryOffsets(waveCount, 0.22, 1.1);
        const projectileCutVolleyTargets = new Set();
        const launchScale = Math.min(1.35, secondarySizeScale);
        const launchGate = this.add.image(this.player.x, this.player.y - 5, "scatterRingBlade")
          .setTint(0xff9a78)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(8)
          .setRotation(baseAngle + Math.PI / 4)
          .setAlpha(0.72)
          .setScale(0.16 * launchScale, 0.1 * launchScale);
        this.tweens.add({
          targets: launchGate,
          scaleX: 0.48 * launchScale,
          scaleY: 0.28 * launchScale,
          rotation: launchGate.rotation + 0.32,
          alpha: 0,
          duration: 220,
          ease: "Cubic.easeOut",
          onComplete: () => launchGate.destroy(),
        });
        angleOffsets.forEach((angleOffset) => {
          const swordWaveAngle = baseAngle + angleOffset;
          const swordWaveTravel = this.getSwordWaveEdgeTravel(swordWaveAngle, 360);
          const swordWave = this.spawnSecondaryShot(secondary, denseTarget, swordWaveAngle, {
            texture: "starSwordWave",
            damage: 25,
            pierce: 6,
            life: swordWaveTravel.life,
            speed: 360,
            homing: 0,
            scale: 0.58,
            hitWidth: 104,
            hitHeight: 104,
            trailRadius: 4,
            projectileCutChance: SWORD_WAVE_PROJECTILE_CUT_CHANCE,
            projectileCutVolleyTargets,
            projectileKind: "persistent-crescent-sword-wave",
            fxStyle: "secondary-star-sword-wave",
            audioCue: "scatterSlash",
          });
          swordWave.setData({
            swordWaveOriginX: this.player.x,
            swordWaveOriginY: this.player.y - 5,
            swordWaveEdgeDistance: swordWaveTravel.edgeDistance,
            swordWaveBaseLife: swordWaveTravel.life,
          });
        });
        this.recordSecondaryUnitCount(secondary.id, waveCount, secondaryExtraUnitCount);
        this.recordSecondaryEvent(secondary.id, "special", "persistent-sword-array-volley");
      } else if (secondary.id === "ember-bellows") {
        const baseAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, denseTarget.x, denseTarget.y);
        const widened = this.secondaryUpgradeIds.has("ember-bellows-wide");
        const pressured = this.secondaryUpgradeIds.has("ember-bellows-pressure");
        const range = (widened ? 300 : 270) * secondarySizeScale;
        const fanAngle = widened ? 1.72 : 1.42;
        const damage = pressured ? 38 : 30;
        const originX = this.player.x;
        const originY = this.player.y;
        const fanCount = 1 + secondaryExtraUnitCount;
        const fanOffsets = this.getCenteredSecondaryOffsets(fanCount, 0.32, 1.12);
        fanOffsets.forEach((fanOffset, fanIndex) => {
          const fanDirection = baseAngle + fanOffset;
          this.enemies.getChildren().slice().forEach((enemy) => {
            if (!enemy?.active || enemy.getData("kind") === "rift") return;
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            const enemyRadius = Math.min(32, Math.max(enemy.body?.width || 0, enemy.displayWidth || 0) * 0.32);
            if (distance > range + enemyRadius) return;
            const enemyAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            const angleDelta = Math.abs(Phaser.Math.Angle.Wrap(enemyAngle - fanDirection));
            const angularAllowance = Math.asin(Math.min(1, enemyRadius / Math.max(1, distance)));
            if (angleDelta > fanAngle / 2 + angularAllowance) return;
            this.spawnProjectileImpact(enemy.x, enemy.y, secondary.colorValue, "secondary-blade", enemyAngle);
            this.applySecondaryHit(enemy, damage, secondary.id);
          });
          [-0.14, 0, 0.14].forEach((offset, index) => {
            this.spawnScatterBladeArc(originX, originY, fanDirection + offset, range * (0.86 + index * 0.07), {
              alpha: 0.76 + index * 0.08,
              delay: fanIndex * 28 + index * 42,
              duration: 150 + index * 14,
              fanScale: fanAngle / 1.42,
              rotationLead: 0.24,
              rotationFollow: 0.1,
              startScale: 0.72,
            });
          });
          this.recordSecondaryProjectile(secondary, "folding-fan-triple-slash", "secondary-blade-fan", "scatterSlash");
        });
        this.recordSecondaryUnitCount(secondary.id, fanCount, secondaryExtraUnitCount);
        this.recordSecondaryEvent(secondary.id, "special", "folding-fan-slash");
        this.cameras.main.shake(58, (this.usesCompactControls() ? 0.0011 : 0.0016));
      } else if (secondary.id === "shadow-stake") {
        const doubled = this.secondaryUpgradeIds.has("shadow-stake-anchor");
        const empowered = this.secondaryUpgradeIds.has("shadow-stake-sunder");
        const radius = (empowered ? 244 : 208) * secondarySizeScale;
        const duration = 820;
        const baseAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, denseTarget.x, denseTarget.y);
        const lanceCount = 1 + (doubled ? 1 : 0) + secondaryExtraUnitCount;
        const angleOffsets = Array.from({ length: lanceCount }, (_, index) => (Math.PI * 2 * index) / lanceCount);
        const lances = angleOffsets.map((angleOffset, index) => this.add.image(this.player.x, this.player.y - 5, "lanceThrust")
          .setOrigin(0.04, 0.5)
          .setTint(index === 0 ? 0xeafffb : secondary.colorValue)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(18)
          .setRotation(baseAngle + angleOffset)
          .setAlpha(0.94)
          .setScale(radius / 192, empowered ? 1.22 : 1.04));
        const ring = this.add.image(this.player.x, this.player.y - 5, "fxRing")
          .setTint(secondary.colorValue).setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(17).setAlpha(0.72).setScale(radius / 150);
        this.addSecondaryEffect(secondary, {
          type: "dragon-lance-sweep",
          baseAngle,
          angleOffsets,
          radius,
          halfWidth: (empowered ? 32 : 27) * secondarySizeScale,
          damage: empowered ? 74 : 46,
          startedAt: time,
          duration,
          expiresAt: time + duration,
          sweepAngle: 0,
          lanceHitTargets: angleOffsets.map(() => new Set()),
          projectileCutAttempts: angleOffsets.map(() => new Set()),
          enemyHitCounts: new Map(),
          completed: false,
          lances,
          ring,
          objects: lances,
        });
        this.recordSecondaryUnitCount(secondary.id, lanceCount, secondaryExtraUnitCount);
        this.secondaryTelemetry.maxDragonLanceCount = Math.max(this.secondaryTelemetry.maxDragonLanceCount, lanceCount);
        this.recordSecondaryProjectile(secondary, `${lanceCount}-dragon-lance-sweep`, "secondary-lance", "lanceHeavy");
        this.recordSecondaryEvent(secondary.id, "special", `dragon-sweep-${lanceCount}`);
        this.cameras.main.shake(72, this.usesCompactControls() ? 0.0014 : 0.0021);
      } else if (secondary.id === "sky-laser") {
        const beamCount = 1 + secondaryExtraUnitCount;
        const targets = this.getSecondaryTargets();
        const fallbackOffsets = this.getCenteredSecondaryOffsets(beamCount, 0.14, 0.56);
        for (let index = 0; index < beamCount; index += 1) {
          const target = targets[index] || denseTarget;
          this.spawnSkyLaserEffect(secondary, target, time, targets[index] ? 0 : fallbackOffsets[index], index === 0);
        }
        this.recordSecondaryUnitCount(secondary.id, beamCount, secondaryExtraUnitCount);
      } else if (secondary.id === "moon-orbit") {
        const count = (this.secondaryUpgradeIds.has("moon-orbit-twin") ? 2 : 1) + secondaryExtraUnitCount;
        const empowered = this.secondaryUpgradeIds.has("moon-orbit-edge");
        const blades = Array.from({ length: count }, () => this.add.image(this.player.x, this.player.y, "returnBolt")
          .setTint(secondary.colorValue).setScale(0.86 * secondarySizeScale).setDepth(15).setBlendMode(Phaser.BlendModes.ADD));
        this.addSecondaryEffect(secondary, {
          type: "moon-orbit",
          startedAt: time,
          activeUntil: time + (empowered ? 5200 : 4900),
          expiresAt: time + (empowered ? 5520 : 5220),
          radius: 88 * secondarySizeScale,
          hitRadius: 30 * secondarySizeScale,
          blockRadius: 27 * secondarySizeScale,
          angularSpeed: 0.0085,
          damage: empowered ? 32 : 24,
          projectileCutChance: 0.6,
          projectileCutAttempts: new Set(),
          lastProjectileCutAt: time,
          nextTickAt: time,
          blades,
          objects: blades,
        });
        this.recordSecondaryUnitCount(secondary.id, count, secondaryExtraUnitCount);
        this.recordSecondaryProjectile(secondary, "orbiting-moon-blade", "secondary-moon", "secondaryDart");
      } else if (secondary.id === "echo-wheel") {
        const x = this.player.x;
        const y = this.player.y;
        const wheel = this.add.image(x, y, "returnBolt")
          .setTint(secondary.colorValue).setScale(0.86 * secondarySizeScale).setDepth(12).setBlendMode(Phaser.BlendModes.ADD);
        const ring = this.add.image(x, y, "fxRing")
          .setTint(secondary.colorValue).setScale(0.72 * secondarySizeScale).setDepth(11).setAlpha(0.7).setBlendMode(Phaser.BlendModes.ADD);
        const shardCount = (this.secondaryUpgradeIds.has("echo-wheel-eight") ? 8 : 6) + secondaryExtraUnitCount;
        this.tweens.add({ targets: [wheel, ring], angle: 360, scale: 1.12 * secondarySizeScale, duration: 650, ease: "Sine.easeIn" });
        this.addSecondaryEffect(secondary, {
          type: "echo-wheel", x, y, releaseAt: time + 650, expiresAt: time + 760, released: false,
          count: shardCount,
          damage: this.secondaryUpgradeIds.has("echo-wheel-memory") ? 30 : 25,
          returnDamageMultiplier: this.secondaryUpgradeIds.has("echo-wheel-memory") ? 1.5 : 1,
          objects: [wheel, ring],
        });
        this.recordSecondaryUnitCount(secondary.id, shardCount, secondaryExtraUnitCount);
        this.recordSecondaryProjectile(secondary, "delayed-echo-wheel", "secondary-echo", "secondaryCore");
      } else if (secondary.id === "soul-tether") {
        const tetherCount = (this.secondaryUpgradeIds.has("soul-tether-chain") ? 2 : 1) + secondaryExtraUnitCount;
        const candidates = this.getFarthestSecondaryTargets();
        const targets = Array.from({ length: tetherCount }, (_, index) => candidates[index % Math.max(1, candidates.length)] || denseTarget);
        const empowered = this.secondaryUpgradeIds.has("soul-tether-grip");
        targets.forEach((target, index) => {
          if (!target?.active) return;
          const baseAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y);
          const duplicateOffset = candidates[index] ? 0 : this.getCenteredSecondaryOffsets(tetherCount, 0.12, 0.48)[index];
          const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, target.x, target.y);
          const speed = this.getSecondaryProjectileSpeed(540);
          const returnAfter = Phaser.Math.Clamp((distance / Math.max(1, speed)) * 1000 + 100, 440, 980);
          const wheel = this.spawnSecondaryShot(secondary, target, baseAngle + duplicateOffset, {
            texture: "returnBolt", damage: empowered ? 62 : 54, pierce: 0,
            life: returnAfter + 1850, speed: 540, homing: 0.075, scale: 1.02,
            hitWidth: 30, hitHeight: 24, trailRadius: 4,
            returnAfter, returnOnHit: true,
            returnDamageMultiplier: empowered ? 1.55 : 1.25,
            returnBurstDamage: empowered ? 36 : 0,
            returnBurstRadius: empowered ? 128 * secondarySizeScale : 0,
            projectileKind: "soul-tether-wheel", fxStyle: "secondary-moon", audioCue: "secondaryDart",
          });
          wheel.setAngularVelocity(620);
        });
        this.recordSecondaryUnitCount(secondary.id, tetherCount, secondaryExtraUnitCount);
        this.recordSecondaryEvent(secondary.id, "special", "farthest-return-execution");
      } else if (secondary.id === "lightning-rod") {
        const rodCount = 1 + secondaryExtraUnitCount;
        const targets = this.getSecondaryTargets();
        for (let index = 0; index < rodCount; index += 1) {
          const target = targets[index] || denseTarget;
          const duplicateAngle = (Math.PI * 2 * index) / rodCount;
          const duplicateOffset = targets[index] ? 0 : 26 * index;
          const x = Phaser.Math.Clamp(target.x + Math.cos(duplicateAngle) * duplicateOffset, 34, this.scale.width - 34);
          const y = Phaser.Math.Clamp(target.y + Math.sin(duplicateAngle) * duplicateOffset, this.getPlayableTop() + 34, this.getPlayableBottom() - 34);
          const rod = this.add.image(x, y, "arcBolt")
            .setTint(secondary.colorValue).setAngle(-90).setScale(0.9 * secondarySizeScale).setDepth(10).setBlendMode(Phaser.BlendModes.ADD);
          const ring = this.add.image(x, y, "fxRing")
            .setTint(secondary.colorValue).setScale(0.9 * secondarySizeScale).setDepth(9).setAlpha(0.68).setBlendMode(Phaser.BlendModes.ADD);
          this.tweens.add({ targets: ring, angle: 360, duration: 900, repeat: -1, ease: "Linear" });
          this.addSecondaryEffect(secondary, {
            type: "lightning-rod", x, y,
            damage: this.secondaryUpgradeIds.has("lightning-rod-overcharge") ? 36 : 27,
            targetCount: this.secondaryUpgradeIds.has("lightning-rod-twin") ? 2 : 1,
            strikeRange: 340 * secondarySizeScale,
            nextTickAt: time + 260,
            expiresAt: time + (this.secondaryUpgradeIds.has("lightning-rod-overcharge") ? 4300 : 3400),
            objects: [rod, ring],
          });
          this.recordSecondaryProjectile(secondary, "temporary-lightning-rod", "secondary-rod", "chain");
        }
        this.recordSecondaryUnitCount(secondary.id, rodCount, secondaryExtraUnitCount);
      } else if (secondary.id === "static-canopy") {
        const expanded = this.secondaryUpgradeIds.has("static-canopy-bulwark");
        const canopyCount = 1 + secondaryExtraUnitCount;
        const radius = (expanded ? 154 : 122) * secondarySizeScale;
        const zones = Array.from({ length: canopyCount }, (_, index) => this.add.circle(
          this.player.x,
          this.player.y,
          radius * (1 - Math.min(0.24, index * 0.06)),
          secondary.colorValue,
          0.035 + index * 0.008,
        ).setStrokeStyle(3, secondary.colorValue, 0.72).setDepth(13).setBlendMode(Phaser.BlendModes.ADD));
        this.addSecondaryEffect(secondary, {
          type: "static-canopy", radius,
          damage: this.secondaryUpgradeIds.has("static-canopy-discharge") ? 24 : 17,
          unitCount: canopyCount,
          clearBudget: (expanded ? 9 : 5) * canopyCount,
          nextTickAt: time,
          expiresAt: time + (this.secondaryUpgradeIds.has("static-canopy-discharge") ? 3300 : 2600),
          zones,
          objects: zones,
        });
        this.recordSecondaryUnitCount(secondary.id, canopyCount, secondaryExtraUnitCount);
        this.recordSecondaryProjectile(secondary, "bullet-clearing-canopy", "secondary-canopy", "shield");
      } else if (secondary.id === "storm-orb") {
        const orbCount = 1 + secondaryExtraUnitCount;
        const targets = this.getSecondaryTargets();
        const fallbackOffsets = this.getCenteredSecondaryOffsets(orbCount, 0.16, 0.64);
        for (let index = 0; index < orbCount; index += 1) {
          const target = targets[index] || denseTarget;
          const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y)
            + (targets[index] ? 0 : fallbackOffsets[index]);
          const bullet = this.spawnSecondaryShot(secondary, target, angle, {
            texture: "arcBolt", damage: this.secondaryUpgradeIds.has("storm-orb-charge") ? 30 : 23,
            pierce: 0, life: 2900, speed: 470, homing: 0.2, scale: 1.02,
            hitWidth: 24, hitHeight: 20, trailRadius: 4, glow: true,
            secondaryBehavior: "storm-orb", projectileKind: "bouncing-electric-orb",
            fxStyle: "secondary-orb", audioCue: "chain",
          });
          bullet.setData("secondaryBounces", this.secondaryUpgradeIds.has("storm-orb-jumps") ? 5 : 3);
        }
        this.recordSecondaryUnitCount(secondary.id, orbCount, secondaryExtraUnitCount);
      } else if (secondary.id === "solar-rocket") {
        const rocketCount = 1 + secondaryExtraUnitCount;
        const upgradedWarhead = this.secondaryUpgradeIds.has("solar-rocket-warhead");
        const baseExplosionRadius = upgradedWarhead ? 150 : 120;
        const actualExplosionRadius = baseExplosionRadius * secondarySizeScale;
        const targets = this.getDenseSecondaryTargets(rocketCount, actualExplosionRadius, actualExplosionRadius);
        const baseSpeed = this.secondaryUpgradeIds.has("solar-rocket-thrusters") ? 680 : 520;
        for (let index = 0; index < rocketCount; index += 1) {
          const target = targets[index] || targets[0] || denseTarget;
          const impactX = Phaser.Math.Clamp(target.x, 24, this.scale.width - 24);
          const impactY = Phaser.Math.Clamp(target.y, this.getPlayableTop() + 8, this.getPlayableBottom() - 8);
          const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, impactX, impactY);
          const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, impactX, impactY);
          const travelSpeed = this.getSecondaryProjectileSpeed(baseSpeed);
          const bullet = this.spawnSecondaryShot(secondary, target, angle, {
            texture: "novaBolt", damage: 0, pierce: 0,
            life: Math.max(1200, (distance / travelSpeed) * 1000 + 360), speed: baseSpeed, homing: 0,
            scale: 1.22, hitWidth: 28, hitHeight: 26, trailRadius: 6, glow: true,
            secondaryBehavior: "solar-rocket",
            secondaryArrivalAt: time + Math.max(620, (distance / travelSpeed) * 1000),
            projectileKind: "fixed-impact-solar-rocket", fxStyle: "secondary-rocket", audioCue: "secondaryBottle",
          });
          const warning = this.add.graphics().setPosition(impactX, impactY).setDepth(4).setBlendMode(Phaser.BlendModes.ADD);
          warning.fillStyle(0xff8a35, 0.08);
          warning.fillCircle(0, 0, actualExplosionRadius);
          warning.lineStyle(3, 0xffc75f, 0.72);
          warning.strokeCircle(0, 0, actualExplosionRadius);
          warning.lineStyle(1, 0xfff1b8, 0.9);
          warning.strokeCircle(0, 0, Math.max(12, actualExplosionRadius * 0.28));
          warning.beginPath();
          warning.moveTo(-actualExplosionRadius * 0.22, 0);
          warning.lineTo(actualExplosionRadius * 0.22, 0);
          warning.moveTo(0, -actualExplosionRadius * 0.22);
          warning.lineTo(0, actualExplosionRadius * 0.22);
          warning.strokePath();
          this.tweens.add({
            targets: warning,
            alpha: { from: 0.54, to: 0.9 },
            scaleX: { from: 1.04, to: 0.96 },
            scaleY: { from: 1.04, to: 0.96 },
            duration: 310,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });
          bullet.setData({
            secondaryExplosionDamage: upgradedWarhead ? 128 : 96,
            secondaryExplosionRadius: baseExplosionRadius,
            secondaryImpactX: impactX,
            secondaryImpactY: impactY,
            secondaryImpactWarning: warning,
          });
          bullet.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.tweens.killTweensOf(warning);
            if (warning.active || warning.scene) warning.destroy();
          });
        }
        this.recordSecondaryUnitCount(secondary.id, rocketCount, secondaryExtraUnitCount);
        this.recordSecondaryEvent(secondary.id, "special", "dense-area-rocket-lock");
      } else if (secondary.id === "flare-wall") {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, denseTarget.x, denseTarget.y) + Math.PI / 2;
        const extended = this.secondaryUpgradeIds.has("flare-wall-length");
        const length = (extended ? 310 : 240) * secondarySizeScale;
        const wallCount = 1 + secondaryExtraUnitCount;
        const wallOffsets = this.getCenteredSecondaryOffsets(wallCount, 38, 152);
        wallOffsets.forEach((offset) => {
          const x = Phaser.Math.Clamp(denseTarget.x + Math.cos(angle + Math.PI / 2) * offset, 48, this.scale.width - 48);
          const y = Phaser.Math.Clamp(denseTarget.y + Math.sin(angle + Math.PI / 2) * offset, this.getPlayableTop() + 48, this.getPlayableBottom() - 48);
          const corona = this.add.graphics().setPosition(x, y).setRotation(angle).setDepth(5).setBlendMode(Phaser.BlendModes.ADD);
          const curtainHeight = 54 * secondarySizeScale;
          corona.fillStyle(0xff7a2f, 0.12);
          corona.fillRect(-length / 2, -curtainHeight / 2, length, curtainHeight);
          corona.fillStyle(0xffc24d, 0.3);
          for (let tongue = 0; tongue < 6; tongue += 1) {
            const tongueX = -length * 0.42 + (length * 0.84 * tongue) / 5;
            const halfBase = Math.max(8, length * 0.045);
            const tipY = (tongue % 2 === 0 ? -1 : 1) * curtainHeight * 0.78;
            corona.fillTriangle(tongueX - halfBase, 0, tongueX + halfBase, 0, tongueX, tipY);
          }
          corona.lineStyle(2, 0xff8a35, 0.42);
          corona.strokeRect(-length / 2, -curtainHeight / 2, length, curtainHeight);
          const wall = this.add.rectangle(x, y, length, 18 * secondarySizeScale, secondary.colorValue, 0.18)
            .setStrokeStyle(3, 0xfff2bd, 0.82).setRotation(angle).setDepth(12).setBlendMode(Phaser.BlendModes.ADD);
          const core = this.add.rectangle(x, y, length * 0.92, 5 * secondarySizeScale, 0xffffff, 0.7)
            .setRotation(angle).setDepth(13).setBlendMode(Phaser.BlendModes.ADD);
          this.tweens.add({
            targets: corona,
            alpha: { from: 0.68, to: 1 },
            scaleY: { from: 0.9, to: 1.08 },
            duration: 360,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });
          this.addSecondaryEffect(secondary, {
            type: "flare-wall", x, y, angle, length, width: 34 * secondarySizeScale, startedAt: time,
            damage: this.secondaryUpgradeIds.has("flare-wall-furnace") ? 25 : 18,
            nextTickAt: time + 120,
            expiresAt: time + (extended ? 4200 : 3300),
            objects: [corona, wall, core],
          });
          this.recordSecondaryProjectile(secondary, "persistent-solar-wall", "secondary-wall", "ember");
        });
        this.recordSecondaryUnitCount(secondary.id, wallCount, secondaryExtraUnitCount);
      } else if (secondary.id === "corona-sail") {
        const count = (this.secondaryUpgradeIds.has("corona-sail-twin") ? 2 : 1) + secondaryExtraUnitCount;
        const clearableTextures = new Set(["enemyShot", "enemyBlade"]);
        const incomingShots = this.enemyProjectiles.getChildren()
          .filter((shot) => shot?.active && clearableTextures.has(shot.texture?.key));
        let facingTarget = denseTarget;
        let bestIncomingScore = -1;
        incomingShots.forEach((shot) => {
          const nearby = incomingShots.reduce((score, other) => (
            score + (Phaser.Math.Distance.Squared(shot.x, shot.y, other.x, other.y) <= 150 * 150 ? 1 : 0)
          ), 0);
          const distancePenalty = Phaser.Math.Distance.Between(this.player.x, this.player.y, shot.x, shot.y) / 700;
          const score = nearby - distancePenalty;
          if (score > bestIncomingScore) {
            bestIncomingScore = score;
            facingTarget = shot;
          }
        });
        const facingAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, facingTarget.x, facingTarget.y);
        const empowered = this.secondaryUpgradeIds.has("corona-sail-flare");
        const capacity = empowered ? 10 : 6;
        const mirrors = Array.from({ length: count }, (_value, index) => {
          const shield = this.add.image(this.player.x, this.player.y, "scatterSweep")
            .setTint(secondary.colorValue).setScale(0.27 * secondarySizeScale).setDepth(14).setBlendMode(Phaser.BlendModes.ADD);
          const core = this.add.image(this.player.x, this.player.y, "fxGlow")
            .setTint(0xfff3bd).setScale(0.5 * secondarySizeScale).setDepth(15).setBlendMode(Phaser.BlendModes.ADD);
          return { index, shield, core, absorbed: 0, capacity };
        });
        this.addSecondaryEffect(secondary, {
          type: "corona-mirror", startedAt: time, facingAngle,
          frontDistance: 88 * secondarySizeScale,
          lateralSpacing: 54 * secondarySizeScale,
          hitRadius: 28 * secondarySizeScale,
          blockRadius: 28 * secondarySizeScale,
          damage: empowered ? 31 : 23,
          empowered,
          nextTickAt: time,
          expiresAt: time + 2200,
          mirrors,
          counterReleased: false,
          objects: mirrors.flatMap((mirror) => [mirror.shield, mirror.core]),
        });
        this.recordSecondaryUnitCount(secondary.id, count, secondaryExtraUnitCount);
        this.recordSecondaryProjectile(secondary, "directed-corona-mirror", "secondary-mirror", "shield");
      }
      if (!["star-mine", "ember-bellows", "dash-blades"].includes(secondary.id)) {
        this.spawnWeaponMuzzle(
          Phaser.Math.Angle.Between(this.player.x, this.player.y, denseTarget.x, denseTarget.y),
          secondary.weaponOnly,
          secondary.colorValue,
          true,
        );
      }
      return true;
    }

    damageEnemyWithSecondary(enemy, amount, secondaryId) {
      if (!enemy?.active || amount <= 0) return 0;
      const damageResult = this.resolveSecondaryDamage(amount, secondaryId);
      if (damageResult.damage <= 0) return 0;
      const beforeHp = Math.max(0, enemy.getData("hp") || 0);
      const beforeArmor = Math.max(0, enemy.getData("armor") || 0);
      if (damageResult.critical) soundscape.recordCritical();
      this.damageEnemy(enemy, damageResult.damage, null);
      const afterHp = enemy.active ? Math.max(0, enemy.getData("hp") || 0) : 0;
      const afterArmor = enemy.active ? Math.max(0, enemy.getData("armor") || 0) : 0;
      const hpDamage = Math.max(0, beforeHp - afterHp);
      const applied = hpDamage + Math.max(0, beforeArmor - afterArmor);
      this.secondaryTelemetry.damageApplied += applied;
      this.secondaryTelemetry.damageToHp += hpDamage;
      this.secondaryTelemetry.inheritedDamageBonus += damageResult.inheritedDamageBonus;
      if (damageResult.extraProjectilePower > 0) this.secondaryTelemetry.extraProjectilePowerHits += 1;
      if (damageResult.critical) {
        this.secondaryTelemetry.criticalHits += 1;
        this.recordSecondaryEvent(secondaryId, "criticals");
      }
      if (damageResult.surgeActive) this.secondaryTelemetry.surgeDamageHits += 1;
      this.recordSecondaryEvent(secondaryId, "damage", applied);
      return applied;
    }

    applySecondaryHit(enemy, amount, secondaryId) {
      if (!enemy?.active) return 0;
      this.secondaryTelemetry.hits += 1;
      this.recordSecondaryEvent(secondaryId, "hits");
      return this.damageEnemyWithSecondary(enemy, amount, secondaryId);
    }

    onSecondaryBulletHit(bullet, enemy) {
      const hitTargets = bullet.getData("hitTargets");
      if (hitTargets?.has(enemy)) return;
      hitTargets?.add(enemy);
      const behavior = bullet.getData("secondaryBehavior");
      const secondaryId = bullet.getData("secondaryId");
      if (behavior === "storm-orb") {
        const angle = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
        this.spawnProjectileImpact(enemy.x, enemy.y, bullet.getData("color"), "secondary-orb", angle);
        this.applySecondaryHit(enemy, bullet.getData("damage") || 0, secondaryId);
        const remaining = bullet.getData("secondaryBounces") || 0;
        const nextTarget = this.enemies.getChildren()
          .filter((candidate) => candidate?.active && candidate !== enemy && !hitTargets?.has(candidate) && candidate.getData("kind") !== "rift")
          .sort((left, right) => (
            Phaser.Math.Distance.Squared(enemy.x, enemy.y, left.x, left.y)
            - Phaser.Math.Distance.Squared(enemy.x, enemy.y, right.x, right.y)
          ))[0];
        if (remaining <= 0 || !nextTarget || !bullet.active) {
          if (bullet.active) bullet.destroy();
          return;
        }
        const nextAngle = Phaser.Math.Angle.Between(bullet.x, bullet.y, nextTarget.x, nextTarget.y);
        bullet.setData({ target: nextTarget, homing: 0.24, secondaryBounces: remaining - 1 });
        bullet.setVelocity(Math.cos(nextAngle) * (bullet.getData("speed") || 470), Math.sin(nextAngle) * (bullet.getData("speed") || 470));
        this.recordSecondaryEvent(secondaryId, "special", "orb-bounce");
        soundscape.play("chain", true);
        return;
      }
      if (behavior === "solar-rocket") return;
      if (behavior) {
        this.detonateSecondaryProjectile(bullet, enemy.x, enemy.y);
        return;
      }
      const angle = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
      const bulletFxStyle = bullet.getData("fxStyle");
      const impactStyle = ["secondary-sword-wave", "secondary-star-sword-wave"].includes(bulletFxStyle)
        ? "secondary-sword-wave"
        : bulletFxStyle === "secondary-blade"
          ? bulletFxStyle
        : ["secondary-lance", "secondary-stake"].includes(bulletFxStyle)
          ? "lance"
        : "secondary-dart";
      this.spawnProjectileImpact(enemy.x, enemy.y, bullet.getData("color"), impactStyle, angle);
      this.applySecondaryHit(enemy, bullet.getData("damage") || 0, secondaryId);
      if ((bullet.getData("returnAfter") || 0) > 0) {
        this.recordSecondaryEvent(secondaryId, "special", bullet.getData("returning") ? "return-hit" : "outbound-hit");
        if (bullet.getData("returnOnHit") && enemy === bullet.getData("target") && !bullet.getData("returning")) {
          this.beginReturnFlight(bullet);
        }
        return;
      }
      if (bullet.getData("projectileKind") === "persistent-crescent-sword-wave") {
        const waveHits = (bullet.getData("swordWaveEnemyHits") || 0) + 1;
        bullet.setData("swordWaveEnemyHits", waveHits);
        this.secondaryTelemetry.maxSwordWaveEnemyHits = Math.max(this.secondaryTelemetry.maxSwordWaveEnemyHits, waveHits);
      }
      const pierce = bullet.getData("pierce") || 0;
      if (pierce <= 0) {
        if (bullet.active) bullet.destroy();
      } else {
        bullet.setData("pierce", pierce - 1);
        this.recordSecondaryEvent(secondaryId, "special", "pierce");
      }
    }

    detonateSecondaryProjectile(bullet, impactX = bullet?.x, impactY = bullet?.y) {
      if (!bullet?.active) return false;
      const secondaryId = bullet.getData("secondaryId");
      const behavior = bullet.getData("secondaryBehavior");
      if (behavior === "solar-rocket") {
        impactX = bullet.getData("secondaryImpactX") ?? impactX;
        impactY = bullet.getData("secondaryImpactY") ?? impactY;
      }
      const projectileSizeScale = bullet.getData("projectileSizeScale") || 1;
      const secondaryExplosionDamage = bullet.getData("secondaryExplosionDamage") || 82;
      const secondaryExplosionRadius = (bullet.getData("secondaryExplosionRadius") || 100) * projectileSizeScale;
      const corePullMargin = (this.secondaryUpgradeIds.has("eclipse-core-tide") ? 205 : 170) * projectileSizeScale;
      const coreMarginX = behavior === "eclipse-core"
        ? Math.min(corePullMargin, Math.max(36, this.scale.width / 2 - 24))
        : 24;
      const coreMarginY = behavior === "eclipse-core"
        ? Math.min(
          corePullMargin,
          Math.max(36, (this.getPlayableBottom() - this.getPlayableTop()) / 2 - 24),
        )
        : 8;
      const x = Phaser.Math.Clamp(impactX, coreMarginX, this.scale.width - coreMarginX);
      const y = Phaser.Math.Clamp(
        impactY,
        this.getPlayableTop() + coreMarginY,
        this.getPlayableBottom() - coreMarginY,
      );
      bullet.destroy();
      this.secondaryTelemetry.hits += 1;
      this.recordSecondaryEvent(secondaryId, "hits");
      if (behavior === "fire-bottle") {
        const upgraded = this.secondaryUpgradeIds.has("fire-bottle-wick");
        const wide = this.secondaryUpgradeIds.has("fire-bottle-glaze");
        const radius = (wide ? 92 : 78) * projectileSizeScale;
        this.enemies.getChildren().slice().forEach((enemy) => {
          if (enemy?.active && Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= radius) {
            this.damageEnemyWithSecondary(enemy, 28, secondaryId);
          }
        });
        const zone = this.add.circle(x, y, radius, COLORS.goldHot, 0.11)
          .setStrokeStyle(2, 0xffe29a, 0.72)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(4);
        const ring = this.add.image(x, y, "fxRing").setTint(COLORS.goldHot).setBlendMode(Phaser.BlendModes.ADD).setDepth(5).setAlpha(0.72).setScale(radius / 36);
        this.tweens.add({ targets: ring, angle: 360, duration: 1300, repeat: -1, ease: "Linear" });
        this.secondaryEffects.push({ type: "fire", x, y, radius, damage: upgraded ? 20 : 18, expiresAt: this.gameplayTime + (upgraded ? 2300 : 1500), nextTickAt: this.gameplayTime + 180, zone, ring, secondaryId });
        this.spawnProjectileImpact(x, y, 0xffb24d, "secondary-bottle", 0);
        this.spawnRadialShards(x, y, 0xffd36e, 11, radius * 0.66, Math.PI / 8, 0.5);
        soundscape.play("secondaryBottle", true);
      } else if (behavior === "eclipse-core") {
        const expanded = this.secondaryUpgradeIds.has("eclipse-core-tide");
        const empowered = this.secondaryUpgradeIds.has("eclipse-core-collapse");
        const pullRadius = (expanded ? 205 : 170) * projectileSizeScale;
        const damageRadius = (expanded ? 116 : 100) * projectileSizeScale;
        const duration = expanded ? 2150 : 1800;
        const core = this.add.image(x, y, "secondaryCore").setDepth(13).setScale(1.1 * projectileSizeScale).setBlendMode(Phaser.BlendModes.NORMAL);
        const outer = this.add.image(x, y, "fxRing").setTint(0x83e9df).setBlendMode(Phaser.BlendModes.ADD).setDepth(12).setAlpha(0.76).setScale(pullRadius / 34);
        const inner = this.add.image(x, y, "fxRing").setTint(COLORS.gold).setBlendMode(Phaser.BlendModes.ADD).setDepth(12).setAlpha(0.64).setScale(damageRadius / 40);
        const wisps = Array.from({ length: this.usesCompactControls() ? 4 : 6 }, (_value, index) => (
          this.add.image(x, y, "fxShard")
            .setTint(index % 2 === 0 ? 0x83e9df : 0xc7adff)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(12)
            .setAlpha(0.72)
            .setScale(0.36)
        ));
        this.tweens.add({ targets: outer, angle: -360, scale: pullRadius / 42, duration, ease: "Sine.easeIn" });
        this.tweens.add({ targets: inner, angle: 540, scale: 0.32, duration, ease: "Cubic.easeIn" });
        this.secondaryEffects.push({
          type: "core",
          x,
          y,
          pullRadius,
          damageRadius,
          damage: empowered ? 134 : 110,
          startedAt: this.gameplayTime,
          duration,
          expiresAt: this.gameplayTime + duration,
          core,
          outer,
          inner,
          wisps,
          pulledTargets: new Set(),
          pullStartDistances: new Map(),
          pullLastDistances: new Map(),
          nextPullFxAt: this.gameplayTime,
          secondaryId,
        });
        soundscape.play("secondaryCore", true);
      } else if (behavior === "solar-rocket") {
        const damage = secondaryExplosionDamage;
        const radius = secondaryExplosionRadius;
        this.enemies.getChildren().slice().forEach((enemy) => {
          if (enemy?.active && Phaser.Math.Distance.Squared(x, y, enemy.x, enemy.y) <= radius * radius) {
            this.applySecondaryHit(enemy, damage, secondaryId);
          }
        });
        this.spawnExpandingSigil(x, y, 0xffcf62, radius, 420);
        this.spawnRadialShards(x, y, 0xfff0a8, 16, radius * 0.74, Math.PI / 12, 0.62);
        this.burstAt(x, y, 0xffb24d, 18);
        this.cameras.main.shake(100, 0.004);
        this.recordSecondaryEvent(secondaryId, "special", "rocket-explosion");
        soundscape.play("secondaryBottle", true);
      }
      return true;
    }

    releaseCoronaMirrorCounter(effect) {
      if (effect.counterReleased) return;
      effect.counterReleased = true;
      const usedTargets = new Set();
      effect.mirrors.forEach((mirror) => {
        const targets = this.getSecondaryTargets();
        const target = targets.find((candidate) => !usedTargets.has(candidate)) || targets[0];
        if (!target?.active) return;
        usedTargets.add(target);
        const damage = effect.empowered
          ? 48 + mirror.absorbed * 8
          : 36 + mirror.absorbed * 6;
        const x = mirror.core?.x ?? this.player.x;
        const y = mirror.core?.y ?? this.player.y;
        const angle = Phaser.Math.Angle.Between(x, y, target.x, target.y);
        const length = Phaser.Math.Distance.Between(x, y, target.x, target.y);
        const beam = this.add.rectangle(
          x + Math.cos(angle) * length / 2,
          y + Math.sin(angle) * length / 2,
          length,
          7,
          0xffe59a,
          0.84,
        ).setRotation(angle).setDepth(16).setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
          targets: beam,
          alpha: 0,
          scaleY: 0.18,
          duration: 220,
          ease: "Quad.easeOut",
          onComplete: () => beam.destroy(),
        });
        this.spawnProjectileImpact(target.x, target.y, 0xffe59a, "secondary-rocket", angle);
        this.applySecondaryHit(target, damage, effect.secondaryId);
        this.recordSecondaryEvent(effect.secondaryId, "special", "mirror-counter");
      });
      soundscape.play("secondaryCore", true);
    }

    destroySecondaryEffect(effect) {
      const objects = new Set([
        effect.zone,
        effect.ring,
        effect.core,
        effect.outer,
        effect.inner,
        effect.warning,
        ...(effect.wisps || []),
        ...(effect.objects || []),
      ].filter(Boolean));
      objects.forEach((object) => {
        this.tweens.killTweensOf(object);
        if (object?.active || object?.scene) object.destroy();
      });
      effect.timer?.remove?.(false);
    }

    updateSecondaryEffects(time, delta) {
      let lightningRodRelayUsed = false;
      this.secondaryEffects = this.secondaryEffects.filter((effect) => {
        if (effect.type === "dragon-lance-sweep") {
          const progress = Phaser.Math.Clamp((time - effect.startedAt) / effect.duration, 0, 1);
          const sweepAngle = progress * Math.PI * 2;
          const previousSweepAngle = effect.sweepAngle || 0;
          const originX = this.player.x;
          const originY = this.player.y - 5;
          effect.ring?.setPosition(originX, originY).setRotation(-sweepAngle * 0.42);
          effect.lances.forEach((lance, index) => {
            lance?.setPosition(originX, originY).setRotation(effect.baseAngle + effect.angleOffsets[index] + sweepAngle);
          });
          if (sweepAngle > previousSweepAngle) {
            const fullTurn = Math.PI * 2;
            const crossedByLance = (pointAngle, distance, objectRadius, angleOffset) => {
              if (distance <= effect.halfWidth + objectRadius) return true;
              const angularAllowance = Math.asin(Math.min(1, (effect.halfWidth + objectRadius) / Math.max(1, distance)));
              const relative = ((pointAngle - effect.baseAngle - angleOffset) % fullTurn + fullTurn) % fullTurn;
              return relative + angularAllowance >= previousSweepAngle && relative - angularAllowance <= sweepAngle;
            };
            this.enemies.getChildren().slice().forEach((enemy) => {
              if (!enemy?.active || enemy.getData("kind") === "rift") return;
              const distance = Phaser.Math.Distance.Between(originX, originY, enemy.x, enemy.y);
              const enemyRadius = Math.min(36, Math.max(enemy.body?.width || 0, enemy.displayWidth || 0) * 0.34);
              if (distance > effect.radius + enemyRadius) return;
              const enemyAngle = Phaser.Math.Angle.Between(originX, originY, enemy.x, enemy.y);
              effect.angleOffsets.forEach((angleOffset, index) => {
                const hitTargets = effect.lanceHitTargets[index];
                if (hitTargets.has(enemy) || !crossedByLance(enemyAngle, distance, enemyRadius, angleOffset)) return;
                hitTargets.add(enemy);
                this.spawnProjectileImpact(enemy.x, enemy.y, 0xb6fff3, "lance", enemyAngle);
                this.applySecondaryHit(enemy, effect.damage, effect.secondaryId);
                const hitCount = (effect.enemyHitCounts.get(enemy) || 0) + 1;
                effect.enemyHitCounts.set(enemy, hitCount);
                this.secondaryTelemetry.dragonSweepTargets += 1;
                this.secondaryTelemetry.maxDragonSweepHitsPerEnemy = Math.max(
                  this.secondaryTelemetry.maxDragonSweepHitsPerEnemy,
                  hitCount,
                );
                this.recordSecondaryEvent(effect.secondaryId, "special", `dragon-sweep-hit-${index + 1}`);
              });
            });
            const totalEnemyHits = effect.lanceHitTargets.reduce((total, hitTargets) => total + hitTargets.size, 0);
            this.secondaryTelemetry.maxDragonSweepTargets = Math.max(
              this.secondaryTelemetry.maxDragonSweepTargets,
              totalEnemyHits,
            );
            let projectileCutCandidates = 0;
            let projectilesCut = 0;
            let visibleCuts = 0;
            this.enemyProjectiles.getChildren().slice().forEach((shot) => {
              if (!shot?.active) return;
              const distance = Phaser.Math.Distance.Between(originX, originY, shot.x, shot.y);
              const shotRadius = Math.min(18, Math.max(6, Math.max(shot.body?.width || 0, shot.displayWidth || 0) * 0.32));
              if (distance > effect.radius + shotRadius) return;
              const shotAngle = Phaser.Math.Angle.Between(originX, originY, shot.x, shot.y);
              for (let index = 0; index < effect.angleOffsets.length; index += 1) {
                const attempts = effect.projectileCutAttempts[index];
                if (attempts.has(shot) || !crossedByLance(shotAngle, distance, shotRadius, effect.angleOffsets[index])) continue;
                attempts.add(shot);
                projectileCutCandidates += 1;
                if (Math.random() >= MELEE_PROJECTILE_CUT_CHANCE) continue;
                const impactX = shot.x;
                const impactY = shot.y;
                shot.destroy();
                projectilesCut += 1;
                if (visibleCuts < 6) {
                  this.spawnProjectileImpact(impactX, impactY, 0xb6fff3, "secondary-blade", shotAngle);
                  visibleCuts += 1;
                }
                break;
              }
            });
            this.secondaryTelemetry.projectileCutCandidates += projectileCutCandidates;
            this.secondaryTelemetry.projectilesCut += projectilesCut;
            this.secondaryTelemetry.maxProjectilesCutPerMeleeSecondary = Math.max(
              this.secondaryTelemetry.maxProjectilesCutPerMeleeSecondary,
              projectilesCut,
            );
            this.recordSecondaryEvent(effect.secondaryId, "projectileCutCandidates", projectileCutCandidates);
            this.recordSecondaryEvent(effect.secondaryId, "projectilesCut", projectilesCut);
            if (projectilesCut > 0) {
              this.showCombatLabel(originX, originY - 30, `回枪断弹 ×${projectilesCut}`, 0xb6fff3);
              soundscape.play("projectileCut");
            }
          }
          effect.sweepAngle = sweepAngle;
          if (progress >= 1 && !effect.completed) {
            effect.completed = true;
            this.spawnExpandingSigil(originX, originY, 0x9ae6d8, effect.radius, 340);
            this.burstAt(originX, originY, 0xeafffb, 10);
          }
        }
        if (effect.type === "fire" && time >= effect.nextTickAt && time < effect.expiresAt) {
          effect.nextTickAt += 300;
          this.enemies.getChildren().slice().forEach((enemy) => {
            if (enemy?.active && Phaser.Math.Distance.Between(effect.x, effect.y, enemy.x, enemy.y) <= effect.radius) {
              this.damageEnemyWithSecondary(enemy, effect.damage, effect.secondaryId);
            }
          });
          this.burstAt(effect.x, effect.y, COLORS.goldHot, 3);
        }
        if (effect.type === "core" && time < effect.expiresAt) {
          const progress = Phaser.Math.Clamp((time - effect.startedAt) / effect.duration, 0, 1);
          effect.core?.setAngle((effect.core.angle || 0) - delta * 0.11);
          effect.wisps?.forEach((wisp, index) => {
            if (!wisp?.active) return;
            const angle = -time * 0.0062 + (Math.PI * 2 * index) / effect.wisps.length;
            const orbitRadius = Phaser.Math.Linear(effect.pullRadius * 0.78, effect.damageRadius * 0.18, progress);
            wisp
              .setPosition(effect.x + Math.cos(angle) * orbitRadius, effect.y + Math.sin(angle) * orbitRadius)
              .setRotation(angle + Math.PI / 2)
              .setAlpha(0.48 + Math.sin(time * 0.014 + index) * 0.18)
              .setScale(Phaser.Math.Linear(0.42, 0.18, progress));
          });
          let pullFxEnemy = null;
          this.enemies.getChildren().slice().forEach((enemy) => {
            if (!enemy?.active || !enemy.body) return;
            const kind = enemy.getData("kind");
            const attackState = enemy.getData("attackState");
            if (
              kind === "boss"
              || kind === "rift"
              || enemy.body.checkCollision.none
              || attackState === "charging"
              || attackState === "vanishing"
              || attackState === "reappearing"
            ) return;
            const distance = Phaser.Math.Distance.Between(effect.x, effect.y, enemy.x, enemy.y);
            if (distance > effect.pullRadius) return;
            if (!effect.pulledTargets.has(enemy)) {
              effect.pulledTargets.add(enemy);
              effect.pullStartDistances.set(enemy, distance);
              effect.pullLastDistances.set(enemy, distance);
              this.secondaryTelemetry.pullTargets += 1;
              if (effect.pulledTargets.size <= 2) this.showCombatLabel(enemy.x, enemy.y - 30, "牵引", 0x83e9df);
            }
            const lastDistance = effect.pullLastDistances.get(enemy) ?? distance;
            const pulledDistance = Math.max(0, lastDistance - distance);
            if (pulledDistance > 0) this.secondaryTelemetry.pullDistance += pulledDistance;
            const startDistance = effect.pullStartDistances.get(enemy) ?? distance;
            this.secondaryTelemetry.maxPullDisplacement = Math.max(
              this.secondaryTelemetry.maxPullDisplacement,
              Math.max(0, startDistance - distance),
            );
            effect.pullLastDistances.set(enemy, distance);
            if (distance <= 18) {
              enemy.body.velocity.scale(0.24);
              return;
            }
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, effect.x, effect.y);
            const proximity = 1 - distance / effect.pullRadius;
            const expanded = this.secondaryUpgradeIds.has("eclipse-core-tide");
            const resistance = enemyCatalog[kind]?.elite ? 0.72 : 1;
            const pullSpeed = Phaser.Math.Linear(expanded ? 280 : 245, expanded ? 460 : 390, proximity) * resistance;
            const blend = Phaser.Math.Clamp((delta / 16.67) * (0.62 + proximity * 0.2), 0.24, 0.9);
            enemy.body.velocity.x = Phaser.Math.Linear(enemy.body.velocity.x, Math.cos(angle) * pullSpeed, blend);
            enemy.body.velocity.y = Phaser.Math.Linear(enemy.body.velocity.y, Math.sin(angle) * pullSpeed, blend);
            this.secondaryTelemetry.pullApplications += 1;
            if (!pullFxEnemy && time >= effect.nextPullFxAt) pullFxEnemy = enemy;
          });
          if (pullFxEnemy) {
            const mote = this.add.image(pullFxEnemy.x, pullFxEnemy.y, "fxShard")
              .setTint(0x83e9df)
              .setBlendMode(Phaser.BlendModes.ADD)
              .setDepth(14)
              .setAlpha(0.82)
              .setScale(0.5);
            this.tweens.add({
              targets: mote,
              x: effect.x,
              y: effect.y,
              alpha: 0,
              scale: 0.12,
              angle: mote.angle + 180,
              duration: 260,
              ease: "Quad.easeIn",
              onComplete: () => mote.destroy(),
            });
            effect.nextPullFxAt = time + (this.usesCompactControls() ? 170 : 110);
          }
        }
        if (effect.type === "laser" && time < effect.expiresAt) {
          let directionX = Math.cos(effect.angle);
          let directionY = Math.sin(effect.angle);
          if (!effect.released) {
            effect.originX = this.player.x;
            effect.originY = this.player.y - 5;
            if (effect.target?.active) {
              effect.angle = Phaser.Math.Angle.Between(effect.originX, effect.originY, effect.target.x, effect.target.y)
                + (effect.trackingAngleOffset || 0);
            }
            directionX = Math.cos(effect.angle);
            directionY = Math.sin(effect.angle);
            const muzzleX = effect.originX + directionX * 18;
            const muzzleY = effect.originY + directionY * 18;
            const chargeProgress = Phaser.Math.Clamp((time - effect.startedAt) / Math.max(1, effect.releaseAt - effect.startedAt), 0, 1);
            const chargePulse = 0.86 + Math.sin(time * 0.045) * 0.14;
            effect.warning?.clear();
            effect.warning?.lineStyle(7, 0x43d9d0, 0.05 + chargeProgress * 0.12).lineBetween(
              muzzleX,
              muzzleY,
              effect.originX + directionX * effect.length,
              effect.originY + directionY * effect.length,
            );
            effect.warning?.lineStyle(2 + chargeProgress * 2, 0xb7fff6, 0.24 + chargeProgress * 0.42).lineBetween(
              muzzleX,
              muzzleY,
              effect.originX + directionX * effect.length,
              effect.originY + directionY * effect.length,
            );
            effect.warning?.fillStyle(0x43d9d0, 0.12 + chargeProgress * 0.24).fillCircle(muzzleX, muzzleY, 11 + chargeProgress * 12);
            effect.warning?.fillStyle(0xffffff, 0.38 + chargeProgress * 0.58).fillCircle(muzzleX, muzzleY, 4 + chargeProgress * 7);
            effect.muzzle?.setPosition(muzzleX, muzzleY).setRotation(effect.angle + time * 0.004)
              .setScale(Phaser.Math.Linear(0.92, 0.28, chargeProgress));
            effect.chargeCore?.setPosition(muzzleX, muzzleY).setRotation(-time * 0.006)
              .setScale((0.28 + chargeProgress * 0.82) * chargePulse).setAlpha(0.34 + chargeProgress * 0.62);
            effect.chargeRingOuter?.setPosition(muzzleX, muzzleY).setRotation(time * 0.005)
              .setScale(Phaser.Math.Linear(1.46, 0.42, chargeProgress)).setAlpha(0.38 + chargeProgress * 0.48);
            effect.chargeRingInner?.setPosition(muzzleX, muzzleY).setRotation(-time * 0.008)
              .setScale(Phaser.Math.Linear(0.96, 0.22, chargeProgress)).setAlpha(0.48 + chargeProgress * 0.5);
            if (effect.emitChargeMotes !== false && time >= effect.nextChargeMoteAt) {
              const moteRadius = Phaser.Math.Linear(58, 34, chargeProgress);
              [-1, 1].forEach((side) => {
                const moteAngle = effect.angle + side * (Math.PI / 2) + time * 0.0018;
                const mote = this.add.image(
                  muzzleX + Math.cos(moteAngle) * moteRadius,
                  muzzleY + Math.sin(moteAngle) * moteRadius,
                  "fxStar",
                )
                  .setTint(side < 0 ? 0xb7fff6 : 0xffffff)
                  .setBlendMode(Phaser.BlendModes.ADD)
                  .setDepth(20)
                  .setAlpha(0.72)
                  .setScale(0.22 + chargeProgress * 0.12);
                this.tweens.add({
                  targets: mote,
                  x: muzzleX,
                  y: muzzleY,
                  scale: 0.06,
                  alpha: 0,
                  angle: mote.angle + side * 140,
                  duration: this.usesCompactControls() ? 170 : 135,
                  ease: "Quad.easeIn",
                  onComplete: () => mote.destroy(),
                });
              });
              effect.nextChargeMoteAt = time + (this.usesCompactControls() ? 145 : 95);
            }
          }
          if (!effect.released && time >= effect.releaseAt) {
            effect.released = true;
            effect.originX = this.player.x;
            effect.originY = this.player.y - 5;
            effect.warning?.clear();
            effect.beam?.setVisible(true);
            effect.head?.setVisible(true);
            effect.chargeCore?.setVisible(false);
            effect.chargeRingOuter?.setVisible(false);
            effect.chargeRingInner?.setVisible(false);
            const muzzleX = effect.originX + directionX * 18;
            const muzzleY = effect.originY + directionY * 18;
            this.spawnExpandingSigil(muzzleX, muzzleY, 0xb7fff6, 92, 300, 0, effect.angle);
            this.spawnExpandingSigil(muzzleX, muzzleY, 0xffffff, 58, 220, 35, effect.angle + Math.PI / 4);
            this.spawnRadialShards(muzzleX, muzzleY, 0xb7fff6, 16, 128, effect.angle, 0.68, Math.PI * 0.9);
            this.burstAt(muzzleX, muzzleY, 0xffffff, 14);
            this.cameras.main.shake(110, this.usesCompactControls() ? 0.0025 : 0.0042);
            this.recordSecondaryEvent(effect.secondaryId, "special", "laser-release");
            soundscape.play("pulse", true);
          }
          if (effect.released) {
            const progress = Phaser.Math.Clamp((time - effect.releaseAt) / effect.advanceDuration, 0, 1);
            const easedProgress = Phaser.Math.Easing.Cubic.Out(progress);
            const currentAdvance = effect.length * easedProgress;
            const startAdvance = effect.lastAdvance || 0;
            const muzzleX = effect.originX + directionX * 18;
            const muzzleY = effect.originY + directionY * 18;
            const headX = effect.originX + directionX * currentAdvance;
            const headY = effect.originY + directionY * currentAdvance;
            const beamPulse = 1 + Math.sin(time * 0.055) * 0.08;
            const railOffsetX = -directionY * effect.width * 0.34;
            const railOffsetY = directionX * effect.width * 0.34;
            effect.beam?.clear();
            effect.beam?.lineStyle(effect.width * 3.4 * beamPulse, 0x43d9d0, 0.08).lineBetween(muzzleX, muzzleY, headX, headY);
            effect.beam?.lineStyle(effect.width * 2.2 * beamPulse, 0x43d9d0, 0.2).lineBetween(muzzleX, muzzleY, headX, headY);
            effect.beam?.lineStyle(effect.width * 1.08, 0xb7fff6, 0.82).lineBetween(muzzleX, muzzleY, headX, headY);
            effect.beam?.lineStyle(Math.max(3, effect.width * 0.26), 0xffffff, 0.99).lineBetween(muzzleX, muzzleY, headX, headY);
            effect.beam?.lineStyle(Math.max(2, effect.width * 0.1), 0xffffff, 0.58).lineBetween(
              muzzleX + railOffsetX, muzzleY + railOffsetY, headX + railOffsetX, headY + railOffsetY,
            );
            effect.beam?.lineStyle(Math.max(2, effect.width * 0.1), 0xb7fff6, 0.48).lineBetween(
              muzzleX - railOffsetX, muzzleY - railOffsetY, headX - railOffsetX, headY - railOffsetY,
            );
            effect.head?.setPosition(headX, headY).setRotation(effect.angle + time * 0.01)
              .setScale((0.82 + (1 - progress) * 0.42) * beamPulse);
            effect.muzzle?.setPosition(muzzleX, muzzleY).setRotation(effect.angle - time * 0.008)
              .setScale(0.58 + Math.sin(time * 0.04) * 0.1);
            if (currentAdvance > startAdvance) {
              const segmentX1 = effect.originX + directionX * startAdvance;
              const segmentY1 = effect.originY + directionY * startAdvance;
              this.enemies.getChildren().slice().forEach((enemy) => {
                if (!enemy?.active || effect.hitTargets.has(enemy)) return;
                const enemyRadius = Math.min(38, Math.max(enemy.body?.width || 0, enemy.displayWidth || 0) * 0.32);
                if (this.getDistanceToSegment(enemy.x, enemy.y, segmentX1, segmentY1, headX, headY) > effect.width * 0.72 + enemyRadius) return;
                effect.hitTargets.add(enemy);
                this.applySecondaryHit(enemy, effect.damage, effect.secondaryId);
                this.secondaryTelemetry.laserHits += 1;
                this.recordSecondaryEvent(effect.secondaryId, "special", "laser-sweep-hit");
              });
            }
            effect.lastAdvance = currentAdvance;
            this.secondaryTelemetry.laserMaxAdvance = Math.max(this.secondaryTelemetry.laserMaxAdvance, currentAdvance);
            if (progress >= 1 && !effect.travelComplete) {
              effect.travelComplete = true;
              this.recordSecondaryEvent(effect.secondaryId, "special", "laser-travel-complete");
            }
            const fadeStart = effect.releaseAt + effect.advanceDuration;
            if (time > fadeStart) {
              const fade = 1 - Phaser.Math.Clamp((time - fadeStart) / Math.max(1, effect.expiresAt - fadeStart), 0, 1);
              effect.beam?.setAlpha(fade);
              effect.head?.setAlpha(fade);
              effect.muzzle?.setAlpha(fade);
            }
          }
        }
        if (effect.type === "moon-orbit" && time < effect.expiresAt) {
          const angularSpeed = effect.angularSpeed || 0.0085;
          if (time < effect.activeUntil) {
            effect.blades.forEach((blade, index) => {
              if (!blade?.active) return;
              const angle = time * angularSpeed + (Math.PI * 2 * index) / effect.blades.length;
              blade.setPosition(
                this.player.x + Math.cos(angle) * effect.radius,
                this.player.y + Math.sin(angle) * effect.radius,
              ).setRotation(angle + Math.PI / 2);
            });
          } else {
            if (!effect.returning) {
              effect.returning = true;
              effect.returnStartedAt = time;
              effect.returnOrigins = effect.blades.map((blade) => ({ x: blade.x, y: blade.y }));
              this.recordSecondaryEvent(effect.secondaryId, "special", "orbit-recall");
            }
            const recallProgress = Phaser.Math.Clamp((time - effect.returnStartedAt) / Math.max(1, effect.expiresAt - effect.returnStartedAt), 0, 1);
            effect.blades.forEach((blade, index) => {
              if (!blade?.active) return;
              const origin = effect.returnOrigins[index];
              blade.setPosition(
                Phaser.Math.Linear(origin.x, this.player.x, recallProgress),
                Phaser.Math.Linear(origin.y, this.player.y - 5, recallProgress),
              ).setAlpha(1 - recallProgress * 0.65).setScale((0.86 - recallProgress * 0.5) * this.getPlayerProjectileSizeScale());
            });
          }
          if (time < effect.activeUntil && time >= effect.nextTickAt) {
            effect.nextTickAt = time + 200;
            this.enemies.getChildren().slice().forEach((enemy) => {
              if (!enemy?.active) return;
              const struck = effect.blades.some((blade) => blade?.active
                && Phaser.Math.Distance.Squared(blade.x, blade.y, enemy.x, enemy.y) <= (effect.hitRadius || 26) ** 2);
              if (struck) this.applySecondaryHit(enemy, effect.damage, effect.secondaryId);
            });
            const fullTurn = Math.PI * 2;
            const previousCutAt = effect.lastProjectileCutAt ?? effect.startedAt ?? time;
            const sweepAngle = Math.min(fullTurn, Math.max(0, (time - previousCutAt) * angularSpeed));
            let visibleCuts = 0;
            this.enemyProjectiles.getChildren().slice().forEach((shot) => {
              if (!shot?.active || effect.projectileCutAttempts.has(shot)) return;
              const blockRadius = effect.blockRadius || 27;
              const shotDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, shot.x, shot.y);
              if (Math.abs(shotDistance - effect.radius) > blockRadius || shotDistance <= 0) return;
              const shotAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, shot.x, shot.y);
              const angularAllowance = Math.acos(Phaser.Math.Clamp(
                (shotDistance ** 2 + effect.radius ** 2 - blockRadius ** 2) / (2 * shotDistance * effect.radius),
                -1,
                1,
              ));
              const intercepted = effect.blades.some((blade, index) => {
                if (!blade?.active) return false;
                const startAngle = previousCutAt * angularSpeed + (fullTurn * index) / effect.blades.length;
                const relativeAngle = ((shotAngle - startAngle) % fullTurn + fullTurn) % fullTurn;
                const distanceToSweep = relativeAngle <= sweepAngle
                  ? 0
                  : Math.min(relativeAngle - sweepAngle, fullTurn - relativeAngle);
                return distanceToSweep <= angularAllowance;
              });
              if (!intercepted) return;
              effect.projectileCutAttempts.add(shot);
              if (Math.random() >= effect.projectileCutChance) return;
              if (visibleCuts < 6) {
                this.spawnProjectileImpact(shot.x, shot.y, this.getSecondaryProfile(effect.secondaryId)?.colorValue || 0xc8a9ff, "secondary-moon", 0);
                visibleCuts += 1;
              }
              shot.destroy();
              this.recordSecondaryEvent(effect.secondaryId, "special", "orbit-cut");
            });
            effect.lastProjectileCutAt = time;
          }
        }
        if (effect.type === "echo-wheel" && !effect.released && time >= effect.releaseAt && time < effect.expiresAt) {
          effect.released = true;
          const secondary = this.getSecondaryProfile(effect.secondaryId);
          if (secondary) {
            for (let index = 0; index < effect.count; index += 1) {
              const angle = (index / effect.count) * Math.PI * 2;
              const shard = this.spawnSecondaryShot(secondary, null, angle, {
                texture: "returnBolt", damage: effect.damage, pierce: 0,
                life: 2100, speed: 430, homing: 0, scale: 0.72,
                hitWidth: 24, hitHeight: 20, trailRadius: 3,
                returnAfter: 520, returnDamageMultiplier: effect.returnDamageMultiplier,
                projectileKind: "echo-moon-shard", fxStyle: "secondary-moon", audioCue: "secondaryDart",
              });
              shard.setPosition(effect.x, effect.y);
            }
          }
          this.spawnExpandingSigil(effect.x, effect.y, 0xd7c4ff, 86, 320);
          this.recordSecondaryEvent(effect.secondaryId, "special", "echo-release");
        }
        if (effect.type === "lightning-rod" && time >= effect.nextTickAt && time < effect.expiresAt) {
          effect.nextTickAt = time + 520;
          const canRelayArcNode = !lightningRodRelayUsed && this.getActiveArcNodes().length > 0;
          const targets = this.enemies.getChildren()
            .filter((enemy) => enemy?.active && enemy.getData("kind") !== "rift")
            .sort((left, right) => (
              Phaser.Math.Distance.Squared(effect.x, effect.y, left.x, left.y)
              - Phaser.Math.Distance.Squared(effect.x, effect.y, right.x, right.y)
            ))
            .filter((enemy) => Phaser.Math.Distance.Squared(effect.x, effect.y, enemy.x, enemy.y) <= (effect.strikeRange || 340) ** 2)
            .slice(0, effect.targetCount);
          targets.forEach((enemy) => {
            this.drawLightning(effect.x, effect.y - 18, enemy.x, enemy.y);
            this.applySecondaryHit(enemy, effect.damage, effect.secondaryId);
          });
          if (canRelayArcNode && targets[0] && !this.ended) {
            const relayTarget = targets[0];
            this.registerArcNodeHit(relayTarget, relayTarget.x, relayTarget.y, null);
            lightningRodRelayUsed = true;
            this.recordSecondaryEvent(effect.secondaryId, "special", "rod-node-relay");
          }
          if (targets.length) {
            this.recordSecondaryEvent(effect.secondaryId, "special", "rod-strike");
            soundscape.play("chain", true);
          }
        }
        if (effect.type === "static-canopy" && time < effect.expiresAt) {
          effect.zones?.forEach((zone) => zone?.setPosition(this.player.x, this.player.y));
          if (time >= effect.nextTickAt) {
            effect.nextTickAt = time + 260;
            this.enemies.getChildren().slice().forEach((enemy) => {
              if (enemy?.active && Phaser.Math.Distance.Squared(this.player.x, this.player.y, enemy.x, enemy.y) <= effect.radius * effect.radius) {
                for (let unit = 0; unit < (effect.unitCount || 1); unit += 1) {
                  if (!enemy.active) break;
                  this.applySecondaryHit(enemy, effect.damage, effect.secondaryId);
                }
              }
            });
            if (effect.clearBudget > 0) {
              const clearableTextures = new Set(["enemyShot", "enemyBlade"]);
              const cleared = this.enemyProjectiles.getChildren()
                .filter((shot) => shot?.active && clearableTextures.has(shot.texture?.key))
                .filter((shot) => Phaser.Math.Distance.Squared(this.player.x, this.player.y, shot.x, shot.y) <= effect.radius * effect.radius)
                .slice(0, Math.min(2, effect.clearBudget));
              cleared.forEach((shot) => {
                this.spawnProjectileImpact(shot.x, shot.y, 0xa7f3ff, "secondary-orb", 0);
                shot.destroy();
                effect.clearBudget -= 1;
                this.recordSecondaryEvent(effect.secondaryId, "special", "canopy-clear");
              });
            }
          }
        }
        if (effect.type === "flare-wall" && time >= effect.nextTickAt && time < effect.expiresAt) {
          effect.nextTickAt = time + 280;
          const halfLength = effect.length / 2;
          const dx = Math.cos(effect.angle) * halfLength;
          const dy = Math.sin(effect.angle) * halfLength;
          this.enemies.getChildren().slice().forEach((enemy) => {
            if (enemy?.active && this.getDistanceToSegment(
              enemy.x, enemy.y,
              effect.x - dx, effect.y - dy,
              effect.x + dx, effect.y + dy,
            ) <= effect.width) {
              this.applySecondaryHit(enemy, effect.damage, effect.secondaryId);
            }
          });
          const burstProgress = Phaser.Math.FloatBetween(-0.42, 0.42);
          this.burstAt(
            effect.x + Math.cos(effect.angle) * effect.length * burstProgress,
            effect.y + Math.sin(effect.angle) * effect.length * burstProgress,
            0xffda78,
            2,
          );
          this.recordSecondaryEvent(effect.secondaryId, "special", "wall-burn");
        }
        if (effect.type === "corona-mirror" && time < effect.expiresAt) {
          const directionX = Math.cos(effect.facingAngle);
          const directionY = Math.sin(effect.facingAngle);
          const perpendicularX = -directionY;
          const perpendicularY = directionX;
          effect.mirrors.forEach((mirror, index) => {
            const lateral = (index - (effect.mirrors.length - 1) / 2) * effect.lateralSpacing;
            const x = this.player.x + directionX * effect.frontDistance + perpendicularX * lateral;
            const y = this.player.y + directionY * effect.frontDistance + perpendicularY * lateral;
            mirror.shield?.setPosition(x, y).setRotation(effect.facingAngle);
            mirror.core?.setPosition(x, y).setRotation(effect.facingAngle).setAlpha(0.48 + 0.34 * (mirror.absorbed / mirror.capacity));
          });
          if (time >= effect.nextTickAt) {
            effect.nextTickAt = time + 220;
            this.enemies.getChildren().slice().forEach((enemy) => {
              if (!enemy?.active) return;
              const struck = effect.mirrors.some((mirror) => mirror.core?.active
                && Phaser.Math.Distance.Squared(mirror.core.x, mirror.core.y, enemy.x, enemy.y) <= (effect.hitRadius || 28) ** 2);
              if (struck) this.applySecondaryHit(enemy, effect.damage, effect.secondaryId);
            });
          }
          const clearableTextures = new Set(["enemyShot", "enemyBlade"]);
          this.enemyProjectiles.getChildren().slice().forEach((shot) => {
            if (!shot?.active || !clearableTextures.has(shot.texture?.key)) return;
            const mirror = effect.mirrors.find((candidate) => candidate.core?.active
              && candidate.absorbed < candidate.capacity
              && Phaser.Math.Distance.Squared(candidate.core.x, candidate.core.y, shot.x, shot.y) <= (effect.blockRadius || 28) ** 2);
            if (!mirror) return;
            this.spawnProjectileImpact(shot.x, shot.y, 0xffe59a, "secondary-rocket", effect.facingAngle);
            shot.destroy();
            mirror.absorbed += 1;
            mirror.core?.setScale((0.5 + mirror.absorbed * 0.025) * this.getPlayerProjectileSizeScale());
            this.recordSecondaryEvent(effect.secondaryId, "special", "mirror-absorb");
          });
          if (effect.mirrors.every((mirror) => mirror.absorbed >= mirror.capacity)) effect.expiresAt = time;
        }
        if (this.ended && ["flare-wall", "corona-mirror"].includes(effect.type)) return false;
        if (time < effect.expiresAt) return true;
        if (effect.type === "corona-mirror") this.releaseCoronaMirrorCounter(effect);
        if (effect.type === "core") {
          this.enemies.getChildren().slice().forEach((enemy) => {
            if (enemy?.active && Phaser.Math.Distance.Between(effect.x, effect.y, enemy.x, enemy.y) <= effect.damageRadius) {
              this.damageEnemyWithSecondary(enemy, effect.damage, effect.secondaryId);
            }
          });
          this.spawnExpandingSigil(effect.x, effect.y, 0x83e9df, effect.damageRadius, 430);
          this.spawnRadialShards(effect.x, effect.y, 0xc7adff, 14, effect.damageRadius * 0.72, 0, 0.58);
          this.burstAt(effect.x, effect.y, 0x83e9df, 16);
          this.cameras.main.shake(110, 0.004);
          soundscape.play("secondaryCore", true);
        }
        this.destroySecondaryEffect(effect);
        return false;
      });
      const activeProjectiles = this.bullets.getChildren().filter((bullet) => bullet?.active && bullet.getData("source") === "secondary").length;
      this.secondaryTelemetry.peakActive = Math.max(this.secondaryTelemetry.peakActive, activeProjectiles + this.secondaryEffects.length);
    }

    clearSecondaryEffects() {
      this.secondaryEffects.forEach((effect) => this.destroySecondaryEffect(effect));
      this.secondaryEffects = [];
      this.arrayLanceVolleyReady = false;
    }

    fireAtNearest(time) {
      let nearest = null;
      let nearestDistance = Number.POSITIVE_INFINITY;
      let nearestPriority = -1;
      const targetCandidates = [];
      const profile = this.weaponProfile;
      const effectiveRange = this.getPrimaryAttackRange(profile);
      const rangeSquared = effectiveRange * effectiveRange;
      const patrolTarget = this.activePatrolEvent?.type === "rift" ? this.activePatrolEvent.target : null;
      this.enemies.children.iterate((enemy) => {
        if (!enemy || !enemy.active) return;
        const distance = Phaser.Math.Distance.Squared(this.player.x, this.player.y, enemy.x, enemy.y);
        if (distance > rangeSquared) return;
        const kind = enemy.getData("kind");
        const attackState = enemy.getData("attackState");
        const priority = enemy === patrolTarget
          ? 4
          : kind === "mirrorAcolyte"
            ? 3
            : kind === "herald" || (kind !== "boss" && attackState === "warning")
              ? 2
              : 0;
        targetCandidates.push({ enemy, distance, priority });
        if (priority > nearestPriority || (priority === nearestPriority && distance < nearestDistance)) {
          nearestPriority = priority;
          nearestDistance = distance;
          nearest = enemy;
        }
      });
      if (!nearest) {
        this.priorityTarget = null;
        this.lastMainTarget = null;
        return;
      }

      this.lastMainTarget = nearest;

      if (nearestPriority > 0 && this.priorityTarget !== nearest) {
        this.priorityTarget = nearest;
        const priorityColor = nearest.getData("kind") === "mirrorAcolyte" ? 0x43d9d0 : COLORS.gold;
        this.spawnExpandingSigil(nearest.x, nearest.y, priorityColor, 48, 280);
        this.showCombatLabel(nearest.x, nearest.y - 36, "优先锁定", priorityColor);
      } else if (nearestPriority === 0) {
        this.priorityTarget = null;
      }

      this.lastShotAt = time;
      const baseAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, nearest.x, nearest.y);
      const count = this.stats.projectileCount;
      const spread = profile.spread;
      let signatureTriggered = false;
      if (this.stats.signatureLevel > 0 && profile.id !== "tracker") {
        this.signatureCounter += 1;
        if (this.signatureCounter >= this.getSignatureCycle()) {
          this.signatureCounter = 0;
          signatureTriggered = true;
        }
      }
      const isChargedLance = profile.id === "lance" && signatureTriggered;
      const isReturner = profile.id === "returner";
      const isMeleeAttack = profile.id === "scatter" || profile.id === "lance";
      let offsets = isMeleeAttack ? [] : [0];
      let trackerShotPlan = null;
      let arcShotPlan = null;
      const trackerEvolutionStage = profile.id === "tracker" ? this.getTrackerEvolutionStage() : null;
      if (!isMeleeAttack) {
        const useTrackerShotPlan = profile.id === "tracker"
          && trackerEvolutionStage
          && (
            (this.isPrecisionTrackerPrototype() && count > 1)
            || (this.isStandardTrackerVerticalSlice() && (count > 1 || trackerEvolutionStage !== "single"))
          );
        if (useTrackerShotPlan) {
          trackerShotPlan = this.getTrackerShotPlan(baseAngle, count, spread, targetCandidates);
          offsets = trackerShotPlan.shots.map((shot) => shot.angleOffset);
        } else {
          for (let ring = 1; offsets.length < count; ring += 1) {
            offsets.push(this.volleySide * ring * spread);
            if (offsets.length < count) offsets.push(-this.volleySide * ring * spread);
          }
          if (count % 2 === 0) this.volleySide *= -1;
        }
      }
      if (profile.id === "arc") arcShotPlan = this.getArcShotPlan(nearest, offsets, targetCandidates);
      if (profile.id === "scatter") this.fireScatterSweep(baseAngle, signatureTriggered);
      else if (profile.id === "lance") {
        this.fireLanceThrust(baseAngle, isChargedLance);
        this.releaseArrayLanceVolley(time, nearest, baseAngle);
      }
      const shotPlan = trackerShotPlan?.shots || arcShotPlan || offsets.map((offset) => ({
        angleOffset: offset,
        lateralOffset: 0,
        damage: this.stats.damage,
      }));
      const arcVolleyHitTargets = profile.id === "arc" ? new Set() : null;
      for (const shot of shotPlan) {
        const offset = shot.angleOffset;
        const shotTarget = shot.target?.active ? shot.target : nearest;
        const angle = shot.target?.active
          ? Phaser.Math.Angle.Between(this.player.x, this.player.y, shotTarget.x, shotTarget.y)
            + (shot.arcSplitPath ? offset : 0)
          : baseAngle + offset;
        const central = Math.abs(offset) < 0.001;
        const isEmpoweredReturn = isReturner && signatureTriggered && central;
        let shotOptions;
        if (isReturner) {
          shotOptions = {
            returnAfter: profile.returnAfter,
            returnPulseLevel: isEmpoweredReturn ? this.stats.signatureLevel : 0,
            returnDamageMultiplier: isEmpoweredReturn ? 1.15 + this.stats.signatureLevel * 0.15 : 1,
            life: isEmpoweredReturn ? profile.life + 550 : profile.life,
            scale: isEmpoweredReturn ? 1.18 + this.stats.signatureLevel * 0.06 : 1,
            hitScale: isEmpoweredReturn ? 1.1 : 1,
            signature: isEmpoweredReturn ? "returner" : null,
          };
        } else {
          shotOptions = {
            signature: profile.id === "tracker" && this.stats.signatureLevel > 0 ? "tracker" : null,
          };
        }
        if (profile.id === "arc") shotOptions.arcVolleyHitTargets = arcVolleyHitTargets;
        if (profile.id === "tracker" && trackerShotPlan) {
          const trackerStage = trackerShotPlan?.stage || this.getTrackerEvolutionStage();
          const heavyVolley = trackerShotPlan?.heavy === true;
          const lateralAngle = baseAngle + Math.PI / 2;
          shotOptions.trackerDirect = true;
          shotOptions.heavyVolley = heavyVolley;
          shotOptions.heavyVolleyId = heavyVolley ? trackerShotPlan.volleyId : null;
          shotOptions.projectileKind = heavyVolley ? "tracker-heavy-volley" : `tracker-${trackerStage || "single"}`;
          shotOptions.fxStyle = heavyVolley ? "tracker-ember" : trackerStage === "lanternMark" ? "tracker-mark" : "tracker";
          shotOptions.color = heavyVolley ? 0xfff0a3 : trackerStage === "lanternMark" ? COLORS.goldHot : profile.colorValue;
          shotOptions.glow = trackerStage !== "single";
          shotOptions.scale = heavyVolley ? 1.28 : trackerStage === "single" ? 0.96 : trackerStage === "lanternMark" ? 1.18 : 1.12;
          shotOptions.hitScale = heavyVolley ? 1.18 : trackerStage === "lanternMark" ? 1.12 : 1;
          shotOptions.trailRadius = heavyVolley ? 7 : trackerStage === "single" ? 3 : 4;
          shotOptions.damage = shot.damage;
          shotOptions.canCrit = !heavyVolley;
          shotOptions.tintProjectile = trackerStage !== "single";
          shotOptions.spawnOffsetX = Math.cos(lateralAngle) * shot.lateralOffset;
          shotOptions.spawnOffsetY = Math.sin(lateralAngle) * shot.lateralOffset;
        }
        if (profile.id === "arc" && signatureTriggered && shot.arcPrimary) {
          shotOptions.weaponEffect = "arc";
          shotOptions.effectLevel = this.stats.signatureLevel;
          shotOptions.scale = 1.24 + this.stats.signatureLevel * 0.08;
          shotOptions.glow = true;
        }
        if (profile.id === "nova") {
          const empowered = signatureTriggered && central;
          shotOptions.weaponEffect = "nova";
          shotOptions.effectLevel = empowered ? this.stats.signatureLevel : 0;
          shotOptions.novaFullVfx = central;
          shotOptions.damage = empowered
            ? Math.round(this.stats.damage * (1.2 + this.stats.signatureLevel * 0.1))
            : this.stats.damage;
          shotOptions.scale = empowered ? 1.28 + this.stats.signatureLevel * 0.08 : 1;
          shotOptions.glow = empowered;
        }
        this.spawnPlayerBullet(angle, shotTarget, shotOptions);
      }
      if (profile.id !== "scatter") {
        this.spawnWeaponMuzzle(
          baseAngle,
          profile.fxStyle,
          profile.colorValue,
          trackerShotPlan?.heavy === true
            || isChargedLance
            || (isReturner && signatureTriggered)
            || (["arc", "nova"].includes(profile.id) && signatureTriggered),
        );
      }
      if (isChargedLance) {
        this.spawnRipple(this.player.x, this.player.y, profile.colorValue);
        this.burstAt(this.player.x, this.player.y, profile.colorValue, 8 + this.stats.signatureLevel * 2);
        this.announceWeaponTrigger(this.player.x, this.player.y - 34, "重枪贯阵");
        soundscape.play("pulse");
      }
      if (isReturner && signatureTriggered) {
        this.spawnExpandingSigil(this.player.x, this.player.y - 5, profile.colorValue, 44, 260);
      }
      this.updateWeaponState();
      soundscape.play(profile.id === "scatter" ? "scatterSlash" : profile.id === "lance" ? (isChargedLance ? "lanceHeavy" : "lanceThrust") : "shot");
      this.player.rotation = Math.sin(time / 45) * 0.025;
      this.time.delayedCall(70, () => {
        if (this.player?.active) this.player.rotation = 0;
      });
    }

    onBulletHit(bullet, enemy) {
      if (!bullet.active || !enemy.active) return;
      if (bullet.getData("source") === "secondary") {
        this.onSecondaryBulletHit(bullet, enemy);
        return;
      }
      const hitTargets = bullet.getData("hitTargets");
      if (hitTargets?.has(enemy)) return;
      hitTargets?.add(enemy);
      const impactAngle = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
      this.applyPrimaryAttackHit(enemy, { bullet, impactAngle });
      if (this.ended) {
        if (bullet.active) bullet.destroy();
        return;
      }
      if ((bullet.getData("returnAfter") || 0) > 0) return;
      const pierce = bullet.getData("pierce") || 0;
      if (pierce <= 0) bullet.destroy();
      else bullet.setData("pierce", pierce - 1);
    }

    onEnemyProjectileHit(player, shot) {
      if (!shot.active || this.ended) return;
      const impactX = shot.x;
      const impactY = shot.y;
      const damage = shot.getData("damage") || 7;
      const color = shot.getData("color") || COLORS.violet;
      const style = shot.getData("fxStyle") || "hexer";
      const slowDuration = shot.getData("slowDuration") || 0;
      const prototypeSource = shot.getData("prototypeSource");
      const prototypeWarningAt = shot.getData("prototypeWarningAt");
      const prototypeDangerAt = shot.getData("prototypeDangerAt");
      const impactAngle = Math.atan2(shot.body.velocity.y, shot.body.velocity.x);
      shot.destroy();
      this.spawnProjectileImpact(impactX, impactY, color, style, impactAngle);
      if (this.gameplayTime < this.dashInvulnerableUntil) {
        this.showDashEvade(impactX, impactY);
        return;
      }
      if (this.stats.aegisLevel > 0 && this.tryAegisBlock(impactX, impactY)) return;
      if (prototypeSource === "boss-safe-gap") {
        if (
          this.bossGapDodgeTracking?.active
          && this.bossGapDodgeTracking.source === prototypeSource
          && this.bossGapDodgeTracking.warningAt === prototypeWarningAt
        ) {
          this.bossGapDodgeTracking.hit = true;
        }
        this.recordPrecisionPrototypeEvent("boss-gap-hit", {
          source: prototypeSource,
          warningAt: prototypeWarningAt,
          dangerAt: prototypeDangerAt,
          hitAt: this.gameplayTime,
          damage,
        });
      }
      this.registerActDamage();
      this.playerHealth = Math.max(0, this.playerHealth - damage);
      if (slowDuration > 0) {
        this.playerSlowedUntil = Math.max(this.playerSlowedUntil, this.gameplayTime + slowDuration);
        this.showCombatLabel(player.x, player.y - 34, "霜缓", COLORS.ice);
      }
      const angle = Phaser.Math.Angle.Between(impactX, impactY, player.x, player.y);
      player.x += Math.cos(angle) * 14;
      player.y += Math.sin(angle) * 14;
      this.burstAt(impactX, impactY, color, 7);
      this.flashDamage();
      if (this.playerHealth <= 0) this.finishRun(false, "守夜人倒下了，随身火种沉入长夜。");
    }

    damageEnemy(enemy, amount, bullet, impactColor = null) {
      if (this.ended || !enemy.active) return;
      const isBoss = enemy.getData("kind") === "boss";
      const isTrackerDirectHit = bullet?.getData("trackerDirect") === true && this.isTrackerEvolutionActive();
      const isHeavyTrackerHit = isTrackerDirectHit && bullet?.getData("heavyVolley") === true;
      const hitsVulnerability = isBoss && enemy.getData("attackState") === "recovering";
      let remainingDamage = Math.round(hitsVulnerability ? amount * 1.35 : amount);
      if (isBoss && this.battlefieldProfile.id === "lantern-court" && this.countBossAttendants() > 0) {
        remainingDamage = Math.max(1, Math.round(remainingDamage * 0.8));
      }
      if (hitsVulnerability && this.gameplayTime >= this.bossVulnerabilityNoticeAt) {
        this.bossVulnerabilityNoticeAt = this.gameplayTime + 620;
        this.showCombatLabel(enemy.x, enemy.y - 56, "破绽增伤", COLORS.gold);
      }
      const armor = enemy.getData("armor") || 0;
      if (armor > 0) {
        const absorbed = Math.min(armor, remainingDamage);
        const nextArmor = armor - absorbed;
        remainingDamage -= absorbed;
        enemy.setData("armor", nextArmor);
        enemy.setTint(COLORS.armor);
        this.showDamageNumber(enemy.x, enemy.y, absorbed, false, "#8cebe0");
        this.burstAt(enemy.x, enemy.y, COLORS.armor, 4);
        if (nextArmor <= 0) {
          const armorRing = enemy.getData("armorRing");
          if (armorRing?.active) armorRing.destroy();
          enemy.setData("armorRing", null);
          this.spawnRipple(enemy.x, enemy.y, COLORS.armor);
          this.showCombatLabel(enemy.x, enemy.y - 32, "破甲", COLORS.armor);
        }
        this.updateEnemyDecorations(enemy);
        if (remainingDamage <= 0) {
          if (isTrackerDirectHit) {
            this.recordTrackerEvolutionMetric("direct-hit", { x: Math.round(enemy.x), y: Math.round(enemy.y), armorOnly: true });
            const heavyImpactShown = isHeavyTrackerHit && this.registerTrackerHeavyImpact(bullet, enemy.x, enemy.y);
            if (!heavyImpactShown) {
              this.showTrackerDirectFeedback(enemy.x, enemy.y, "hit");
              soundscape.play("trackerHit");
            }
          } else {
            soundscape.play("hit");
          }
          this.time.delayedCall(70, () => {
            if (enemy.active) enemy.clearTint();
          });
          return;
        }
      }
      const health = enemy.getData("hp") - remainingDamage;
      enemy.setData("hp", health);
      enemy.setTintFill(0xffffff);
      const throttlePressureCrowdDamageNumber = (
        this.isStandardMirrorHarborPressureSlice()
        && (
          (enemy.getData("bossWaveMinion") === true && this.countBossCrowd() >= 24)
          || (enemy.getData("pressureBruiser") === true && this.countPressureBruisers() >= 18)
        )
      ) || (
        this.isStandardLanternCourtSiegeSlice()
        && enemy.getData("citySiege") === true
        && this.countCitySiege() >= 24
      );
      if (!throttlePressureCrowdDamageNumber || this.gameplayTime >= this.nextBossCrowdDamageNumberAt) {
        this.showDamageNumber(enemy.x, enemy.y, remainingDamage, isBoss, hitsVulnerability ? "#fff0a3" : null);
        if (throttlePressureCrowdDamageNumber) this.nextBossCrowdDamageNumberAt = this.gameplayTime + 80;
      }
      this.time.delayedCall(55, () => {
        if (enemy.active) enemy.clearTint();
      });
      const resolvedImpactColor = isBoss
        ? (hitsVulnerability ? COLORS.gold : COLORS.red)
        : impactColor ?? bullet?.getData("color") ?? COLORS.gold;
      this.burstAt(enemy.x, enemy.y, resolvedImpactColor, bullet ? 3 : 2);
      this.updateEnemyDecorations(enemy);
      if (isBoss) this.updateBossHud();
      if (isTrackerDirectHit) {
        this.recordTrackerEvolutionMetric("direct-hit", { x: Math.round(enemy.x), y: Math.round(enemy.y), kill: health <= 0 });
        const heavyImpactShown = isHeavyTrackerHit && this.registerTrackerHeavyImpact(bullet, enemy.x, enemy.y);
        if (health <= 0) {
          this.recordTrackerEvolutionMetric("direct-kill", { x: Math.round(enemy.x), y: Math.round(enemy.y) });
          this.showTrackerDirectFeedback(enemy.x, enemy.y, "kill");
          soundscape.play("trackerKill");
        } else if (!heavyImpactShown) {
          this.showTrackerDirectFeedback(enemy.x, enemy.y, "hit");
          soundscape.play("trackerHit");
        }
      } else {
        soundscape.play("hit");
      }
      if (health <= 0) this.killEnemy(enemy, { suppressKillSound: isTrackerDirectHit });
    }

    killEnemy(enemy, options = {}) {
      if (!enemy.active) return;
      const suppressKillSound = options.suppressKillSound === true;
      const kind = enemy.getData("kind");
      const xpValue = enemy.getData("xp");
      const isPrototypeHorde = enemy.getData("prototypeHorde") === true;
      const isPressureFodder = enemy.getData("pressureFodder") === true;
      const isPressureBruiser = enemy.getData("pressureBruiser") === true;
      const isCitySiege = enemy.getData("citySiege") === true;
      const x = enemy.x;
      const y = enemy.y;
      const deathVfxSpawned = this.spawnDeathVfx(
        enemy,
        enemyCatalog[kind]?.color || (kind === "boss" ? this.battlefieldProfile.accentValue : COLORS.red),
      );
      this.destroyEnemyDecorations(enemy);
      enemy.disableBody(true, true);
      this.kills += 1;
      const isBossMinion = Boolean(enemyCatalog[kind]?.bossMinion);
      const isBossWaveMinion = Boolean(enemy.getData("bossWaveMinion"));
      let pressureFodderRewardReady = false;
      let pressureBruiserRewardReady = false;
      if (isPressureFodder) {
        this.pressureFodderKillCredit += 1;
        if (this.pressureFodderKillCredit >= STANDARD_MIRROR_FODDER_REWARD_KILLS) {
          this.pressureFodderKillCredit = 0;
          pressureFodderRewardReady = true;
          this.spawnSpark(x, y, 1);
          this.gainShopCurrency(1);
        }
      }
      if (isPressureBruiser) {
        this.pressureBruiserKillCredit += 1;
        if (this.pressureBruiserKillCredit >= STANDARD_MIRROR_BRUISER_REWARD_KILLS) {
          this.pressureBruiserKillCredit = 0;
          pressureBruiserRewardReady = true;
          this.spawnSpark(x, y, 1);
          this.gainShopCurrency(1);
        }
      }
      if (isCitySiege && !isBossWaveMinion) {
        const isElite = Boolean(enemyCatalog[kind]?.elite);
        this.gainShopCurrency(isElite ? 4 : 1);
        this.citySiegeKillCredit += 1;
        if (this.citySiegeKillCredit >= STANDARD_CITY_SIEGE_REWARD_KILLS) {
          this.citySiegeKillCredit = 0;
          this.spawnSpark(x, y, 1);
        }
      }
      if (isBossMinion) {
        this.gainEmberCharge(10, "噬光侍从");
        this.showCombatLabel(x, y - 30, "侍从熄灭 · 火种 +10", COLORS.gold);
        if (this.countBossAttendants() === 0 && this.boss?.active) {
          const nextSummonAt = this.gameplayTime + 12000;
          this.boss.setData("nextSummonAt", nextSummonAt);
          this.bossSummonTelemetry.lastClearedAt = this.gameplayTime;
          this.bossSummonTelemetry.nextAllowedAt = nextSummonAt;
          this.showCombatLabel(this.boss.x, this.boss.y - 62, "护灯已破", COLORS.gold);
          this.updateBossPhaseHud(this.boss);
        }
      } else if (isBossWaveMinion) {
        this.bossCrowdTelemetry.kills += 1;
        if (
          (!isPressureFodder && !isPressureBruiser)
          || pressureFodderRewardReady
          || pressureBruiserRewardReady
        ) this.gainEmberCharge(2, isPressureBruiser ? "厚潮近战群" : "扑灯幼影");
      }
      if (
        kind !== "boss"
        && kind !== "rift"
        && !isBossMinion
        && !isBossWaveMinion
        && !isPrototypeHorde
        && !isPressureFodder
        && !isPressureBruiser
        && !isCitySiege
      ) {
        const isElite = Boolean(enemyCatalog[kind]?.elite);
        const quickCurrencyScale = RUN_PROFILE.id === "quick" ? 3 : 1;
        this.gainShopCurrency((isElite ? 4 : 1) * quickCurrencyScale);
        if (this.shopRelics.has("watch-scale") && xpValue > 0) {
          this.watchScaleKills += 1;
          if (this.watchScaleKills >= 30) {
            this.watchScaleKills = 0;
            this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 5);
            this.showCombatLabel(this.player.x, this.player.y - 34, "守夜刻度 · 生命 +5", COLORS.green);
          }
        }
      }
      const deathBurstCount = kind === "boss"
        ? (this.usesCompactControls() ? 14 : 22)
        : deathVfxSpawned ? (this.usesCompactControls() ? 6 : 8) : (this.usesCompactControls() ? 2 : 3);
      this.burstAt(x, y, enemyCatalog[kind]?.color || COLORS.red, deathBurstCount);
      if (isPrototypeHorde) this.recordPrototypeHordeKill(enemy, x, y);

      if (kind === "boss") {
        this.bossAlive = false;
        this.boss = null;
        this.clearBossAttendants(false);
        this.clearBossCrowd();
        this.clearBossHazards();
        this.bossTelegraph.clear();
        ui.bossStatus.hidden = true;
        this.elapsed = RUN_DURATION;
        ui.waveLabel.textContent = `${RUN_END_LABEL} · 黎明抵达`;
        this.spawnBossDeathSpectacle(x, y, this.battlefieldProfile.id === "mirror-harbor" ? 0x43d9d0 : COLORS.gold);
        enemy.destroy();
        this.updateHud(true);
        this.finishRun(true, this.battlefieldProfile.finishMessage);
        return;
      } else if (kind === "rift") {
        soundscape.recordKill({ suppressBase: suppressKillSound });
        this.completePatrolEvent("rift", x, y);
        enemy.destroy();
        return;
      } else {
        soundscape.recordKill({ suppressBase: suppressKillSound });
        if (xpValue > 0) this.spawnSpark(x, y, xpValue);
        if (kind === "splitter" && !isPressureBruiser) {
          this.spawnRipple(x, y, COLORS.goldHot);
          this.spawnEnemy("shard", x - 10, y + 5);
          this.spawnEnemy("shard", x + 10, y - 5);
        }
      }
      enemy.destroy();
    }

    spawnSpark(x, y, value) {
      const spark = this.sparks.create(x, y, "spark").setDepth(5);
      spark.setData({ value, bornAt: this.gameplayTime });
      spark.setVelocity(Phaser.Math.Between(-45, 45), Phaser.Math.Between(-45, 45));
      spark.setAngularVelocity(Phaser.Math.Between(-120, 120));
    }

    collectSpark(spark) {
      if (!spark.active) return;
      const value = spark.getData("value") || 1;
      this.xp += value;
      spark.destroy();
      this.gainEmberCharge(2 + value * 1.25, "击退余火");
      soundscape.recordPickup(value);
      this.burstAt(this.player.x, this.player.y, COLORS.violet, 3);
      this.tryShowLevelUp();
    }

    tryShowLevelUp() {
      if (
        this.ended ||
        this.isChoosing ||
        this.bossPreludeStarted ||
        this.bossSpawned ||
        this.gameplayTime < this.nextUpgradeAt ||
        this.xp < this.nextXp
      ) return false;
      this.xp -= this.nextXp;
      this.level += 1;
      this.nextUpgradeAt = this.gameplayTime + UPGRADE_MIN_INTERVAL;
      this.nextXp = Math.round(this.nextXp * 1.2 + 6);
      this.updateHud(true);
      this.showUpgradeChoice();
      return true;
    }

    getPrototypeTrackerRecommendedUpgrade(available) {
      if (!this.isPrecisionTrackerPrototype()) return null;
      const nextId = ["lanternMark", "volley", "focus"]
        .find((id) => (this.upgradeLevels[id] || 0) < 1);
      if (!nextId) return null;
      return available.find((upgrade) => upgrade.id === nextId) || null;
    }

    filterPrototypeTrackerUpgradeChoices(available) {
      if (!this.isPrecisionTrackerPrototype()) return available;
      const targetOrder = ["lanternMark", "volley", "focus"];
      const nextTarget = targetOrder.find((id) => (this.upgradeLevels[id] || 0) < 1);
      if (!nextTarget) return available;
      const lockedTargets = new Set(targetOrder.filter((id) => id !== nextTarget));
      return available.filter((upgrade) => !lockedTargets.has(upgrade.id));
    }

    getAvailableUpgradeChoices() {
      return this.filterPrototypeTrackerUpgradeChoices(upgradeCatalog.filter((upgrade) => (
        this.upgradeLevels[upgrade.id] < upgrade.maxLevel
        && (!upgrade.weaponOnly || upgrade.weaponOnly === this.weaponProfile.id)
      )));
    }

    getUpgradeAct() {
      return Math.min(3, Math.max(1, this.wavePhase || 1));
    }

    syncUpgradeRerollAct() {
      const act = this.getUpgradeAct();
      if (this.upgradeRerollAct !== act) {
        this.upgradeRerollAct = act;
        this.upgradeRerollAvailable = true;
      }
      return act;
    }

    buildInitialUpgradeChoices(available) {
      const needsFirstSynergy = this.activeSynergies.size === 0;
      const partner = needsFirstSynergy ? this.getPendingSynergyPartner() : null;
      const featuredSkillId = needsFirstSynergy ? ["frost", "chain", "aegis", "afterglow"][this.level - 2] : null;
      const featuredSkill = available.find((upgrade) => upgrade.id === featuredSkillId);
      const prototypeTrackerUpgrade = this.getPrototypeTrackerRecommendedUpgrade(available);
      const featuredSignature = this.level === 2
        ? available.find((upgrade) => upgrade.id === this.weaponProfile.signatureUpgrade)
        : null;
      const guaranteed = [prototypeTrackerUpgrade, featuredSignature, partner, featuredSkill]
        .filter(Boolean)
        .filter((upgrade, index, items) => items.findIndex((item) => item.id === upgrade.id) === index);
      const guaranteedIds = new Set(guaranteed.map((upgrade) => upgrade.id));
      const remaining = available.filter((upgrade) => !guaranteedIds.has(upgrade.id));
      Phaser.Utils.Array.Shuffle(remaining);
      return [...guaranteed, ...remaining.slice(0, Math.max(0, 3 - guaranteed.length))].slice(0, 3);
    }

    buildRerolledUpgradeChoices(available) {
      const previousIds = new Set(this.currentUpgradeChoiceIds);
      const replacements = available.filter((upgrade) => !previousIds.has(upgrade.id));
      if (replacements.length < 3) return null;
      Phaser.Utils.Array.Shuffle(replacements);
      return replacements.slice(0, 3);
    }

    renderUpgradeChoices(choices) {
      this.currentUpgradeChoiceIds = choices.map((upgrade) => upgrade.id);
      ui.upgradeOptions.innerHTML = choices
        .map((upgrade, index) => {
          const currentLevel = this.upgradeLevels[upgrade.id];
          const completingSynergy = this.getCompletingSynergy(upgrade.id);
          const synergyHint = completingSynergy || this.getStartingSynergy(upgrade.id);
          const synergyClass = completingSynergy ? " upgrade-card--synergy-ready" : "";
          const weaponClass = upgrade.weaponOnly ? " upgrade-card--weapon" : "";
          const synergyStyle = synergyHint ? `;--synergy-color:${synergyHint.color}` : "";
          const synergyText = completingSynergy
            ? `选择后解锁 · ${completingSynergy.name}（自动触发）`
            : synergyHint ? `共鸣组件 · ${synergyHint.name} 1/2` : "";
          const weaponRoute = upgrade.weaponOnly
            ? `${this.weaponProfile.name}专属 · ${this.weaponProfile.signatureSummary}`
            : "";
          return `
            <button class="upgrade-card${synergyClass}${weaponClass}" type="button" data-upgrade="${upgrade.id}" style="--upgrade-color:${upgrade.color}${synergyStyle}">
              <span class="upgrade-card__top">
                <span class="upgrade-card__index">0${index + 1} / CHOICE</span>
                <span class="upgrade-card__sigil">${upgrade.sigil}</span>
              </span>
              <span class="upgrade-card__body">
                ${weaponRoute ? `<span class="upgrade-card__route">${weaponRoute}</span>` : ""}
                <strong>${upgrade.name}</strong>
                <span>${upgrade.description}</span>
                ${synergyText ? `<span class="upgrade-card__synergy">${synergyText}</span>` : ""}
              </span>
              <span class="upgrade-card__level">当前 ${currentLevel} · 上限 ${upgrade.maxLevel}</span>
            </button>`;
        })
        .join("");
      this.syncUpgradeRerollUi();
      ui.upgradeOptions.querySelector("button")?.focus({ preventScroll: true });
    }

    syncUpgradeRerollUi() {
      const act = this.syncUpgradeRerollAct();
      const actLabel = ["", "第一幕", "第二幕", "第三幕"][act];
      const available = this.getAvailableUpgradeChoices();
      const previousIds = new Set(this.currentUpgradeChoiceIds);
      const replacementCount = available.filter((upgrade) => !previousIds.has(upgrade.id)).length;
      const canReroll = this.choiceMode === "upgrade"
        && ui.upgradeScreen.hidden === false
        && !this.ended
        && this.upgradeRerollAvailable
        && replacementCount >= 3;
      ui.upgradeRefreshButton.disabled = !canReroll;
      ui.upgradeRefreshButton.textContent = !this.upgradeRerollAvailable
        ? `${actLabel} · 已刷新`
        : replacementCount < 3 ? `${actLabel} · 可替代项不足` : `${actLabel} · 刷新全部三项（1次）`;
      return canReroll;
    }

    showUpgradeChoice() {
      if (!this.enterChoiceMode("upgrade")) return false;
      ui.upgradeScreen.hidden = false;
      soundscape.play("level");
      this.syncUpgradeRerollAct();
      const choices = this.buildInitialUpgradeChoices(this.getAvailableUpgradeChoices());
      this.renderUpgradeChoices(choices);
      return true;
    }

    rerollUpgradeChoices() {
      if (
        this.choiceMode !== "upgrade"
        || ui.upgradeScreen.hidden
        || this.ended
        || !this.upgradeRerollAvailable
      ) return false;
      this.syncUpgradeRerollAct();
      const choices = this.buildRerolledUpgradeChoices(this.getAvailableUpgradeChoices());
      if (!choices) {
        this.syncUpgradeRerollUi();
        return false;
      }
      this.upgradeRerollAvailable = false;
      this.renderUpgradeChoices(choices);
      soundscape.play("toggle", true);
      return true;
    }

    getUpgradeChoiceState() {
      const available = this.getAvailableUpgradeChoices();
      const previousIds = new Set(this.currentUpgradeChoiceIds);
      const replacementCount = available.filter((upgrade) => !previousIds.has(upgrade.id)).length;
      return {
        open: this.choiceMode === "upgrade" && ui.upgradeScreen.hidden === false,
        act: this.getUpgradeAct(),
        remaining: this.upgradeRerollAvailable ? 1 : 0,
        canReroll: this.choiceMode === "upgrade"
          && ui.upgradeScreen.hidden === false
          && !this.ended
          && this.upgradeRerollAvailable
          && replacementCount >= 3,
        choiceIds: this.currentUpgradeChoiceIds.slice(),
      };
    }

    getCompletingSynergy(upgradeId) {
      return synergyCatalog.find((synergy) => {
        if (this.activeSynergies.has(synergy.id) || !synergy.requirements[upgradeId]) return false;
        return Object.entries(synergy.requirements).every(([requiredId, requiredLevel]) => {
          const nextLevel = this.upgradeLevels[requiredId] + (requiredId === upgradeId ? 1 : 0);
          return nextLevel >= requiredLevel;
        });
      });
    }

    getStartingSynergy(upgradeId) {
      return synergyCatalog.find((synergy) => {
        if (this.activeSynergies.has(synergy.id)) return false;
        return (synergy.requirements[upgradeId] || 0) > this.upgradeLevels[upgradeId];
      });
    }

    getPendingSynergyPartner() {
      for (const synergy of synergyCatalog) {
        if (this.activeSynergies.has(synergy.id)) continue;
        const missing = Object.entries(synergy.requirements)
          .filter(([upgradeId, requiredLevel]) => this.upgradeLevels[upgradeId] < requiredLevel);
        if (missing.length !== 1) continue;
        const partner = upgradeCatalog.find((upgrade) => upgrade.id === missing[0][0]);
        if (partner && this.upgradeLevels[partner.id] < partner.maxLevel) return partner;
      }
      return null;
    }

    unlockSynergies() {
      const unlocked = [];
      synergyCatalog.forEach((synergy) => {
        if (this.activeSynergies.has(synergy.id)) return;
        const requirementsMet = Object.entries(synergy.requirements)
          .every(([upgradeId, requiredLevel]) => this.upgradeLevels[upgradeId] >= requiredLevel);
        if (!requirementsMet) return;
        this.activeSynergies.add(synergy.id);
        unlocked.push(synergy);
      });
      return unlocked;
    }

    grantUpgrade(id) {
      const upgrade = upgradeCatalog.find((item) => item.id === id);
      if (!upgrade || this.upgradeLevels[id] >= upgrade.maxLevel) return null;
      if (upgrade.weaponOnly && upgrade.weaponOnly !== this.weaponProfile.id) return null;
      this.upgradeLevels[id] += 1;
      upgrade.apply(this);
      const unlockedSynergies = this.unlockSynergies();
      this.refreshTrackerEvolutionTelemetry();
      return { upgrade, unlockedSynergies };
    }

    applyUpgrade(id) {
      if (this.choiceMode !== "upgrade") return false;
      const granted = this.grantUpgrade(id);
      if (!granted) return false;
      const { upgrade, unlockedSynergies } = granted;
      this.combatUpgradeCount += 1;
      ui.upgradeScreen.hidden = true;
      this.currentUpgradeChoiceIds = [];
      if (!this.leaveChoiceMode("upgrade")) return false;
      if (unlockedSynergies.length) {
        const synergy = unlockedSynergies[0];
        ui.objectiveText.textContent = `已解锁 · ${synergy.name}（自动触发）`;
        soundscape.play("synergy", true);
        this.showPhaseBanner("组合已解锁", synergy.name, `自动生效 · ${synergy.description}`);
      } else if (upgrade.weaponOnly) {
        ui.objectiveText.textContent = `专属成长 · ${upgrade.name} ${this.upgradeLevels[id]}级`;
        soundscape.play("upgrade", true);
        if (this.upgradeLevels[id] === 1) {
          this.showPhaseBanner("武器专属", upgrade.name, upgrade.description);
        }
      } else {
        ui.objectiveText.textContent = `${upgrade.name}已融入火种`;
        soundscape.play(id === "volley" ? "volley" : "upgrade", id === "volley");
      }
      this.renderBuild();
      this.updateHud(true);
      ui.pauseButton.focus({ preventScroll: true });
      return true;
    }

    renderBuild() {
      const activeUpgrades = upgradeCatalog.filter((upgrade) => this.upgradeLevels[upgrade.id] > 0);
      const activeSynergies = synergyCatalog.filter((synergy) => this.activeSynergies.has(synergy.id));
      const activeRelics = patrolRelicCatalog.filter((relic) => this.patrolRelics.has(relic.id));
      const activeShopRelics = shopRelicCatalog.filter((relic) => this.shopRelics.has(relic.id));
      const activeSecondaries = this.getSecondaryProfiles();
      const weaponMarkup = `<span class="build-sigil build-sigil--weapon" style="--build-color:${this.weaponProfile.color}" title="${this.weaponProfile.name}：${this.weaponProfile.description}" aria-label="当前武器 ${this.weaponProfile.name}">${this.weaponProfile.sigil}<b>器</b></span>`;
      const secondaryMarkup = activeSecondaries
        .map((secondary) => `<span class="build-sigil build-sigil--secondary" style="--build-color:${secondary.color}" title="${secondary.name}：${secondary.description}" aria-label="副武器 ${secondary.name}">${secondary.sigil}<b>副</b></span>`)
        .join("");
      this.updateWeaponState();
      ui.synergyList.hidden = activeSynergies.length === 0;
      ui.synergyList.innerHTML = activeSynergies
        .map((synergy) => `
          <div class="synergy-row" data-synergy="${synergy.id}" style="--synergy-color:${synergy.color}" title="${synergy.description}">
            <span class="synergy-row__sigil">${synergy.sigil}</span>
            <span><small>自动共鸣</small><strong>${synergy.name}</strong></span>
          </div>`)
        .join("");
      if (!activeUpgrades.length && !activeRelics.length && !activeShopRelics.length && !activeSecondaries.length) {
        ui.buildList.innerHTML = `${weaponMarkup}<span class="build-list__empty">火种尚未共鸣</span>`;
        return;
      }
      const relicMarkup = activeRelics
        .map((relic) => `<span class="build-sigil build-sigil--relic" style="--build-color:${relic.color}" title="${relic.name}：${relic.description}" aria-label="巡夜遗物 ${relic.name}"><i>${relic.sigil}</i><b>遗</b></span>`)
        .join("");
      const shopRelicMarkup = activeShopRelics
        .map((relic) => `<span class="build-sigil build-sigil--relic" style="--build-color:${relic.color}" title="${relic.name}：${relic.description}" aria-label="商店遗物 ${relic.name}"><i>${relic.sigil}</i><b>购</b></span>`)
        .join("");
      const upgradeMarkup = activeUpgrades
        .map((upgrade) => {
          const level = this.upgradeLevels[upgrade.id];
          const signatureClass = upgrade.weaponOnly ? " build-sigil--signature" : "";
          return `<span class="build-sigil${signatureClass}" style="--build-color:${upgrade.color}" title="${upgrade.name} ${level}级" aria-label="${upgrade.name} ${level}级">${upgrade.sigil}<b>${level}</b></span>`;
        })
        .join("");
      ui.buildList.innerHTML = weaponMarkup + secondaryMarkup + relicMarkup + shopRelicMarkup + upgradeMarkup;
    }

    announceSynergyTrigger(id, x, y, detail) {
      const now = this.gameplayTime;
      if (now < (this.synergyFeedbackAt[id] || 0)) return;
      const synergy = synergyCatalog.find((item) => item.id === id);
      if (!synergy) return;
      this.synergyFeedbackAt[id] = now + 1800;
      ui.objectiveText.textContent = `自动触发 · ${synergy.name}`;
      const status = ui.synergyList.querySelector(`[data-synergy="${id}"]`);
      if (status) {
        status.classList.remove("is-triggered");
        void status.offsetWidth;
        status.classList.add("is-triggered");
        status.addEventListener("animationend", () => status.classList.remove("is-triggered"), { once: true });
      }
      const labelX = Phaser.Math.Clamp(x, 92, this.scale.width - 92);
      const labelY = Math.max(54, y - 24);
      const label = this.add.text(labelX, labelY, `${synergy.name} · ${detail}`, {
        fontFamily: "STKaiti, KaiTi, Georgia, serif",
        fontSize: "13px",
        fontStyle: "bold",
        color: synergy.color,
        stroke: "#071012",
        strokeThickness: 4,
      }).setOrigin(0.5).setDepth(35);
      this.tweens.add({
        targets: label,
        y: labelY - 30,
        alpha: 0,
        duration: 920,
        ease: "Quad.easeOut",
        onComplete: () => label.destroy(),
      });
    }

    syncOrbitals() {
      const desired = this.stats.orbitLevel + 1;
      while (this.orbitals.length < desired) {
        const orbital = this.add.image(this.player.x, this.player.y, "orbital")
          .setDepth(9)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setData("trailAt", 0);
        this.orbitals.push(orbital);
      }
    }

    releaseDawnPulse() {
      this.dawnCooldown = Math.max(2600, 5600 - this.stats.dawnLevel * 650);
      const radius = 210 + this.stats.dawnLevel * 35;
      const firstDamage = 20 + this.stats.dawnLevel * 16;
      const echoDamage = Math.round(firstDamage * 0.7);
      this.spawnExpandingSigil(this.player.x, this.player.y, COLORS.paper, radius, 610);
      this.spawnRadialShards(
        this.player.x,
        this.player.y,
        COLORS.paper,
        12,
        Math.min(126, radius * 0.48),
        Math.PI / 12,
        0.56,
      );
      this.burstAt(this.player.x, this.player.y, COLORS.gold, 14);
      this.cameras.main.flash(120, 255, 244, 190, false);
      soundscape.play("pulse");
      this.enemies.children.iterate((enemy) => {
        if (!enemy || !enemy.active) return;
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) <= radius) {
          this.damageEnemy(enemy, firstDamage, null);
        }
      });
      if (this.ended) return;
      this.time.delayedCall(320, () => {
        if (this.ended || !this.player?.active) return;
        const echoX = this.player.x;
        const echoY = this.player.y;
        this.spawnExpandingSigil(echoX, echoY, COLORS.gold, radius, 540, 0, Math.PI / 4);
        this.burstAt(echoX, echoY, COLORS.gold, 4);
        this.enemies.children.iterate((enemy) => {
          if (!enemy || !enemy.active) return;
          if (Phaser.Math.Distance.Between(echoX, echoY, enemy.x, enemy.y) <= radius) {
            this.damageEnemy(enemy, echoDamage, null);
          }
        });
        this.showCombatLabel(echoX, echoY - 36, `天光回响 ${echoDamage}`, COLORS.gold);
        soundscape.play("pulse", true);
      });
    }

    onPlayerContact(player, enemy) {
      if (!enemy.active || this.ended) return;
      const now = this.gameplayTime;
      if (now < enemy.getData("nextPlayerHitAt")) return;
      const kind = enemy.getData("kind");
      const isBossCharge = kind === "boss" && enemy.getData("attackState") === "charging";
      const isChargerCharge = kind === "charger" && enemy.getData("attackState") === "charging";
      const isCharge = isBossCharge || isChargerCharge;
      enemy.setData("nextPlayerHitAt", now + (isCharge ? 1100 : 640));
      if (now < this.dashInvulnerableUntil) {
        const evadeAngle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
        enemy.x += Math.cos(evadeAngle) * 32;
        enemy.y += Math.sin(evadeAngle) * 32;
        if (isBossCharge) this.endBossCharge(enemy, now);
        if (isChargerCharge) this.endChargerCharge(enemy, now);
        this.showDashEvade(enemy.x, enemy.y);
        return;
      }
      const damage = isBossCharge
        ? 18
        : isChargerCharge ? enemy.getData("damage") : Math.max(4, Math.round(enemy.getData("damage") * 0.72));
      if (this.stats.aegisLevel > 0 && this.tryAegisBlock(enemy.x, enemy.y)) {
        const blockAngle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
        enemy.x += Math.cos(blockAngle) * 28;
        enemy.y += Math.sin(blockAngle) * 28;
        if (isBossCharge) this.endBossCharge(enemy, now);
        if (isChargerCharge) this.endChargerCharge(enemy, now);
        return;
      }
      this.registerActDamage();
      this.playerHealth = Math.max(0, this.playerHealth - damage);
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
      const knockback = isBossCharge ? 38 : isChargerCharge ? 30 : 15;
      player.x += Math.cos(angle) * knockback;
      player.y += Math.sin(angle) * knockback;
      if (isBossCharge) this.endBossCharge(enemy, now);
      if (isChargerCharge) this.endChargerCharge(enemy, now);
      if (this.stats.thornsLevel > 0 && enemy.active) {
        const retaliation = 8 + this.stats.thornsLevel * 6;
        this.damageEnemy(enemy, retaliation, null);
        this.showCombatLabel(enemy.x, enemy.y - 30, `逆火 ${retaliation}`, COLORS.red);
      }
      this.flashDamage();
      if (this.playerHealth <= 0) this.finishRun(false, "守夜人倒下了，随身火种沉入长夜。");
    }

    flashDamage() {
      this.trySharedVow();
      ui.damageVignette.classList.remove("is-hit");
      void ui.damageVignette.offsetWidth;
      ui.damageVignette.classList.add("is-hit");
      soundscape.play("damage");
      this.cameras.main.shake(120, 0.006);
      this.updateHud(true);
    }

    showDamageNumber(x, y, amount, isBoss, color = null) {
      const label = this.add.text(x, y - 17, String(Math.round(amount)), {
        fontFamily: "Georgia, serif",
        fontSize: isBoss ? "17px" : "12px",
        fontStyle: "bold",
        color: color || (isBoss ? "#fff0a3" : "#f3f0e6"),
        stroke: "#071012",
        strokeThickness: 3,
      }).setOrigin(0.5).setDepth(30);
      this.tweens.add({
        targets: label,
        y: y - 39,
        alpha: 0,
        duration: isBoss ? 520 : 360,
        ease: "Quad.easeOut",
        onComplete: () => label.destroy(),
      });
    }

    showCombatLabel(x, y, text, color) {
      const label = this.add.text(
        Phaser.Math.Clamp(x, 78, this.scale.width - 78),
        Phaser.Math.Clamp(y, this.getPlayableTop() - 18, this.getPlayableBottom() - 18),
        text,
        {
          fontFamily: "STKaiti, KaiTi, Georgia, serif",
          fontSize: "12px",
          fontStyle: "bold",
          color: `#${color.toString(16).padStart(6, "0")}`,
          stroke: "#071012",
          strokeThickness: 4,
        },
      ).setOrigin(0.5).setDepth(34);
      this.tweens.add({
        targets: label,
        y: label.y - 27,
        alpha: 0,
        duration: 1050,
        ease: "Quad.easeOut",
        onComplete: () => label.destroy(),
      });
    }

    spawnWeaponMuzzle(angle, style, color, empowered = false) {
      const isReturner = style === "returner";
      const offset = style === "lance" ? 22 : isReturner ? 18 : 14;
      const x = this.player.x + Math.cos(angle) * offset;
      const y = this.player.y - 5 + Math.sin(angle) * offset;
      const texture = style === "lance" ? "fxSlash" : isReturner ? "fxRing" : "fxStar";
      const flash = this.add.image(x, y, texture)
        .setTint(color)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(15)
        .setRotation(angle)
        .setAlpha(0.9)
        .setScale(style === "lance" ? 0.42 : isReturner ? 0.28 : 0.32);
      const glow = this.add.image(x, y, "fxGlow")
        .setTint(color)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(14)
        .setAlpha(empowered ? 0.9 : 0.62)
        .setScale(empowered ? 0.68 : 0.42);
      this.tweens.add({
        targets: flash,
        scaleX: empowered ? 1.35 : 0.92,
        scaleY: style === "lance" ? 0.66 : (empowered ? 1.2 : 0.78),
        alpha: 0,
        angle: flash.angle + (isReturner ? 170 : 0),
        duration: empowered ? 260 : 170,
        ease: "Cubic.easeOut",
        onComplete: () => flash.destroy(),
      });
      this.tweens.add({
        targets: glow,
        scale: empowered ? 1.45 : 0.9,
        alpha: 0,
        duration: empowered ? 300 : 190,
        ease: "Quad.easeOut",
        onComplete: () => glow.destroy(),
      });
    }

    spawnProjectileTrail(x, y, color, radius, style = "tracker", angle = 0, channel = "player") {
      const creditKey = channel === "enemy" ? "enemyTrailVfxCredit" : "playerTrailVfxCredit";
      if (this[creditKey] < 1) return false;
      this[creditKey] -= 1;
      const isLance = ["lance", "secondary-lance", "secondary-stake", "secondary-sword-wave"].includes(style);
      const isStarSwordWave = style === "secondary-star-sword-wave";
      const isScatter = style === "scatter";
      const isReturner = style === "returner";
      const isBoss = style === "bossRed" || style === "bossGold";
      const isTide = style === "tide";
      const texture = isStarSwordWave ? "starSwordWave" : isLance || isTide ? "fxSlash" : isScatter ? "fxShard" : isReturner ? "returnBolt" : isBoss ? "fxStar" : style === "hexer" ? "fxGlow" : "fxStar";
      const baseScale = isStarSwordWave
        ? 0.17 + radius * 0.02
        : isLance
        ? 0.34 + radius * 0.045
        : isScatter ? 0.26 + radius * 0.035
          : isReturner ? 0.2 + radius * 0.028
          : isTide ? 0.3 + radius * 0.042
          : isBoss ? 0.24 + radius * 0.045
            : style === "hexer" ? 0.22 + radius * 0.05 : 0.2 + radius * 0.045;
      const tailDistance = isStarSwordWave ? 18 : isLance ? 13 : isTide ? 11 : isScatter ? 7 : isReturner ? 8 : 5;
      const trail = this.add.image(
        x - Math.cos(angle) * tailDistance,
        y - Math.sin(angle) * tailDistance,
        texture,
      );
      if (isStarSwordWave) trail.clearTint();
      else trail.setTint(color);
      trail
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(isStarSwordWave ? 5 : 4)
        .setRotation(angle)
        .setAlpha(isStarSwordWave ? 0.38 : isBoss || isTide ? 0.74 : isReturner ? 0.42 : 0.58)
        .setScale(baseScale, isStarSwordWave ? baseScale * 0.52 : isLance || isTide ? baseScale * 0.62 : baseScale);
      this.tweens.add({
        targets: trail,
        x: trail.x - Math.cos(angle) * (isStarSwordWave ? 18 : isLance ? 14 : isTide ? 12 : 7),
        y: trail.y - Math.sin(angle) * (isStarSwordWave ? 18 : isLance ? 14 : isTide ? 12 : 7),
        scaleX: isStarSwordWave ? baseScale * 1.32 : baseScale * 0.25,
        scaleY: isStarSwordWave ? baseScale * 0.52 * 1.2 : baseScale * 0.25,
        alpha: 0,
        angle: trail.angle + (isReturner ? 150 : isBoss ? 55 : 0),
        duration: isStarSwordWave ? 180 : isLance ? 250 : isTide ? 230 : isBoss ? 260 : isReturner ? 240 : 210,
        ease: "Quad.easeOut",
        onComplete: () => trail.destroy(),
      });
      return true;
    }

    spawnProjectileImpact(x, y, color, style = "tracker", angle = 0) {
      if (style === "scatter" || style === "secondary-blade" || style === "secondary-sword-wave") {
        const cut = this.add.image(x, y, "fxSlash")
          .setTint(style === "scatter" ? 0xffeee9 : color)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(20)
          .setRotation(angle + Math.PI / 2)
          .setAlpha(0.98)
          .setScale(style === "secondary-sword-wave" ? 0.46 : 0.34, style === "secondary-sword-wave" ? 0.68 : 0.48);
        this.tweens.add({
          targets: cut,
          scaleX: style === "scatter" ? 1.28 : style === "secondary-sword-wave" ? 1.42 : 1.06,
          scaleY: style === "scatter" ? 0.72 : style === "secondary-sword-wave" ? 0.84 : 0.62,
          alpha: 0,
          duration: style === "scatter" ? 118 : 135,
          ease: "Cubic.easeOut",
          onComplete: () => cut.destroy(),
        });
        return;
      }
      if (style === "tracker-mark" || style === "tracker-ember") {
        const heavy = style === "tracker-ember";
        const ring = this.add.image(x, y, "fxRing")
          .setTint(heavy ? COLORS.goldHot : COLORS.gold)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(19)
          .setRotation(angle)
          .setAlpha(heavy ? 0.64 : 0.58)
          .setScale(heavy ? 0.28 : 0.22);
        this.tweens.add({
          targets: ring,
          scale: heavy ? 0.92 : 0.72,
          angle: ring.angle + 38,
          alpha: 0,
          duration: heavy ? 230 : 190,
          ease: "Quad.easeOut",
          onComplete: () => ring.destroy(),
        });
        const slash = this.add.image(x, y, "fxSlash")
          .setTint(heavy ? 0xfff0a3 : COLORS.goldHot)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(20)
          .setRotation(angle)
          .setAlpha(heavy ? 0.74 : 0.58)
          .setScale(heavy ? 0.36 : 0.28, heavy ? 0.24 : 0.18);
        this.tweens.add({
          targets: slash,
          scaleX: heavy ? 1.08 : 0.78,
          scaleY: 0.08,
          alpha: 0,
          duration: heavy ? 180 : 150,
          ease: "Cubic.easeOut",
          onComplete: () => slash.destroy(),
        });
        if (!heavy) return;
      }
      const glow = this.add.image(x, y, "fxGlow")
        .setTint(color)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(18)
        .setAlpha(0.9)
        .setScale(style === "lance" ? 0.7 : 0.48);
      this.tweens.add({
        targets: glow,
        scale: style === "lance" ? 1.45 : 1.05,
        alpha: 0,
        duration: 210,
        ease: "Cubic.easeOut",
        onComplete: () => glow.destroy(),
      });
      const core = this.add.image(x, y, "fxStar")
        .setTint(0xffffff)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(20)
        .setRotation(angle)
        .setAlpha(0.96)
        .setScale(style === "lance" ? 0.34 : 0.24);
      this.tweens.add({
        targets: core,
        scaleX: style === "lance" ? 1.08 : 0.72,
        scaleY: 0.14,
        alpha: 0,
        duration: style === "lance" ? 180 : 145,
        ease: "Cubic.easeOut",
        onComplete: () => core.destroy(),
      });

      if (style === "tide") {
        [angle, angle + Math.PI / 2].forEach((rotation, index) => {
          const slash = this.add.image(x, y, "fxSlash")
            .setTint(index === 0 ? color : 0xff6d79)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(19)
            .setRotation(rotation)
            .setAlpha(index === 0 ? 0.92 : 0.68)
            .setScale(0.32, 0.24);
          this.tweens.add({
            targets: slash,
            scaleX: index === 0 ? 1.2 : 0.78,
            scaleY: 0.5,
            alpha: 0,
            duration: 220 + index * 35,
            ease: "Cubic.easeOut",
            onComplete: () => slash.destroy(),
          });
        });
        this.spawnRipple(x, y, color);
        this.spawnRadialShards(x, y, 0xff6d79, 5, 38, angle, 0.42, Math.PI * 0.9);
        return;
      }

      if (style === "lance") {
        [angle, angle + Math.PI / 2].forEach((rotation, index) => {
          const slash = this.add.image(x, y, "fxSlash")
            .setTint(color)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(19)
            .setRotation(rotation)
            .setAlpha(index === 0 ? 0.95 : 0.68)
            .setScale(0.4, 0.3);
          this.tweens.add({
            targets: slash,
            scaleX: index === 0 ? 1.45 : 0.92,
            scaleY: 0.68,
            alpha: 0,
            duration: index === 0 ? 250 : 210,
            ease: "Cubic.easeOut",
            onComplete: () => slash.destroy(),
          });
        });
        this.spawnRipple(x, y, color);
        return;
      }

      if (style === "returner") {
        const echo = this.add.image(x, y, "returnBolt")
          .setTint(color)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(19)
          .setAlpha(0.74)
          .setScale(0.34);
        this.tweens.add({
          targets: echo,
          scale: 0.82,
          alpha: 0,
          angle: echo.angle + 140,
          duration: 230,
          ease: "Cubic.easeOut",
          onComplete: () => echo.destroy(),
        });
        this.spawnRipple(x, y, color);
        this.spawnRadialShards(x, y, COLORS.ice, 4, 27, angle, 0.3);
        return;
      }

      const hostile = style === "hexer" || style === "bossRed" || style === "bossGold" || style === "tide";
      this.spawnRipple(x, y, color);
      this.spawnRadialShards(x, y, color, hostile ? 4 : 3, hostile ? 30 : 24, angle, hostile ? 0.42 : 0.34);
    }

    getVfxBudgetScale() {
      const activeEnemies = this.enemies?.countActive(true) || 0;
      if (activeEnemies >= 16) return 0.45;
      if (activeEnemies >= 12) return 0.6;
      if (activeEnemies >= 8) return 0.78;
      return 1;
    }

    spawnRadialShards(x, y, color, count, distance, offset = 0, scale = 0.4, arc = Math.PI * 2) {
      const budgetedCount = count > 0 ? Math.max(2, Math.ceil(count * this.getVfxBudgetScale())) : 0;
      if (budgetedCount <= 0) return;
      const fullCircle = Math.abs(arc - Math.PI * 2) < 0.001;
      const divisor = fullCircle ? budgetedCount : Math.max(1, budgetedCount - 1);
      for (let index = 0; index < budgetedCount; index += 1) {
        const angle = offset + (arc * index) / divisor - (fullCircle ? 0 : arc / 2);
        const shard = this.add.image(x, y, "fxShard")
          .setTint(color)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(17)
          .setRotation(angle)
          .setAlpha(0.84)
          .setScale(scale, scale * 0.78);
        this.tweens.add({
          targets: shard,
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          scaleX: scale * 0.32,
          scaleY: scale * 0.24,
          alpha: 0,
          duration: 260 + index * 12,
          ease: "Cubic.easeOut",
          onComplete: () => shard.destroy(),
        });
      }
    }

    spawnFrostBloom(x, y) {
      const core = this.add.image(x, y, "fxStar")
        .setTint(COLORS.ice)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(16)
        .setAlpha(0.84)
        .setScale(0.34);
      this.tweens.add({
        targets: core,
        scale: 0.92,
        angle: 45,
        alpha: 0,
        duration: 390,
        ease: "Cubic.easeOut",
        onComplete: () => core.destroy(),
      });
      this.spawnRipple(x, y, COLORS.ice);
      this.spawnRadialShards(x, y, COLORS.ice, 6, 31, Math.PI / 6, 0.4);
    }

    spawnExpandingSigil(x, y, color, radius, duration, delay = 0, rotation = 0) {
      const ring = this.add.image(x, y, "fxRing")
        .setTint(color)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(6)
        .setRotation(rotation)
        .setAlpha(0.76)
        .setScale(0.34);
      this.tweens.add({
        targets: ring,
        scale: radius / 23,
        angle: ring.angle + 48,
        alpha: 0,
        delay,
        duration,
        ease: "Cubic.easeOut",
        onComplete: () => ring.destroy(),
      });
      return ring;
    }

    spawnRipple(x, y, color) {
      const ring = this.add.image(x, y, "fxRing")
        .setTint(color)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(6)
        .setAlpha(0.62)
        .setScale(0.2);
      this.tweens.add({
        targets: ring,
        scale: 1.08,
        angle: 34,
        alpha: 0,
        duration: 430,
        ease: "Sine.easeOut",
        onComplete: () => ring.destroy(),
      });
    }

    burstAt(x, y, color, count) {
      const particleCount = Math.min(24, Math.max(0, Math.ceil(count * this.getVfxBudgetScale())));
      if (particleCount >= 5) {
        const flash = this.add.image(x, y, "fxGlow")
          .setTint(color)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(11)
          .setAlpha(0.62)
          .setScale(0.24 + Math.min(0.28, particleCount * 0.012));
        this.tweens.add({
          targets: flash,
          scale: 0.86 + Math.min(0.65, particleCount * 0.025),
          alpha: 0,
          duration: 230,
          ease: "Cubic.easeOut",
          onComplete: () => flash.destroy(),
        });
      }
      for (let index = 0; index < particleCount; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Phaser.Math.Between(14, particleCount >= 12 ? 54 : 38);
        const isStar = index % 3 === 0;
        const texture = isStar ? "fxStar" : "fxShard";
        const particleScale = isStar
          ? Phaser.Math.FloatBetween(0.16, 0.3)
          : Phaser.Math.FloatBetween(0.2, 0.4);
        const particle = this.add.image(x, y, texture)
          .setTint(color)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(13)
          .setRotation(isStar ? Math.random() * Math.PI : angle)
          .setAlpha(0.86)
          .setScale(particleScale);
        this.tweens.add({
          targets: particle,
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          alpha: 0,
          angle: particle.angle + (isStar ? Phaser.Math.Between(-90, 90) : 0),
          scale: particleScale * 0.28,
          duration: Phaser.Math.Between(240, 460),
          ease: "Quad.easeOut",
          onComplete: () => particle.destroy(),
        });
      }
    }

    spawnDeathVfx(enemy, color) {
      const isBoss = enemy.getData("kind") === "boss";
      const isElite = Boolean(enemyCatalog[enemy.getData("kind")]?.elite);
      const highPressure = (this.enemies?.countActive(true) || 0) >= 12;
      const deathVfxCap = this.usesCompactControls() || highPressure ? 4 : 7;
      if (!isBoss && this.deathVfxActive >= deathVfxCap) return false;
      this.deathVfxActive += 1;
      const residue = this.add.image(enemy.x, enemy.y, enemy.texture.key)
        .setDepth(12)
        .setRotation(enemy.rotation)
        .setFlipX(enemy.flipX)
        .setAlpha(0.88)
        .setTint(color)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDisplaySize(enemy.displayWidth, enemy.displayHeight);
      this.tweens.add({
        targets: residue,
        y: residue.y - (isBoss ? 34 : 14),
        scaleX: residue.scaleX * (isBoss ? 1.34 : 1.16),
        scaleY: residue.scaleY * (isBoss ? 0.72 : 0.54),
        angle: residue.angle + (Math.random() > 0.5 ? 18 : -18),
        alpha: 0,
        duration: isBoss ? 620 : isElite ? 440 : 320,
        ease: "Cubic.easeOut",
        onComplete: () => {
          residue.destroy();
          this.deathVfxActive = Math.max(0, this.deathVfxActive - 1);
        },
      });
      const slash = this.add.image(enemy.x, enemy.y, "fxSlash")
        .setTint(0xffffff)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(18)
        .setRotation(Math.random() * Math.PI)
        .setAlpha(0.92)
        .setScale(isBoss ? 0.72 : 0.34, 0.28);
      this.tweens.add({
        targets: slash,
        scaleX: isBoss ? 3.1 : isElite ? 1.45 : 0.95,
        scaleY: 0.08,
        alpha: 0,
        duration: isBoss ? 360 : 220,
        ease: "Cubic.easeOut",
        onComplete: () => slash.destroy(),
      });
      if (isElite || isBoss) {
        this.spawnExpandingSigil(enemy.x, enemy.y, color, isBoss ? 138 : 62, isBoss ? 540 : 320);
      }
      return true;
    }

    spawnBossDeathSpectacle(x, y, color) {
      const secondary = this.battlefieldProfile.id === "mirror-harbor" ? 0xff6d79 : COLORS.goldHot;
      const compact = this.usesCompactControls();
      [0, Math.PI / 4, Math.PI / 2].forEach((rotation, index) => {
        this.spawnExpandingSigil(x, y, index === 1 ? secondary : color, 128 + index * 58, 520 + index * 120, index * 55, rotation);
      });
      for (let index = 0; index < (compact ? 3 : 4); index += 1) {
        const slash = this.add.image(x, y, "fxSlash")
          .setTint(index % 2 === 0 ? color : secondary)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(20)
          .setRotation((Math.PI * index) / 4)
          .setAlpha(0.9)
          .setScale(0.5, 0.24);
        this.tweens.add({
          targets: slash,
          scaleX: 3.8,
          scaleY: 0.12,
          alpha: 0,
          duration: 520 + index * 60,
          ease: "Cubic.easeOut",
          onComplete: () => slash.destroy(),
        });
      }
      this.spawnRadialShards(x, y, color, compact ? 12 : 18, 138, Math.PI / 12, 0.72);
      this.spawnRadialShards(x, y, secondary, compact ? 9 : 14, 104, Math.PI / 7, 0.56);
      this.burstAt(x, y, color, compact ? 16 : 24);
      const accent = this.battlefieldProfile.accentValue || COLORS.gold;
      this.cameras.main.flash(720, (accent >> 16) & 0xff, (accent >> 8) & 0xff, accent & 0xff, false);
      this.cameras.main.shake(620, this.usesCompactControls() ? 0.012 : 0.018);
    }

    togglePause(forceState) {
      if (!this.started || this.ended || this.isChoosing) return;
      const shouldPause = typeof forceState === "boolean" ? forceState : !this.pausedByUser;
      this.pausedByUser = shouldPause;
      ui.pauseScreen.hidden = !shouldPause;
      this.time.paused = shouldPause;
      soundscape.setMusicPaused(shouldPause);
      if (shouldPause) this.tweens.pauseAll();
      else this.tweens.resumeAll();
      this.setGameplayChromeInert(shouldPause);
      if (shouldPause) {
        this.physics.world.pause();
        this.player.setVelocity(0, 0);
        ui.resumeButton.focus({ preventScroll: true });
      } else {
        this.physics.world.resume();
        ui.pauseButton.focus({ preventScroll: true });
      }
      this.updateDashState(this.gameplayTime);
    }

    renderEndArchive(victory, report) {
      const earned = new Set(report.earnedIds);
      const newlyEarned = new Set(report.newIds);
      ui.endSeals.innerHTML = archiveSealCatalog
        .map((seal) => {
          const isEarned = earned.has(seal.id);
          const isNew = newlyEarned.has(seal.id);
          const classes = ["end-record-seal"];
          if (isEarned) classes.push("is-earned");
          if (isNew) classes.push("is-new");
          const state = isEarned ? "本局达成" : "本局未达成";
          return `<span class="${classes.join(" ")}" title="${seal.description}" aria-label="${seal.name}，${state}${isNew ? "，新获得" : ""}">
            <i aria-hidden="true">${seal.sigil}</i><b>${seal.name}</b>
          </span>`;
        })
        .join("");

      let summary = `本局未刻印 · 总掌握 ${report.total}/${ARCHIVE_TOTAL_MAX}`;
      if (victory && report.recorded && report.newIds.length > 0) {
        const names = archiveSealCatalog
          .filter((seal) => newlyEarned.has(seal.id))
          .map((seal) => seal.name)
          .join("、");
        summary = `新刻 ${names} · 总掌握 ${report.total}/${ARCHIVE_TOTAL_MAX}`;
      } else if (victory && report.recorded) {
        summary = `本路线已收录 · 总掌握 ${report.total}/${ARCHIVE_TOTAL_MAX}`;
      } else if (victory) {
        summary = `路线记录不完整 · 总掌握 ${report.total}/${ARCHIVE_TOTAL_MAX}`;
      }
      if (!archiveStorageAvailable) summary += " · 仅本次页面有效";
      ui.endArchiveSummary.textContent = summary;
    }

    finishRun(victory, message, defeatTitle = "长夜吞没了灯") {
      if (this.ended) return;
      this.recordPrecisionPrototypeEvent("prototype-finish", {
        outcome: victory ? "complete" : "defeat",
        message,
      });
      this.ended = true;
      this.choiceMode = null;
      this.isChoosing = false;
      this.pendingRouteStage = null;
      this.pendingShopVisit = null;
      if (this.weaponProfile?.id === "nova") {
        this.secondaryEffects = this.secondaryEffects.filter((effect) => {
          if (!["flare-wall", "corona-mirror"].includes(effect.type)) return true;
          this.destroySecondaryEffect(effect);
          return false;
        });
        this.bullets.getChildren()
          .filter((bullet) => bullet?.active && bullet.getData("secondaryBehavior") === "solar-rocket")
          .forEach((bullet) => bullet.destroy());
      }
      soundscape.stopMusic();
      this.setGameplayChromeInert(true);
      this.clearThreatAlert();
      this.clearPatrolEvent();
      this.clearPrototypeTrackerAutoGrants();
      this.clearPrototypeHorde();
      this.clearPrototypeAudioPrompt();
      this.clearArcNodes();
      this.physics.world.pause();
      this.player.setVelocity(0, 0);
      this.bossTelegraph.clear();
      this.stageController?.clearWarning();
      if (this.boss?.active) this.destroyEnemyDecorations(this.boss);
      if (this.phaseBanner?.active) {
        this.phaseBanner.destroy(true);
        this.phaseBanner = null;
      }
      ui.lampStatus.classList.remove("is-critical", "is-charged", "is-surging");
      ui.pauseButton.disabled = true;
      ui.bossStatus.hidden = true;
      ui.pauseScreen.hidden = true;
      ui.upgradeScreen.hidden = true;
      ui.routeScreen.hidden = true;
      ui.secondaryScreen.hidden = true;
      ui.shopScreen.hidden = true;
      ui.endScreen.hidden = false;
      ui.endPanel.classList.toggle("is-defeat", !victory);
      if (RUN_PROFILE.precisionPrototype) {
        this.renderPrecisionPrototypeEnd();
      } else {
        ui.endEyebrow.textContent = victory ? "黎明记录 · 守夜成功" : "守夜记录 · 灯火中断";
        ui.endTitle.textContent = victory ? "天亮了" : defeatTitle;
        ui.endMessage.textContent = message;
        ui.endKills.textContent = String(this.kills);
        ui.endLevel.textContent = String(this.level);
        ui.endLamp.textContent = `${this.surgeCount} 次`;
        ui.endPatrol.textContent = `${this.patrolCompleted}/${PATROL_EVENT_SCHEDULE.length}`;
        const archiveReport = victory
          ? recordExpeditionRun(this)
          : { earnedIds: [], newIds: [], total: getTotalArchiveScore(), recorded: false };
        this.renderEndArchive(victory, archiveReport);
        ui.endRoute.textContent = `远征路线 · ${this.getRouteSummary()}`;
        ui.objectiveText.textContent = victory ? "黎明抵达" : "守夜失败";
      }
      this.updateDashState(this.gameplayTime);
      ui.restartButton.focus({ preventScroll: true });
      soundscape.play(victory ? "victory" : "defeat", true);
    }

    updateBossHud() {
      if (!this.boss?.active) return;
      const health = Math.max(0, this.boss.getData("hp"));
      const maxHealth = this.boss.getData("maxHp");
      ui.bossHealthText.textContent = String(Math.ceil(health));
      ui.bossHealthFill.style.width = `${(health / maxHealth) * 100}%`;
      this.updateBossPhaseHud(this.boss);
    }

    updateHud(force = false) {
      if (!force && Math.floor(this.elapsed * 10) % 2 !== 0) return;
      const dawnProgress = Math.min(1, this.elapsed / RUN_DURATION);
      const totalMinutes = START_HOUR * 60 + dawnProgress * (END_HOUR - START_HOUR) * 60;
      const hour = Math.floor(totalMinutes / 60);
      const minute = Math.min(59, Math.floor(totalMinutes % 60));
      ui.clockValue.textContent = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      ui.dawnFill.style.width = `${dawnProgress * 100}%`;
      ui.killCount.textContent = String(this.kills).padStart(3, "0");
      ui.currencyCount.textContent = String(this.shopCurrency);
      const emberRatio = this.emberCharge / this.emberChargeMax;
      const emberPercent = Math.floor(emberRatio * 100);
      const surgeCooldown = Math.max(0, Math.ceil((this.emberSurgeReadyAt - this.gameplayTime) / 1000));
      ui.lampHealthText.textContent = `蓄光 ${emberPercent}% · ${surgeCooldown > 0 ? `余热 ${surgeCooldown}s` : `${this.surgeCount} 爆`}`;
      ui.lampHealthFill.style.width = `${emberRatio * 100}%`;
      ui.lampHealthFill.parentElement?.setAttribute("aria-valuenow", String(emberPercent));
      ui.lampStatus.classList.toggle("is-charged", emberRatio >= 0.8);
      ui.lampStatus.classList.toggle("is-surging", this.gameplayTime < this.surgeUntil);
      ui.playerHealthText.textContent = String(Math.ceil(this.playerHealth));
      ui.playerHealthFill.style.width = `${(this.playerHealth / this.playerMaxHealth) * 100}%`;
      ui.playerLevel.textContent = String(this.level).padStart(2, "0");
      ui.xpText.textContent = `${this.xp} / ${this.nextXp}`;
      ui.xpFill.style.width = `${Math.min(100, (this.xp / this.nextXp) * 100)}%`;
      if (this.bossAlive) this.updateBossHud();
    }
  }

  const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    backgroundColor: "#071012",
    transparent: false,
    pixelArt: false,
    antialias: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    render: {
      antialias: true,
      roundPixels: false,
      powerPreference: "high-performance",
    },
    scene: [NightScene],
  };

  if (QA_MODE) {
    window.__LAST_LIGHT_QA__ = Object.freeze({
      version: 3,
      getScene: () => activeScene,
      setMovement(x, y) {
        qaMoveVector.x = Number.isFinite(x) ? Phaser.Math.Clamp(x, -1, 1) : 0;
        qaMoveVector.y = Number.isFinite(y) ? Phaser.Math.Clamp(y, -1, 1) : 0;
      },
      selectBattlefield: (id) => activeScene?.selectBattlefield(id),
      selectWeapon: (id) => activeScene?.selectWeapon(id),
      startRun: () => activeScene?.startRun(),
      getAudioState: () => soundscape.getState(),
      chooseUpgrade: (id) => activeScene?.applyUpgrade(id),
      refreshUpgrade: () => activeScene?.rerollUpgradeChoices(),
      getUpgradeChoiceState: () => activeScene?.getUpgradeChoiceState(),
      chooseRoute: (id) => activeScene?.applyRouteChoice(id),
      chooseSecondary: (id) => activeScene?.applySecondaryChoice(id),
      getSecondaryState: () => activeScene?.getSecondaryState(),
      chooseShop: (id) => activeScene?.purchaseShopOffer(id),
      sellRelic: (id) => activeScene?.sellShopRelic(id),
      refreshShop: () => activeScene?.refreshShop(),
      continueShop: () => activeScene?.continueFromShop(),
      getShopState: () => activeScene?.getShopState(),
      getBossState: () => activeScene?.getBossCombatState(),
      getPrototypeState: () => activeScene?.getPrecisionPrototypeState(),
      dash: () => activeScene?.tryDash(),
    });
  }

  new Phaser.Game(config);

  window.addEventListener("pointerdown", (event) => {
    soundscape.resumeFromPointerdown(event);
  }, { passive: true });

  ui.battlefieldOptions.addEventListener("click", (event) => {
    const option = event.target.closest("[data-battlefield]");
    if (!option || activeScene?.started) return;
    activeScene?.selectBattlefield(option.dataset.battlefield);
    soundscape.play("toggle", true);
  });
  ui.weaponOptions.addEventListener("click", (event) => {
    const option = event.target.closest("[data-weapon]");
    if (!option || activeScene?.started) return;
    activeScene?.selectWeapon(option.dataset.weapon);
    soundscape.play("toggle", true);
  });
  ui.startButton.addEventListener("click", () => activeScene?.startRun());
  ui.dashButton.addEventListener("click", () => activeScene?.tryDash());
  ui.soundButton.addEventListener("click", () => soundscape.toggle());
  ui.pauseButton.addEventListener("click", () => activeScene?.togglePause(true));
  ui.resumeButton.addEventListener("click", () => activeScene?.togglePause(false));
  ui.restartFromPause.addEventListener("click", () => activeScene?.restartRun());
  ui.pauseLoadoutButton.addEventListener("click", () => activeScene?.returnToLoadout());
  ui.restartButton.addEventListener("click", () => activeScene?.restartRun());
  ui.loadoutButton.addEventListener("click", () => activeScene?.returnToLoadout());
  ui.upgradeOptions.addEventListener("click", (event) => {
    const option = event.target.closest("[data-upgrade]");
    if (option) activeScene?.applyUpgrade(option.dataset.upgrade);
  });
  ui.upgradeRefreshButton.addEventListener("click", () => activeScene?.rerollUpgradeChoices());
  ui.routeOptions.addEventListener("click", (event) => {
    const option = event.target.closest("[data-route]");
    if (option) activeScene?.applyRouteChoice(option.dataset.route);
  });
  ui.secondaryOptions.addEventListener("click", (event) => {
    const option = event.target.closest("[data-secondary]");
    if (option) activeScene?.applySecondaryChoice(option.dataset.secondary);
  });
  ui.shopOptions.addEventListener("click", (event) => {
    const option = event.target.closest("[data-shop-offer]");
    if (option) activeScene?.purchaseShopOffer(option.dataset.shopOffer);
  });
  ui.shopRelicSlots.addEventListener("click", (event) => {
    const option = event.target.closest("[data-shop-sell]");
    if (option) activeScene?.sellShopRelic(option.dataset.shopSell);
  });
  ui.shopRefreshButton.addEventListener("click", () => activeScene?.refreshShop());
  ui.shopContinueButton.addEventListener("click", () => activeScene?.continueFromShop());

  let joystickPointer = null;

  function updateJoystick(event) {
    const rect = ui.joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rawX = event.clientX - centerX;
    const rawY = event.clientY - centerY;
    const maxDistance = rect.width * 0.31;
    const distance = Math.hypot(rawX, rawY);
    const scale = distance > maxDistance ? maxDistance / distance : 1;
    const clampedX = rawX * scale;
    const clampedY = rawY * scale;
    touchVector.x = clampedX / maxDistance;
    touchVector.y = clampedY / maxDistance;
    ui.joystickKnob.style.transform = `translate(calc(-50% + ${clampedX}px), calc(-50% + ${clampedY}px))`;
  }

  function resetJoystick(event) {
    if (event && joystickPointer !== null && event.pointerId !== joystickPointer) return;
    joystickPointer = null;
    touchVector.x = 0;
    touchVector.y = 0;
    ui.joystickKnob.style.transform = "translate(-50%, -50%)";
  }

  ui.joystick.addEventListener("pointerdown", (event) => {
    if (joystickPointer !== null) return;
    joystickPointer = event.pointerId;
    ui.joystick.setPointerCapture(event.pointerId);
    updateJoystick(event);
  });
  ui.joystick.addEventListener("pointermove", (event) => {
    if (event.pointerId === joystickPointer) updateJoystick(event);
  });
  ui.joystick.addEventListener("pointerup", resetJoystick);
  ui.joystick.addEventListener("pointercancel", resetJoystick);
  ui.joystick.addEventListener("lostpointercapture", resetJoystick);

  window.addEventListener("blur", () => {
    resetJoystick();
    if (!QA_MODE && activeScene?.started && !activeScene.ended && !activeScene.isChoosing) activeScene.togglePause(true);
  });
})();
