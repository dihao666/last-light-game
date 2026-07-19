(function () {
  "use strict";

  class MirrorHarborController {
    constructor(scene) {
      this.scene = scene;
      this.nextSweepAt = scene.runProfile?.precisionPrototype
        ? scene.runProfile.prototypeTideWarningAt
        : scene.runProfile?.id === "standard" ? 12000 : 6800;
      this.sweepIndex = 0;
      this.warning = null;
      this.ambient = [];
      this.transientFx = new Set();
      this.transientTimers = new Set();
      this.createAmbientGlints();
    }

    createAmbientGlints() {
      const scene = this.scene;
      const count = scene.usesCompactControls() ? 5 : 8;
      for (let index = 0; index < count; index += 1) {
        const glint = scene.add.image(
          ((index + 0.5) / count) * scene.scale.width,
          scene.getPlayableTop() + ((index * 83) % Math.max(120, scene.getPlayableBottom() - scene.getPlayableTop())),
          index % 2 === 0 ? "fxShard" : "fxGlow",
        )
          .setTint(index % 3 === 0 ? 0xff6d79 : 0x43d9d0)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setAlpha(0.11)
          .setScale(index % 2 === 0 ? 0.5 : 0.8)
          .setDepth(-3);
        scene.tweens.add({
          targets: glint,
          x: glint.x + (index % 2 === 0 ? 46 : -38),
          y: glint.y + (index % 3 === 0 ? 22 : -18),
          alpha: { from: 0.05, to: 0.2 },
          angle: index % 2 === 0 ? 28 : -18,
          duration: 2200 + index * 170,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
        this.ambient.push(glint);
      }
    }

    update(time) {
      const scene = this.scene;
      if (scene.ended || scene.isChoosing || !scene.started) return;
      if (scene.bossPreludeStarted && !scene.bossAlive) {
        this.clearWarning();
        this.nextSweepAt = scene.runProfile?.precisionPrototype
          ? Number.POSITIVE_INFINITY
          : time + 1800;
        return;
      }
      if (this.warning) {
        if (time >= this.warning.resolveAt) this.resolveSweep(time);
        return;
      }
      if (scene.elapsed < 7 || time < this.nextSweepAt) return;
      this.beginSweep(time);
    }

    beginSweep(time, restartWarning = null) {
      const scene = this.scene;
      const vertical = false;
      const laneWidth = restartWarning?.laneWidth ?? (scene.usesCompactControls() ? 82 : 96);
      const playableTop = scene.getPlayableTop();
      const playableBottom = scene.getPlayableBottom();
      const playableHeight = playableBottom - playableTop;
      const upperLane = playableTop + playableHeight * 0.28;
      const lowerLane = playableTop + playableHeight * 0.72;
      const isUpperLane = restartWarning?.isUpperLane ?? this.sweepIndex % 2 === 0;
      const position = restartWarning?.position ?? (isUpperLane ? upperLane : lowerLane);
      const configuredWarningDuration = scene.runProfile?.precisionPrototype
        ? scene.runProfile.prototypeTideWarningDuration
        : 1400;
      const warningAt = restartWarning?.warningAt ?? time;
      const resolveAt = restartWarning?.resolveAt ?? time + configuredWarningDuration;
      const warningDuration = Math.max(1, resolveAt - time);
      let telegraph = null;
      const markers = [];
      let fxObjects = [];
      if (scene.runProfile?.precisionPrototype) {
        fxObjects = this.createPrototypeWarningFx(position, laneWidth, warningAt, resolveAt, time);
      } else {
        fxObjects = this.createPrototypeWarningFx(position, laneWidth, warningAt, resolveAt, time);
      }
      this.warning = { vertical, position, laneWidth, warningAt, resolveAt, isUpperLane, telegraph, markers, fxObjects };
      if (!restartWarning) {
        this.sweepIndex += 1;
        scene.recordPrecisionPrototypeEvent?.("tide-warning", {
          warningAt,
          dangerAt: resolveAt,
          lane: {
            axis: "y",
            center: position,
            min: position - laneWidth / 2,
            max: position + laneWidth / 2,
          },
        });
      }
      scene.showThreatAlert(isUpperLane ? "上港退潮 · 转下港" : "下港退潮 · 转上港", 0xff6d79, warningDuration + 320);
    }

    createPrototypeWarningFx(position, laneWidth, warningAt, resolveAt, time) {
      const scene = this.scene;
      const width = scene.scale.width;
      const elapsed = Math.max(0, time - warningAt);
      const duration = Math.max(1, resolveAt - warningAt);
      const progress = Phaser.Math.Clamp(elapsed / duration, 0, 1);
      const earlyRevealAt = duration * 0.1375;
      const crestMidAt = duration * 0.5625;
      const crestPeakAt = duration * 0.85;
      const objects = [];
      const backwater = scene.add.graphics().setDepth(3);
      backwater.fillStyle(0x1f7f86, 0.1);
      backwater.fillRect(0, position - laneWidth / 2, width, laneWidth);
      backwater.setAlpha(elapsed < earlyRevealAt ? 0.72 + progress * 0.18 : 0.9);
      scene.tweens.add({
        targets: backwater,
        alpha: 1,
        duration: Math.max(1, resolveAt - time),
        ease: "Sine.easeIn",
      });
      objects.push(backwater);

      const boundaries = scene.add.graphics().setDepth(4).setBlendMode(Phaser.BlendModes.ADD);
      boundaries.lineStyle(2, 0xff6d79, 0.42);
      boundaries.lineBetween(0, position - laneWidth / 2, width, position - laneWidth / 2);
      boundaries.lineBetween(0, position + laneWidth / 2, width, position + laneWidth / 2);
      objects.push(boundaries);

      if (elapsed < earlyRevealAt) {
        const currents = scene.add.graphics().setDepth(4).setBlendMode(Phaser.BlendModes.ADD);
        currents.lineStyle(1, 0x43d9d0, 0.38);
        for (let index = 0; index < 4; index += 1) {
          const y = position - laneWidth * 0.3 + index * laneWidth * 0.2;
          currents.beginPath();
          currents.moveTo(width * (0.54 + index * 0.035), y);
          currents.lineTo(width * 0.7, y + (index % 2 === 0 ? 3 : -3));
          currents.lineTo(width * 0.86, y);
          currents.lineTo(width * 0.97, y + (index % 2 === 0 ? -2 : 2));
          currents.strokePath();
        }
        currents.setPosition((elapsed / earlyRevealAt) * 32, 0).setAlpha(1 - elapsed / earlyRevealAt);
        scene.tweens.add({
          targets: currents,
          x: 32,
          alpha: 0,
          duration: Math.max(1, earlyRevealAt - elapsed),
          ease: "Sine.easeIn",
        });
        objects.push(currents);
      }

      const arcCount = scene.usesCompactControls() ? 5 : 8;
      const crest = scene.add.graphics().setDepth(15).setBlendMode(Phaser.BlendModes.ADD);
      for (let index = 0; index < arcCount; index += 1) {
        const centerX = width * (0.845 + index * (scene.usesCompactControls() ? 0.027 : 0.019));
        const centerY = position - laneWidth * 0.28 + (index % 3) * laneWidth * 0.28;
        crest.lineStyle(index % 3 === 0 ? 3 : 2, index % 2 === 0 ? 0xeaffff : 0x43d9d0, index % 3 === 0 ? 0.78 : 0.62);
        crest.beginPath();
        crest.arc(centerX, centerY, 9 + (index % 3) * 3, Math.PI * 1.06, Math.PI * 1.94, false);
        crest.strokePath();
      }
      const crestTravel = width * 0.04;
      crest.setPosition(-crestTravel * progress, 0);
      crest.setAlpha(elapsed < earlyRevealAt ? 0 : elapsed < crestPeakAt ? 0.68 : 0.9);
      scene.tweens.add({
        targets: crest,
        x: -crestTravel,
        duration: Math.max(1, resolveAt - time),
        ease: "Sine.easeInOut",
      });
      if (elapsed < earlyRevealAt) {
        scene.tweens.add({
          targets: crest,
          alpha: 0.68,
          delay: earlyRevealAt - elapsed,
          duration: duration * 0.1125,
          ease: "Sine.easeOut",
        });
      }
      scene.tweens.add({
        targets: crest,
        alpha: 0.96,
        delay: Math.max(0, crestPeakAt - elapsed),
        duration: Math.max(1, resolveAt - Math.max(time, warningAt + crestPeakAt)),
        ease: "Sine.easeIn",
      });
      objects.push(crest);

      for (let index = 0; index < arcCount; index += 1) {
        const appearAt = earlyRevealAt + (index % 3) * duration * 0.05625;
        const foam = scene.add.image(
          width * (0.85 + index * (scene.usesCompactControls() ? 0.026 : 0.018)),
          position - laneWidth * 0.28 + (index % 4) * laneWidth * 0.19,
          index % 2 === 0 ? "fxStar" : "fxShard",
        )
          .setTint(index % 2 === 0 ? 0xeaffff : 0x43d9d0)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(18)
          .setRotation(index * 0.47)
          .setScale(index % 2 === 0 ? 0.14 : 0.2)
          .setAlpha(elapsed >= appearAt ? (elapsed >= crestMidAt ? 0.84 : 0.58) : 0);
        foam.x -= crestTravel * progress;
        scene.tweens.add({
          targets: foam,
          x: foam.x - crestTravel * (1 - progress),
          alpha: 0.92,
          scaleX: foam.scaleX * 1.18,
          delay: Math.max(0, appearAt - elapsed),
          duration: Math.max(1, resolveAt - Math.max(time, warningAt + appearAt)),
          ease: "Sine.easeIn",
        });
        objects.push(foam);
      }
      return objects;
    }

    resolveSweep(time) {
      const scene = this.scene;
      const warning = this.warning;
      if (!warning) return;
      this.destroyWarningFx(warning);
      const { vertical, position, laneWidth } = warning;
      const playableTop = scene.getPlayableTop();
      const playableBottom = scene.getPlayableBottom();
      const length = scene.scale.width;
      if (scene.runProfile?.precisionPrototype) {
        this.spawnPrototypeResolveFx(position, laneWidth);
      } else {
        this.spawnPrototypeResolveFx(position, laneWidth);
      }
      const insideLane = (target) => Math.abs(target.y - position) <= laneWidth * 0.5;
      const playerInside = insideLane(scene.player);
      const playerHit = playerInside && scene.gameplayTime >= scene.dashInvulnerableUntil;
      const lane = {
        axis: "y",
        center: position,
        min: position - laneWidth / 2,
        max: position + laneWidth / 2,
      };
      scene.recordPrecisionPrototypeEvent?.("tide-resolve", {
        warningAt: warning.warningAt,
        dangerAt: warning.resolveAt,
        resolvedAt: time,
        lane,
        playerInside,
        playerHit,
      });
      let enemyHits = 0;
      scene.enemies.children.iterate((enemy) => {
        if (!enemy?.active || !insideLane(enemy)) return;
        const isBoss = enemy.getData("kind") === "boss";
        scene.damageEnemy(enemy, isBoss ? 12 : 22, null);
        if (!isBoss && enemy.active) enemy.x = Phaser.Math.Clamp(enemy.x - 72, 24, scene.scale.width - 24);
        scene.burstAt(enemy.x, enemy.y, 0x43d9d0, 5);
        enemyHits += 1;
      });
      const tidePerfectAwarded = !playerHit && Boolean(scene.awardPrecisionPerfectDodge?.("tide", { enemyHits }));
      if (playerHit) {
        scene.recordPrecisionPrototypeEvent?.("tide-hit", {
          source: "tide-sweep",
          warningAt: warning.warningAt,
          dangerAt: warning.resolveAt,
          hitAt: time,
          lane,
        });
        scene.registerActDamage();
        scene.playerHealth = Math.max(0, scene.playerHealth - 9);
        scene.player.x = Phaser.Math.Clamp(scene.player.x - 48, 24, scene.scale.width - 24);
        scene.flashDamage();
        scene.burstAt(scene.player.x, scene.player.y, 0xff6d79, 9);
        scene.showCombatLabel(scene.player.x, scene.player.y - 34, "镜潮 -9", 0xff6d79);
        if (scene.playerHealth <= 0) scene.finishRun(false, "守夜人被镜潮卷入深港。", "潮声覆灯");
      } else if (enemyHits > 0 && !tidePerfectAwarded) {
        scene.showCombatLabel(scene.scale.width / 2, position - 38, `借潮破敌 · ${enemyHits}`, 0x43d9d0);
      }
      if (!scene.runProfile?.precisionPrototype) {
        scene.spawnExpandingSigil(scene.scale.width / 2, position, 0x43d9d0, 86, 340);
        scene.cameras.main.shake(150, scene.usesCompactControls() ? 0.004 : 0.006);
      }
      this.warning = null;
      const bossBias = scene.getRoute(scene.finalRouteId)?.bossBias;
      const bossSweepDelay = bossBias === "charge" ? 4100 : bossBias === "pulse" ? 5700 : 5200;
      const routeTwoTime = scene.runProfile?.routeStageTwoTime || 24;
      const routeThreeTime = scene.runProfile?.routeStageThreeTime || 50;
      const phaseIndex = scene.elapsed < routeTwoTime ? 0 : scene.elapsed < routeThreeTime ? 1 : 2;
      const standardSweepDelay = scene.runProfile?.mirrorSweepDelays?.[phaseIndex] || 6600;
      this.nextSweepAt = scene.runProfile?.precisionPrototype
        ? Number.POSITIVE_INFINITY
        : time + (scene.bossAlive ? bossSweepDelay : standardSweepDelay);
    }

    spawnPrototypeResolveFx(position, laneWidth) {
      const scene = this.scene;
      const width = scene.scale.width;
      const track = (item) => {
        this.transientFx.add(item);
        return item;
      };
      const release = (item) => {
        this.transientFx.delete(item);
        if (item?.active) item.destroy();
      };

      const impact = track(scene.add.graphics().setDepth(18).setBlendMode(Phaser.BlendModes.ADD));
      [-0.28, 0, 0.28].forEach((offset, band) => {
        impact.lineStyle(band === 1 ? 2 : 1, 0xeaffff, band === 1 ? 0.94 : 0.72);
        impact.beginPath();
        for (let index = 0; index <= 16; index += 1) {
          const x = (index / 16) * width;
          const y = position + laneWidth * offset + (index % 2 === 0 ? -2 : 2);
          if (index === 0) impact.moveTo(x, y);
          else impact.lineTo(x, y);
        }
        impact.strokePath();
      });
      scene.tweens.add({
        targets: impact,
        alpha: 0,
        duration: 100,
        ease: "Quad.easeOut",
        onComplete: () => release(impact),
      });

      const startX = width + 230;
      const endX = -260;
      const back = track(scene.add.graphics().setPosition(startX, position).setDepth(3));
      back.fillStyle(0x1f7f86, 0.22);
      back.beginPath();
      back.moveTo(-230, -laneWidth / 2);
      back.lineTo(-54, -laneWidth / 2 + 7);
      back.lineTo(-18, -laneWidth * 0.3);
      back.lineTo(0, -laneWidth * 0.12);
      back.lineTo(-12, laneWidth * 0.12);
      back.lineTo(-32, laneWidth * 0.34);
      back.lineTo(-230, laneWidth / 2);
      back.closePath();
      back.fillPath();

      const trail = track(scene.add.graphics().setPosition(startX, position).setDepth(14).setBlendMode(Phaser.BlendModes.ADD));
      for (let index = 0; index < 4; index += 1) {
        const y = -laneWidth * 0.32 + index * laneWidth * 0.21;
        trail.lineStyle(1, index % 2 === 0 ? 0x43d9d0 : 0xeaffff, 0.42);
        trail.beginPath();
        trail.moveTo(-220, y);
        trail.lineTo(-145, y + (index % 2 === 0 ? 4 : -4));
        trail.lineTo(-68, y);
        trail.strokePath();
      }

      const crest = track(scene.add.graphics().setPosition(startX, position).setDepth(15).setBlendMode(Phaser.BlendModes.ADD));
      crest.lineStyle(13, 0x43d9d0, 0.68);
      crest.beginPath();
      crest.moveTo(-20, -laneWidth / 2 + 5);
      crest.lineTo(2, -laneWidth * 0.28);
      crest.lineTo(-12, -laneWidth * 0.08);
      crest.lineTo(4, laneWidth * 0.14);
      crest.lineTo(-24, laneWidth / 2 - 5);
      crest.strokePath();
      crest.lineStyle(2, 0xeaffff, 0.94);
      crest.beginPath();
      crest.moveTo(-12, -laneWidth / 2 + 6);
      crest.lineTo(9, -laneWidth * 0.28);
      crest.lineTo(-5, -laneWidth * 0.08);
      crest.lineTo(11, laneWidth * 0.14);
      crest.lineTo(-17, laneWidth / 2 - 6);
      crest.strokePath();

      [back, trail, crest].forEach((item) => {
        scene.tweens.add({
          targets: item,
          x: endX,
          duration: 780,
          ease: "Cubic.easeInOut",
          onComplete: () => release(item),
        });
      });

      const timer = scene.time.delayedCall(600, () => {
        this.transientTimers.delete(timer);
        const foamCount = scene.usesCompactControls() ? 3 : 4;
        for (let index = 0; index < foamCount; index += 1) {
          const foam = track(scene.add.image(
            22 + index * 14,
            position - laneWidth * 0.3 + index * laneWidth * 0.18,
            index % 2 === 0 ? "fxStar" : "fxShard",
          )
            .setTint(0xeaffff)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(18)
            .setAlpha(0.82)
            .setScale(index % 2 === 0 ? 0.13 : 0.18));
          scene.tweens.add({
            targets: foam,
            x: foam.x - 24,
            y: foam.y + (index % 2 === 0 ? -8 : 8),
            alpha: 0,
            duration: 200 + index * 10,
            ease: "Quad.easeOut",
            onComplete: () => release(foam),
          });
        }
      });
      this.transientTimers.add(timer);
    }

    resize() {
      if (!this.scene.runProfile?.precisionPrototype) {
        this.clearWarning();
        this.nextSweepAt = this.scene.gameplayTime + 1600;
        return;
      }
      const interruptedWarning = this.warning
        ? {
            vertical: this.warning.vertical,
            position: this.warning.position,
            laneWidth: this.warning.laneWidth,
            warningAt: this.warning.warningAt,
            resolveAt: this.warning.resolveAt,
            isUpperLane: this.warning.isUpperLane,
          }
        : null;
      this.clearWarning();
      if (interruptedWarning) {
        this.nextSweepAt = Number.POSITIVE_INFINITY;
        this.beginSweep(this.scene.gameplayTime, interruptedWarning);
        return;
      }
      this.nextSweepAt = this.sweepIndex > 0
        ? Number.POSITIVE_INFINITY
        : this.scene.runProfile.prototypeTideWarningAt;
    }

    clearWarning() {
      if (!this.warning) return;
      this.destroyWarningFx(this.warning);
      this.warning = null;
    }

    destroyWarningFx(warning) {
      const objects = [warning?.telegraph, ...(warning?.markers || []), ...(warning?.fxObjects || [])];
      objects.forEach((item) => {
        if (!item) return;
        this.scene.tweens.killTweensOf(item);
        if (item.active) item.destroy();
      });
    }

    destroy() {
      this.clearWarning();
      this.transientTimers.forEach((timer) => timer.remove(false));
      this.transientTimers.clear();
      this.transientFx.forEach((item) => {
        this.scene.tweens.killTweensOf(item);
        if (item.active) item.destroy();
      });
      this.transientFx.clear();
      this.ambient.forEach((item) => {
        this.scene.tweens.killTweensOf(item);
        item.destroy();
      });
      this.ambient.length = 0;
    }
  }

  window.LastLightStages = window.LastLightStages || {};
  window.LastLightStages.MirrorHarborController = MirrorHarborController;
})();
