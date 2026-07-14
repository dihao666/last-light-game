(function () {
  "use strict";

  const QA_MODE = new URLSearchParams(window.location.search).get("qa") === "1";
  const RUN_DURATION = 100;
  const BOSS_TIME = 78;
  const BOSS_PRELUDE_DURATION = 6;
  const ROUTE_STAGE_TWO_TIME = 24;
  const ROUTE_STAGE_THREE_TIME = 50;
  const PATROL_EVENT_SCHEDULE = [
    { time: 32, type: "beacon" },
    { time: 58, type: "rift" },
  ];
  const DASH_COOLDOWN = 3400;
  const DASH_DURATION = 180;
  const DASH_INVULNERABILITY = 280;
  const EMBER_SURGE_COOLDOWN = 20000;
  const EMBER_SURGE_DURATION = 4000;
  const UPGRADE_MIN_INTERVAL = 9000;
  const START_HOUR = 3;
  const END_HOUR = 6;

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
    routeScreen: document.getElementById("route-screen"),
    routeKicker: document.getElementById("route-kicker"),
    routeTitle: document.getElementById("route-title"),
    routePrompt: document.getElementById("route-prompt"),
    routeOrigin: document.getElementById("route-origin"),
    routeStageName: document.getElementById("route-stage-name"),
    routeOptions: document.getElementById("route-options"),
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

  const touchVector = { x: 0, y: 0 };
  const qaMoveVector = { x: 0, y: 0 };
  let activeScene = null;
  let autoStartOnCreate = false;
  let selectedBattlefieldId = battlefieldCatalog[0]?.id || "lantern-court";
  let selectedWeaponId = "tracker";

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  const MASTER_VOLUME = 0.5;
  const soundscape = {
    context: null,
    master: null,
    muted: false,
    lastPlayed: Object.create(null),
    musicTimer: null,
    musicStep: 0,
    musicTheme: null,
    musicPaused: false,
    musicPatterns: Object.freeze({
      "lantern-court": Object.freeze({
        bass: [98, null, 98, null, 116.54, null, 87.31, null, 98, null, 130.81, null, 116.54, null, 87.31, null],
        lead: [392, null, 466.16, null, 523.25, null, 466.16, null, 392, null, 349.23, null, 293.66, null, 349.23, null],
      }),
      "mirror-harbor": Object.freeze({
        bass: [82.41, null, 110, null, 98, null, 73.42, null, 82.41, null, 123.47, null, 110, null, 73.42, null],
        lead: [329.63, null, 392, 440, 392, null, 293.66, null, 329.63, null, 466.16, 440, 392, null, 293.66, null],
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
        this.master.gain.value = this.muted ? 0 : MASTER_VOLUME;
        this.master.connect(this.context.destination);
      }
      if (this.context.state === "suspended") {
        this.context.resume().then(
          () => this.syncButton(),
          () => {
            ui.soundButton.dataset.audioState = "blocked";
          },
        );
      }
      this.syncButton();
      return this.context;
    },

    syncButton() {
      const unavailable = !AudioContextConstructor;
      ui.soundButton.disabled = unavailable;
      ui.soundButton.classList.toggle("is-muted", this.muted);
      ui.soundButton.setAttribute("aria-pressed", String(this.muted));
      ui.soundButton.setAttribute("aria-label", this.muted ? "打开声音" : "关闭声音");
      ui.soundButton.dataset.audioState = unavailable ? "unavailable" : this.context?.state || "idle";
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
      if (!context) return false;
      this.musicTheme = this.musicPatterns[theme] ? theme : "lantern-court";
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
      const pattern = this.musicPatterns[this.musicTheme];
      const index = this.musicStep % pattern.bass.length;
      const cycle = Math.floor(this.musicStep / pattern.bass.length);
      const bossPressure = Boolean(activeScene?.bossAlive);
      const variation = bossPressure ? 1.05946 : cycle % 4 === 3 ? 0.94387 : 1;
      const bass = pattern.bass[index];
      const lead = pattern.lead[index];
      if (bass) this.tone(bass * variation, bass * variation * 0.997, 0.52, bossPressure ? 0.065 : 0.05, "sine");
      if (lead) {
        this.tone(lead * variation, lead * variation * 1.006, 0.26, bossPressure ? 0.042 : 0.032, "triangle", 0.035);
      }
      if (index % 8 === 7) {
        const root = this.musicTheme === "mirror-harbor" ? 220 : 261.63;
        this.tone(root * variation, root * variation * 1.004, 0.48, 0.018, "sine", 0.08);
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
        musicStep: this.musicStep,
        masterGain: this.master?.gain.value || 0,
        lastHitAt: this.lastPlayed.hit || 0,
      };
    },

    tone(startFrequency, endFrequency, duration, volume, type = "sine", delay = 0) {
      const context = this.ensure();
      if (!context || context.state !== "running" || !this.master || this.muted) return false;
      const startAt = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(Math.max(1, startFrequency), startAt);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), startAt + duration);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.linearRampToValueAtTime(volume, startAt + Math.min(0.012, duration * 0.3));
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + 0.02);
      return true;
    },

    play(name, bypassLimit = false) {
      if (this.muted) return;
      const now = Date.now();
      const minGap = {
        shot: 120,
        hit: 55,
        kill: 85,
        pickup: 75,
        damage: 150,
        ember: 90,
        enemyShot: 180,
      }[name] || 0;
      if (!bypassLimit && now - (this.lastPlayed[name] || 0) < minGap) return;
      this.lastPlayed[name] = now;

      if (name === "toggle") {
        this.tone(520, 760, 0.08, 0.028, "sine");
      } else if (name === "start") {
        this.tone(196, 294, 0.18, 0.03, "sine");
        this.tone(392, 588, 0.16, 0.018, "triangle", 0.07);
      } else if (name === "shot") {
        this.tone(720, 410, 0.045, 0.009, "square");
      } else if (name === "hit") {
        this.tone(180, 72, 0.065, 0.065, "square");
        this.tone(980, 280, 0.045, 0.032, "triangle", 0.004);
      } else if (name === "kill") {
        this.tone(180, 82, 0.09, 0.022, "triangle");
      } else if (name === "pickup") {
        this.tone(620, 940, 0.06, 0.014, "sine");
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
    },
  };

  const enemyCatalog = {
    shade: { name: "暗影", role: "游猎", hp: 30, speed: 70, damage: 5, xp: 1, color: COLORS.red },
    wraith: { name: "哀影", role: "追猎守夜人", hp: 23, speed: 112, damage: 4, xp: 1, color: COLORS.violet },
    brute: { name: "重影", role: "直扑守夜人", hp: 98, speed: 46, damage: 9, xp: 3, color: COLORS.red, elite: true },
    splitter: { name: "裂影", role: "死亡后分裂", hp: 54, speed: 62, damage: 6, xp: 2, color: COLORS.goldHot, introduce: true },
    shard: { name: "碎影", role: "迅捷", hp: 12, speed: 146, damage: 3, xp: 0, color: COLORS.goldHot },
    hexer: { name: "咒灯者", role: "蓄力远射", hp: 48, speed: 58, damage: 7, xp: 2, color: COLORS.violet, elite: true, introduce: true },
    bulwark: { name: "甲魇", role: "先破甲再伤身", hp: 82, armor: 52, speed: 40, damage: 8, xp: 3, color: COLORS.armor, elite: true, introduce: true },
    charger: { name: "奔魇", role: "锁定后直线突袭", hp: 62, speed: 78, damage: 14, xp: 2, color: COLORS.goldHot, introduce: true },
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
      description: "近距三连，覆盖面更宽。",
      color: "#ef7563",
      colorValue: 0xef7563,
      texture: "scatterBolt",
      fxStyle: "scatter",
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
      range: 430,
      trailRadius: 2,
      signatureUpgrade: "starburst",
      signatureCycle: 4,
      signatureSummary: "第四击环射",
    },
    {
      id: "lance",
      sigil: "贯",
      name: "破夜枪",
      description: "蓄势重击，可连续穿透。",
      color: "#69d5c8",
      colorValue: COLORS.armor,
      texture: "lanceBolt",
      fxStyle: "lance",
      hitWidth: 34,
      hitHeight: 8,
      damage: 39,
      fireRate: 740,
      projectileCount: 1,
      projectileSpeed: 690,
      spread: 0.08,
      pierce: 2,
      homing: 0.018,
      life: 1500,
      range: 650,
      trailRadius: 4,
      signatureUpgrade: "nightbreaker",
      signatureCycle: 3,
      signatureSummary: "第三击重枪",
    },
    {
      id: "returner",
      sigil: "轮",
      name: "回光轮",
      description: "飞出折返，往返皆可命中。",
      color: "#c19cff",
      colorValue: 0xc19cff,
      texture: "returnBolt",
      fxStyle: "returner",
      hitWidth: 27,
      hitHeight: 27,
      damage: 18,
      fireRate: 760,
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
      signatureSummary: "第三击折返爆环",
    },
    {
      id: "arc",
      sigil: "雷",
      name: "星链符",
      description: "双枚追踪电符，擅长清理游散敌群。",
      color: "#8fe7ff",
      colorValue: 0x8fe7ff,
      texture: "arcBolt",
      fxStyle: "arc",
      hitWidth: 21,
      hitHeight: 21,
      damage: 20,
      fireRate: 610,
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
      signatureSummary: "第四击三段跃雷",
    },
    {
      id: "nova",
      sigil: "曜",
      name: "曜日核",
      description: "缓慢重弹，命中时爆开灼亮星环。",
      color: "#ffcf62",
      colorValue: 0xffcf62,
      texture: "novaBolt",
      fxStyle: "nova",
      hitWidth: 29,
      hitHeight: 29,
      damage: 34,
      fireRate: 850,
      projectileCount: 1,
      projectileSpeed: 430,
      spread: 0.11,
      pierce: 0,
      homing: 0.052,
      life: 1500,
      range: 600,
      trailRadius: 5,
      signatureUpgrade: "sunwell",
      signatureCycle: 3,
      signatureSummary: "第三击引爆日珥",
    },
  ];

  const upgradeCatalog = [
    {
      id: "focus",
      sigil: "炽",
      name: "炽光",
      description: "光弹伤害提高 8 点。",
      color: "#f2c84b",
      maxLevel: 5,
      apply(scene) {
        scene.stats.damage += 8;
      },
    },
    {
      id: "volley",
      sigil: "+1",
      name: "子弹 +1",
      description: "所有守夜器每次攻击额外发射 1 枚弹体。",
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
      description: "自动攻击间隔缩短 18%。",
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
      description: "碎星扇每第 4 次攻击，向四周额外散射星片。",
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
      description: "破夜枪每第 3 次攻击化为重枪，强化伤害与穿透。",
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
      description: "回光轮每第 3 次攻击折返时爆开月环，并强化回程伤害。",
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
      name: "跃雷星图",
      description: "星链符每第 4 次攻击跃向额外目标。",
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
      name: "日珥核心",
      description: "曜日核每第 3 次攻击引发更大的范围爆炸。",
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
      description: "召出绕身火种，接触敌人时造成伤害。",
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
      description: "周期性释放一圈净化冲击。",
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
      description: "光弹附着寒焰，使敌人减速。",
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
      description: "连续命中会向附近敌人释放电弧。",
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
      description: "暴击率提高 8%，暴击造成 1.8 倍伤害。",
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
      description: "光弹附着灼烧，持续蚕食敌人生命。",
      color: "#ff765c",
      maxLevel: 3,
      apply(scene) {
        scene.stats.blazeLevel += 1;
      },
    },
    {
      id: "reach",
      sigil: "引",
      name: "远星引力",
      description: "索敌距离提高 70，弹体寿命延长。",
      color: "#8fe7ff",
      maxLevel: 3,
      apply(scene) {
        scene.stats.rangeBonus += 70;
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
      description: "光弹命中后爆开余焰，追加 10 点伤害。",
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
      description: "光弹伤害提高 6，攻击间隔缩短 8%，弹速提高 25。",
      color: "#a984d6",
      apply(scene) {
        scene.stats.damage += 6;
        scene.stats.fireRate = Math.max(150, scene.stats.fireRate * 0.92);
        scene.stats.projectileSpeed += 25;
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
        ["shade", 0.04], ["wraith", 0.1], ["splitter", 0.12], ["hexer", 0.12],
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
        ["shade", 0.08], ["wraith", 0.05], ["splitter", 0.09], ["hexer", 0.06],
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
        ["shade", 0.02], ["wraith", 0.04], ["splitter", 0.05], ["hexer", 0.09],
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
        ["shade", 0.04], ["wraith", 0.04], ["splitter", 0.06], ["hexer", 0.04],
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
      this.phaseBanner = null;
      this.kills = 0;
      this.level = 1;
      this.xp = 0;
      this.nextXp = 6;
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
      this.sharedVowUsed = false;
      this.nextCrownTickAt = 0;
      this.synergyFeedbackAt = Object.create(null);
      this.chainHitCounter = 0;
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
      this.input.keyboard.on("keydown-SPACE", this.handleDashKey);
      this.input.keyboard.on("keydown-SHIFT", this.handleDashKey);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.input.keyboard.off("keydown-SPACE", this.handleDashKey);
        this.input.keyboard.off("keydown-SHIFT", this.handleDashKey);
      });
    }

    createCollisions() {
      this.physics.add.overlap(this.bullets, this.enemies, this.onBulletHit, null, this);
      this.physics.add.overlap(this.player, this.enemyProjectiles, this.onEnemyProjectileHit, null, this);
      this.physics.add.overlap(this.player, this.enemies, this.onPlayerContact, null, this);
    }

    resetDom() {
      this.setGameplayChromeInert(false);
      ui.gameShell.classList.toggle("is-loadout", !autoStartOnCreate);
      ui.startScreen.hidden = autoStartOnCreate;
      ui.pauseScreen.hidden = true;
      ui.upgradeScreen.hidden = true;
      ui.routeScreen.hidden = true;
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
      ui.startEyebrow.textContent = `${this.battlefieldProfile.chapter} · 一局约 100 秒`;
      ui.startDescription.textContent = this.battlefieldProfile.description;
      ui.endRoute.textContent = "远征路线 · 尚未记录";
      ui.endSeals.innerHTML = "";
      ui.endArchiveSummary.textContent = "通关后写入远征档案";
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
      const profile = weaponCatalog.find((weapon) => weapon.id === id);
      if (!profile) return;
      selectedWeaponId = profile.id;
      this.weaponProfile = profile;
      this.stats.damage = profile.damage;
      this.stats.fireRate = profile.fireRate;
      this.stats.projectileCount = profile.projectileCount;
      this.stats.projectileSpeed = profile.projectileSpeed;
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
      this.started = true;
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
      this.updateDashState(this.gameplayTime);
      this.showPhaseBanner(
        `第一幕 · ${this.battlefieldProfile.name}`,
        this.battlefieldProfile.id === "mirror-harbor" ? "镜潮涨落" : "暗影苏醒",
        this.battlefieldProfile.firstActObjective,
      );
      this.time.delayedCall(350, () => this.spawnEnemy("shade"));
    }

    restartRun() {
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
      this.scene.restart();
    }

    returnToLoadout() {
      autoStartOnCreate = false;
      soundscape.stopMusic();
      this.time.paused = false;
      this.tweens.resumeAll();
      this.setGameplayChromeInert(false);
      ui.pauseScreen.hidden = true;
      ui.endScreen.hidden = true;
      ui.upgradeScreen.hidden = true;
      ui.routeScreen.hidden = true;
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

    showRouteChoice(stage) {
      if (this.ended || this.isChoosing || this.routeChoicesSeen.has(stage)) return false;
      const choices = routeCatalog.filter((route) => route.stage === stage);
      if (!choices.length) return false;
      this.isChoosing = true;
      this.pendingRouteStage = stage;
      this.routeChoicesSeen.add(stage);
      this.physics.world.pause();
      this.time.paused = true;
      this.tweens.pauseAll();
      this.setGameplayChromeInert(true);
      this.player.setVelocity(0, 0);
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
      if (!this.isChoosing || !this.pendingRouteStage) return;
      const route = this.getRoute(id);
      if (!route || route.stage !== this.pendingRouteStage) return;
      const stage = this.pendingRouteStage;
      this.pendingRouteStage = null;
      this.routePath.push(route.id);
      this.activeRouteId = route.id;
      if (stage === 3) this.finalRouteId = route.id;
      route.apply(this);
      this.applyDistrictTheme(route);
      this.spawnAccumulator = 0;
      this.wavePhase = stage;
      this.isChoosing = false;
      ui.routeScreen.hidden = true;
      this.time.paused = false;
      this.tweens.resumeAll();
      this.setGameplayChromeInert(false);
      this.physics.world.resume();
      ui.objectiveText.textContent = `${route.name} · ${route.tag}`;
      this.showPhaseBanner(
        `第${stage === 2 ? "二" : "三"}幕 · 路线已定`,
        route.name,
        `获得 ${route.reward}`,
      );
      this.spawnRipple(this.player.x, this.player.y, route.colorValue);
      this.burstAt(this.player.x, this.player.y, route.colorValue, 10);
      this.showCombatLabel(this.player.x, this.player.y - 36, route.name, route.colorValue);
      soundscape.play("upgrade", true);
      this.updateDashState(this.gameplayTime);
      this.updateHud(true);
      this.renderBuild();
      ui.pauseButton.focus({ preventScroll: true });
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
      const trailCreditCap = this.usesCompactControls() ? 3 : 6;
      const trailCreditRate = this.usesCompactControls() ? 90 : 180;
      this.playerTrailVfxCredit = Math.min(trailCreditCap, this.playerTrailVfxCredit + deltaSeconds * trailCreditRate);
      this.enemyTrailVfxCredit = Math.min(trailCreditCap, this.enemyTrailVfxCredit + deltaSeconds * trailCreditRate);
      this.updateProjectiles(frameDelta);
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
      if (this.stats.dawnLevel > 0 && this.dawnCooldown <= 0) {
        this.releaseDawnPulse();
      }

      if (this.elapsed >= RUN_DURATION && this.bossAlive && !this.overtimeStarted) {
        this.overtimeStarted = true;
        ui.waveLabel.textContent = "01:40 · 黎明决战";
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
      return this.stats.fireRate * (time < this.surgeUntil ? 0.82 : 1);
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
      this.surgeUntil = this.gameplayTime + EMBER_SURGE_DURATION;
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
      this.showPhaseBanner("火种满溢", "蓄光爆发", `${source ? `${source} · ` : ""}清场震荡 · 4 秒余辉加速`);
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
      const line = this.add.graphics().setDepth(5);
      line.lineStyle(2, COLORS.goldHot, 0.68);
      line.lineBetween(enemy.x, enemy.y, targetX, targetY);
      const targetRing = this.add.circle(targetX, targetY, 28, COLORS.goldHot, 0.045)
        .setStrokeStyle(2, COLORS.goldHot, 0.84)
        .setDepth(5);
      this.tweens.add({ targets: targetRing, scale: 0.48, alpha: 0.18, duration: 640, ease: "Sine.easeIn" });
      enemy.setData({
        attackState: "warning",
        attackAt: time + 640,
        chargeTargetX: targetX,
        chargeTargetY: targetY,
        chargeLine: line,
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
      const fanTelegraph = this.add.graphics().setDepth(5).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.42);
      [-0.18, 0.18].forEach((offset, index) => {
        const color = index === 0 ? COLORS.cyan : 0xff6d79;
        fanTelegraph.lineStyle(8, color, 0.09);
        fanTelegraph.lineBetween(enemy.x, enemy.y, enemy.x + Math.cos(angle + offset) * 380, enemy.y + Math.sin(angle + offset) * 380);
        fanTelegraph.lineStyle(2, color, 0.82);
        fanTelegraph.lineBetween(enemy.x, enemy.y, enemy.x + Math.cos(angle + offset) * 380, enemy.y + Math.sin(angle + offset) * 380);
      });
      this.tweens.add({ targets: sourceRing, scale: 1.5, angle: 190, alpha: 0.08, duration, ease: "Sine.easeIn" });
      this.tweens.add({ targets: fanTelegraph, alpha: 0.96, duration, ease: "Sine.easeIn" });
      enemy.setVelocity(0, 0).setTint(COLORS.violet);
      enemy.setData({ attackState: "warning", attackAt: time + duration, shotAngle: angle, sourceRing, fanTelegraph });
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
      const fanTelegraph = this.add.graphics().setDepth(5).setAlpha(0.46);
      [-0.28, 0, 0.28].forEach((offset, index) => {
        fanTelegraph.lineStyle(index === 1 ? 3 : 1, COLORS.ice, index === 1 ? 0.9 : 0.58);
        fanTelegraph.lineBetween(enemy.x, enemy.y, enemy.x + Math.cos(angle + offset) * 350, enemy.y + Math.sin(angle + offset) * 350);
      });
      this.tweens.add({ targets: sourceRing, scale: 1.4, angle: 160, alpha: 0.1, duration: 780, ease: "Sine.easeIn" });
      this.tweens.add({ targets: fanTelegraph, alpha: 0.9, duration: 780, ease: "Sine.easeIn" });
      enemy.setVelocity(0, 0).setTint(COLORS.ice);
      enemy.setData({ attackState: "warning", attackAt: time + 780, shotAngle: angle, sourceRing, fanTelegraph });
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
      const fanTelegraph = this.add.graphics().setDepth(5).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.42);
      [-0.16, 0.16].forEach((offset, index) => {
        const shotAngle = angle + offset;
        const color = index === 0 ? COLORS.cyan : 0xff6d79;
        fanTelegraph.lineStyle(8, color, 0.1);
        fanTelegraph.lineBetween(enemy.x, enemy.y, enemy.x + Math.cos(shotAngle) * 430, enemy.y + Math.sin(shotAngle) * 430);
        fanTelegraph.lineStyle(2, color, 0.82);
        fanTelegraph.lineBetween(enemy.x, enemy.y, enemy.x + Math.cos(shotAngle) * 430, enemy.y + Math.sin(shotAngle) * 430);
      });
      this.tweens.add({ targets: sourceRing, scale: 1.42, angle: 190, alpha: 0.08, duration, ease: "Sine.easeIn" });
      this.tweens.add({ targets: fanTelegraph, alpha: 0.94, duration, ease: "Sine.easeIn" });
      enemy.setVelocity(0, 0).setTint(COLORS.cyan);
      enemy.setData({ attackState: "warning", attackAt: time + duration, shotAngle: angle, sourceRing, fanTelegraph });
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
      const fanTelegraph = this.add.graphics().setDepth(5).setAlpha(0.42);
      const offsets = mode === "sniper" ? [0] : [-0.42, -0.28, -0.14, 0, 0.14, 0.28, 0.42];
      offsets.forEach((offset, index) => {
        const color = mode === "sniper" ? COLORS.red : index % 2 === 0 ? COLORS.ice : COLORS.violet;
        fanTelegraph.lineStyle(mode === "sniper" || index === 3 ? 3 : 1, color, mode === "sniper" ? 0.92 : 0.62);
        fanTelegraph.lineBetween(enemy.x, enemy.y, enemy.x + Math.cos(angle + offset) * 520, enemy.y + Math.sin(angle + offset) * 520);
      });
      this.tweens.add({ targets: sourceRing, scale: 1.48, angle: 180, alpha: 0.08, duration, ease: "Sine.easeIn" });
      this.tweens.add({ targets: fanTelegraph, alpha: 0.95, duration, ease: "Sine.easeIn" });
      enemy.setVelocity(0, 0).setTint(mode === "sniper" ? COLORS.red : COLORS.violet);
      enemy.setData({ attackState: "warning", attackAt: time + duration, prismMode: mode, shotAngle: angle, sourceRing, fanTelegraph });
      this.showThreatAlert(mode === "sniper" ? "棱镜狙击锁定 · 横移躲线" : "棱镜七向折射 · 穿过弹缝", mode === "sniper" ? COLORS.red : COLORS.violet, duration + 420);
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
        this.showThreatAlert("咒灯者锁定 · 离开紫色弹道", COLORS.violet, 1200);
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
      const fanTelegraph = this.add.graphics().setDepth(5).setAlpha(0.34);
      [-0.2, 0, 0.2].forEach((offset, index) => {
        fanTelegraph.lineStyle(index === 1 ? 2 : 1, index === 1 ? COLORS.gold : COLORS.violet, index === 1 ? 0.86 : 0.62);
        fanTelegraph.lineBetween(
          enemy.x,
          enemy.y,
          enemy.x + Math.cos(angle + offset) * 390,
          enemy.y + Math.sin(angle + offset) * 390,
        );
      });
      this.tweens.add({
        targets: fanTelegraph,
        alpha: 0.92,
        duration: 680,
        ease: "Sine.easeIn",
      });
      enemy.setData({
        attackState: "warning",
        attackAt: time + 680,
        shotAngle: angle,
        fanTelegraph,
      });
      enemy.setVelocity(0, 0);
      enemy.setTint(COLORS.violet);
      if (!this.bossAlive && time >= (this.nextCantorNoticeAt || 0)) {
        this.nextCantorNoticeAt = time + 4200;
        this.showThreatAlert("钟咏者三向扇射 · 从两道弹线之间穿过", COLORS.violet, 1250);
        soundscape.play("warning");
      }
    }

    fireCantorVolley(enemy, time) {
      if (!enemy.active) return;
      const baseAngle = enemy.getData("shotAngle") || 0;
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
      const fanTelegraph = this.add.graphics().setDepth(5).setAlpha(0.38);
      [-0.34, -0.17, 0, 0.17, 0.34].forEach((offset, index) => {
        fanTelegraph.lineStyle(index === 2 ? 2 : 1, index % 2 === 0 ? 0x43d9d0 : 0xff6d79, index === 2 ? 0.84 : 0.5);
        fanTelegraph.lineBetween(
          enemy.x,
          enemy.y,
          enemy.x + Math.cos(angle + offset) * 360,
          enemy.y + Math.sin(angle + offset) * 360,
        );
      });
      this.tweens.add({ targets: sourceRing, scale: 1.34, angle: 145, alpha: 0.12, duration: 760, ease: "Sine.easeIn" });
      this.tweens.add({ targets: fanTelegraph, alpha: 0.9, duration: 760, ease: "Sine.easeIn" });
      enemy.setData({
        attackState: "warning",
        attackAt: time + 760,
        shotAngle: angle,
        sourceRing,
        fanTelegraph,
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
          nextSummonAt: this.battlefieldProfile.id === "mirror-harbor"
            ? time + 9000
            : Number.POSITIVE_INFINITY,
        });
        ui.objectiveText.textContent = `${this.battlefieldProfile.bossName}现身，击败它`;
        this.updateBossPhaseHud(boss);
        return;
      }
      const phase = boss.getData("phase") || 1;
      const healthRatio = boss.getData("hp") / boss.getData("maxHp");
      if (state !== "pulseWarning" && state !== "mirrorWarning") {
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
        boss.rotation = Math.sin(time / 45) * 0.055;
        return;
      }

      if (state === "recovering") {
        boss.setVelocity(0, 0);
        boss.rotation = 0;
        if (time >= boss.getData("recoverUntil")) {
          boss.setData("attackState", "chasing");
          ui.objectiveText.textContent = `${this.battlefieldProfile.bossName}现身，击败它`;
          this.updateBossPhaseHud(boss);
        }
        return;
      }

      if (this.battlefieldProfile.id === "mirror-harbor") {
        const targetX = this.scale.width * 0.56;
        const targetY = this.getBossEntryY() + Math.sin(time / 720) * 52;
        this.physics.moveTo(boss, targetX, targetY, boss.getData("speed"));
      } else {
        this.physics.moveToObject(boss, this.player, boss.getData("speed"));
      }
      boss.rotation = Math.sin(time / 380) * 0.035;
      if (time >= boss.getData("nextSpecialAt")) {
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
        [-0.42, -0.28, -0.14, 0, 0.14, 0.28, 0.42].forEach((offset, index) => {
          telegraph.lineStyle(index === 3 ? 3 : 1, index % 2 === 0 ? 0x43d9d0 : 0xff6d79, index === 3 ? 0.9 : 0.5);
          telegraph.lineBetween(
            boss.x,
            boss.y,
            boss.x + Math.cos(angle + offset) * 430,
            boss.y + Math.sin(angle + offset) * 430,
          );
        });
      } else if (mode === "spiral") {
        telegraph.lineStyle(3, 0x43d9d0, 0.72);
        telegraph.strokeCircle(boss.x, boss.y, 68);
        telegraph.lineStyle(2, 0xff6d79, 0.64);
        telegraph.strokeCircle(boss.x, boss.y, 106);
        for (let index = 0; index < 12; index += 1) {
          const rayAngle = angle + (Math.PI * 2 * index) / 12;
          telegraph.lineBetween(
            boss.x + Math.cos(rayAngle) * 52,
            boss.y + Math.sin(rayAngle) * 52,
            boss.x + Math.cos(rayAngle) * 138,
            boss.y + Math.sin(rayAngle) * 138,
          );
        }
      } else if (mode === "lattice") {
        const top = this.getPlayableTop() + 54;
        const bottom = this.getPlayableBottom() - 54;
        mirrorNodes = [
          { x: Phaser.Math.Clamp(this.player.x - 150, 80, this.scale.width - 80), y: Phaser.Math.Clamp(this.player.y - 96, top, bottom) },
          { x: Phaser.Math.Clamp(this.player.x + 150, 80, this.scale.width - 80), y: Phaser.Math.Clamp(this.player.y - 74, top, bottom) },
          { x: Phaser.Math.Clamp(this.player.x, 80, this.scale.width - 80), y: Phaser.Math.Clamp(this.player.y + 132, top, bottom) },
        ];
        telegraph.lineStyle(10, 0x43d9d0, 0.08);
        telegraph.strokePoints([...mirrorNodes, mirrorNodes[0]], false);
        telegraph.lineStyle(2, 0xff6d79, 0.82);
        telegraph.strokePoints([...mirrorNodes, mirrorNodes[0]], false);
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
          telegraph.lineStyle(10, color, 0.08);
          telegraph.lineBetween(boss.x, boss.y, node.x, node.y);
          telegraph.lineStyle(2, color, 0.88);
          telegraph.lineBetween(boss.x, boss.y, node.x, node.y);
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
        boss.setData("nextSummonAt", time + 14500);
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
      this.bossTelegraph.lineStyle(2, COLORS.red, 0.42 + progress * 0.48);
      this.bossTelegraph.lineBetween(boss.x, boss.y, targetX, targetY);
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
      this.beginBossRecovery(boss, time, phase === 3 ? 1750 : phase === 2 ? 2400 : 3200, "冲锋失衡");
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
      });
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
        : (phase === 3 ? "双重暗潮袭来 · 第二道缺口旋转九十度" : "青色引线标出缺口 · 按顺时针规律移动");
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
      this.beginBossPulseWarning(boss, time, true);
      if (phase === 3) {
        this.time.delayedCall(420, () => {
          if (!boss.active || this.ended) return;
          this.spawnBossReinforcements(boss);
        });
      }
    }

    beginBossPulseWarning(boss, time, isTransition = false) {
      if (!boss.active) return;
      const previousRing = boss.getData("bossPulseRing");
      if (previousRing?.active) previousRing.destroy();
      const phase = boss.getData("phase") || 2;
      const color = phase === 3 ? COLORS.goldHot : COLORS.red;
      const duration = isTransition ? 920 : phase === 3 ? 680 : 780;
      const pulsePatternIndex = boss.getData("pulsePatternIndex") || 0;
      const safeAngle = (pulsePatternIndex % 4) * (Math.PI / 2);
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
      });
      boss.setVelocity(0, 0);
      boss.setTint(color);
      this.bossTelegraph.clear();
      const guideLength = Math.min(this.scale.width, this.scale.height) * 0.42;
      const guideHalfAngle = Math.PI / 6;
      this.bossTelegraph.lineStyle(2, COLORS.ice, 0.78);
      this.bossTelegraph.lineBetween(
        boss.x,
        boss.y,
        boss.x + Math.cos(safeAngle - guideHalfAngle) * guideLength,
        boss.y + Math.sin(safeAngle - guideHalfAngle) * guideLength,
      );
      this.bossTelegraph.lineBetween(
        boss.x,
        boss.y,
        boss.x + Math.cos(safeAngle + guideHalfAngle) * guideLength,
        boss.y + Math.sin(safeAngle + guideHalfAngle) * guideLength,
      );
      this.showCombatLabel(
        boss.x + Math.cos(safeAngle) * 92,
        boss.y + Math.sin(safeAngle) * 92,
        "安全缺口",
        COLORS.ice,
      );
      this.showThreatAlert(
        phase === 3
          ? "双重暗潮将至 · 第二道缺口旋转九十度"
          : "暗潮将至 · 青色引线之间是安全缺口",
        COLORS.ice,
        duration + 420,
      );
      this.updateBossPhaseHud(boss);
      soundscape.play("warning");
    }

    releaseBossPulse(boss, time) {
      if (!boss.active) return;
      const phase = boss.getData("phase") || 2;
      const ring = boss.getData("bossPulseRing");
      if (ring?.active) ring.destroy();
      boss.setData("bossPulseRing", null);
      boss.clearTint();
      this.bossTelegraph.clear();
      const count = phase === 3 ? 12 : 10;
      const speed = phase === 3 ? 215 : 188;
      const safeAngle = boss.getData("pulseSafeAngle") || 0;
      const pulsePatternIndex = boss.getData("pulsePatternIndex") || 0;
      boss.setData("pulsePatternIndex", pulsePatternIndex + 1);
      this.spawnBossPulseWave(boss, count, speed, safeAngle, phase);
      if (phase === 3) {
        this.time.delayedCall(300, () => {
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
      this.beginBossRecovery(boss, time, phase === 3 ? 1750 : 2400, "暗潮反噬");
    }

    spawnBossPulseWave(boss, count, speed, safeAngle, phase) {
      const color = phase === 3 ? COLORS.goldHot : COLORS.red;
      const step = (Math.PI * 2) / count;
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
        });
      }
    }

    spawnBossReinforcements(boss) {
      const y = Phaser.Math.Clamp(boss.y + 72, this.getPlayableTop() + 8, this.getPlayableBottom() - 22);
      const leftX = Phaser.Math.Clamp(boss.x - 82, 34, this.scale.width - 34);
      const rightX = Phaser.Math.Clamp(boss.x + 82, 34, this.scale.width - 34);
      this.spawnEnemy("wraith", leftX, y);
      this.spawnEnemy("wraith", rightX, y);
      this.spawnEnemy("shade", boss.x, Phaser.Math.Clamp(y + 34, this.getPlayableTop() + 8, this.getPlayableBottom() - 10));
      this.showCombatLabel(boss.x, y - 42, "终相残影", COLORS.goldHot);
      soundscape.play("wave");
    }

    beginBossRecovery(boss, time, nextSpecialDelay, cause) {
      if (!boss.active) return;
      boss.setVelocity(0, 0);
      boss.setData({
        attackState: "recovering",
        recoverUntil: time + 720,
        nextSpecialAt: time + nextSpecialDelay,
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
      ui.bossPhase.textContent = state === "entering" ? "现身" : vulnerable ? "破绽 ×1.35" : phase === 3 ? "终相" : phase === 2 ? "二相" : "一相";
      ui.bossPhase.classList.toggle("is-vulnerable", vulnerable);
    }

    updateProjectiles(delta) {
      this.bullets.children.iterate((bullet) => {
        if (!bullet || !bullet.active) return;
        const returnAfter = bullet.getData("returnAfter") || 0;
        const outboundAge = this.gameplayTime - (bullet.getData("spawnedAt") || 0);
        const velocity = bullet.body.velocity;
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
          const distance = Phaser.Math.Distance.Between(bullet.x, bullet.y, this.player.x, this.player.y - 5);
          if (distance <= 28) {
            this.catchReturner(bullet);
            return;
          }
          const desiredAngle = Phaser.Math.Angle.Between(bullet.x, bullet.y, this.player.x, this.player.y - 5);
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
      const radius = 56 + this.stats.orbitLevel * 8 + (gravityHalo ? 28 : 0);
      this.orbitals.forEach((orbital, index) => {
        const angle = time * 0.0022 + (Math.PI * 2 * index) / this.orbitals.length;
        orbital
          .setPosition(this.player.x + Math.cos(angle) * radius, this.player.y + Math.sin(angle) * radius)
          .setRotation(angle + Math.PI / 4)
          .setScale(0.92 + Math.sin(time * 0.008 + index) * 0.08);
        if (time >= (orbital.getData("trailAt") || 0)) {
          const trail = this.add.image(orbital.x, orbital.y, "fxShard")
            .setTint(index % 2 === 0 ? COLORS.cyan : COLORS.gold)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(7)
            .setRotation(angle + Math.PI)
            .setAlpha(0.42)
            .setScale(0.36, 0.2);
          this.tweens.add({
            targets: trail,
            x: trail.x - Math.cos(angle) * 22,
            y: trail.y - Math.sin(angle) * 22,
            scaleX: 0.1,
            scaleY: 0.08,
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

    updateWaveState() {
      if (!this.bossPreludeStarted && this.elapsed >= 18 && !this.scriptedThreatsSpawned.has("opening-threat")) {
        this.scriptedThreatsSpawned.add("opening-threat");
        this.spawnEnemy(this.battlefieldProfile.signatureEnemy || "charger");
      }
      if (this.elapsed >= ROUTE_STAGE_THREE_TIME && this.wavePhase < 3) {
        if (this.showRouteChoice(3)) return;
      } else if (this.elapsed >= ROUTE_STAGE_TWO_TIME && this.wavePhase < 2) {
        if (this.showRouteChoice(2)) return;
      }
      if (!this.bossPreludeStarted && this.elapsed >= 28 && !this.scriptedThreatsSpawned.has("blink-intro")) {
        this.scriptedThreatsSpawned.add("blink-intro");
        this.spawnEnemy("blinkHunter");
      }
      if (!this.bossPreludeStarted && this.elapsed >= 36 && !this.scriptedThreatsSpawned.has("route-threat")) {
        this.scriptedThreatsSpawned.add("route-threat");
        const routeThreat = this.getRoute(this.activeRouteId)?.scriptedThreat || "herald";
        this.spawnEnemy(routeThreat);
      }
      if (!this.bossPreludeStarted && this.elapsed >= 42 && !this.scriptedThreatsSpawned.has("frost-intro")) {
        this.scriptedThreatsSpawned.add("frost-intro");
        this.spawnEnemy("frostOracle");
      }
      if (!this.bossPreludeStarted && this.elapsed >= 54 && !this.scriptedThreatsSpawned.has("bomber-intro")) {
        this.scriptedThreatsSpawned.add("bomber-intro");
        this.spawnEnemy("emberBomber");
      }
      if (!this.bossPreludeStarted && this.elapsed >= 34 && !this.scriptedThreatsSpawned.has("echo-duelist-intro")) {
        this.scriptedThreatsSpawned.add("echo-duelist-intro");
        this.spawnEnemy("echoDuelist");
      }
      if (!this.bossPreludeStarted && this.elapsed >= 61 && !this.scriptedThreatsSpawned.has("void-scribe-intro")) {
        this.scriptedThreatsSpawned.add("void-scribe-intro");
        this.spawnEnemy("voidScribe");
      }
      if (!this.bossPreludeStarted && this.elapsed >= 65 && !this.scriptedThreatsSpawned.has("prism-intro")) {
        this.scriptedThreatsSpawned.add("prism-intro");
        this.spawnEnemy("prismSentry");
      }
      if (!this.bossPreludeStarted && this.elapsed >= 68 && !this.scriptedThreatsSpawned.has("signature-enemy")) {
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
      if (!this.bossSpawned && !this.bossPreludeStarted && this.spawnAccumulator >= interval && this.enemies.countActive(true) < this.getEnemyCap()) {
        this.spawnAccumulator = 0;
        this.spawnEnemy(this.pickEnemyKind());
        if (this.elapsed > 40 && Math.random() > 0.7 && this.enemies.countActive(true) < this.getEnemyCap()) {
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
        ui.waveLabel.textContent = "01:40 · 黎明抵达";
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
      let interval = 1320;
      if (this.elapsed >= 6 && this.elapsed < 12) interval = 1180;
      else if (this.elapsed < 18) interval = 1080;
      else if (this.elapsed < ROUTE_STAGE_TWO_TIME) interval = 990;
      else if (this.elapsed < 40) interval = 950;
      else if (this.elapsed < ROUTE_STAGE_THREE_TIME) interval = 810;
      else if (this.elapsed < 66) interval = 850;
      else if (this.elapsed < BOSS_TIME) interval = 760;
      if (this.activePatrolEvent) interval *= 1.25;
      const route = this.getRoute(this.activeRouteId);
      return Math.round(interval * (route?.spawnRate || 1) * (this.battlefieldProfile.spawnRate || 1));
    }

    getEnemyCap() {
      if (this.elapsed < 6) return 5;
      if (this.elapsed < 12) return 7;
      if (this.elapsed < 18) return 8;
      if (this.elapsed < ROUTE_STAGE_TWO_TIME) return 10;
      if (this.elapsed < 40) return 12;
      if (this.elapsed < ROUTE_STAGE_THREE_TIME) return 15;
      if (this.elapsed < 66) return 17;
      return 22;
    }

    pickWeightedEnemy(weights) {
      const available = weights.filter(([kind]) => (enemyCatalog[kind]?.randomAt || enemyCatalog[kind]?.unlockAt || 0) <= this.elapsed);
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
      if (this.battlefieldProfile.id === "mirror-harbor" && this.elapsed >= 18 && Math.random() < 0.18) {
        return "tideweaver";
      }
      if (this.elapsed < 6) return "shade";
      if (this.elapsed < 12) return roll < 0.72 ? "shade" : "wraith";
      if (this.elapsed < 18) return roll < 0.48 ? "shade" : roll < 0.72 ? "wraith" : "splitter";
      if (this.elapsed < ROUTE_STAGE_TWO_TIME) return roll < 0.35 ? "shade" : roll < 0.56 ? "wraith" : roll < 0.78 ? "splitter" : "charger";
      const route = this.getRoute(this.activeRouteId);
      if (route?.enemyWeights) return this.pickWeightedEnemy(route.enemyWeights);
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

    spawnEnemy(kind, spawnX = null, spawnY = null) {
      if (!this.started || this.ended) return;
      const stats = enemyCatalog[kind];
      if (!stats || (stats.unlockAt || 0) > this.elapsed) return;
      const maxActive = stats.maxActive || (kind === "tideweaver" ? 1 : null);
      if (maxActive) {
        let activeCount = 0;
        this.enemies.children.iterate((enemy) => {
          if (enemy?.active && enemy.getData("kind") === kind) activeCount += 1;
        });
        if (activeCount >= maxActive) return;
      }
      const margin = 35;
      let x = spawnX;
      let y = spawnY;
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        if (this.battlefieldProfile.id === "mirror-harbor") {
          const playableTop = this.getPlayableTop();
          const playableBottom = this.getPlayableBottom();
          const laneY = Math.random() > 0.5
            ? playableTop + (playableBottom - playableTop) * 0.28
            : playableTop + (playableBottom - playableTop) * 0.72;
          if (this.elapsed < ROUTE_STAGE_THREE_TIME || Math.random() < 0.72) {
            x = -margin;
            y = laneY + Phaser.Math.Between(-24, 24);
          } else {
            x = Phaser.Math.Between(28, Math.max(30, Math.round(this.scale.width * 0.2)));
            y = Math.random() > 0.5 ? playableTop - margin : playableBottom + margin;
          }
        } else {
          const side = Phaser.Math.Between(0, 3);
          if (side === 0) {
            x = Phaser.Math.Between(0, this.scale.width);
            y = -margin;
          } else if (side === 1) {
            x = this.scale.width + margin;
            y = Phaser.Math.Between(this.getPlayableTop(), this.getPlayableBottom());
          } else if (side === 2) {
            x = Phaser.Math.Between(0, this.scale.width);
            y = this.getPlayableBottom() + margin;
          } else {
            x = -margin;
            y = Phaser.Math.Between(this.getPlayableTop(), this.getPlayableBottom());
          }
        }
      }

      const healthScale = 1 + Math.max(0, this.elapsed - 20) * 0.003;
      const textureMap = {
        tideweaver: "tideweaverArt",
        mirrorAcolyte: "mirrorBossArt",
        blinkHunter: "blinkHunterArt",
        frostOracle: "frostOracleArt",
        emberBomber: "emberBomberArt",
        echoDuelist: "echoDuelistArt",
        voidScribe: "voidScribeArt",
        prismSentry: "prismSentryArt",
      };
      const preferredTexture = textureMap[kind];
      const texture = preferredTexture && this.textures.exists(preferredTexture) ? preferredTexture : kind;
      const enemy = this.enemies.create(x, y, texture).setDepth(6);
      if (kind === "tideweaver" && texture === "tideweaverArt") enemy.setDisplaySize(54, 60);
      if (kind === "mirrorAcolyte" && texture === "mirrorBossArt") enemy.setDisplaySize(58, 58);
      if (["blinkHunter", "frostOracle", "emberBomber", "echoDuelist", "voidScribe", "prismSentry"].includes(kind) && texture === preferredTexture) {
        const sizes = { blinkHunter: [62, 68], frostOracle: [64, 72], emberBomber: [68, 72], echoDuelist: [66, 70], voidScribe: [66, 72], prismSentry: [66, 70] };
        enemy.setDisplaySize(...sizes[kind]);
      }
      enemy.body.setCircle(Math.min(enemy.width, enemy.height) * 0.36);
      enemy.setData({
        kind,
        hp: Math.round(stats.hp * healthScale),
        maxHp: Math.round(stats.hp * healthScale),
        armor: stats.armor || 0,
        maxArmor: stats.armor || 0,
        speed: stats.speed,
        damage: stats.damage,
        xp: stats.xp,
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
      ["hpBarBack", "hpBarFill", "armorRing", "sourceRing", "targetRing", "riftAura", "riftLabel", "supportAura", "mirrorSummonOuter", "mirrorSummonInner", "chargeLine", "chargeTargetRing", "fanTelegraph", "bombMarker", "slamRing", "bossAura", "bossPulseRing", "mirrorTelegraph"].forEach((key) => {
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
      const y = -72;
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
      const bossHealth = Math.round(baseBossHealth * (this.battlefieldProfile.bossHealthScale || 1));
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
        nextSummonAt: Number.POSITIVE_INFINITY,
        battlefieldId: this.battlefieldProfile.id,
        bossAura,
        bossPulseRing: null,
      });
      this.boss = boss;
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
      const bullet = this.bullets.create(this.player.x, this.player.y - 5, texture).setDepth(7);
      const hitScale = options.hitScale ?? 1;
      const fxStyle = options.fxStyle ?? profile.fxStyle ?? profile.id;
      const baseScale = options.scale ?? 1;
      const baseLife = options.life ?? profile.life;
      bullet.setScale(baseScale);
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
        trailRadius: options.trailRadius ?? profile.trailRadius,
        fxStyle,
        trailAt: 0,
        signature: options.signature ?? null,
        weaponEffect: options.weaponEffect ?? null,
        effectLevel: options.effectLevel ?? 0,
        spawnedAt: this.gameplayTime,
        returnAfter: options.returnAfter ?? profile.returnAfter ?? 0,
        returning: false,
        returnPulseLevel: options.returnPulseLevel ?? 0,
        returnDamageMultiplier: options.returnDamageMultiplier ?? 1,
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

    releaseScatterBurst(level) {
      const shardCount = 6 + level * 2;
      const damage = Math.round(this.stats.damage * (0.5 + level * 0.12));
      for (let index = 0; index < shardCount; index += 1) {
        const angle = (index / shardCount) * Math.PI * 2;
        this.spawnPlayerBullet(angle, null, {
          texture: "scatterBolt",
          damage,
          pierce: level >= 3 ? 1 : 0,
          life: 660 + level * 70,
          speed: 410 + level * 25,
          homing: 0,
          scale: 0.8,
          hitScale: 0.82,
          trailRadius: 2,
          signature: "scatter",
        });
      }
      this.spawnRipple(this.player.x, this.player.y, this.weaponProfile.colorValue);
      this.burstAt(this.player.x, this.player.y, this.weaponProfile.colorValue, 8 + level * 2);
      this.announceWeaponTrigger(this.player.x, this.player.y - 34, `${shardCount} 枚星片`);
      soundscape.play("pulse");
    }

    detonateLanternMark(x, y) {
      const level = this.stats.signatureLevel;
      const radius = 78 + level * 14;
      const damage = 12 + level * 8;
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
      soundscape.play("ember");
    }

    releaseArcGlyph(origin, x, y, level) {
      if (level <= 0) return;
      const jumpCount = 2 + level;
      const range = 205 + level * 18;
      const damage = Math.round(this.stats.damage * (0.55 + level * 0.1));
      let fromX = x;
      let fromY = y;
      const visited = new Set([origin]);
      for (let jump = 0; jump < jumpCount; jump += 1) {
        let target = null;
        let nearestDistance = range * range;
        this.enemies.children.iterate((enemy) => {
          if (!enemy?.active || visited.has(enemy)) return;
          const distance = Phaser.Math.Distance.Squared(fromX, fromY, enemy.x, enemy.y);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            target = enemy;
          }
        });
        if (!target) break;
        visited.add(target);
        const targetX = target.x;
        const targetY = target.y;
        this.drawLightning(fromX, fromY, targetX, targetY);
        this.damageEnemy(target, Math.max(1, Math.round(damage * (0.82 ** jump))), null);
        fromX = targetX;
        fromY = targetY;
      }
      this.spawnExpandingSigil(x, y, 0x8fe7ff, 72 + level * 10, 360);
      this.announceWeaponTrigger(x, y - 28, `${Math.max(0, visited.size - 1)} 段跃雷`);
      soundscape.play("chain", true);
    }

    releaseNovaRing(origin, x, y, level) {
      const empowered = level > 0;
      const radius = empowered ? 96 + level * 14 : 72;
      const damage = empowered ? 22 + level * 7 : 14;
      const coreDamage = Math.round(damage * (empowered ? 2 : 1.25));
      this.spawnExpandingSigil(x, y, 0xffcf62, radius, empowered ? 440 : 340);
      this.spawnExpandingSigil(x, y, COLORS.goldHot, radius * 0.62, 320, 40, Math.PI / 4);
      this.spawnRadialShards(x, y, 0xffcf62, empowered ? 10 + level * 2 : 7, radius * 0.56, 0, 0.5);
      if (origin?.active) this.damageEnemy(origin, coreDamage, null);
      this.enemies.getChildren().slice().forEach((enemy) => {
        if (!enemy?.active || enemy === origin) return;
        if (Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= radius) this.damageEnemy(enemy, damage, null);
      });
      if (empowered) {
        this.announceWeaponTrigger(x, y - 28, `日珥 ${coreDamage}`);
        soundscape.play("pulse", true);
      } else {
        soundscape.play("ember");
      }
    }

    beginReturnFlight(bullet) {
      if (!bullet?.active || bullet.getData("returning")) return;
      bullet.setData("returning", true);
      bullet.setData("target", null);
      bullet.setData("homing", 0);
      bullet.getData("hitTargets")?.clear();
      bullet.setAngularVelocity(780);

      const level = bullet.getData("returnPulseLevel") || 0;
      if (level <= 0) return;
      const x = bullet.x;
      const y = bullet.y;
      const radius = 72 + level * 15;
      const pulseDamage = 10 + level * 8;
      bullet.setData("damage", Math.round(bullet.getData("damage") * bullet.getData("returnDamageMultiplier")));
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
      this.burstAt(x, y, COLORS.ice, 8 + level * 2);
      this.announceWeaponTrigger(x, y - 30, `折返点月环 ${pulseDamage}`);
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

    fireAtNearest(time) {
      let nearest = null;
      let nearestDistance = Number.POSITIVE_INFINITY;
      let nearestPriority = -1;
      const profile = this.weaponProfile;
      const effectiveRange = profile.range + this.stats.rangeBonus;
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
        if (priority > nearestPriority || (priority === nearestPriority && distance < nearestDistance)) {
          nearestPriority = priority;
          nearestDistance = distance;
          nearest = enemy;
        }
      });
      if (!nearest) {
        this.priorityTarget = null;
        return;
      }

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
      const offsets = [0];
      for (let ring = 1; offsets.length < count; ring += 1) {
        offsets.push(this.volleySide * ring * spread);
        if (offsets.length < count) offsets.push(-this.volleySide * ring * spread);
      }
      if (count % 2 === 0) this.volleySide *= -1;
      for (const offset of offsets) {
        const angle = baseAngle + offset;
        const central = Math.abs(offset) < 0.001;
        const isEmpoweredReturn = isReturner && signatureTriggered && central;
        let shotOptions;
        if (isChargedLance) {
          shotOptions = {
            damage: Math.round(this.stats.damage * (1.45 + this.stats.signatureLevel * 0.25)),
            pierce: profile.pierce + 1 + this.stats.signatureLevel,
            life: profile.life + 260,
            speed: this.stats.projectileSpeed * 0.9,
            scale: 1.55 + this.stats.signatureLevel * 0.12,
            hitScale: 1.3,
            trailRadius: profile.trailRadius + 2 + this.stats.signatureLevel,
            signature: "lance",
            glow: true,
          };
        } else if (isReturner) {
          shotOptions = {
            returnAfter: profile.returnAfter,
            returnPulseLevel: isEmpoweredReturn ? this.stats.signatureLevel : 0,
            returnDamageMultiplier: isEmpoweredReturn ? 1.15 + this.stats.signatureLevel * 0.15 : 1,
            scale: isEmpoweredReturn ? 1.18 + this.stats.signatureLevel * 0.06 : 1,
            hitScale: isEmpoweredReturn ? 1.1 : 1,
            signature: isEmpoweredReturn ? "returner" : null,
          };
        } else {
          shotOptions = {
            signature: profile.id === "tracker" && this.stats.signatureLevel > 0 ? "tracker" : null,
          };
        }
        if (profile.id === "arc" && signatureTriggered && central) {
          shotOptions.weaponEffect = "arc";
          shotOptions.effectLevel = this.stats.signatureLevel;
          shotOptions.scale = 1.24 + this.stats.signatureLevel * 0.08;
          shotOptions.glow = true;
        }
        if (profile.id === "nova") {
          const empowered = signatureTriggered && central;
          shotOptions.weaponEffect = "nova";
          shotOptions.effectLevel = empowered ? this.stats.signatureLevel : 0;
          shotOptions.damage = empowered
            ? Math.round(this.stats.damage * (1.2 + this.stats.signatureLevel * 0.1))
            : this.stats.damage;
          shotOptions.scale = empowered ? 1.28 + this.stats.signatureLevel * 0.08 : 1;
          shotOptions.glow = empowered;
        }
        this.spawnPlayerBullet(angle, nearest, shotOptions);
      }
      this.spawnWeaponMuzzle(
        baseAngle,
        profile.fxStyle,
        profile.colorValue,
        isChargedLance || (isReturner && signatureTriggered) || (["arc", "nova"].includes(profile.id) && signatureTriggered),
      );
      if (profile.id === "scatter" && signatureTriggered) this.releaseScatterBurst(this.stats.signatureLevel);
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
      soundscape.play("shot");
      this.player.rotation = Math.sin(time / 45) * 0.025;
      this.time.delayedCall(70, () => {
        if (this.player?.active) this.player.rotation = 0;
      });
    }

    onBulletHit(bullet, enemy) {
      if (!bullet.active || !enemy.active) return;
      const hitTargets = bullet.getData("hitTargets");
      if (hitTargets?.has(enemy)) return;
      hitTargets?.add(enemy);
      const leavesEmber = this.activeSynergies.has("emberVolley");
      const emberX = enemy.x;
      const emberY = enemy.y;
      const impactAngle = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
      const tracksLanternMark = bullet.getData("signature") === "tracker";
      const critical = this.stats.criticalChance > 0 && Math.random() < this.stats.criticalChance;
      const surgeMultiplier = this.gameplayTime < this.surgeUntil ? 1.25 : 1;
      const directDamage = Math.round(bullet.getData("damage") * (critical ? 1.8 : 1) * surgeMultiplier);
      this.spawnProjectileImpact(
        emberX,
        emberY,
        bullet.getData("color") || COLORS.gold,
        bullet.getData("fxStyle") || this.weaponProfile.fxStyle,
        impactAngle,
      );
      this.applyFrost(enemy);
      this.applyBlaze(enemy);
      this.triggerFrostfire(enemy, emberX, emberY);
      this.damageEnemy(enemy, directDamage, bullet);
      if (critical) this.showCombatLabel(emberX, emberY - 28, `暴击 ${directDamage}`, COLORS.gold);
      if (this.ended) {
        if (bullet.active) bullet.destroy();
        return;
      }
      if (tracksLanternMark) {
        this.signatureCounter += 1;
        if (this.signatureCounter >= this.getSignatureCycle()) {
          this.signatureCounter = 0;
          this.detonateLanternMark(emberX, emberY);
        }
        this.updateWeaponState();
      }
      if (bullet.getData("weaponEffect") === "arc") {
        this.releaseArcGlyph(enemy, emberX, emberY, bullet.getData("effectLevel") || 0);
      } else if (bullet.getData("weaponEffect") === "nova") {
        this.releaseNovaRing(enemy, emberX, emberY, bullet.getData("effectLevel") || 0);
      }
      this.tryChainLightning(enemy, emberX, emberY, critical);
      if (leavesEmber) {
        this.time.delayedCall(90, () => {
          if (this.ended) return;
          this.spawnRipple(emberX, emberY, COLORS.goldHot);
          if (enemy.active) this.damageEnemy(enemy, 10, null);
          soundscape.play("ember");
          this.announceSynergyTrigger("emberVolley", emberX, emberY, "余焰 +10");
        });
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
      const impactAngle = Math.atan2(shot.body.velocity.y, shot.body.velocity.x);
      shot.destroy();
      this.spawnProjectileImpact(impactX, impactY, color, style, impactAngle);
      if (this.gameplayTime < this.dashInvulnerableUntil) {
        this.showDashEvade(impactX, impactY);
        return;
      }
      if (this.stats.aegisLevel > 0 && this.tryAegisBlock(impactX, impactY)) return;
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

    damageEnemy(enemy, amount, bullet) {
      if (this.ended || !enemy.active) return;
      const isBoss = enemy.getData("kind") === "boss";
      soundscape.play("hit");
      const hitsVulnerability = isBoss && enemy.getData("attackState") === "recovering";
      let remainingDamage = hitsVulnerability ? Math.round(amount * 1.35) : amount;
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
          this.time.delayedCall(70, () => {
            if (enemy.active) enemy.clearTint();
          });
          return;
        }
      }
      const health = enemy.getData("hp") - remainingDamage;
      enemy.setData("hp", health);
      enemy.setTintFill(0xffffff);
      this.showDamageNumber(enemy.x, enemy.y, remainingDamage, isBoss, hitsVulnerability ? "#fff0a3" : null);
      this.time.delayedCall(55, () => {
        if (enemy.active) enemy.clearTint();
      });
      const impactColor = isBoss ? (hitsVulnerability ? COLORS.gold : COLORS.red) : bullet?.getData("color") || COLORS.gold;
      this.burstAt(enemy.x, enemy.y, impactColor, bullet ? 3 : 2);
      this.updateEnemyDecorations(enemy);
      if (isBoss) this.updateBossHud();
      if (health <= 0) this.killEnemy(enemy);
    }

    killEnemy(enemy) {
      if (!enemy.active) return;
      const kind = enemy.getData("kind");
      const xpValue = enemy.getData("xp");
      const x = enemy.x;
      const y = enemy.y;
      const deathVfxSpawned = this.spawnDeathVfx(
        enemy,
        enemyCatalog[kind]?.color || (kind === "boss" ? this.battlefieldProfile.accentValue : COLORS.red),
      );
      this.destroyEnemyDecorations(enemy);
      enemy.disableBody(true, true);
      this.kills += 1;
      const deathBurstCount = kind === "boss"
        ? (this.usesCompactControls() ? 14 : 22)
        : deathVfxSpawned ? (this.usesCompactControls() ? 6 : 8) : (this.usesCompactControls() ? 2 : 3);
      this.burstAt(x, y, enemyCatalog[kind]?.color || COLORS.red, deathBurstCount);

      if (kind === "boss") {
        this.bossAlive = false;
        this.boss = null;
        this.bossTelegraph.clear();
        ui.bossStatus.hidden = true;
        this.elapsed = RUN_DURATION;
        ui.waveLabel.textContent = "01:40 · 黎明抵达";
        this.spawnBossDeathSpectacle(x, y, this.battlefieldProfile.id === "mirror-harbor" ? 0x43d9d0 : COLORS.gold);
        enemy.destroy();
        this.updateHud(true);
        this.finishRun(true, this.battlefieldProfile.finishMessage);
        return;
      } else if (kind === "rift") {
        soundscape.play("kill");
        this.completePatrolEvent("rift", x, y);
        enemy.destroy();
        return;
      } else {
        soundscape.play("kill");
        if (xpValue > 0) this.spawnSpark(x, y, xpValue);
        if (kind === "splitter") {
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
      soundscape.play("pickup");
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
      this.nextXp = Math.round(this.nextXp * 1.24 + 2);
      this.updateHud(true);
      this.showUpgradeChoice();
      return true;
    }

    showUpgradeChoice() {
      this.isChoosing = true;
      this.physics.world.pause();
      this.time.paused = true;
      this.tweens.pauseAll();
      this.setGameplayChromeInert(true);
      this.player.setVelocity(0, 0);
      ui.upgradeScreen.hidden = false;
      soundscape.play("level");
      const available = upgradeCatalog.filter((upgrade) => (
        this.upgradeLevels[upgrade.id] < upgrade.maxLevel &&
        (!upgrade.weaponOnly || upgrade.weaponOnly === this.weaponProfile.id)
      ));
      const needsFirstSynergy = this.activeSynergies.size === 0;
      const partner = needsFirstSynergy ? this.getPendingSynergyPartner() : null;
      const featuredSkillId = needsFirstSynergy ? ["frost", "chain", "aegis", "afterglow"][this.level - 2] : null;
      const featuredSkill = available.find((upgrade) => upgrade.id === featuredSkillId);
      const featuredSignature = this.level === 2
        ? available.find((upgrade) => upgrade.id === this.weaponProfile.signatureUpgrade)
        : null;
      const guaranteed = [featuredSignature, partner, featuredSkill]
        .filter(Boolean)
        .filter((upgrade, index, items) => items.findIndex((item) => item.id === upgrade.id) === index);
      const guaranteedIds = new Set(guaranteed.map((upgrade) => upgrade.id));
      const remaining = available.filter((upgrade) => !guaranteedIds.has(upgrade.id));
      Phaser.Utils.Array.Shuffle(remaining);
      const choices = [...guaranteed, ...remaining.slice(0, Math.max(0, 3 - guaranteed.length))];
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
      ui.upgradeOptions.querySelector("button")?.focus({ preventScroll: true });
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

    applyUpgrade(id) {
      if (!this.isChoosing) return;
      const upgrade = upgradeCatalog.find((item) => item.id === id);
      if (!upgrade) return;
      if (upgrade.weaponOnly && upgrade.weaponOnly !== this.weaponProfile.id) return;
      this.upgradeLevels[id] += 1;
      upgrade.apply(this);
      const unlockedSynergies = this.unlockSynergies();
      this.isChoosing = false;
      ui.upgradeScreen.hidden = true;
      this.time.paused = false;
      this.tweens.resumeAll();
      this.setGameplayChromeInert(false);
      this.physics.world.resume();
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
    }

    renderBuild() {
      const activeUpgrades = upgradeCatalog.filter((upgrade) => this.upgradeLevels[upgrade.id] > 0);
      const activeSynergies = synergyCatalog.filter((synergy) => this.activeSynergies.has(synergy.id));
      const activeRelics = patrolRelicCatalog.filter((relic) => this.patrolRelics.has(relic.id));
      const weaponMarkup = `<span class="build-sigil build-sigil--weapon" style="--build-color:${this.weaponProfile.color}" title="${this.weaponProfile.name}：${this.weaponProfile.description}" aria-label="当前武器 ${this.weaponProfile.name}">${this.weaponProfile.sigil}<b>器</b></span>`;
      this.updateWeaponState();
      ui.synergyList.hidden = activeSynergies.length === 0;
      ui.synergyList.innerHTML = activeSynergies
        .map((synergy) => `
          <div class="synergy-row" data-synergy="${synergy.id}" style="--synergy-color:${synergy.color}" title="${synergy.description}">
            <span class="synergy-row__sigil">${synergy.sigil}</span>
            <span><small>自动共鸣</small><strong>${synergy.name}</strong></span>
          </div>`)
        .join("");
      if (!activeUpgrades.length && !activeRelics.length) {
        ui.buildList.innerHTML = `${weaponMarkup}<span class="build-list__empty">火种尚未共鸣</span>`;
        return;
      }
      const relicMarkup = activeRelics
        .map((relic) => `<span class="build-sigil build-sigil--relic" style="--build-color:${relic.color}" title="${relic.name}：${relic.description}" aria-label="巡夜遗物 ${relic.name}"><i>${relic.sigil}</i><b>遗</b></span>`)
        .join("");
      const upgradeMarkup = activeUpgrades
        .map((upgrade) => {
          const level = this.upgradeLevels[upgrade.id];
          const signatureClass = upgrade.weaponOnly ? " build-sigil--signature" : "";
          return `<span class="build-sigil${signatureClass}" style="--build-color:${upgrade.color}" title="${upgrade.name} ${level}级" aria-label="${upgrade.name} ${level}级">${upgrade.sigil}<b>${level}</b></span>`;
        })
        .join("");
      ui.buildList.innerHTML = weaponMarkup + relicMarkup + upgradeMarkup;
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
      this.spawnExpandingSigil(this.player.x, this.player.y, COLORS.paper, radius, 610);
      this.spawnExpandingSigil(this.player.x, this.player.y, COLORS.gold, radius * 0.78, 540, 55, Math.PI / 4);
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
          this.damageEnemy(enemy, 18 + this.stats.dawnLevel * 12, null);
        }
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
      const isLance = style === "lance";
      const isScatter = style === "scatter";
      const isReturner = style === "returner";
      const isBoss = style === "bossRed" || style === "bossGold";
      const isTide = style === "tide";
      const texture = isLance || isTide ? "fxSlash" : isScatter ? "fxShard" : isReturner ? "returnBolt" : isBoss ? "fxStar" : style === "hexer" ? "fxGlow" : "fxStar";
      const baseScale = isLance
        ? 0.34 + radius * 0.045
        : isScatter ? 0.26 + radius * 0.035
          : isReturner ? 0.2 + radius * 0.028
          : isTide ? 0.3 + radius * 0.042
          : isBoss ? 0.24 + radius * 0.045
            : style === "hexer" ? 0.22 + radius * 0.05 : 0.2 + radius * 0.045;
      const tailDistance = isLance ? 13 : isTide ? 11 : isScatter ? 7 : isReturner ? 8 : 5;
      const trail = this.add.image(
        x - Math.cos(angle) * tailDistance,
        y - Math.sin(angle) * tailDistance,
        texture,
      )
        .setTint(color)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(4)
        .setRotation(angle)
        .setAlpha(isBoss || isTide ? 0.74 : isReturner ? 0.42 : 0.58)
        .setScale(baseScale, isLance || isTide ? baseScale * 0.62 : baseScale);
      this.tweens.add({
        targets: trail,
        x: trail.x - Math.cos(angle) * (isLance ? 14 : isTide ? 12 : 7),
        y: trail.y - Math.sin(angle) * (isLance ? 14 : isTide ? 12 : 7),
        scaleX: baseScale * 0.25,
        scaleY: baseScale * 0.25,
        alpha: 0,
        angle: trail.angle + (isReturner ? 150 : isBoss ? 55 : 0),
        duration: isLance ? 250 : isTide ? 230 : isBoss ? 260 : isReturner ? 240 : 210,
        ease: "Quad.easeOut",
        onComplete: () => trail.destroy(),
      });
      return true;
    }

    spawnProjectileImpact(x, y, color, style = "tracker", angle = 0) {
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

      if (style === "scatter") {
        this.spawnRadialShards(x, y, color, 4, 34, angle + Math.PI * 0.72, 0.42, Math.PI * 0.56);
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

    spawnRadialShards(x, y, color, count, distance, offset = 0, scale = 0.4, arc = Math.PI * 2) {
      const fullCircle = Math.abs(arc - Math.PI * 2) < 0.001;
      const divisor = fullCircle ? count : Math.max(1, count - 1);
      for (let index = 0; index < count; index += 1) {
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
      const particleCount = Math.min(24, Math.max(0, count));
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
      if (!isBoss && this.deathVfxActive >= (this.usesCompactControls() ? 4 : 7)) return false;
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
      this.ended = true;
      soundscape.stopMusic();
      this.setGameplayChromeInert(true);
      this.clearThreatAlert();
      this.clearPatrolEvent();
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
      ui.endScreen.hidden = false;
      ui.endPanel.classList.toggle("is-defeat", !victory);
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
      version: 1,
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
      chooseRoute: (id) => activeScene?.applyRouteChoice(id),
      dash: () => activeScene?.tryDash(),
    });
  }

  new Phaser.Game(config);

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
  ui.routeOptions.addEventListener("click", (event) => {
    const option = event.target.closest("[data-route]");
    if (option) activeScene?.applyRouteChoice(option.dataset.route);
  });

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
    if (activeScene?.started && !activeScene.ended && !activeScene.isChoosing) activeScene.togglePause(true);
  });
})();
