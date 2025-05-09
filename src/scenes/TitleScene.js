import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('title');
  }


  preload() {
    this.load.image('logo', 'assets/logo.png');
  }

  create() {
    this.add.text(250, 100, 'Into the Forest', { fontSize: '48px', color: '#fff' });
    this.add.text(200, 200, 'A Choose Your Own Adventure Game',
      { fontSize: '24px', color: '#fff' });
    this.add.text(230, 300, 'Press SPACE to Start',
      { fontSize: '20px', color: '#00f' }).setInteractive().on('pointerdown',
      () => this.startGame());
    this.add.image(400, 350, 'logo');
  }

  startGame() {
    this.scene.start('gameplay');
  }
}