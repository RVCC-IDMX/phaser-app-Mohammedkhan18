import Phaser from 'phaser';

export default class Gameplay extends Phaser.Scene {
  constructor() {
    super('gameplay');
    this.currentScene = 'start';  // Starting scene
    this.prevScene = null;        // To track and fade out previous scene sounds
  }

  preload() {
    // Preload all background images
    const backgrounds = [
      'start', 'glade', 'darkForest', 'lakeMonster',
      'cabin', 'bats', 'cliff', 'escape', 'cave', 'bridge'
    ];

    backgrounds.forEach(name => {
      this.load.image(`bg_${name}`, `assets/images/bg_${name}.jpg`);
    });

    // Preload sound effects and ambient audio
    this.load.audio('click', 'assets/click.mp3');
    this.load.audio('forest', 'assets/dark-forest.mp3');
    this.load.audio('wolf', 'assets/wolf.mp3');
    this.load.audio('bats', 'assets/bats.mp3');
    this.load.audio('cabin', 'assets/cabin.mp3');
    this.load.audio('glade', 'assets/glade.mp3');
    this.load.audio('cliff', 'assets/cliff.mp3');
    this.load.audio('lakeMonster', 'assets/monster.mp3'); // Monster sound
  }

  create() {
    // Load all sound assets with looping and initial volume 0 for fade-in later
    this.clickSound = this.sound.add('click');
    this.forestSound = this.sound.add('forest', { loop: true, volume: 0 });
    this.wolfSound = this.sound.add('wolf', { volume: 1 });
    this.batsSound = this.sound.add('bats', { loop: true, volume: 0 });
    this.cabinSound = this.sound.add('cabin', { loop: true, volume: 0 });
    this.gladeSound = this.sound.add('glade', { loop: true, volume: 0 });
    this.cliffSound = this.sound.add('cliff', { loop: true, volume: 0 });
    this.lakeMonsterSound = this.sound.add('lakeMonster', {volume: 0 });

    // Set up default background
    this.background = this.add.image(400, 300, 'bg_start').setDisplaySize(800, 600).setAlpha(0);
    this.tweens.add({ targets: this.background, alpha: 1, duration: 500 });

    // Display text box for story content
    this.text = this.add.text(100, 100, '', {
      fontSize: '20px',
      color: '#048ABF',
      backgroundColor: '#011526',
      wordWrap: { width: 600 }
    });
    this.optionButtons = [];  // Store interactive buttons

    // Begin the game
    this.displayScene(this.currentScene);
  }

  /**
   * Displays the given scene by updating background, text, sounds, and options.
   * @param {string} sceneKey - Key of the scene to display.
   */
  displayScene(sceneKey) {
    this.prevScene = this.currentScene;
    this.currentScene = sceneKey;
    const scene = window.story[sceneKey];

    const bgKey = `bg_${sceneKey}`;
    if (this.textures.exists(bgKey)) {
      // Fade out the old background and fade in the new one
      this.tweens.add({
        targets: this.background,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.background.setTexture(bgKey);
          this.tweens.add({ targets: this.background, alpha: 1, duration: 500 });
        }
      });
    }

    // Handle sounds for new scene
    this.fadeOutSceneSounds(this.prevScene);
    this.fadeInSceneSounds(this.currentScene);

    // Set text
    this.text.setText(scene.text);

    // Remove and rebuild buttons
    this.optionButtons.forEach(btn => btn.destroy());
    this.optionButtons = [];

    scene.options.forEach((option, index) => {
      const btn = this.create3DButton(100, 200 + index * 60, option.text, () => {
        this.displayScene(option.next);
      });
      this.optionButtons.push(btn);
    });
  }

  /**
   * Fades in relevant ambient/audio based on scene.
   */
  fadeInSceneSounds(sceneKey) {
    if (sceneKey === 'darkForest') {
      this.fadeInSound(this.forestSound, 1);
      this.wolfSound.play();
    }

    if (sceneKey === 'bats') {
      this.fadeInSound(this.batsSound, 0.8);
    }

    if (sceneKey === 'cabin') {
      this.fadeInSound(this.cabinSound, 0.6);
    }

    if (sceneKey === 'glade') {
      this.fadeInSound(this.gladeSound, 0.7);
    }

    if (sceneKey === 'cliff') {
      this.fadeInSound(this.cliffSound, 0.7);
    }

    if (sceneKey === 'lakeMonster') {
      this.fadeInSound(this.lakeMonsterSound, 0.9);
    }

  }

  /**
   * Fades out all scene sounds that may have been playing previously.
   */
  fadeOutSceneSounds(sceneKey) {
    if (sceneKey === 'darkForest') {
      this.fadeOutSound(this.forestSound);
      if (this.wolfSound.isPlaying)  {
        this.wolfSound.stop();
      }
    }

    if (sceneKey === 'bats') {
      this.fadeOutSound(this.batsSound);
    }

    if (sceneKey === 'cabin') {
      this.fadeOutSound(this.cabinSound);
    }

    if (sceneKey === 'glade') {
      this.fadeOutSound(this.gladeSound);
    }

    if (sceneKey === 'cliff') {
      this.fadeOutSound(this.cliffSound);
    }

    if (sceneKey === 'lakeMonster') {
      this.fadeOutSound(this.lakeMonsterSound);
    }

  }

  /**
   * Smoothly fades in a given sound to the specified volume.
   * @param {Phaser.Sound.BaseSound} sound
   * @param {number} targetVolume
   * @param {number} duration
   */
  fadeInSound(sound, targetVolume, duration = 1000) {
    if (!sound.isPlaying) {
      sound.play();
    }

    this.tweens.add({
      targets: sound,
      volume: targetVolume,
      duration,
      ease: 'Linear'
    });
  }

  /**
   * Smoothly fades out a sound and stops it.
   * @param {Phaser.Sound.BaseSound} sound
   * @param {number} duration
   */
  fadeOutSound(sound, duration = 1000) {
    this.tweens.add({
      targets: sound,
      volume: 0,
      duration,
      ease: 'Linear',
      onComplete: () => {
        if (sound.isPlaying) {
          sound.stop();
        }
      }
    });
  }

  /**
   * Creates a styled interactive 3D-like button with hover and click effects.
   * @param {number} x
   * @param {number} y
   * @param {string} label
   * @param {function} onClick
   * @returns {Phaser.GameObjects.Text}
   */
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

    // Hover styles
    btn.on('pointerover', () => {
      if (!btn.selected) {
        btn.setStyle({ backgroundColor: '#021E73' });
      }
    });

    btn.on('pointerout', () => {
      if (!btn.selected) {
        btn.setStyle({ backgroundColor: '#011526' });
      }
    });

    // Click behavior
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
