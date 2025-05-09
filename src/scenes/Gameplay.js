import Phaser from 'phaser';

export default class GameplayScene extends Phaser.Scene {
  constructor() {
    super('gameplay');
    this.currentScene = 'start';
}

  create() {
    this.cameras.main.setBackgroundColor('#222');
    this.text = this.add.text(100, 100, '', 
      { fontSize: '20px', color: '#fff', wordWrap: { width: 600 } });
    this.optionButtons = [];
    this.displayScene(this.currentScene);
}

  displayScene(sceneKey) {
    this.currentScene = sceneKey;
    const scene = story[sceneKey]; 

    this.text.setText(scene.text);
    this.optionButtons.forEach(btn => btn.destroy());
    this.optionButtons = [];

    scene.options.forEach((option, index) => { 
      const btn = this.add.text(100, 200 + index * 40, option.text,
        { fontSize: '18px', color: '#00f', backgroundColor: '#fff', padding: { x: 10, y: 5 } })
        .setInteractive()
        .on('pointerdown', () => this.displayScene(option.next));

      this.optionButtons.push(btn);
    });
}
}