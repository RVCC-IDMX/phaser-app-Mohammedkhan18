import Phaser from 'phaser';

export default class Gameplay extends Phaser.Scene {
  constructor() {
    super('gameplay');
    this.currentScene = 'start';
    this.prevScene = null;
  }

  preload() {
    const backgrounds = [
      'start', 'glade', 'darkForest', 'lakeMonster',
      'cabin', 'bats', 'cliff', 'escape', 'cave', 'bridge'
    ];
    backgrounds.forEach(name => {
      this.load.image(`bg_${name}`, `assets/images/bg_${name}.jpg`);
    });

    this.load.audio('click', 'assets/click.mp3');
    this.load.audio('forest', 'assets/dark-forest.mp3');
    this.load.audio('wolf', 'assets/wolf.mp3');
    this.load.audio('bats', 'assets/bats.mp3');
    this.load.audio('cabin', 'assets/cabin.mp3');
    this.load.audio('lake', 'assets/lake.mp3');
    this.load.audio('glade', 'assets/glade.mp3');
    this.load.audio('cliff', 'assets/cliff.mp3');
    this.load.audio('monster', 'assets/monster.mp3');
  }

  create() {
    this.clickSound = this.sound.add('click');
    this.forestSound = this.sound.add('forest', { loop: true, volume: 0 });
    this.wolfSound = this.sound.add('wolf', { volume: 1 });
    this.batsSound = this.sound.add('bats', { loop: true, volume: 0 });
    this.cabinSound = this.sound.add('cabin', { loop: true, volume: 0 });
    this.lakeSound = this.sound.add('lake', { loop: true, volume: 0 });
    this.gladeSound = this.sound.add('glade', { loop: true, volume: 0 });
    this.cliffSound = this.sound.add('cliff', { loop: true, volume: 0 });
    this.monsterSound = this.sound.add('monster', { loop: true, volume: 0 });

    this.background = this.add.image(400, 300, 'bg_start').setDisplaySize(800, 600).setAlpha(1);

    this.text = this.add.text(100, 100, '', {
      fontSize: '20px',
      color: '#048ABF',
      backgroundColor: '#011526',
      wordWrap: { width: 600 }
    });

    this.optionButtons = [];
    this.displayScene(this.currentScene);
  }

  displayScene(sceneKey) {
    this.prevScene = this.currentScene;
    this.currentScene = sceneKey;
    const scene = window.story[sceneKey];

    const bgKey = `bg_${sceneKey}`;
    if (this.textures.exists(bgKey)) {
      this.tweens.add({
        targets: this.background,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.background.setTexture(bgKey);
          this.tweens.add({
            targets: this.background,
            alpha: 1,
            duration: 500
          });
        }
      });
    }

    this.fadeOutSceneSounds(this.prevScene);
    this.fadeInSceneSounds(sceneKey);

    this.text.setText(scene.text);
    this.optionButtons.forEach(btn => btn.destroy());
    this.optionButtons = [];

    scene.options.forEach((option, index) => {
      const btn = this.create3DButton(100, 200 + index * 60, option.text, () => {
        this.displayScene(option.next);
      });
      this.optionButtons.push(btn);
    });
  }

  fadeInSceneSounds(sceneKey) {
    if (sceneKey === 'darkForest') {
      this.fadeInAmbient(this.forestSound, 1);
      this.wolfSound.play();
    }
    if (sceneKey === 'bats') {
      this.fadeInAmbient(this.batsSound, 0.8);
    }
    if (sceneKey === 'cabin') {
      this.fadeInAmbient(this.cabinSound, 0.6);
    }
    if (sceneKey === 'lakeMonster') {
      this.fadeInAmbient(this.lakeSound, 0.6);
      this.fadeInAmbient(this.monsterSound, 0.8);
    }
    if (sceneKey === 'glade') {
      this.fadeInAmbient(this.gladeSound, 0.5);
    }
    if (sceneKey === 'cliff') {
      this.fadeInAmbient(this.cliffSound, 0.5);
    }
  }

  fadeOutSceneSounds(sceneKey) {
    if (sceneKey === 'darkForest') {
      this.fadeOutSound(this.forestSound);
    }
    if (sceneKey === 'bats') {
      this.fadeOutSound(this.batsSound);
    }
    if (sceneKey === 'cabin') {
      this.fadeOutSound(this.cabinSound);
    }
    if (sceneKey === 'lakeMonster') {
      this.fadeOutSound(this.lakeSound);
      this.fadeOutSound(this.monsterSound);
    }
    if (sceneKey === 'glade') {
      this.fadeOutSound(this.gladeSound);
    }
    if (sceneKey === 'cliff') {
      this.fadeOutSound(this.cliffSound);
    }
  }

  fadeInAmbient(sound, targetVolume, duration = 1000) {
    if (!sound.isPlaying)
    {
      sound.play();
    }
    this.tweens.add({
      targets: sound,
      volume: targetVolume,
      duration,
      ease: 'Linear'
    });
  }

  fadeOutSound(sound, duration = 1000) {
    this.tweens.add({
      targets: sound,
      volume: 0,
      duration,
      ease: 'Linear',
      onComplete: () => {
        if (sound.isPlaying)
        {
          sound.stop();
        }
      }
    });
  }

  create3DButton(x, y, label, onClick) {
    const btn = this.add.text(x, y, label, {
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#048ABF',
      backgroundColor: '#011526',
      padding: { x: 20, y: 12 },
      align: 'center',
      fixedWidth: 600
    })
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
      .setShadow(3, 3, '#000', 2, true, true);

    btn.originalY = y;
    btn.selected = false;

    btn.on('pointerover', () => {
      if (!btn.selected)
      {
        btn.setStyle({ backgroundColor: '#021E73' });
      }
    });

    btn.on('pointerout', () => {
      if (!btn.selected) {
        btn.setStyle({ backgroundColor: '#011526' });
      }
    });

    btn.on('pointerdown', () => {
      this.optionButtons.forEach(b => {
        b.setStyle({ backgroundColor: '#011526' });
        b.y = b.originalY;
        b.selected = false;
      });

      btn.setStyle({ backgroundColor: '#444' });
      btn.y += 2;
      btn.selected = true;

      this.clickSound.play();
      onClick();
    });

    return btn;
  }
}
