(function () {
  "use strict";

  class MirrorHarborController {
    constructor(scene) {
      this.scene = scene;
      this.nextSweepAt = 6800;
      this.sweepIndex = 0;
      this.warning = null;
      this.ambient = [];
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
        this.nextSweepAt = time + 1800;
        return;
      }
      if (this.warning) {
        if (time >= this.warning.resolveAt) this.resolveSweep(time);
        return;
      }
      if (scene.elapsed < 7 || time < this.nextSweepAt) return;
      this.beginSweep(time);
    }

    beginSweep(time) {
      const scene = this.scene;
      const vertical = false;
      const laneWidth = scene.usesCompactControls() ? 82 : 96;
      const playableTop = scene.getPlayableTop();
      const playableBottom = scene.getPlayableBottom();
      const playableHeight = playableBottom - playableTop;
      const upperLane = playableTop + playableHeight * 0.28;
      const lowerLane = playableTop + playableHeight * 0.72;
      const position = this.sweepIndex % 2 === 0 ? upperLane : lowerLane;
      const warningDuration = 1400;
      const telegraph = scene.add.graphics().setDepth(4).setBlendMode(Phaser.BlendModes.ADD);
      telegraph.fillStyle(0xff6d79, 0.09);
      telegraph.fillRect(0, position - laneWidth / 2, scene.scale.width, laneWidth);
      telegraph.lineStyle(2, 0xf4ffff, 0.76);
      telegraph.lineBetween(0, position - laneWidth / 2, scene.scale.width, position - laneWidth / 2);
      telegraph.lineBetween(0, position + laneWidth / 2, scene.scale.width, position + laneWidth / 2);
      telegraph.lineStyle(1, 0xff6d79, 0.56);
      for (let x = -laneWidth; x < scene.scale.width + laneWidth; x += 48) {
        telegraph.lineBetween(x, position - laneWidth / 2, x + laneWidth, position + laneWidth / 2);
      }
      const markers = [];
      for (let index = 0; index < 5; index += 1) {
        const ratio = (index + 0.5) / 5;
        const marker = scene.add.image(
          scene.scale.width * ratio,
          position,
          "fxShard",
        )
          .setTint(index % 2 === 0 ? 0x43d9d0 : 0xff6d79)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setRotation(Math.PI)
          .setAlpha(0.32)
          .setDepth(4);
        scene.tweens.add({
          targets: marker,
          alpha: 0.9,
          scaleX: 1.7,
          duration: warningDuration,
          ease: "Sine.easeIn",
        });
        markers.push(marker);
      }
      scene.tweens.add({ targets: telegraph, alpha: 0.32, duration: warningDuration, ease: "Sine.easeIn" });
      this.warning = { vertical, position, laneWidth, resolveAt: time + warningDuration, telegraph, markers };
      this.sweepIndex += 1;
      scene.showThreatAlert(position === upperLane ? "上港退潮 · 转下港" : "下港退潮 · 转上港", 0xff6d79, warningDuration + 320);
    }

    resolveSweep(time) {
      const scene = this.scene;
      const warning = this.warning;
      if (!warning) return;
      warning.telegraph.destroy();
      warning.markers.forEach((marker) => marker.destroy());
      const { vertical, position, laneWidth } = warning;
      const playableTop = scene.getPlayableTop();
      const playableBottom = scene.getPlayableBottom();
      const length = scene.scale.width;
      const wave = scene.add.rectangle(
        scene.scale.width + 70,
        position,
        140,
        laneWidth,
        0x43d9d0,
        0.48,
      )
        .setStrokeStyle(3, 0xe8ffff, 0.92)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(16);
      scene.tweens.add({
        targets: wave,
        x: -70,
        alpha: { from: 0.72, to: 0.12 },
        scaleY: 1.16,
        duration: 780,
        ease: "Cubic.easeInOut",
        onComplete: () => wave.destroy(),
      });
      const insideLane = (target) => Math.abs(target.y - position) <= laneWidth * 0.5;
      let enemyHits = 0;
      scene.enemies.children.iterate((enemy) => {
        if (!enemy?.active || !insideLane(enemy)) return;
        const isBoss = enemy.getData("kind") === "boss";
        scene.damageEnemy(enemy, isBoss ? 12 : 22, null);
        if (!isBoss && enemy.active) enemy.x = Phaser.Math.Clamp(enemy.x - 72, 24, scene.scale.width - 24);
        scene.burstAt(enemy.x, enemy.y, 0x43d9d0, 5);
        enemyHits += 1;
      });
      if (insideLane(scene.player) && scene.gameplayTime >= scene.dashInvulnerableUntil) {
        scene.playerHealth = Math.max(0, scene.playerHealth - 9);
        scene.player.x = Phaser.Math.Clamp(scene.player.x - 48, 24, scene.scale.width - 24);
        scene.flashDamage();
        scene.burstAt(scene.player.x, scene.player.y, 0xff6d79, 9);
        scene.showCombatLabel(scene.player.x, scene.player.y - 34, "镜潮 -9", 0xff6d79);
        if (scene.playerHealth <= 0) scene.finishRun(false, "守夜人被镜潮卷入深港。", "潮声覆灯");
      } else if (enemyHits > 0) {
        scene.showCombatLabel(scene.scale.width / 2, position - 38, `借潮破敌 · ${enemyHits}`, 0x43d9d0);
      }
      scene.spawnExpandingSigil(scene.scale.width / 2, position, 0x43d9d0, 86, 340);
      scene.cameras.main.shake(150, scene.usesCompactControls() ? 0.004 : 0.006);
      this.warning = null;
      const bossBias = scene.getRoute(scene.finalRouteId)?.bossBias;
      const bossSweepDelay = bossBias === "charge" ? 4100 : bossBias === "pulse" ? 5700 : 5200;
      this.nextSweepAt = time + (scene.bossAlive ? bossSweepDelay : 6600);
    }

    resize() {
      this.clearWarning();
      this.nextSweepAt = this.scene.gameplayTime + 1600;
    }

    clearWarning() {
      if (!this.warning) return;
      const { telegraph, markers } = this.warning;
      this.scene.tweens.killTweensOf(telegraph);
      if (telegraph.active) telegraph.destroy();
      markers.forEach((marker) => {
        this.scene.tweens.killTweensOf(marker);
        if (marker.active) marker.destroy();
      });
      this.warning = null;
    }

    destroy() {
      this.clearWarning();
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
